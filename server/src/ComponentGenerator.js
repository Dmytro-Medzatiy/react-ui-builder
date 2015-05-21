'use strict';

var _ = require('underscore');
var fs = require('fs-extra');
var path = require('path');
//if(/^win/.test(process.platform)){
//    path = path.win32;
//}
var StorageManager = require('./StorageManager.js');

var innerTemplate = null;

var processChild = function(child){
    var tpl = _.template(innerTemplate);
    var _child = {
        text: child.text,
        children: child.children,
        props: child.props,
        type: child.type,
        processChild: processChild,
        processProps: processProps
    };
    var result = tpl(_child);
    return result;
};

var cleanPropsUmyId = function(modelItem){
    if(modelItem.props && modelItem.props['data-umyid']){
        modelItem.props['data-umyid'] = undefined;
        delete modelItem.props['data-umyid'];
    }
    _.mapObject(modelItem.props, function(value, prop){
        if(_.isObject(value) && value.type){
            cleanPropsUmyId(value);
        }
    }, this);
    if(modelItem.children && modelItem.children.length > 0){
        for(var i = 0; i < modelItem.children.length; i++){
            cleanPropsUmyId(modelItem.children[i]);
        }
    }
};

function processStyle(styleObject){
    var result = '';
    if(styleObject && !_.isEmpty(styleObject)){
        _.mapObject(styleObject, function(value, prop){
            if(_.isString(value) && value.length > 0){
                result += ' ' + prop + ": '" + value + "',";
            } else if(_.isBoolean(value) || _.isNumber(value)){
                result += ' ' + prop + ": " + value + ",";
            }
        });
        result = result.substr(0, result.length - 1);
    }
    return result;
}

var processProps = function(props){

    var result = '';
    if(props && !_.isEmpty(props)){
        _.mapObject(props, function(value, prop){
            if(_.isString(value) && value.length > 0){
                result += prop + "={'" + value + "'} ";
            } else if(_.isBoolean(value) || _.isNumber(value)){
                result += prop + "={" + value + "} ";
            } else if(_.isObject(value)){
                if(prop === 'style'){
                    result += prop + "={{ " + processStyle(value) + " }} ";
                } else if(value['type']){
                    result += prop +"={ " + processChild(value) + " }";
                }
            }
        });
    }
    return result;
};

var processDefaultProps = function(props){

    var result = '';
    if(props && !_.isEmpty(props)){
        _.mapObject(props, function(value, prop){
            if(result.length > 0){
                result += ", ";
            }
            if(_.isString(value) && value.length > 0){
                result += prop + ": '" + value + "'";
            } else if(_.isBoolean(value) || _.isNumber(value)){
                result += prop + ": " + value;
            } else if(_.isObject(value)){
                if(prop === 'style'){
                    result += prop + ": { " + processStyle(value) + " }";
                } else if(value['type']){
                    result += prop +": ( " + processChild(value) + " )";
                }
            }
        });
    }
    return result;
};

var findNeededComponentsArray = function(modelItem, checkArray, resultArray){
    var result = resultArray || {};
    if(checkArray[modelItem.type]){
        result[modelItem.type] = checkArray[modelItem.type];
    }
    if(modelItem.props){
        _.mapObject(modelItem.props,
            function(propValue, prop){
                if(_.isObject(propValue) && propValue.type){
                    findNeededComponentsArray(propValue, checkArray, result);
                }
            }, this);
    }
    if(modelItem.children && modelItem.children.length > 0){
        for(var i = 0; i < modelItem.children.length; i++){
            findNeededComponentsArray(modelItem.children[i], checkArray, result);
        }
    }
    return result;
};

function translateVariables(indexFilePath, componentGroup, variables){
    var result = [];
    _.forEach(variables, function(variable){
        var variableString = '';
        if(variable.type === 'require'){
            var indexDirPath = path.dirname(indexFilePath);
            var sourceDirPath = path.join(indexDirPath, 'components', componentGroup);
            var variableSourcePath = variable.value;
            if(variableSourcePath.indexOf('/') >= 0 || variableSourcePath.indexOf('\\') >= 0){
                var fileName = path.basename(variableSourcePath);
                variableSourcePath = path.relative(sourceDirPath, variableSourcePath);
                if(variableSourcePath.indexOf(fileName) === 0){
                    variableSourcePath = '.' + path.sep + variableSourcePath;
                }
            }
            variableString = 'var ' + variable.name + ' = require(\'' + variableSourcePath + '\');';
        } else if(variable.type === 'reference') {
            variableString = 'var ' + variable.name + ' = ' + variable.value + ';';
        }
        result.push(variableString);
    });
    return result;
}

