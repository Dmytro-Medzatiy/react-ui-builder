'use strict';

var Reflux = require('reflux');
var PanelComponentsHierarchyActions = require('../action/PanelComponentsHierarchyActions.js');
var Repository = require('../api/Repository.js');

var frameWindow = null;

var PanelComponentsHierarchyStore = Reflux.createStore({
    listenables: PanelComponentsHierarchyActions,
    model: {},

    getModel: function(){
        //console.log("PanelComponentsHierarchyStore.getModel: %o", Repository.getCurrentPageModel());
        this.model.currentPageModel = Repository.getCurrentPageModel();
        return this.model;
    },

    onSetFrameWindow: function(_frameWindow){
        frameWindow = _frameWindow;
    },

    onRefreshTreeview: function(){
        this.model.selectedUmyId = null;
        this.trigger(this.getModel());
    },


    onSelectTreeviewItem: function(umyid, clipboardActive){
        this.model.selectedUmyId = umyid;
        this.model.clipboardActive = clipboardActive;
        this.trigger(this.model);
    },

    onDeselectTreeviewItem: function(){
        this.model.selectedUmyId = null;
        this.model.clipboardActive = null;
        this.trigger(this.model);
    },

    onSetCopyMark: function(umyId){
        this.model.copyMarkUmyId = umyId;
        this.trigger(this.model);
    },

    onRemoveCopyMark: function(){
        this.model.copyMarkUmyId = null;
        this.trigger(this.model);
    },

    onSetCutMark: function(umyId){
        this.model.cutMarkUmyId = umyId;
        this.trigger(this.model);
    },

    onRemoveCutMark: function(){
        this.model.cutMarkUmyId = null;
        this.trigger(this.model);
    }
});

module.exports = PanelComponentsHierarchyStore;
