'use strict';

var Reflux = require('reflux');
var esprima = require('esprima-fb');
var validator = require('validator');

var Server = require('../api/Server.js');
var Repository = require('../api/Repository.js');
var Common = require('../api/Common.js');
var DeskPageFrameActions = require('../action/DeskPageFrameActions.js');
var ModalPropsEditorTriggerActions = require('../action/ModalPropsEditorTriggerActions.js');

var defaultModel = {
    isModalOpen: false
};

var ModalPropsEditorTriggerStore = Reflux.createStore({
    model: defaultModel,
    listenables: ModalPropsEditorTriggerActions,

    onShowModal: function(options){
        if(!this.model.isModalOpen){
            //
            this.model.actionsSourceCode = false;
            this.model.storeSourceCode = false;
            //
            this.model.selectedUmyId = options.selectedUmyId;

            var searchResult = Repository.findInCurrentPageModelByUmyId(this.model.selectedUmyId);
            if(searchResult){
                //
                var copy = searchResult.found;
                Common.cleanPropsUmyId(copy);
                copy.props = copy.props || {};
                //
                //this.model.componentModel = copy;
                this.model.componentText = copy.text;
                this.model.propsScript = JSON.stringify(copy.props, null, '\t');
                this.model.errors = [];
                this.model.sourceCode = null;
                this.model.isProjectComponent = false;
                this.model.isSourceCodeChanged = false;
                //
                var componentTypeValue = Repository.getComponentFromTree(copy.type);
                this.model.componentName = copy.type;
                this.model.componentGroup = componentTypeValue.group;
                //
                this.model.isModalOpen = true;
                //
                if(!componentTypeValue.value || componentTypeValue.value.type === 'Reference'){
                    //
                    this.trigger(this.model);
                    //
                } else if(componentTypeValue.value.type === 'ProjectComponent') {
                    //
                    this.model.isProjectComponent = true;
                    this.model.sourceFilePath = componentTypeValue.value.sourcePath;
                    //
                    Server.invoke('readJSFile', {filePath: componentTypeValue.value.sourcePath},
                        function(errors){
                            this.model.errors = errors;
                            this.trigger(this.model);
                        }.bind(this),
                        function(data){
                            this.model.isSourceCodeChanged = true;
                            this.model.sourceCode = data;
                            Server.invoke('loadFluxFiles',
                                {
                                    componentName: this.model.componentName
                                },
                                function(errors){
                                    this.model.errors = errors;
                                    this.trigger(this.model);
                                }.bind(this),
                                function(response){
                                    this.model.actionsSourceCode = response.actionsSourceCode;
                                    this.model.storeSourceCode = response.storeSourceCode;
                                    this.trigger(this.model);
                                }.bind(this)
                            );
                        }.bind(this)
                    );
                }
                //
            }
        }
    },

    onHideModal: function(){
        if(this.model.isModalOpen){
            this.model.isModalOpen = false;
            this.trigger(this.model);
        }
    },

    onToggleModal: function(){
        this.model.isModalOpen = !this.model.isModalOpen;
        this.trigger(this.model);
    },

    onSaveProperties: function(options){
        try{
            //
            this.model.isModalOpen = true;
            this.model.isSourceCodeChanged = false;
            //
            var projectModel = Repository.getCurrentProjectModel();
            var searchResult = null;
            for(var i = 0; i < projectModel.pages.length; i++){
                if(!searchResult){
                    searchResult = Common.findByPropsUmyId(projectModel.pages[i], this.model.selectedUmyId);
                }
            }
            //
            var changedProps = JSON.parse(options.propsScript);
            changedProps['data-umyid'] = this.model.selectedUmyId;
            searchResult.found.props = changedProps;
            //
            if(searchResult.found.text){
                if(options.componentText){
                    searchResult.found.text = options.componentText;
                } else {
                    throw new Error('Text value is empty. Please enter text.');
                }
            }
            //
            if(options.sourceCodeOptions && options.sourceCodeOptions.sourceCode){
                var componentTypeValue = Repository.getComponentFromTree(this.model.componentName);
                //
                try{
                    esprima.parse(options.sourceCodeOptions.sourceCode);
                } catch(e){
                    throw new Error('Component code error: ' + e.message);
                }
                if(options.actionsSourceCode){
                    try{
                        esprima.parse(options.actionsSourceCode)
                    } catch(e){
                        throw new Error('Actions code error: ' + e.message);
                    }
                }
                if(options.storeSourceCode){
                    try{
                        esprima.parse(options.storeSourceCode)
                    } catch(e){
                        throw new Error('Store code error: ' + e.message);
                    }
                }
                //
                if(componentTypeValue
                    && componentTypeValue.value
                    && componentTypeValue.value.type === 'ProjectComponent'){
                    // old component
                    Server.invoke('rewriteComponentSourceCode',
                        {
                            filePath: componentTypeValue.value.sourcePath,
                            data: options.sourceCodeOptions.sourceCode,
                            componentGroup: this.model.componentGroup,
                            componentName: this.model.componentName,
                            actionsSourceCode: options.actionsSourceCode,
                            storeSourceCode: options.storeSourceCode
                        },
                        function(err){
                            this.model.errors = [JSON.stringify(err)];
                            this.trigger(this.model);
                        }.bind(this),
                        function(response){
                            if(this.model.isChildrenRewritten){
                                searchResult.found.children = [];
                            }
                            Repository.renewCurrentProjectModel(projectModel);
                            DeskPageFrameActions.renderPageFrame();
                            //
                            this.model.isModalOpen = false;
                            this.trigger(this.model);
                        }.bind(this)
                    );
                    //
                } else {
                    // new component
                    Server.invoke('writeNewComponentSourceCode',
                        {
                            componentGroup: this.model.componentGroup,
                            componentName: this.model.componentName,
                            sourceCode: options.sourceCodeOptions.sourceCode,
                            actionsSourceCode: options.actionsSourceCode,
                            storeSourceCode: options.storeSourceCode
                        },
                        function(err){
                            this.model.errors = [JSON.stringify(err)];
                            this.trigger(this.model);
                        }.bind(this),
                        function(response){
                            searchResult.found.type = this.model.componentName;
                            if(options.sourceCodeOptions.includeChildren){
                                searchResult.found.children = [];
                            }
                            searchResult.found.text = null;
                            Repository.renewCurrentProjectModel(projectModel);
                            DeskPageFrameActions.renderPageFrame();
                            //
                            this.model.isModalOpen = false;
                            this.trigger(this.model);
                            //
                        }.bind(this)
                    );
                    //
                }
                //
            } else {
                Repository.renewCurrentProjectModel(projectModel);
                DeskPageFrameActions.renderPageFrame();
                //
                this.model.isModalOpen = false;
                this.trigger(this.model);
            }
        } catch(e){
            this.model.errors = [e.message];
            this.trigger(this.model);
        }
    },

    onSaveOptionsVariant: function(options){
        try{
            //
            this.model.isModalOpen = true;
            this.model.isSourceCodeChanged = false;
            //
            var changedProps = JSON.parse(options.propsScript);
            var projectModel = Repository.getCurrentProjectModel();
            var searchResult = null;
            for(var i = 0; i < projectModel.pages.length; i++){
                if(!searchResult){
                    searchResult = Common.findByPropsUmyId(projectModel.pages[i], this.model.selectedUmyId);
                }
            }
            //
            var changedText = null;
            if(searchResult && searchResult.found.text){
                if(options.componentText){
                    changedText = options.componentText;
                } else {
                    throw new Error('Text value is empty. Please enter text.');
                }
            }
            //
            var defaults = {
                type: searchResult.found.type,
                props: changedProps,
                children: searchResult.found.children,
                text: changedText
            };
            //
            Server.invoke('saveComponentDefaults',
                {
                    componentName: searchResult.found.type,
                    componentOptions: defaults
                },
                function(err){
                    this.model.errors = [JSON.stringify(err)];
                    this.trigger(this.model);
                }.bind(this),
                function(response){
                    this.trigger(this.model);
                }.bind(this)
            );
            //
        } catch(e) {
            this.model.errors = [e.message];
            this.trigger(this.model);
        }
    },

    onGenerateComponentCode: function(options){
        //
        this.model.isModalOpen = true;
        //
        this.model.isProjectComponent = false;
        this.model.isSourceCodeChanged = false;
        this.model.sourceCode = null;
        this.model.errors = [];

        var componentGroup = options.componentGroup;
        if(!componentGroup || componentGroup.length <= 0 || !validator.isAlphanumeric(componentGroup)){
            this.model.errors.push('Please enter alphanumeric value for group name');
        }
        var componentName = options.componentName;
        if(!componentName || componentName.length <= 0 || !validator.isAlphanumeric(componentName)){
            this.model.errors.push('Please enter alphanumeric value for component name');
        }

        if(this.model.errors.length <= 0){
            var _componentName = options.componentName;
            if(_componentName && _componentName.length > 0){
                var firstChar = _componentName.charAt(0).toUpperCase();
                _componentName = firstChar + _componentName.substr(1);
            }
            this.model.componentName = _componentName;
            this.model.componentGroup = options.componentGroup;
            //
            var testComponent = Repository.getComponentFromTree(this.model.componentName);
            if(testComponent.value){
                this.model.errors.push(
                    'There is already a component with name: ' + this.model.componentName + '. Please specify another component name.'
                );
                this.trigger(this.model);
            } else {
                var projectModel = Repository.getCurrentProjectModel();
                var searchResult = null;
                for(var i = 0; i < projectModel.pages.length; i++){
                    if(!searchResult){
                        searchResult = Common.findByPropsUmyId(projectModel.pages[i], this.model.selectedUmyId);
                    }
                }
                //
                Server.invoke('generateComponentCode',
                    {
                        componentGroup: this.model.componentGroup,
                        componentName: this.model.componentName,
                        componentModel: searchResult.found,
                        includeChildren: options.includeChildren,
                        includeFlux: options.includeFlux
                    },
                    function(errors){
                        this.model.errors = errors;
                        this.trigger(this.model);
                    }.bind(this),
                    function(data){
                        this.model.isSourceCodeChanged = true;
                        this.model.isProjectComponent = true;
                        this.model.sourceCode = data;
                        //
                        if(options.includeFlux){
                            Server.invoke('generateFluxCode',
                                {
                                    componentGroup: this.model.componentGroup,
                                    componentName: this.model.componentName
                                },
                                function(errors){
                                    this.model.errors = errors;
                                    this.trigger(this.model);
                                }.bind(this),
                                function(response){
                                    this.model.actionsSourceCode = response.actionsSourceCode;
                                    this.model.storeSourceCode = response.storeSourceCode;
                                    this.trigger(this.model);
                                }.bind(this)
                            );
                        } else {
                            this.trigger(this.model);
                        }
                        //
                    }.bind(this)
                );
            }
        } else {
            this.trigger(this.model);
        }
    },

    onGenerateComponentChildrenCode: function(options){
        //
        this.model.isModalOpen = true;
        //
        this.model.sourceCode = null;
        this.model.errors = [];
        this.model.isProjectComponent = true;
        this.model.isSourceCodeChanged = false;
        this.model.isChildrenRewritten = false;
        //
        var testComponent = Repository.getComponentFromTree(this.model.componentName);
        if(testComponent.value){
            //
            var projectModel = Repository.getCurrentProjectModel();
            var searchResult = null;
            for(var i = 0; i < projectModel.pages.length; i++){
                if(!searchResult){
                    searchResult = Common.findByPropsUmyId(projectModel.pages[i], this.model.selectedUmyId);
                }
            }
            //
            Server.invoke('generateComponentChildrenCode',
                {
                    componentGroup: testComponent.group,
                    componentName: this.model.componentName,
                    componentModel: searchResult.found,
                    sourceCode: options.sourceCode
                },
                function(errors){
                    this.model.errors = errors;
                    this.trigger(this.model);
                }.bind(this),
                function(data){
                    this.model.isSourceCodeChanged = true;
                    this.model.isChildrenRewritten = true;
                    this.model.sourceCode = data;
                    this.trigger(this.model);
                }.bind(this)
            );
        }
    }


});

module.exports = ModalPropsEditorTriggerStore;
