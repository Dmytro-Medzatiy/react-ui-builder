'use strict';

var webpack = require('webpack');
var _ = require('underscore');
var path = require('path');

var watcher = null;
var lastWatcherHash = null;

var Compiler = {

    compileBunch: function(optionsArray, index, callback){
        if(index >= 0 && index < optionsArray.length){
            var options = optionsArray[index];
            var self = this;
            this.startCompiler(options.nodeModulesDir, options.builderModulesDir, options.entryFilePath, options.outputDirPath, options.outputFileName, function(err){
                if(err && callback){
                    callback(err);
                } else {
                    self.compileBunch(optionsArray, ++index, callback);
                }
            });
        } else {
            if(callback){
                callback();
            }
        }
    },

    startCompiler: function(nodeModulesDir, builderModulesDir, entryFilePath, outputDirPath, outputFileName, callback){

        var compiler = webpack({
            name: "browser",
            entry: [entryFilePath],
            output: {
                path: outputDirPath,
                filename: outputFileName
            },
            debug: true,
            module: {
                loaders: [
                    { test: /\.js$/, loader: 'jsx-loader?harmony' },
                    { test: /\.css$/, loader: "style-loader!css-loader" },
                    { test: /\.(eot|woff|ttf|svg|png|jpg)([\?]?.*)$/, loader: 'url-loader' }
                ]
            },
            //resolveLoader: { root: path.join(__dirname, "node_modules") },
            resolveLoader: {
                root: [nodeModulesDir, builderModulesDir]
            },
            externals: {
                // require("jquery") is external and available
                //  on the global var jQuery
                "jquery": "jQuery"
            }
        });

        compiler.run(function(err, stats) {
            var jsonStats = stats.toJson({
                hash: true
            });
            //console.log(jsonStats.hash);
            lastWatcherHash = jsonStats.hash;
            //if(jsonStats.errors.length > 0)
            //    console.log(jsonStats.errors);
            //if(jsonStats.warnings.length > 0)
            //    console.log(jsonStats.warnings);
            //console.log(stats);
            if(err) {
                //console.error(err);
                callback(err);
            } else if(jsonStats.errors.length > 0){
                var messages = [];
                _.each(jsonStats.errors, function(item){
                    var messageArray = item.split('\n');
                    //console.log('Error message: ' + messageArray);
                    messages.push(messageArray);
                });
                //console.log(jsonStats.errors);
                callback(messages);
            } else {
                callback();
            }
        });
    },

    //compileLibrary: function(entryFilePath, outputDirPath, outputFileName, globalVarName, callback){
    //
    //    var compiler = webpack({
    //        name: "browser",
    //        entry: [entryFilePath],
    //        output: {
    //            path: outputDirPath,
    //            filename: outputFileName,
    //            libraryTarget: 'umd',
    //            library: globalVarName
    //
    //        },
    //        debug: true,
    //        module: {
    //            loaders: [
    //                { test: /\.js$/, loader: 'jsx-loader?harmony' },
    //                { test: /\.css$/, loader: "style!css" },
    //                { test: /\.less$/, loader: "style!css!less"},
    //                //{ test: /\.(eot|woff|ttf|svg|png|jpg)([\?]?.*)$/, loader: 'url-loader?limit=8000&name=[name]-[hash].[ext]' }
    //                { test: /\.(eot|woff|ttf|svg|png|jpg)([\?]?.*)$/, loader: 'url-loader' }
    //                //{ test: /\.(eot|woff|ttf)([\?]?.*)$/, loader: "file-loader" }
    //            ]
    //        },
    //        externals: {
    //            // require("jquery") is external and available
    //            //  on the global var jQuery
    //            "jquery": "jQuery"
    //        }
    //    });
    //
    //    compiler.run(function(err, stats) {
    //        if(err){
    //            console.error(err);
    //        } else {
    //            console.log('Compiled...');
    //        }
    //    });
    //},

    watchCompiler: function (nodeModulesDir, builderModulesDir, entryFilePath, outputDirPath, outputFileName, callback) {

        var compiler = webpack({
            name: "browser",
            entry: [entryFilePath],
            output: {
                path: outputDirPath,
                filename: outputFileName
            },
            debug: true,
            module: {
                loaders: [
                    {test: /\.js$/, loader: 'jsx-loader?harmony'},
                    {test: /\.css$/, loader: "style-loader!css-loader"},
                    {test: /\.(eot|woff|ttf|svg|png|jpg)([\?]?.*)$/, loader: 'url-loader'}
                ]
            },
            //resolveLoader: { root: path.join(__dirname, "node_modules") },
            resolveLoader: {
                root: [nodeModulesDir, builderModulesDir]
            },
            externals: {
                // require("jquery") is external and available
                //  on the global var jQuery
                "jquery": "jQuery"
            }
        });
        var compiledProcessCount = 0;
        var processId = setTimeout(function () {
            watcher = compiler.watch(200, function (err, stats) {
                var jsonStats = stats.toJson({
                    hash: true
                });
                //console.log(jsonStats.hash);
                //if(jsonStats.errors.length > 0)
                //    console.log(jsonStats.errors);
                //if(jsonStats.warnings.length > 0)
                //    console.log(jsonStats.warnings);
                //console.log('compiled in ' + processId._idleStart);
                if (err) {
                    //console.error(err);
                    callback([[err]]);
                } else if (jsonStats.errors.length > 0) {
                    var messages = [];
                    _.each(jsonStats.errors, function (item) {
                        var messageArray = item.split('\n');
                        //console.log('Error message: ' + messageArray);
                        messages.push(messageArray);
                    });
                    //console.log(jsonStats.errors);
                    callback(messages);
                } else {
                    if (lastWatcherHash !== jsonStats.hash) {
                        callback(null, {
                            compiledProcessCount: ++compiledProcessCount
                        });
                    }
                }
                lastWatcherHash = jsonStats.hash;
            });
        }, 1000);
    },

    stopWatchCompiler: function(callback){
        if(watcher != null){
            watcher.close();
            watcher = null;
            lastWatcherHash = null;
        }
        callback();
    }

};

module.exports = Compiler;
