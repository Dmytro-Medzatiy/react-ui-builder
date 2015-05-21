'use strict';

var _ = require('underscore');
var Reflux = require('reflux');
var ToolbarTopActions = require('../action/ToolbarTopActions.js');
var ApplicationActions = require('../action/ApplicationActions.js');
var DeskPageFrameActions = require('../action/DeskPageFrameActions.js');
var Common = require('../api/Common.js');
var Repository = require('../api/Repository.js');
var Server = require('../api/Server.js');

var defaultModel = {
    pageNames:[],
    currentPageName: '',
    isAddNewComponentMode: false
};

var ToolbarTopStore = Reflux.createStore({
    model: defaultModel,
    listenables: ToolbarTopActions,

    onStartAddNewComponentMode: function(inClipboard){
        this.model.isAddNewComponentMode = true;
        this.model.inClipboard = inClipboard;
        this.trigger(this.model);
    },
    onStopAddNewComponentMode: function(){
        this.model.isAddNewComponentMode = false;
        this.model.inClipboard = null;
        this.trigger(this.model);
    },

    onRefreshPageList: function(){
        var pageNames = Repository.getCurrentProjectPageNames();

        this.model.currentPageName = Repository.getCurrentPageName();
        this.model.pages = [];
        _.forEach(pageNames, (function(page, pageIndex){
            //if(page !== this.model.currentPageName){
                this.model.pages.push(
                    {
                        pageName: page,
                        pageIndex: pageIndex
                    });
            //}
        }).bind(this));

        this.trigger(this.model);
    },

    onCurrentPageNameChange: function(newPageName){
        Repository.setCurrentPageName(newPageName);
        this.model.currentPageName = Repository.getCurrentPageName();
        this.onRefreshPageList();
        this.trigger(this.model);
    },

    onAddNewPage: function(){
        var projectModel = Repository.getCurrentProjectModel();
        var newPageModel = Repository.getTemplatePageModel();
        newPageModel.pageName = newPageModel.pageName + projectModel.pages.length;
        Common.setupPropsUmyId(newPageModel, true);
        projectModel.pages.push(newPageModel);
        Repository.renewCurrentProjectModel(projectModel);
        Repository.setCurrentPageModelByIndex(projectModel.pages.length - 1);
        this.onRefreshPageList();
        DeskPageFrameActions.renderPageFrame();
    },

    onDeletePage: function(){
        Repository.deleteCurrentPageModel();
        this.onRefreshPageList();
        DeskPageFrameActions.renderPageFrame();
    },

    onCopyPage: function(){
        var projectModel = Repository.getCurrentProjectModel();
        var newPageModel = Repository.getCurrentPageModel();
        newPageModel.pageName = newPageModel.pageName + projectModel.pages.length;
        Common.setupPropsUmyId(newPageModel, true);
        projectModel.pages.push(newPageModel);
        Repository.renewCurrentProjectModel(projectModel);
        Repository.setCurrentPageModelByIndex(projectModel.pages.length - 1);
        this.onRefreshPageList();
        DeskPageFrameActions.renderPageFrame();
    },

    onSwitchToPage: function(pageIndex){
        Repository.setCurrentPageModelByIndex(parseInt(pageIndex));
        this.onRefreshPageList();
        DeskPageFrameActions.renderPageFrame();
    },

    onUndo: function(){
        Repository.undoCurrentProjectModel();
        this.onRefreshPageList();
        DeskPageFrameActions.renderPageFrame();
    },

    onRedo: function(){
        Repository.redoCurrentProjectModel();
        this.onRefreshPageList();
        DeskPageFrameActions.renderPageFrame();
    }
});

module.exports = ToolbarTopStore;
