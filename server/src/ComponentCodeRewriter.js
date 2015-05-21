var _ = require('underscore');
var esprima = require('esprima-fb');
var escodegen = require('escodegen');
var fs = require('fs-extra');
var path = require('path');

var ComponentIndexManager = require('./ComponentsIndexManager.js');
var StorageManager = require('./StorageManager.js');

// Executes visitor on the object and its children (recursively).
function traverse(object, visitor) {
    var key, child;

    visitor(object);
    //if (!_result) {
    //    return;
    //}
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}

function getVariables(ast){
    var variables = {};
    traverse(ast, function(node){
        if(node.type === 'VariableDeclarator' && node.id.type === 'Identifier'){
            //
            var variable = null;
            if(node.init.type === 'CallExpression' && node.init.callee.name === 'require'){
                variable = {};
                variable.name = node.id.name;
                variable.type = 'require';
                variable.range = node.range;
                variables[variable.name] = variable;
                //
            } else if(node.init.type === 'MemberExpression'){
                variable = {};
                variable.name = node.id.name;
                variable.type = 'reference';
                variable.range = node.range;
                variables[variable.name] = variable;
            } else if(node.init.type === 'Identifier'){
                variable = {};
                variable.name = node.id.name;
                variable.type = 'reference';
                variable.range = node.range;
                variables[variable.name] = variable;
            }
            //

        }
    });
    return variables;
}

function getJSXElements(ast){
    var result = {};
    traverse(ast, function(node){
        if(node.type === 'JSXElement' && node.openingElement && node.openingElement.name.type === 'JSXIdentifier'){
            //
            result[node.openingElement.name.name] = {name: node.openingElement.name.name};
        }
    });
    return result;
}

function translateVariables(indexFilePath, componentGroup, variables){
    var result = "";
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
        result += variableString.replace(/\\/g, '/') + " ";
    });
    return result;
}

function memberExpressionToString(node, resultString){
    var _resultString = resultString || '';
    if(node.type === 'MemberExpression'){
        _resultString += memberExpressionToString(node.object, _resultString);
        _resultString += '.' + node.property.name;
    } else if(node.type === 'Identifier') {
        _resultString += node.name;
    } else if(node.type === 'ThisExpression') {
        _resultString += 'this';
    }
    return _resultString;
}

var ComponentCodeRewriter = {

    repairComponentReferences: function(options, callback){
        ComponentIndexManager.loadIndex(options.indexFilePath,
            function(err, data){
                if(err){
                    callback(err);
                } else {
                    var componentsArray = data.componentsArray;
                    //
                    var astSource = esprima.parse(options.data, {range: true});
                    var vars = getVariables(astSource);
                    var elements = getJSXElements(astSource);
                    //
                    var missingVariables = [];
                    _.mapObject(elements, function(value, key){
                        //console.log('Variable key: ' + key);
                        //console.log('Variable key value: ' + vars[key]);
                        if(!vars[key] && componentsArray[key]){
                            //console.log(JSON.stringify(componentsArray[key], null, 4));
                            missingVariables.push({
                                name: key,
                                type: componentsArray[key].type,
                                value: componentsArray[key].value
                            });
                        }
                    });
                    //
                    if(missingVariables.length > 0){
                        var maxMergeIndex = 0;
                        _.mapObject(vars, function(val, key){
                            if(maxMergeIndex < val.range[1]){
                                maxMergeIndex = val.range[1];
                            }
                        });
                        //
                        var mergeString = translateVariables(options.indexFilePath, options.componentGroup, missingVariables);
                        var mergeStringArray = mergeString.split('');
                        var dataApplicationArray = options.data.split('');
                        var args = [maxMergeIndex + 1, 0];
                        args = args.concat(mergeStringArray);
                        Array.prototype.splice.apply(dataApplicationArray, args);
                        //
                        var newSource = dataApplicationArray.join('');
                        var formattedSource = StorageManager.formatJSData(newSource);
                        callback(null, formattedSource);
                    } else if(options.forceToFormat) {
                        var source = StorageManager.formatJSData(options.data);
                        callback(null, source);
                    } else {
                        callback(null, options.data);
                    }
                }
            }
        );
    },

    rewriteChildren: function(options, callback){
        //
        try{
            var ast = esprima.parse(options.sourceCode, {range: true});
            var dataArray = options.sourceCode.split('');

            var oldNameArray = '{this.props.children}'.split('');
            var newNameArray = options.childrenSourceCode.split('');
            var delta = newNameArray.length - oldNameArray.length;
            var cumulativeDelta = 0;
            traverse(ast, function(node){
                if(node.type === 'JSXExpressionContainer'
                    && memberExpressionToString(node.expression) === 'this.props.children'){
                    var startIndex = node.range[0] + cumulativeDelta;
                    var args = [startIndex, oldNameArray.length];
                    args = args.concat(newNameArray);
                    Array.prototype.splice.apply(dataArray, args);
                    cumulativeDelta += delta;
                }
            });

            //console.log(JSON.stringify(ast, null, 4));

            var newSource = dataArray.join('');

            callback(null, newSource);

        } catch(e){
            callback(e.message);
        }

    }



};

module.exports = ComponentCodeRewriter;
