'use strict';

var Reflux = require('reflux');
var ModalCodeGeneratorTriggerActions = require('../action/ModalCodeGeneratorTriggerActions.js');
var Repository = require('../api/Repository.js');

var defaultModel = {
    isModalOpen: false

};

var ModalCodeGeneratorTriggerStore = Reflux.createStore({
    model: defaultModel,
    listenables: ModalCodeGeneratorTriggerActions,

    onShowModal: function(callback){
        if(!this.model.isModalOpen){
            this.model.message = false;
            this.model.dirPath = Repository.getCurrentProjectExportDirPath();
            this.model.submitCallback = callback;
            this.model.isModalOpen = true;
            this.trigger(this.model);
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

    onShowMessage: function(message){
        this.model.isModalOpen = true;
        this.model.message = message;
        this.trigger(this.model);
    }
});

module.exports = ModalCodeGeneratorTriggerStore;
