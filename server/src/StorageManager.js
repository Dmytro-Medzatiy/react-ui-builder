'use strict';

var _ = require('underscore');
var fs = require('fs-extra');
var path = require('path');
var zlib = require('zlib');
var tar = require('tar-fs');
var esformatter = require('esformatter');

var esformatterOptions = {
    // inherit from the default preset
    preset : 'default',
    indent : {
        value : '    '
    },
    lineBreak : {
        before : {
            // at least one line break before BlockStatement
            BlockStatement : '>=1',
            // only one line break before BlockStatement
            DoWhileStatementOpeningBrace : 1
            // ...
        }
    },
    whiteSpace : {
        // ...
    },
    "plugins": [
        "esformatter-jsx"
    ],
    // this is the section this plugin will use to store the settings for the jsx formatting
    "jsx": {
        // by default is true if set to false it works the same as esformatter-jsx-ignore
        "formatJSX": true,
        // keep the node attributes on the same line as the open tag. Default is true.
        // Setting this to false will put each one of the attributes on a single line
        "attrsOnSameLineAsTag": true,
        // how many attributes should the node have before having to put each
        // attribute in a new line. Default 1
        "maxAttrsOnTag": 1,
        // if the attributes are going to be put each one on its own line, then keep the first
        // on the same line as the open tag
        "firstAttributeOnSameLine": false,
        // align the attributes with the first attribute (if the first attribute was kept on the same line as on the open tag)
        "alignWithFirstAttribute": true,
        "htmlOptions": { // same as the ones passed to jsbeautifier.html
            "brace_style": "collapse",
            "indent_char": " ",
            //indentScripts: "keep",
            "indent_size": 2,
            "max_preserve_newlines": 2,
            "preserve_newlines": true
            //unformatted: ["a", "sub", "sup", "b", "i", "u" ],
            //wrapLineLength: 0
        }
    }
};