function translateComponents(indexFilePath, componentGroup, componentsArray){
    var result = [];
    //
    _.mapObject(componentsArray, function(value, key){
        var variableString = '';
        if(value.type === 'require'){
            var indexDirPath = path.dirname(indexFilePath);
            var sourceDirPath = path.join(indexDirPath, 'components', componentGroup);
            var valueSourcePath = value.value;
            if(valueSourcePath.indexOf('/') >= 0 || valueSourcePath.indexOf('\\') >= 0){
                var fileName = path.basename(valueSourcePath);
                valueSourcePath = path.relative(sourceDirPath, valueSourcePath);
                if(valueSourcePath.indexOf(fileName) === 0){
                    valueSourcePath = '.' + path.sep + valueSourcePath;
                }
            }
            variableString = 'var ' + key + ' = require(\'' + valueSourcePath + '\');';
        } else if(value.type === 'reference') {
            variableString = 'var ' + key + ' = ' + value.value + ';';
        }
        result.push(variableString);
    });
    //
    return result;
}

function translateFlux(componentName, componentGroup){
    var result = [];
    //
    result.push('var ' + componentName + 'Store = require(\'' + path.join('..', '..', 'stores', componentGroup, componentName) + 'Store.js\');');
    result.push('var ' + componentName + 'Actions = require(\'' + path.join('..', '..', 'actions', componentGroup, componentName) + 'Actions.js\');');
    //
    return result;
}

var ComponentGenerator = {

    /**
     *
     * @param options
     * @param callback
     */
    generateComponentCode: function(options, callback){

        var templates = [
            { filePath: path.join(options.templateDir, 'app', '_component_inner_export.tpl') },
            { filePath: path.join(options.templateDir, 'app', '_component_js_export.tpl') }
        ];

        StorageManager.readFiles(templates, 0, function(err, dataArray){
            if(err){
                callback(err);
            } else {
                innerTemplate = dataArray[0];
                //
                var componentModel = options.componentModel;
                cleanPropsUmyId(componentModel);
                //
                var variables = translateVariables(options.indexFilePath, options.componentGroup, options.variables);
                //
                var neededComponentsArray = options.includeAllReferences ?
                    options.componentsArray : findNeededComponentsArray(componentModel, options.componentsArray);
                var components = translateComponents(options.indexFilePath, options.componentGroup, neededComponentsArray);
                //
                var childrenArray = options.includeChildren ? componentModel.children : [];
                //
                var fluxVariables = null;
                if(options.includeFlux){
                    fluxVariables = translateFlux(options.componentName, options.componentGroup);
                }
                //
                var componentData = {
                    indexFilePath: options.indexFilePath,
                    components: components,
                    variables: variables,
                    componentName: options.componentName,
                    type: componentModel.type,
                    props: componentModel.props,
                    children: childrenArray,
                    text: componentModel.text,
                    fluxVariables: fluxVariables,
                    processChild: processChild,
                    processProps: processProps,
                    processDefaultProps: processDefaultProps
                };
                //
                StorageManager.generateCode({
                    template: dataArray[1],
                    data: componentData
                }, function(err, data){
                    if(err){
                        callback(err);
                    } else {
                        callback(null, data);
                    }
                });
            }
        });

    },

    /**
     *
     * @param options
     * @param callback
     */
    generateComponentChildrenCode: function(options, callback){

        var templates = [
            { filePath: path.join(options.templateDir, 'app', '_component_inner_export.tpl') },
            { filePath: path.join(options.templateDir, 'app', '_component_children_js_export.tpl') }
        ];

        StorageManager.readFiles(templates, 0, function(err, dataArray){
            if(err){
                callback(err);
            } else {
                innerTemplate = dataArray[0];
                //
                var componentModel = options.componentModel;
                cleanPropsUmyId(componentModel);
                //
                var componentData = {
                    children: componentModel.children,
                    processChild: processChild,
                    processProps: processProps
                };
                //
                var tpl = _.template(dataArray[1]);
                var _data = null;
                try{
                    _data = tpl(componentData);
                    //console.log(_data);

                    callback(null, _data);
                } catch(e){
                    callback(e.message);
                }

            }
        });

    },

    /**
     *
     * @param options
     * @param callback
     */
    generateFluxCode: function(options, callback){

        var templates = [
            { filePath: path.join(options.templateDir, 'app', '_flux_actions_js_export.tpl') },
            { filePath: path.join(options.templateDir, 'app', '_flux_store_js_export.tpl') }
        ];

        StorageManager.readFiles(templates, 0, function(err, dataArray){
            if(err){
                callback(err);
            } else {
                //
                var componentData = {
                    componentName: options.componentName,
                    componentGroup: options.componentGroup
                };
                //
                var response = {};
                StorageManager.generateCode({
                    template: dataArray[0],
                    data: componentData
                }, function(err, data){
                    if(err){
                        callback(err);
                    } else {
                        response.actionsSourceCode = data;
                        StorageManager.generateCode({
                            template: dataArray[1],
                            data: componentData
                        }, function(err, data){
                            if(err){
                                callback(err);
                            } else {
                                response.storeSourceCode = data;
                                callback(null, response);
                            }
                        });
                    }
                });
            }
        });

    }



};

module.exports = ComponentGenerator;
