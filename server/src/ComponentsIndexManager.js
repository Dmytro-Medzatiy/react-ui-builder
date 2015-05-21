'use strict';

var _ = require('underscore');
var esprima = require('esprima-fb');
var escodegen = require('escodegen');
var fs = require('fs-extra');
var path = require('path');

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

function buildTree(object, traverseState) {
    var key, child;
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null) {
                var _traverseState = traverseState || {};
                if(child.type === 'Property' && child.key.type === 'Identifier'){
                    if(child.value.type === 'ObjectExpression'){
                        _traverseState[child.key.name] = {};
                        _traverseState = _traverseState[child.key.name];
                    } else {
                        if(child.value.type === 'CallExpression' && child.value.callee.name === 'require'){
                            var sourcePath = child.value.arguments[0].value;
                            if(path.isAbsolute(sourcePath)){
                                _traverseState[child.key.name] = {
                                    type: 'ProjectComponent',
                                    sourcePath: sourcePath
                                };
                            } else {
                                _traverseState[child.key.name] = {
                                    type: 'ProjectComponent',
                                    sourcePath: path.resolve(indexFileDirPath, sourcePath)
                                };
                            }

                        } else if(child.value.type === 'MemberExpression') {
                            _traverseState[child.key.name] = {
                                type: 'Reference',
                                value: memberExpressionToString(child.value)
                            };
                        } else if(child.value.type === 'Identifier') {
                            _traverseState[child.key.name] = {
                                type: 'Reference',
                                value: child.value.name
                            };
                        }
                    }

                }
                buildTree(child, _traverseState);
            }
        }
    }
}

function traverseFor(object, traverseState, options) {
    var key, child;
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null) {
                var _traverseState = traverseState || {};
                if(child.type === 'Property' && child.key.type === 'Identifier'){
                    if(child.value.type === 'ObjectExpression' && child.key.name === options.groupName){
                        _traverseState[child.key.name] = {
                            _reference: object[key]
                        };
                        _traverseState = _traverseState[child.key.name];
                    } else if(child.key.name === options.componentName) {
                        _traverseState[child.key.name] = {
                            _reference: object[key]
                        };
                    }

                }
                traverseFor(child, _traverseState, options);
            }
        }
    }
}

function memberExpressionToString(node, resultString){
    var _resultString = resultString || '';
    if(node.type === 'MemberExpression'){
        _resultString += memberExpressionToString(node.object, _resultString);
        _resultString += '.' + node.property.name;
    } else if(node.type === 'Identifier') {
        _resultString += node.name;
    }
    return _resultString;
}

var indexFileDirPath = null;

