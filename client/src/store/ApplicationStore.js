'use strict';

var _ = require('underscore');
var Reflux = require('reflux');
var ApplicationActions = require('../action/ApplicationActions.js');
var ModalProgressTriggerActions = require('../action/ModalProgressTriggerActions.js');
var PanelAvailableComponentsActions = require('../action/PanelAvailableComponentsActions.js');
var Server = require('../api/Server.js');
var docCookie = require('../api/cookies.js');
var Repository = require('../api/Repository.js');
//var ModalCodeGeneratorTriggerActions = require('../action/ModalCodeGeneratorTriggerActions.js');

var defaultModel = {
    stage: 'start',
    errors: null,
    packageVersion: 'unversioned',
    builderConfig: {}
};

var autoSaveProjectModelProcessId = null;

function startAutosaveProjectModel(){
    if(!autoSaveProjectModelProcessId){
        autoSaveProjectModelProcessId = setTimeout(function(){
            Server.invoke('saveProjectModel', {
                model: Repository.getCurrentProjectModel()
            }, function(err){
                console.error(JSON.stringify(err));
            }, function(response){
                //console.log('Project model is saved successfully');
                autoSaveProjectModelProcessId = null;
                startAutosaveProjectModel();
            });
        }, 300000);
    }
}

function stopAutosaveProjectModel(){
    if(autoSaveProjectModelProcessId){
        clearTimeout(autoSaveProjectModelProcessId);
        autoSaveProjectModelProcessId = null;
        //console.log('Project model saving is stopped successfully');
    }
}

