'use strict';

var _ = require('underscore');

var Common = {

    fulfil: function (obj1, obj2) {
        if ($.isArray(obj2)) {
            if (!obj1 || obj1 == null) {
                obj1 = [];
                for (var i = 0; i < obj2.length; i++) {
                    obj1.push(this.fulfil(null, obj2[i]));
                }
            }
        } else if ($.isPlainObject(obj2)) {
            if (!obj1) {
                obj1 = {};
            }
            var items = Object.getOwnPropertyNames(obj2);
            for (var item = 0; item < items.length; item++) {
                obj1[items[item]] = this.fulfil(obj1[items[item]], obj2[items[item]]);
            }
        } else {
            if (obj1 == undefined) {
                obj1 = obj2;
            }
        }
        return obj1;
    },
    fulex: function (obj2) {
        var obj1 = null;
        if ($.isArray(obj2)) {
            obj1 = [];
            for (var i = 0; i < obj2.length; i++) {
                obj1.push(this.fulex(obj2[i]));
            }
        } else if ($.isPlainObject(obj2)) {
            obj1 = {};
            for (var item in obj2) {
                if (obj2.hasOwnProperty(item)) {
                    obj1[item] = this.fulex(obj2[item]);
                }
            }
        } else {
            obj1 = obj2;
        }
        return obj1;
    },
    isVisible: function (element) {
        var invisibleParent = false;
        if ($(element).css("display") === "none") {
            invisibleParent = true;
        } else {
            $(element).parents().each(function (i, el) {
                if ($(el).css("display") === "none") {
                    invisibleParent = true;
                    return false;
                }
                return true;
            });
        }
        return !invisibleParent;
    },

    setupPropsUmyId: function(modelItem, force){
        modelItem.props = modelItem.props || {};
        if(!force){
            modelItem.props['data-umyid'] = modelItem.props['data-umyid'] || _.uniqueId();
        } else {
            modelItem.props['data-umyid'] = _.uniqueId();
        }
        _.mapObject(modelItem.props, function(value, prop){
            if(_.isObject(value) && value.type){
                this.setupPropsUmyId(value, force);
            }
        }, this);
        if(modelItem.children && modelItem.children.length > 0){
            for(var i = 0; i < modelItem.children.length; i++){
                this.setupPropsUmyId(modelItem.children[i], force);
            }
        }
    },

    cleanPropsUmyId: function(modelItem){
        if(modelItem.props && modelItem.props['data-umyid']){
            modelItem.props['data-umyid'] = undefined;
            delete modelItem.props['data-umyid'];
        }
        _.mapObject(modelItem.props, function(value, prop){
            if(_.isObject(value) && value.type){
                this.cleanPropsUmyId(value);
            }
        }, this);
        if(modelItem.children && modelItem.children.length > 0){
            for(var i = 0; i < modelItem.children.length; i++){
                this.cleanPropsUmyId(modelItem.children[i]);
            }
        }
    },

    /**
     *
     * @param {object} modelItem
     * @param {object} value
     * @returns {object} {parent, found, index}
     */
    findByPropsUmyId: function(modelItem, value){
        //
        if(modelItem.props && modelItem.props['data-umyid'] === value){
            return {
                //component: modelComponent,
                found: modelItem
            };
        } else {
            var result = null;
            if(modelItem.props){
                _.mapObject(modelItem.props,
                    function(propValue, prop){
                        if(!result && _.isObject(propValue) && propValue.type){
                            var _result1 = this.findByPropsUmyId(propValue, value);
                            if(_result1 && _result1.found){
                                result = {
                                    foundProp: _result1.foundProp || prop,
                                    parent: _result1.parent || modelItem,
                                    found: _result1.found
                                };
                                if(_result1.index == undefined){
                                    result.index = 0;
                                } else {
                                    result.index = _result1.index;
                                }
                            }
                        }
                    }, this);
            }
            if(!result && modelItem.children && modelItem.children.length > 0){
                for(var i = 0; i < modelItem.children.length; i++){
                    var _result = this.findByPropsUmyId(modelItem.children[i], value);
                    if(_result && _result.found){
                        result = {
                            foundProp: _result.foundProp || '/!#child',
                            parent: _result.parent || modelItem,
                            found: _result.found
                        };
                        if(_result.index == undefined){
                            result.index = i;
                        } else {
                            result.index = _result.index;
                        }
                        break;
                    }
                }
            }
            return result;
        }
    },

    /**
     *
     * @param modelItem
     * @param resultArray
     * @returns {*|Array}
     */
    findAllWithComponentName: function(modelItem, resultArray){
        var result = resultArray || [];
        if(modelItem.componentName && modelItem.componentName.length > 0){
            result.push(modelItem);
        }
        if(modelItem.props){
            _.mapObject(modelItem.props,
                function(propValue, prop){
                    if(_.isObject(propValue) && propValue.type){
                        this.findAllWithComponentName(propValue, result);
                    }
                }, this);
        }
        if(modelItem.children && modelItem.children.length > 0){
            for(var i = 0; i < modelItem.children.length; i++){
                this.findAllWithComponentName(modelItem.children[i], result);
            }
        }
        return result;
    },

    findByComponentName: function(modelItem, componentName, resultArray){
        var result = resultArray || [];
        if(modelItem.componentName
            && modelItem.componentName.length > 0
            && modelItem.componentName === componentName){
            result.push(modelItem);
        }
        if(modelItem.props){
            _.mapObject(modelItem.props,
                function(propValue, prop){
                    if(_.isObject(propValue) && propValue.type){
                        this.findByComponentName(propValue, componentName, result);
                    }
                }, this);
        }
        if(modelItem.children && modelItem.children.length > 0){
            for(var i = 0; i < modelItem.children.length; i++){
                this.findByComponentName(modelItem.children[i], componentName, result);
            }
        }
        return result;
    },

    setupAllWithComponentName: function(modelItem, sourceModelItem, componentName){
        var byName = componentName || sourceModelItem.componentName;
        var projectComponents = this.findByComponentName(modelItem, byName, null);
        if(projectComponents && projectComponents.length > 0){
            _.forEach(projectComponents, function(component){
                if(component != sourceModelItem){
                    var newItem = Common.fulex(sourceModelItem);
                    // create new ids for children
                    Common.setupPropsUmyId(newItem, true);
                    // but save found component id
                    newItem.props['data-umyid'] = component.props['data-umyid'];
                    //
                    component.props = newItem.props;
                    component.children = newItem.children;
                    component.text = newItem.text;
                    component.componentName = newItem.componentName;
                    newItem = null;
                }
            });
        }

    },

    //setupAllWithComponentName: function(modelItem, sourceModelItem){
    //    if(modelItem.componentName && modelItem.componentName.length > 0
    //        && modelItem.componentName === sourceModelItem.componentName
    //        && modelItem != sourceModelItem){
    //        //
    //        var newItem = Common.fulex(sourceModelItem);
    //        Common.setupPropsUmyId(newItem, true);
    //        modelItem.props = newItem.props;
    //        modelItem.children = newItem.children;
    //        modelItem.text = newItem.text;
    //        newItem = null;
    //        //
    //    }
    //    if(modelItem.props){
    //        _.mapObject(modelItem.props,
    //            function(propValue, prop){
    //                if(_.isObject(propValue) && propValue.type){
    //                    this.setupAllWithComponentName(propValue, sourceModelItem);
    //                }
    //            }, this);
    //    }
    //    if(modelItem.children && modelItem.children.length > 0){
    //        for(var i = 0; i < modelItem.children.length; i++){
    //            this.setupAllWithComponentName(modelItem.children[i], sourceModelItem);
    //        }
    //    }
    //},
    //
    /**
     *
     * @param srcUmyId
     * @param destUmyId
     * @param projectModel
     * @param modifyMode
     * @returns {*}
     */
    pasteInModelFromUmyId: function(srcUmyId, destUmyId, projectModel, modifyMode){
        if(srcUmyId && destUmyId && projectModel && modifyMode){
            //
            var srcSearchResult = null;
            var searchResult = null;
            for(var i = 0; i < projectModel.pages.length; i++){
                if(!srcSearchResult){
                    srcSearchResult = Common.findByPropsUmyId(projectModel.pages[i], srcUmyId);
                }
                if(!searchResult){
                    searchResult = Common.findByPropsUmyId(projectModel.pages[i], destUmyId);
                }
            }
            if (searchResult && srcSearchResult) {
                var clipboard = Common.fulex(srcSearchResult.found);
                Common.setupPropsUmyId(clipboard, true);
                var modelItem = null;
                var modelIndex = null;
                switch (modifyMode) {
                    case 'addBefore':
                        if (searchResult.foundProp === '/!#child') {
                            modelItem = searchResult.parent;
                            modelIndex = searchResult.index;
                            modelItem.children = modelItem.children || [];
                            modelItem.children.splice(modelIndex, 0, clipboard);
                        }
                        break;
                    case 'insertFirst':
                        modelItem = searchResult.found;
                        modelItem.children = modelItem.children || [];
                        modelItem.children.splice(0, 0, clipboard);
                        break;
                    case 'insertLast':
                        modelItem = searchResult.found;
                        modelItem.children = modelItem.children || [];
                        modelItem.children.push(clipboard);
                        break;
                    case 'addAfter':
                        if (searchResult.foundProp === '/!#child') {
                            modelItem = searchResult.parent;
                            modelIndex = searchResult.index;
                            modelItem.children = modelItem.children || [];
                            modelItem.children.splice(modelIndex + 1, 0, clipboard);
                        }
                        break;
                    case 'wrap':
                        if (searchResult.foundProp === '/!#child') {
                            modelItem = searchResult.parent;
                            //console.log(JSON.stringify(modelItem, null, 4));
                            modelIndex = searchResult.index;
                            modelItem.children = modelItem.children || [];
                            var buffer = modelItem.children.splice(modelIndex, 1, clipboard);
                            clipboard.children = clipboard.children || [];
                            if(buffer && buffer.length > 0){
                                clipboard.children.push(buffer[0]);
                            }
                            //console.log(JSON.stringify(modelItem, null, 4));
                            //modelItem.children.splice(modelIndex, 0, clipboard);
                        }
                        break;
                    case 'replace':
                        if (searchResult.foundProp === '/!#child') {
                            modelItem = searchResult.parent;
                            //console.log(JSON.stringify(modelItem, null, 4));
                            modelIndex = searchResult.index;
                            modelItem.children = modelItem.children || [];
                            modelItem.children.splice(modelIndex, 1, clipboard);
                            //console.log(JSON.stringify(modelItem, null, 4));
                            //modelItem.children.splice(modelIndex, 0, clipboard);
                        }
                        break;
                    default:
                        break;
                }
                //
                srcSearchResult = null;
                clipboard = null;
                searchResult = null;
                modelItem = null;
            }
            return projectModel;
        } else {
            throw new Error('Some parameters are not set');
        }
    },

    /**
     *
     * @param clipboard
     * @param destUmyId
     * @param projectModel
     * @param modifyMode
     * @returns {*}
     */
    pasteInModelFromClipboard: function(clipboard, destUmyId, projectModel, modifyMode){
        if(clipboard && destUmyId && projectModel && modifyMode){
            //
            var searchResult = null;
            for(var i = 0; i < projectModel.pages.length; i++){
                if(!searchResult){
                    searchResult = Common.findByPropsUmyId(projectModel.pages[i], destUmyId);
                }
            }

            if (searchResult) {
                var options = Common.fulex(clipboard);
                Common.setupPropsUmyId(options, true);
                var modelItem = null;
                var modelIndex = null;
                switch (modifyMode) {
                    case 'addBefore':
                        if(searchResult.foundProp === '/!#child'){
                            modelItem = searchResult.parent;
                            modelIndex = searchResult.index;
                            modelItem.children = modelItem.children || [];
                            modelItem.children.splice(modelIndex, 0, options);
                        }
                        break;
                    case 'insertFirst':
                        modelItem = searchResult.found;
                        modelItem.children = modelItem.children || [];
                        modelItem.children.splice(0, 0, options);
                        break;
                    case 'insertLast':
                        modelItem = searchResult.found;
                        modelItem.children = modelItem.children || [];
                        modelItem.children.push(options);
                        break;
                    case 'addAfter':
                        if(searchResult.foundProp === '/!#child') {
                            modelItem = searchResult.parent;
                            modelIndex = searchResult.index;
                            modelItem.children = modelItem.children || [];
                            modelItem.children.splice(modelIndex + 1, 0, options);
                        }
                        break;
                    case 'wrap':
                        if (searchResult.foundProp === '/!#child') {
                            modelItem = searchResult.parent;
                            //console.log(JSON.stringify(modelItem, null, 4));
                            modelIndex = searchResult.index;
                            modelItem.children = modelItem.children || [];
                            var buffer = modelItem.children.splice(modelIndex, 1, options);
                            options.children = options.children || [];
                            if(buffer && buffer.length > 0){
                                options.children.push(buffer[0]);
                            }
                            //console.log(JSON.stringify(modelItem, null, 4));
                            //modelItem.children.splice(modelIndex, 0, clipboard);
                        }
                        break;
                    case 'replace':
                        if (searchResult.foundProp === '/!#child') {
                            modelItem = searchResult.parent;
                            modelIndex = searchResult.index;
                            modelItem.children = modelItem.children || [];
                            modelItem.children.splice(modelIndex, 1, options);
                        }
                        break;
                    default:
                        break;
                }
                //
                options = null;
                searchResult = null;
                modelItem = null;
            }
            return projectModel;
        } else {
            throw new Error('Some parameters are not set');
        }
    },

    /**
     *
     * @param srcUmyId
     * @param destUmyId
     * @param projectModel
     * @param modifyMode
     * @returns {*}
     */
    moveInModel: function(srcUmyId, destUmyId, projectModel, modifyMode){
        if(srcUmyId && destUmyId && projectModel && modifyMode){
            //
            var destSearchResult = null;
            var srcSearchResult = null;
            for(var i = 0; i < projectModel.pages.length; i++){
                if(!destSearchResult){
                    destSearchResult = Common.findByPropsUmyId(projectModel.pages[i], destUmyId);
                }
                if(!srcSearchResult){
                    srcSearchResult = Common.findByPropsUmyId(projectModel.pages[i], srcUmyId);
                }
            }
            //
            if (destSearchResult && srcSearchResult) {
                var modelItem = null;
                var modelIndex = null;
                switch (modifyMode) {
                    case 'addBefore':
                        if(destSearchResult.foundProp === '/!#child') {
                            modelItem = destSearchResult.parent;
                            modelIndex = destSearchResult.index;
                            modelItem.children = modelItem.children || [];
                            srcSearchResult.parent.children.splice(srcSearchResult.index, 1);
                            modelItem.children.splice(modelIndex, 0, srcSearchResult.found);
                        }
                        break;
                    case 'insertFirst':
                        modelItem = destSearchResult.found;
                        modelItem.children = modelItem.children || [];
                        srcSearchResult.parent.children.splice(srcSearchResult.index, 1);
                        modelItem.children.splice(0, 0, srcSearchResult.found);
                        break;
                    case 'insertLast':
                        modelItem = destSearchResult.found;
                        modelItem.children = modelItem.children || [];
                        srcSearchResult.parent.children.splice(srcSearchResult.index, 1);
                        modelItem.children.push(srcSearchResult.found);
                        break;
                    case 'addAfter':
                        if(destSearchResult.foundProp === '/!#child') {
                            modelItem = destSearchResult.parent;
                            modelIndex = destSearchResult.index;
                            modelItem.children = modelItem.children || [];
                            srcSearchResult.parent.children.splice(srcSearchResult.index, 1);
                            modelItem.children.splice(modelIndex + 1, 0, srcSearchResult.found);
                        }
                        break;
                    case 'wrap':
                        if (destSearchResult.foundProp === '/!#child') {
                            modelItem = destSearchResult.parent;
                            modelIndex = destSearchResult.index;
                            modelItem.children = modelItem.children || [];
                            srcSearchResult.parent.children.splice(srcSearchResult.index, 1);
                            // the same parent component, index is decremented
                            if(srcSearchResult.parent == modelItem && modelIndex > srcSearchResult.index){
                                modelIndex--;
                            }
                            var buffer = modelItem.children.splice(modelIndex, 1, srcSearchResult.found);
                            srcSearchResult.found.children = srcSearchResult.found.children || [];
                            if(buffer && buffer.length > 0){
                                srcSearchResult.found.children.push(buffer[0]);
                            }
                        }
                        break;
                    case 'replace':
                        if (destSearchResult.foundProp === '/!#child') {
                            modelItem = destSearchResult.parent;
                            modelIndex = destSearchResult.index;
                            modelItem.children = modelItem.children || [];
                            srcSearchResult.parent.children.splice(srcSearchResult.index, 1);
                            // the same parent component, index is decremented
                            if(srcSearchResult.parent == modelItem && modelIndex > srcSearchResult.index){
                                modelIndex--;
                            }
                            modelItem.children.splice(modelIndex, 1, srcSearchResult.found);
                        }
                        break;
                    default:
                        break;
                }
                //
                destSearchResult = null;
                srcSearchResult = null;
                modelItem = null;
                modelIndex = null;
            }
            return projectModel;
        } else {
            throw new Error('Some parameters are not set');
        }
    },

    /**
     *
     * @param projectModel
     * @param umyId
     * @returns {*}
     */
    moveUpInModel: function(projectModel, umyId){

        var searchResult = null;
        for(var i = 0; i < projectModel.pages.length; i++){
            if(!searchResult){
                searchResult = Common.findByPropsUmyId(projectModel.pages[i], umyId);
            }
        }
        if(searchResult
            && searchResult.foundProp === '/!#child'
            && searchResult.parent
            && searchResult.parent.children
            && searchResult.index > 0){
            //
            searchResult.parent.children.splice(searchResult.index, 1);
            searchResult.parent.children.splice(searchResult.index - 1, 0, searchResult.found);
        }

        return projectModel;
    },

    /**
     *
     * @param projectModel
     * @param umyId
     * @returns {*}
     */
    moveDownInModel: function(projectModel, umyId){

        var searchResult = null;
        for(var i = 0; i < projectModel.pages.length; i++){
            if(!searchResult){
                searchResult = Common.findByPropsUmyId(projectModel.pages[i], umyId);
            }
        }
        if(searchResult
            && searchResult.foundProp === '/!#child'
            && searchResult.parent
            && searchResult.parent.children
            && searchResult.index < searchResult.parent.children.length){
            //
            searchResult.parent.children.splice(searchResult.index, 1);
            searchResult.parent.children.splice(searchResult.index + 1, 0, searchResult.found);
        }

        return projectModel;
    },

    /**
     *
     * @param projectModel
     * @param umyId
     * @returns {*}
     */
    deleteFromModel: function(projectModel, umyId){
        var searchResult = null;
        for(var i = 0; i < projectModel.pages.length; i++){
            if(!searchResult){
                searchResult = Common.findByPropsUmyId(projectModel.pages[i], umyId);
                if(searchResult
                    && searchResult.parent == projectModel.pages[i]
                    && searchResult.parent.children
                    && searchResult.parent.children.length == 1){
                    //
                    console.error("Can't delete the last component on the page");
                    return projectModel;
                }
            }
        }
        if(searchResult && searchResult.parent && searchResult.index >= 0){
            if(searchResult.foundProp && searchResult.foundProp === '/!#child'){
                searchResult.parent.children.splice(searchResult.index, 1);
            }
            // todo: in case we want to delete nested components uncomment this
            //else {
            //    if(searchResult.parent.props){
            //        searchResult.parent.props[searchResult.foundProp] = null;
            //    }
            //}
            //for(i = 0; i < projectModel.pages.length; i++){
            //    var pageModel = projectModel.pages[i];
            //    if(searchResult.component){
            //        Common.setupAllWithComponentName(pageModel, searchResult.component);
            //    } else if(searchResult.found.componentName){
            //        Common.setupAllWithComponentName(pageModel, searchResult.found);
            //    }
            //}
        }
        return projectModel;
    }

};

module.exports = Common;