var ComponentsIndexManager = {

    _findExportsNode: function(ast){
        var _exports = null;
        traverse(ast, function (node) {
            if (node.type === 'ExpressionStatement' && node.expression.type === 'AssignmentExpression') {
                if (node.expression.left.type === 'Identifier' && node.expression.left.name === 'exports') {
                    _exports = node.expression.right;
                } else if(node.expression.left.type === 'MemberExpression' && node.expression.left.property.name === 'exports'){
                    _exports = node.expression.right;
                }
            }
        });

        var variableName = null;
        if(_exports.type === 'Identifier'){
            variableName = _exports.name;
            traverse(ast, function(node){
                if(node.type === 'VariableDeclarator' && node.id.name === variableName){
                    _exports = node.init;
                    return false;
                }
            });
        }
        return _exports;
    },

    _appendToNode: function(node, variableString){
        var newAst = esprima.parse('var c = {' + variableString + '}');
        var newPart = null;
        traverse(newAst, function(node){
            if(node.type === 'VariableDeclarator' && node.id.name === 'c'){
                newPart = node.init.properties[0];
            }
        });
        if(node.properties){
            node.properties.push(
                newPart
            );
        }
    },

    _getVariables: function(ast){
        var variables = [];
        traverse(ast, function(node){
            if(node.type === 'VariableDeclarator' && node.id.type === 'Identifier'){
                //
                var variable = null;
                if(node.init.type === 'CallExpression' && node.init.callee.name === 'require'){
                    variable = {};
                    variable.name = node.id.name;
                    variable.type = 'require';
                    variable.value = node.init.arguments[0].value;
                    if(variable.value.indexOf('/') >= 0 || variable.value.indexOf('\\') >= 0){
                        if(!path.isAbsolute(variable.value)){
                            variable.value = path.resolve(indexFileDirPath, variable.value);
                        }
                    }
                    variables.push(variable);
                    //
                } else if(node.init.type === 'MemberExpression'){
                    variable = {};
                    variable.name = node.id.name;
                    variable.type = 'reference';
                    variable.value = memberExpressionToString(node.init);
                    variables.push(variable);
                } else if(node.init.type === 'Identifier'){
                    variable = {};
                    variable.name = node.id.name;
                    variable.type = 'reference';
                    variable.value = node.init.name;
                    variables.push(variable);
                }
                //
            }
        });
        return variables;
    },

    _getComponentsArray: function(ast){
        var components = {};
        traverse(ast, function(node){
            if(node.type === 'Property' && node.key.type === 'Identifier'){
                if(node.value.type === 'CallExpression' && node.value.callee.name === 'require'){
                    var sourcePath = node.value.arguments[0].value;
                    if(sourcePath.indexOf('/') >= 0 || sourcePath.indexOf('\\') >= 0){
                        if(!path.isAbsolute(sourcePath)){
                            sourcePath = path.resolve(indexFileDirPath, sourcePath);
                        }
                    }
                    components[node.key.name] = {
                        type: 'require',
                        value: sourcePath
                    };
                } else if(node.value.type === 'MemberExpression') {
                    components[node.key.name] = {
                        type: 'reference',
                        value: memberExpressionToString(node.value)
                    };
                } else if(node.value.type === 'Identifier') {
                    components[node.key.name] = {
                        type: 'reference',
                        value: node.value.name
                    };
                }
            }
        });
        return components;
    },

    /**
     *
     * @param {string} indexFilePath
     * @param {function} callback(err, data)
     * {object} data
     * {object} data.componentsTree
     * {object} data.componentsArray
     */
    loadIndex: function(indexFilePath, callback){
        fs.readFile(indexFilePath, {encoding: 'utf8'}, function(err, data){
            if(err){
                callback(err);
            } else {

                indexFileDirPath = path.dirname(indexFilePath);
                try{
                    var ast = esprima.parse(data);

                    var variables = this._getVariables(ast);

                    var _exports = this._findExportsNode(ast);

                    var componentsTree = {};
                    if(_exports.type === 'ObjectExpression'){
                        buildTree(_exports, componentsTree);
                    }

                    var componentsArray = this._getComponentsArray(_exports);

                    callback(null, {
                        componentsTree: componentsTree,
                        componentsArray: componentsArray,
                        variables: variables,
                        indexFilePath: indexFilePath
                    });

                } catch(e){
                    console.error(e.message);
                    callback(e.message);
                }
            }
        }.bind(this));

    },

    modifyIndex: function(indexFilePath, options, callback){
        fs.readFile(indexFilePath, {encoding: 'utf8'}, function(err, data){
            if(err){
                callback(err);
            } else {

                try{
                    var ast = esprima.parse(data);

                    var _exports = this._findExportsNode(ast);
                    var traverseState = {};
                    var relativePath = options.relativeFilePath.replace(/\\/g, '/');
                    if(options.componentGroup && options.componentGroup.trim().length > 0){
                        //
                        traverseFor(_exports, traverseState, {groupName: options.componentGroup});
                        //
                        if(traverseState[options.componentGroup]){
                            this._appendToNode(
                                traverseState[options.componentGroup]._reference.value,
                                options.componentName + ': require("' + relativePath + '")'
                            );
                        } else {
                            this._appendToNode(
                                _exports,
                                options.componentGroup + ': {' + options.componentName + ': require("' + relativePath + '")}'
                            );
                        }
                    } else {
                        this._appendToNode(
                            _exports,
                            options.componentName + ': require("' + relativePath + '")'
                        );
                    }
                    //
                    var newSource =  escodegen.generate(ast);
                    //
                    fs.writeFile(indexFilePath, newSource, function(err){
                        if(err){
                            console.error(err);
                            callback(err);
                        } else {
                            callback();
                        }
                    });
                    //
                } catch(e){
                    console.error(e.message);
                    callback(e.message);
                }
            }
        }.bind(this));
    }

};

module.exports = ComponentsIndexManager;
