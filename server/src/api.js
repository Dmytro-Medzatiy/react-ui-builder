'use strict';

var _ = require('underscore');
var express = require("express");
var path = require('path');
var bodyParser = require('body-parser');
var httpProxy = require('http-proxy');

var app = null;
var socket = null;
var server = null;
var io = null;
var proxy = null;

var Client = require('./Client.js');
var Compiler = require('./Compiler.js');
var StorageManager = require('./StorageManager.js');
var ComponentGenerator = require('./ComponentGenerator.js');
var ComponentCodeRewriter = require('./ComponentCodeRewriter.js');

var FacadeProjectLocal = require('./FacadeProjectLocal.js');
var FacadeGallery = require('./FacadeGallery.js');
var TestRepository = require('./TestRepository.js');

var systemEnv = {
    builderDir: './',
    fileConfigPath: './react-builder.json',

    templateDirPath: './template',
    serviceDirUrl: '/.data'
};

var socketClient = null;
var proxyURL = null;

module.exports = {

    initServer: function(options){
        //
        if(options.dirname){
            systemEnv.builderDir = options.dirname;
            systemEnv.fileConfigPath = path.join(options.dirname, 'react-builder.json');
            systemEnv.templateDirPath = path.join(options.dirname, 'template');
        }
        //
        app = express();
        app.use(bodyParser.json());
        //
        app.use('/builder', express.static(path.join(systemEnv.builderDir, 'html')));
        app.use('/.data', express.static(path.join(systemEnv.builderDir, '.data')));
        app.post('/invoke', function(req, res){
            var methodName = req.body.methodName;
            var data = req.body.data;
            this[methodName](data, function(response){
                res.send(response);
            });
        }.bind(this));
        //
        server = app.listen(2222, function() {
            console.log(
                'React UI Builder started successfully.\nPlease go to http://localhost:%d/builder',
                server.address().port
            );
            if(options.io) {
                io = options.io;
            }
            if(io){
                socket = io(server);
                socket.on('connection', function(socket){
                    socketClient = socket;
                });
            }
        });
        //
    },

    addProjectStaticRoute: function(htmlUrlPrefix, htmlDirPath){
        app.use(htmlUrlPrefix, express.static(htmlDirPath));
    },

    setProjectProxy: function (options, callback) {
        FacadeProjectLocal.loadProjectProxyUrl(options, function(err, url){
            if(err){
                callback({
                    error: true,
                    errors: [ err ]
                });
            } else {
                proxyURL = url;
                //
                if(!proxy){
                    proxy = httpProxy.createProxyServer();
                    proxy.on('error', function (err, req, res) {
                        console.log('Proxy server error connecting to ' + proxyURL + req.url);
                    });
                    //
                    app.all('/*', function (req, res, next) {
                        if (req.url.indexOf(systemEnv.serviceDirUrl) === 0) {
                            next('route');
                        } else {
                            if(proxyURL && proxyURL.length > 0){
                                proxy.web(req, res, {target: proxyURL});
                            } else {
                                next('route');
                            }
                        }
                    });
                }
                callback({data: {
                    proxyURL: url
                }});
            }
        });
    },


    readConfiguration: function(options, callback){
        StorageManager.readObject(systemEnv.fileConfigPath, function(err, data){
            if(err){
                callback({
                    error: true,
                    errors: [ err ]
                });
            } else {
                callback({data: data});
            }
        });
    },

    storeConfiguration: function(options, callback){
        StorageManager.writeObject(systemEnv.fileConfigPath, options, function(err){
            if(err){
                callback({error: true, errors:[err]});
            } else {
                callback(options);
            }
        });
    },

    getPackageConfig: function(options, callback){
        StorageManager.readObject(path.join(systemEnv.builderDir, 'package.json'), function(err, data){
            if(err){
                callback({
                    error: true,
                    errors: [ err ]
                });
            } else {
                callback({data: data});
            }
        });
    },

    /**
     *
     * @param {object} options
     * @param {string} options.name
     * @param {function} callback
     */
    loadProjectModel: function(options, callback){
        var self = this;
        Client.post("/secure/loadProject", options, function(response){
            if(response.error){
                callback(response);
            } else {
                try{
                    self.createProject(JSON.parse(response.data), callback);
                } catch(e){
                    callback({ error: true, errors:[e.message] })
                }
            }
        }, true);
    },

    createProjectModel: function(options, callback){
        var self = this;
        Client.post("/secure/createProject", options, function(response){
            if(response.error){
                callback(response);
            } else {
                try{
                    self.createProject(JSON.parse(response.data), callback);
                } catch(e){
                    callback({ error: true, errors:[e.message] })
                }
            }
        }, true);
    },

    getProjectGallery: function(options, callback){
        Client.post('/getProjectGalleryList', options, callback);
    },

    preparePreview: function(options, callback){
        var storagePath = path.join(systemEnv.builderDir, '.data');
        FacadeGallery.preparePreview(
            {
                storageDir: storagePath,
                projectId: options.projectId
            },
            function(err, data){
                if(err){
                    callback({ error: true, errors:[err] });
                } else {
                    callback({data: data});
                }
            }
        );
    },

    downloadProject: function(options, callback){
        FacadeGallery.downloadProject(
            {
                dirPath: options.dirPath,
                projectId: options.projectId
            },
            function(err){
                if(err){
                    callback({ error: true, errors:[err] });
                } else {
                    callback({data: 'OK'});
                }
            }
        );
    },

    /**
     *
     * @param {object} options
     * @param {string} options.name
     * @param {string} options.model
     * @param callback
     */
    saveProjectModel: function(options, callback){
        FacadeProjectLocal.saveProjectConfig(options, function(err){
            if(err){
                callback({ error: true, errors:[err] });
            } else {
                callback({data: 'OK'});
            }
        });
    },

    prepareLocalProject: function (options, callback) {
        var response = {};
        if (options.dirPath && options.dirPath.length > 0) {
            //
            var htmlDirPath = path.join(options.dirPath, '.builder', 'build');
            var htmlURLPrefix = systemEnv.serviceDirUrl +'/' + path.basename(options.dirPath);
            response.htmlURLPrefix = htmlURLPrefix;
            this.addProjectStaticRoute(htmlURLPrefix, htmlDirPath);
            //
            FacadeProjectLocal.loadProjectConfig(options,
                function (err, data) {
                    if (err) {
                        //console.error(err);
                        callback({error: true, errors: [err]});
                    } else {
                        response = _.extend(response, data);
                        FacadeProjectLocal.loadComponentIndex(
                            function (err, data) {
                                if (err) {
                                    callback({
                                        error: true,
                                        errors: ['Project has broken components-index.js file', err]
                                    });
                                } else {
                                    response = _.extend(response, data);
                                    var templateDir = path.join(systemEnv.builderDir, 'templates');
                                    FacadeProjectLocal.generateProjectResources({templateDir: templateDir},
                                        function (err, data) {
                                            if (err) {
                                                //console.error(err);
                                                callback({error: true, errors: [err]});
                                            } else {
                                                response = _.extend(response, data);
                                                FacadeProjectLocal.compileProjectResourcesWithInstall(
                                                    {
                                                        builderDirPath: systemEnv.builderDir
                                                    },
                                                    function (err) {
                                                        if (err) {
                                                            //console.error(err);
                                                            callback({error: true, errors: [err]});
                                                        } else {
                                                            callback({data: response});
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    );
                                }
                            }
                        );
                    }
                }
            );
        }
    },

    watchLocalProject: function(options, callback){
        FacadeProjectLocal.startWatchProjectResources({builderDirPath: systemEnv.builderDir}, (function(){
            var response = {};
            return function(err, data) {
                if (err) {
                    socketClient.emit('compilerWatcher.errors', err);
                } else {
                    response = _.extend(response, data);
                    FacadeProjectLocal.loadComponentIndex(
                        function (err, data) {
                            if (err) {
                                //console.error(err);
                                setTimeout(function () {
                                    socketClient.emit('compilerWatcher.errors', err);
                                }, 100);
                            } else {
                                response = _.extend(response, data);
                                setTimeout(function () {
                                    socketClient.emit('compilerWatcher.success', response);
                                    response = {};
                                }, 100);
                            }
                        }
                    );
                }
            }
        }()));
        callback({data: 'OK'});
    },

    readJSFile: function(options, callback){
        StorageManager.readJSFile({filePath: options.filePath}, function(err, data){
            if(err){
                callback({error: true, errors:[err]});
            } else {
                callback({data: data});
            }
        })
    },

    loadFluxFiles: function(options, callback){
        FacadeProjectLocal.loadFluxFiles(
            {
                componentName: options.componentName
            },
            function(err, data){
                if(err){
                    callback({error: true, errors:[err]});
                } else {
                    callback({data: data});
                }
            }
        );
    },

    stopWatchLocalProject: function(options, callback){
        //console.log('api.stopWatchLocalProject is invoked...');
        FacadeProjectLocal.stopWatchProjectResources(function(){
            //console.log('Compiler is stopped');
            callback({data: 'OK'});
        });
    },

    loadComponentDefaults: function(options, callback){
        FacadeProjectLocal.loadComponentDefaults(options, function(err, data){
            if (err) {
                //console.error(err);
                callback({error: true, errors: [err]});
            } else {
                callback({data: data});
            }
        });
    },

    saveComponentDefaults: function(options, callback){
        FacadeProjectLocal.saveComponentsDefaults(options,
            function(err){
                if (err) {
                    //console.error(err);
                    callback({error: true, errors: [err]});
                } else {
                    callback({data: 'OK'});
                }
            }
        );
    },

    saveAllComponentDefaults: function(options, callback){
        FacadeProjectLocal.saveAllComponentsDefaults(options,
            function(err){
                if (err) {
                    //console.error(err);
                    callback({error: true, errors: [err]});
                } else {
                    callback({data: 'OK'});
                }
            }
        );
    },

    generateComponentCode: function(options, callback){
        FacadeProjectLocal.loadComponentIndex(
            function(err, data) {
                if (err) {
                    callback({error: true, errors: ['Project has broken components-index.js file', err]});
                } else {
                    ComponentGenerator.generateComponentCode(
                        {
                            templateDir: path.join(systemEnv.builderDir, 'templates'),
                            indexFilePath: data.indexFilePath,
                            componentsArray: data.componentsArray,
                            variables: data.variables,
                            componentName: options.componentName,
                            componentGroup: options.componentGroup,
                            componentModel: options.componentModel,
                            includeChildren: options.includeChildren,
                            includeAllReferences: options.includeAllReferences,
                            includeFlux: options.includeFlux
                        },
                        function(err, data){
                            if (err) {
                                //console.error(err);
                                callback({error: true, errors: [err]});
                            } else {
                                callback({data: data});
                            }
                        }
                    );
                }
            }
        );
    },

    generateFluxCode: function(options, callback){
        ComponentGenerator.generateFluxCode(
            {
                templateDir: path.join(systemEnv.builderDir, 'templates'),
                componentName: options.componentName,
                componentGroup: options.componentGroup
            },
            function(err, data){
                if (err) {
                    //console.error(err);
                    callback({error: true, errors: [err]});
                } else {
                    callback({data: data});
                }
            }
        )
    },

    generateComponentChildrenCode: function(options, callback){
        FacadeProjectLocal.generateComponentChildrenCode(
            {
                templateDir: path.join(systemEnv.builderDir, 'templates'),
                componentModel: options.componentModel,
                sourceCode: options.sourceCode,
                componentGroup: options.componentGroup
            },
            function(err, data){
                if(err){
                    callback({error: true, errors: [err]});
                } else {
                    callback({data: data});
                }
            }
        );
    },

    rewriteComponentSourceCode: function(options, callback){
        FacadeProjectLocal.rewriteComponentSourceCode(options,
            function(err){
                if(err){
                    //console.error(err);
                    callback({error: true, errors: [err]});
                } else {
                    callback({data: 'OK'});
                }
            }
        );
    },

    writeNewComponentSourceCode: function(options, callback){
        FacadeProjectLocal.writeNewComponentSourceCode(options,
            function(err){
                if(err){
                    //console.error(err);
                    callback({error: true, errors: [err]});
                } else {
                    callback({data: 'OK'});
                }
            }
        );
    }

};