var ApplicationStore = Reflux.createStore({
    model: defaultModel,
    listenables: ApplicationActions,

    onGoToErrors: function(errors){
        this.model.stage = 'errors';
        this.model.errors = errors;
        this.trigger(this.model);
    },

    onGoToStartPage: function(){
        this.onStopAutosaveProjectModel();
        this.model.errors = null;
        this.model.stage = 'start';
        this.trigger(this.model);
    },

    onGoToDeskPage: function(){
        this.model.errors = null;
        this.model.stage = 'deskPage';
        this.trigger(this.model);
    },

    onGoToGallery: function(){
        Server.invoke('getProjectGallery',
            {},
            function(errors){
                this.model.errors = errors;
                this.model.stage = 'start';
                this.trigger(this.model);
            }.bind(this),

            function(response){
                this.model.stage = 'gallery';
                //this.model.projects = [
                //    {
                //        projectId: 111,
                //        projectName: 'ReactBootstrap Project',
                //        description: 'This is react-bootstrap library. This is react-bootstrap library. ',
                //        countDownloads: 10
                //    }
                //];
                this.model.projects = response;
                if(this.model.projects.length % 2 > 0){
                    this.model.projects.push({
                        isEmpty: true
                    })
                }
                this.model.errors = null;
                this.trigger(this.model);
            }.bind(this)
        );
    },

    onRefreshServerInfo: function(){
        var self = this;
        Server.invoke("getPackageConfig",
            {},
            function(errors){
                self.onGoToErrors(errors);
            },
            function(response){
                if(response){
                    self.model.packageVersion = response.version;
                }
                Server.invoke('readConfiguration', {},
                    function(errors){
                        //self.onGoToErrors(errors);
                        self.onStoreBuilderConfig(self.model.builderConfig);
                        self.trigger(self.model);
                    },
                    function(response){
                        self.model.builderConfig = response;
                        self.trigger(self.model);
                    }
                );
            }
        )
    },

    onStoreBuilderConfig: function(config){
        var self = this;
        Server.invoke('storeConfiguration', config,
            function(errors){
                self.onGoToErrors(errors);
            },
            function(response){
                ;
            }
        );
    },

    onOpenLocalProject: function(options){
        var dirPath = null;
        if(options.dirPath && options.dirPath.trim().length > 0) {
            dirPath = options.dirPath.trim();
        }
        if(dirPath) {
            //
            ModalProgressTriggerActions.showModalProgress('Project is being compiled and loaded. Please wait...', 400);
            //
            Server.invoke('prepareLocalProject', {dirPath: dirPath},
                function(errors){
                    //this.onGoToErrors(errors);
                    this.model.errors = errors;
                    this.trigger(this.model);
                }.bind(this),
                function(response){

                    //console.log(response);

                    Repository.setCurrentProjectModel(response.model);
                    Repository.setHtmlForDesk(response.htmlURLPrefix + '/' + response.htmlForDesk);
                    Repository.setCurrentPageModelByIndex(0);
                    Repository.setComponentsTree(response.componentsTree);
                    Repository.setCallbackAfterProjectModelRenew(function(){
                        Server.invoke('saveProjectModel', {
                            model: Repository.getCurrentProjectModel()
                        }, function(err){
                            console.error(JSON.stringify(err));
                        }, function(response){
                            //console.log('Project model is saved successfully');
                        });
                    });

                    this.model.errors = null;
                    //
                    this.model.builderConfig.recentProjectDirs = this.model.builderConfig.recentProjectDirs || [];
                    var found = _.find(this.model.builderConfig.recentProjectDirs, function(item){
                        return item === dirPath;
                    });
                    if(!found){
                        this.model.builderConfig.recentProjectDirs.push(dirPath);
                    }
                    this.onStoreBuilderConfig(this.model.builderConfig);
                    //
                    Server.onSocketEmit('compilerWatcher.success', function(data){
                        Repository.setComponentsTree(data.componentsTree);
                        PanelAvailableComponentsActions.refreshComponentList();
                    });
                    //
                    Server.invoke('setProjectProxy', {}, function(err){}, function(response){});
                    Server.invoke('watchLocalProject', {}, function(err){}, function(response){});
                    //
                    this.onGoToDeskPage();
                    //

                }.bind(this)
            );
        } else {
            this.model.errors = ['Please specify local project directory path'];
            this.trigger(this.model);
        }
    },

    onStopAutosaveProjectModel: function(){
        Repository.setCallbackAfterProjectModelRenew(null);
        Server.invoke('stopWatchLocalProject', function(err){}, function(){});
    },

    onPreviewProject: function(projectId){
        Server.invoke('preparePreview', {projectId: projectId},
            function (errors) {
                this.onGoToErrors(errors);
            }.bind(this),
            function (response) {
                this.model.previewProjectId = projectId;
                this.model.previewProjectModel = response.projectModel;
                this.model.previewHtml = response.htmlForDesk;
                this.model.errors = null;
                this.model.stage = 'previewProject';
                this.trigger(this.model);
            }.bind(this)
        );
    },

    onStartDownloadProject: function(projectId){
        this.model.cloneProjectId = projectId;
        this.model.errors = null;
        this.model.stage = 'downloadProjectForm';
        this.trigger(this.model);
    },

    onDownloadProject: function(options){
        var dirPath = null;
        if(options.dirPath && options.dirPath.trim().length > 0) {
            dirPath = options.dirPath.trim();
        }
        if(dirPath){
            this.model.downloadProjectDirPath = options.dirPath;
            ModalProgressTriggerActions.showModalProgress('npm modules are being installed. Please wait, it will take some time...', 400);
            Server.invoke('downloadProject',
                {
                    dirPath: options.dirPath,
                    projectId: this.model.cloneProjectId
                },
                function(errors){
                    this.model.errors = errors;
                    this.model.stage = 'downloadProjectForm';
                    this.trigger(this.model);
                }.bind(this),
                function(response){
                    this.onOpenLocalProject({
                        dirPath: options.dirPath
                    });
                }.bind(this)
            );
        } else {
            this.model.errors = ['Please specify local directory path'];
            this.trigger(this.model);
        }
    }


});

module.exports = ApplicationStore;
