'use strict';

var Reflux = require('reflux');
var Server = require('../api/Server.js');
var ModalVariantsTriggerActions = require('../action/ModalVariantsTriggerActions.js');
var Repository = require('../api/Repository.js');
var PanelAvailableComponentsActions = require('../action/PanelAvailableComponentsActions.js');

var defaultModel = {
    isModalOpen: false

};

var getPageModelForDefaults = function(componentId, defaults, index){
    var templatePageModel = {
        pageName: 'TemplatePage',
        children:[
            {
                type: 'div',
                props: {
                    style: {
                        padding: '0.5em'
                    }
                },
                children:[]
            }
        ]
    };
    if(defaults && defaults.length > 0 && index < defaults.length){
        templatePageModel.children[0].children.push({
            type: componentId,
            props: defaults[index].props,
            children: defaults[index].children,
            text: defaults[index].text
        });
    }
    return templatePageModel;
};

var componentTypeId = null;
var currentDefaults = null;

var ModalVariantsTriggerStore = Reflux.createStore({
    model: defaultModel,
    listenables: ModalVariantsTriggerActions,

    onShowModal: function(componentName, defaults, defaultsIndex){
        if(!this.model.isModalOpen){
            componentTypeId = componentName;
            currentDefaults = defaults;
            this.model.defaultsCount = defaults.length;
            this.model.defaultsIndex = defaultsIndex;
            this.model.templatePageModel = getPageModelForDefaults(componentName, defaults, defaultsIndex);
            this.model.isModalOpen = true;
            this.trigger(this.model);
        }
    },

    onSelectDefaultsIndex: function(defaultsIndex){
        this.model.defaultsCount = currentDefaults.length;
        this.model.defaultsIndex = defaultsIndex;
        this.model.templatePageModel = getPageModelForDefaults(componentTypeId, currentDefaults, defaultsIndex);
        this.model.isModalOpen = true;

        PanelAvailableComponentsActions.selectComponentItemDefaultsIndex(componentTypeId, defaultsIndex);

        this.trigger(this.model);
    },

    onDeleteDefaultsIndex: function(defaultsIndex){
        currentDefaults.splice(defaultsIndex, 1);
        if(defaultsIndex >= currentDefaults.length){
            this.model.defaultsIndex = currentDefaults.length - 1;
        } else {
            this.model.defaultsIndex = defaultsIndex;
        }
        this.model.defaultsCount = currentDefaults.length;
        this.model.templatePageModel = getPageModelForDefaults(componentTypeId, currentDefaults, this.model.defaultsIndex);
        this.model.isModalOpen = true;

        PanelAvailableComponentsActions.selectComponentItemDefaultsIndex(componentTypeId, this.model.defaultsIndex);

        Server.invoke('saveAllComponentDefaults',
            {
                defaults: currentDefaults,
                componentName: componentTypeId
            },
            function(err){
                console.error(JSON.stringify(err));
            },
            function(response){
                // do nothing
            }
        );

        this.trigger(this.model);
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

    onShowMessage: function(message){
        this.model.isModalOpen = true;
        this.model.message = message;
        this.trigger(this.model);
    }
});

module.exports = ModalVariantsTriggerStore;