var StorageManager = {

    /**
     * Generate files from templates
     * @param optionsArray - array of {templateFilePath: '', fileData: {}}
     * @param index - start index of array
     * @param callback - function called after execution, in case of error has parameter 'err'
     */
    generateFiles: function(optionsArray, index, callback){
        if(index >= 0 && index < optionsArray.length){
            var options = optionsArray[index];
            var self = this;
            this.generateFile(options, function(err){
                if(err && callback){
                    callback(err);
                } else {
                    self.generateFiles(optionsArray, ++index, callback);
                }
            });
        } else {
            if(callback){
                callback();
            }
        }
    },

    /**
     * Generate files from templates
     * @param {array} optionsArray - [{filePath: ''}]
     * @param {number} index - start index of array
     * @param {function} callback(err, dataArray)
     * @param {array} dataArray
     */
    readFiles: function(optionsArray, index, callback, dataArray){
        var _dataArray = dataArray || [];
        if(index >= 0 && index < optionsArray.length){
            var options = optionsArray[index];
            this.readFile(options, function(err, data){
                if(err && callback){
                    callback(err);
                } else {
                    _dataArray.push(data);
                    this.readFiles(optionsArray, ++index, callback, _dataArray);
                }
            }.bind(this));
        } else {
            if(callback){
                callback(null, _dataArray);
            }
        }
    },

    /**
     * Generate file from template
     * @param {object} options - object {templateFilePath: '', fileData: {}}
     * @param {string} options.outputFilePath
     * @param {string} options.templateFilePath
     * @param {object} options.fileData
     * @param {function} callback - function called after execution, in case of error has parameter 'err'
     */
    generateFile: function(options, callback){
        fs.readFile(options.templateFilePath, {encoding: 'utf8'}, function(err, data){
            if(err){
                if(callback){
                    callback(err);
                }
            } else {
                fs.ensureFile(options.outputFilePath, function(err){
                    if(err){
                        if(callback){
                            callback(err);
                        }
                    } else {
                        var tpl = _.template(data);
                        var _data = null;
                        if(options.outputFilePath.indexOf('.js', options.outputFilePath.length - 3) !== -1){
                            try{
                                _data = esformatter.format(tpl(options.fileData), esformatterOptions);
                            } catch(e){
                                console.error(options.outputFilePath);
                                console.error(e.message);
                            }
                        } else {
                            _data = tpl(options.fileData);
                        }
                        fs.writeFile(options.outputFilePath, _data, {encoding: 'utf8'}, function(err){
                            if(err){
                                if(callback){
                                    callback(err);
                                }
                            } else {
                                callback();
                            }
                        });
                    }
                });
            }
        });
    },

    /**
     * Generate file from template
     * @param {object} options
     * @param {object} options.template
     * @param {object} options.data
     * @param {function} callback(err, data)
     */
    generateCode: function(options, callback){

        var tpl = _.template(options.template);
        var _data = null;
        try{
            _data = tpl(options.data);
            //console.log(_data);
            _data = esformatter.format(_data, esformatterOptions);
            callback(null, _data);
        } catch(e){
            callback(e.message);
        }

    },

    /**
     *
     * @param {object} options
     * @param {string} options.filePath
     * @param {function} callback(err, data)
     */
    readJSFile: function(options, callback){
        fs.readFile(options.filePath, {encoding: 'utf8'}, function(err, data){
            if(err){
                if(callback){
                    callback(err);
                }
            } else {
                //var _data = data;
                //try{
                //    _data = esformatter.format(data, esformatterOptions);
                //} catch(e){
                //    console.error(e.message);
                //}
                //callback(null, _data);
                callback(null, data);
            }
        });
    },

    /**
     *
     * @param {object} options
     * @param {string} options.filePath
     * @param {function} callback(err, data)
     */
    readFile: function(options, callback){
        fs.readFile(options.filePath, {encoding: 'utf8'}, function(err, data){
            if(err){
                if(callback){
                    callback(err);
                }
            } else {
                callback(null, data);
            }
        });
    },

    /**
     *
     * @param {object} options
     * @param {object} options.data
     * @param {string} options.filePath
     * @param {function} callback(err)
     */
    writeFile: function(options, callback){
        fs.ensureFile(options.filePath, function(err){
            if(err){
                if (callback) callback(err);
            } else {
                fs.writeFile(options.filePath, options.data, function(err){
                    if(err){
                        if (callback) callback(err);
                    } else {
                        if(callback) callback();
                    }
                });
            }
        });
    },

    /**
     *
     * @param {object} options
     * @param {object} options.data
     * @param {string} options.filePath
     * @param {function} callback(err)
     */
    writeJSFile: function(options, callback){
        fs.ensureFile(options.filePath, function(err){
            if(err){
                if (callback) callback(err);
            } else {
                var _data = options.data;
                try{
                    _data = esformatter.format(_data, esformatterOptions);
                } catch(e){
                    console.error(e.message);
                }
                fs.writeFile(options.filePath, _data, function(err){
                    if(err){
                        if (callback) callback(err);
                    } else {
                        if(callback) callback();
                    }
                });
            }
        });
    },

    /**
     *
     * @param data
     * @returns {*}
     */
    formatJSData: function(data){
        var _data = data;
        try{
            _data = esformatter.format(_data, esformatterOptions);
        } catch(e){
            console.error(e.message);
        }
        return _data;
    },

    /**
     * Copy files according parameters in options array
     * @param optionsArray - array of objects {scr: '', dest: ''}
     * @param index - starting index of array
     * @param callback - function called after execution, in case of error has parameter 'err'
     */
    copyFiles: function(optionsArray, index, callback){
        if(index >= 0 && index < optionsArray.length){
            var options = optionsArray[index];
            var self = this;
            this.copy(options, function(err){
                if(err && callback){
                    callback(err);
                } else {
                    self.copyFiles(optionsArray, ++index, callback);
                }
            });
        } else {
            if(callback){
                callback();
            }
        }
    },

    /**
     * Copy files according parameter in options
     * @param options - object {scr: '', dest: ''}
     * @param callback - function called after execution, in case of error has parameter 'err'
     */
    copy: function(options, callback){
        fs.copy(options.src, options.dest, function(err){
            if(err){
                if(callback){
                    callback(err);
                }
            } else {
                if(callback){
                    callback();
                }
            }
        });
    },

    /**
     *
     * @param filePath
     * @param callback
     */
    readObject: function(filePath, callback){
        fs.readFile(filePath, {encoding: 'utf8'}, function(err, data){
            if(err){
                if(callback){
                    callback(err, null);
                }
            } else {
                try{
                    if(callback){
                        callback(null, JSON.parse(data));
                    }
                } catch(e){
                    if(callback){
                        callback(e, data);
                    }
                }
            }
        });
    },

    /**
     *
     * @param filePath
     * @param object
     * @param callback
     */
    writeObject: function(filePath, object, callback){
        fs.ensureFile(filePath, function(err){
            if(err){
                if (callback) callback(err);
            } else {
                var data = JSON.stringify(object);
                fs.writeFile(filePath, data, function(err){
                    if(err){
                        if (callback) callback(err);
                    } else {
                        if(callback) callback();
                    }
                });
            }
        });
    },

    /**
     *
     * @param {array} optionArray
     * @param {function} callback
     * @param {int} index
     */
    unpackTarGz: function(optionArray, callback, index){
        if(index >= 0 && index < optionArray.length){
            var filePath = optionArray[index].filePath;
            var destDir = optionArray[index].destDir;
            var self = this;
            //var extractor = tar.Extract({path: destDir})
            //    .on('error', function(err){ callback(err) })
            //    .on('end', function(){ self.unpackTarGz(optionArray, callback, ++index); });
            fs.createReadStream(filePath)
                .pipe(zlib.createGunzip())
                .pipe(tar.extract(destDir).on('finish', function(){ self.unpackTarGz(optionArray, callback, ++index); }));
        } else {
            if(callback){
                callback();
            }
        }
    },

    /**
     *
     * @param {array} optionArray
     * @param {function} callback
     * @param {int} index
     */
    cleanDir: function(optionArray, callback, index){
        if(index >= 0 && index < optionArray.length){
            var dirPath = optionArray[index].dirPath;
            var self = this;
            fs.remove(dirPath, function (err) {
                if (err) {
                    callback(err);
                } else {
                    fs.mkdir(dirPath, function(err){
                        if(err){
                            callback(err);
                        } else {
                            self.cleanDir(optionArray, callback, ++index);
                        }
                    });
                }
            });
        } else {
            callback();
        }
    },

    /**
     *
     * @param {array} optionArray
     * @param {function} callback
     * @param {int} index
     */
    removeFiles: function(optionArray, callback, index){
        if(index >= 0 && index < optionArray.length){
            var filePath = optionArray[index].filePath;
            var self = this;
            fs.remove(filePath, function (err) {
                if (err) {
                    callback(err);
                } else {
                    self.removeFiles(optionArray, callback, ++index);
                }
            });
        } else {
            callback();
        }
    },

    /**
     *
     * @param dirPath
     * @param callback
     */
    checkDirIsEmpty: function(dirPath, callback){
        fs.stat(dirPath, function (err, stat) {
            if(err){
                callback(err);
            } else {
                if (stat.isDirectory()) {
                    fs.readdir(dirPath, function (err, files) {
                        var total = files.length;
                        if (total === 0) {
                            callback();
                        } else {
                            callback('Directory: ' + dirPath + ' is not empty');
                        }
                    });
                } else {
                    callback("Path: " + dirPath + " is not a directory");
                }
            }
        });
    },

    /**
     *
     * @param start
     * @param callback
     * @param testFileNames
     */
    readDir: function (start, callback, testFileNames) {
        var self = this;
        // Use lstat to resolve symlink if we are passed a symlink
        fs.lstat(start, function (err, stat) {
                if (err) {
                    return callback(err);
                }
                var found = {dirs: [], files: []},
                    total = 0,
                    processed = 0;

                function isDir(abspath, isValid) {
                    fs.stat(abspath, function (err, stat) {
                        if (stat.isDirectory()) {
                            if (isValid === true) {
                                found.dirs.push(abspath);
                            }
                            // If we found a directory, recurse!
                            self.readDir(abspath, function (err, data) {
                                found.dirs = found.dirs.concat(data.dirs);
                                found.files = found.files.concat(data.files);
                                if (++processed == total) {
                                    callback(null, found);
                                }
                            }, testFileNames);
                        } else {
                            if (isValid === true) {
                                found.files.push(abspath);
                            }
                            if (++processed == total) {
                                callback(null, found);
                            }
                        }
                    });
                };

                // Read through all the files in this directory
                if (stat.isDirectory()) {
                    fs.readdir(start, function (err, files) {
                        total = files.length;
                        if (total === 0) {
                            callback(null, found);
                        }
                        for (var x = 0, l = files.length; x < l; x++) {
                            isDir(path.join(start, files[x]), _.contains(testFileNames, files[x]));
                        }
                    });
                } else {
                    return callback(new Error("path: " + start + " is not a directory"));
                }
            }
        )
    }

};
 module.exports = StorageManager;
