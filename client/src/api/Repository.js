'use strict';

var _ = require('underscore');
var Common = require('./Common.js');
var HtmlComponents = require('./HtmlComponents.js');
//var userProfile = null;
//var currentProject = null;

var currentProjectModel = null;
var currentProjectName = null;
var currentPageModel = null;
var currentPageIndex = null;
var currentPageDomNodes = {};
var currentPageWindow = null;
var currentPageDocument = null;
var componentsTree = null;
//var currentPageComponentDefaults = null;

var htmlForDesk = null;

var flatDefaults = null;
//var clipboardForOptions = null;
var redoPool = [];
var undoPool = [];
var callbackAfterProjectModelRenew = null;

function findComponent(index, componentName, level, result){
    var _result = result || {};
    if(index && _.isObject(index) && level <= 1){
        level++;
        _.mapObject(index, function(value, key){
            if(!_result.value){
                if(key === componentName){
                    _result.value = value;
                } else if(value && _.isObject(value)){
                    _result = findComponent(value, componentName, level, _result);
                    if(_result.value){
                        _result.group = key;
                    }
                }
            }
        });
    }
    return _result;
}

var Repository = {

    setCurrentProjectModel: function(projectModel){
        undoPool = [];
        currentProjectModel = projectModel;
        currentProjectName = projectModel.name;
        _.each(currentProjectModel.pages, function(page){
            Common.setupPropsUmyId(page, true);
        });
    },

    getCurrentProjectModel: function(){
        return Common.fulex(currentProjectModel);
    },

    getCurrentProjectName: function(){
        return currentProjectName;
    },

    setCallbackAfterProjectModelRenew: function(callback){
        callbackAfterProjectModelRenew = callback;
    },

    setCurrentPageModel: function(pageName){
        _.each(currentProjectModel.pages, function(page, index){
            if(page.pageName === pageName){
                currentPageModel = page;
                currentPageIndex = index;
            }
        });
    },

    getCurrentProjectPageNames: function(){
        var pageNames = [];
        _.forEach(currentProjectModel.pages, function(page){
            pageNames.push(page.pageName);
        });
        return pageNames;
    },

    setCurrentPageModelByIndex: function(pageIndex){
        if(currentProjectModel.pages && currentProjectModel.pages.length > pageIndex){
            currentPageModel = currentProjectModel.pages[pageIndex];
            currentPageIndex = pageIndex;
        }
    },

    deleteCurrentPageModel: function(){
        if(currentProjectModel.pages && currentProjectModel.pages.length > 1){
            this._appendUndoState();
            //
            var newPages = [];
            for(var i = 0; i < currentProjectModel.pages.length; i++){
                if(i != currentPageIndex){
                    newPages.push(currentProjectModel.pages[i]);
                }
            }
            currentProjectModel.pages = newPages;
            newPages = null;
            if(currentPageIndex >= currentProjectModel.pages.length){
                currentPageIndex = currentProjectModel.pages.length - 1;
            }
            currentPageModel = currentProjectModel.pages[currentPageIndex];
            //
            if(callbackAfterProjectModelRenew){
                callbackAfterProjectModelRenew(currentProjectModel);
            }
        }
    },

    _appendUndoState: function(){
        if(undoPool.length >= 50){
            undoPool = _.rest(undoPool, 50);
        }
        undoPool.push({
            projectModel: Common.fulex(currentProjectModel),
            pageIndex: currentPageIndex
        });
    },
    //
    //_appendRedoState: function(){
    //    if(redoPool.length >= 50){
    //        redoPool = _.rest(redoPool, 50);
    //    }
    //    redoPool.push({
    //        projectModel: Common.fulex(currentProjectModel),
    //        pageIndex: currentPageIndex
    //    });
    //},
    //
    undoCurrentProjectModel: function(){
        if(undoPool.length > 0){
            var undoState = _.last(undoPool);
            currentProjectModel = undoState.projectModel;
            this.setCurrentPageModelByIndex(undoState.pageIndex);
            undoPool = _.initial(undoPool);
        }
    },
    //
    //redoCurrentProjectModel: function(){
    //    if(redoPool.length > 0){
    //        this._appendUndoState();
    //        var redoState = _.last(redoPool);
    //        currentProjectModel = redoState.projectModel;
    //        this.setCurrentPageModelByIndex(redoState.pageIndex);
    //        redoPool = _.initial(redoPool);
    //    }
    //},

    getUndoSize: function(){
        return undoPool.length;
    },

    setCurrentPageName: function(pageName){
        currentPageModel.pageName = pageName;
    },

    renewCurrentProjectModel: function(projectModel){
        this._appendUndoState();
        currentProjectModel = projectModel;
        _.each(currentProjectModel.pages, function(page){
            Common.setupPropsUmyId(page);
        });
        this.setCurrentPageModelByIndex(currentPageIndex);
        if(callbackAfterProjectModelRenew){
            callbackAfterProjectModelRenew(currentProjectModel);
        }
    },

    getCurrentPageModel: function(){
        return Common.fulex(currentPageModel);
    },

    getTemplatePageModel: function(){
        return {
            pageName: 'UnnamedPage',
            children: [
                {
                    type: 'h3',
                    props: {
                        style: {
                            padding: '1em',
                            textAlign: 'center'
                        }
                    },
                    children: [
                        {
                            type: 'span',
                            text: 'This is an empty page. ' +
                            'To add new component select needed element on left-side ' +
                            'panel and click on an element on the page where you want to put new component.'
                        }
                    ]
                }
            ]
        };
    },

    getCurrentPageName: function(){
        return currentPageModel.pageName;
    },

    findInCurrentPageModelByUmyId: function(umyId){
        var searchResult = Common.findByPropsUmyId(currentPageModel, umyId);
        return Common.fulex(searchResult);
    },

    resetCurrentPageDomNodes: function(){
        currentPageDomNodes = {};
    },

    setCurrentPageDomNode: function(key, domNode){
        currentPageDomNodes[key] = domNode;
    },

    getCurrentPageDomNode: function(key){
        return currentPageDomNodes[key];
    },

    getCurrentPageDomNodes: function(){
        return currentPageDomNodes;
    },

    setCurrentPageWindow: function(window){
        currentPageWindow = window;
    },

    getCurrentPageWindow: function(){
        return currentPageWindow;
    },

    setCurrentPageDocument: function(doc){
        currentPageDocument = doc;
    },

    getCurrentPageDocument: function(){
        return currentPageDocument;
    },

    setComponentsTree: function(lib){
        componentsTree = lib;
        //
        var components = {};
        //
        _.mapObject(HtmlComponents, function(component, componentName){
            components[componentName] = {
                type: 'Reference'
            };
        });
        componentsTree['Html'] = components;
    },

    getComponentsTree: function(){
        return componentsTree;
    },

    getComponentFromTree: function(componentName){
        if(componentsTree){
            return findComponent(componentsTree, componentName, 0);
        }
    },

    getComponentsTreeGroups: function(){
        return _.keys(componentsTree);
    },

    getCurrentProjectFramework: function(){
        return currentProjectModel.lib_components[0];
    },

    //setCurrentPageComponentDefaults: function(type, defaults){
    //    var currentPageComponentDefaults = defaults;
    //    flatDefaults = flatDefaults || {};
    //    flatDefaults[type] =
    //    _.mapObject(currentPageComponentDefaults, function(lib, libName){
    //        _.mapObject(lib, function(group, groupName){
    //            _.mapObject(group, function(componentDefaults, componentName){
    //                flatDefaults[libName + ':' + groupName + ':' + componentName] = componentDefaults;
    //            });
    //        });
    //    });
    //},
    //
    getFlatDefaults: function(){
      return flatDefaults;
    },

    setFlatDefaults: function(defaults){
      flatDefaults = defaults;
    },

    getCurrentProjectExportDirPath: function(){
        return currentProjectModel.exportDirPath;
    },

    setCurrentProjectExportDirPath: function(dirPath){
        currentProjectModel.exportDirPath = dirPath;
    },

    setHtmlForDesk: function(path){
        htmlForDesk = path;
    },

    getHtmlForDesk: function(){
        return htmlForDesk;
    }


};

module.exports = Repository;
