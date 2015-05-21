'use strict';

var Reflux = require('reflux');
var Server = require('../api/Server.js');
var ModalProjectSettingsTriggerActions = require('../action/ModalProjectSettingsTriggerActions.js');

var defaultModel = {
    isModalOpen: false
};

var ModalProjectSettingsTriggerStore = Reflux.createStore({
    model: defaultModel,
    listenables: ModalProjectSettingsTriggerActions,

    onShowModal: function(){
        if(!this.model.isModalOpen){
            Server.invoke('setProjectProxy',
                {},
                function(err){
                    this.model.isModalOpen = true;
                    this.trigger(this.model);
                }.bind(this),
                function(response){
                    this.model.urlValue = response.proxyURL;
                    this.model.isModalOpen = true;
                    this.trigger(this.model);
                }.bind(this)
            );
        }
    },
    onSaveSettings: function(options){
        if(this.model.isModalOpen){
            var proxyURLDelete = false;
            if(!options.urlValue || options.urlValue.length <= 0){
                proxyURLDelete = true;
            }
            Server.invoke('setProjectProxy',
                {
                    proxyURL: options.urlValue,
                    proxyURLDelete: proxyURLDelete
                },
                function(err){
                    this.model.isModalOpen = false;
                    this.trigger(this.model);
                }.bind(this),
                function(response){
                    this.model.isModalOpen = false;
                    this.trigger(this.model);
                }.bind(this)
            );
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
    }
});

module.exports = ModalProjectSettingsTriggerStore;
