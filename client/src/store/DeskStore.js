'use strict';

var Reflux = require('reflux');
var DeskActions = require('../action/DeskActions.js');

var defaultModel = {
    isToolbarLeftShown: true,
    isToolbarTopShown: true,

    isAvailableComponentsButtonActive: false,
    isComponentOptionsButtonActive: false,
    isStyleOptionsButtonActive: false,
    isComponentsHierarchyButtonActive: false,

    isEditMode: true,
    isTextEditMode: false,
    LoadUserProfile: false

};

var DeskStore = Reflux.createStore({
    model: defaultModel,
    listenables: DeskActions,

    onStartEditMode: function(){
        if(!this.model.isEditMode){
            this.model.isEditMode = true;
            this.model.isLivePreviewMode = false;
            this.model.isTextEditMode = false;
            //
            //this.model.isAvailableComponentsButtonActive = true;
            //this.model.isComponentOptionsButtonActive = true;
            //this.model.isStyleOptionsButtonActive = true;
            //
            this.trigger(this.model);
        }
    },
    onStartTextEditMode: function(){
        if(!this.model.isTextEditMode){
            this.model.isEditMode = false;
            this.model.isLivePreviewMode = false;
            this.model.isTextEditMode = true;
            //
            this.model.isAvailableComponentsButtonActive = false;
            this.model.isComponentOptionsButtonActive = false;
            this.model.isStyleOptionsButtonActive = false;
            //
            this.trigger(this.model);
        }
    },
    onStartLivePreviewMode: function(){
        if(!this.model.isLivePreviewMode){
            this.model.isEditMode = false;
            this.model.isLivePreviewMode = true;
            this.model.isTextEditMode = false;
            //
            this.model.isAvailableComponentsButtonActive = false;
            this.model.isComponentOptionsButtonActive = false;
            this.model.isStyleOptionsButtonActive = false;
            this.model.isComponentsHierarchyButtonActive = false;
            //
            this.trigger(this.model);
        }
    },
    onToggleAvailableComponents: function(){
        if(!this.model.isAvailableComponentsButtonActive){
            this.model.isAvailableComponentsButtonActive = true;
            this.model.isComponentOptionsButtonActive = false;
            this.model.isStyleOptionsButtonActive = false;
        }  else {
            this.model.isAvailableComponentsButtonActive = false;
        }
        this.trigger(this.model);
    },
    onToggleComponentOptions: function(){
        if(!this.model.isComponentOptionsButtonActive){
            this.model.isAvailableComponentsButtonActive = false;
            this.model.isComponentOptionsButtonActive = true;
            this.model.isStyleOptionsButtonActive = false;
        } else {
            this.model.isComponentOptionsButtonActive = false;
        }
        this.trigger(this.model);
    },
    onToggleStyleOptions: function(){
        if(!this.model.isStyleOptionsButtonActive){
            this.model.isAvailableComponentsButtonActive = false;
            this.model.isComponentOptionsButtonActive = false;
            this.model.isStyleOptionsButtonActive = true;
        } else {
            this.model.isStyleOptionsButtonActive = false;
        }
        this.trigger(this.model);
    },
    onToggleComponentsHierarchy: function(){
        this.model.isComponentsHierarchyButtonActive = !this.model.isComponentsHierarchyButtonActive;
        this.trigger(this.model);
    }


});


module.exports = DeskStore;
