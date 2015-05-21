'use strict';

var _ = require('underscore');
var Reflux = require('reflux');
var HtmlComponents = require('../api/HtmlComponents.js');
var Server = require('../api/Server.js');
var PanelAvailableComponentsActions = require('../action/PanelAvailableComponentsActions.js');
var Repository = require('../api/Repository.js');
var DeskPageFrameActions = require('../action/DeskPageFrameActions.js');

var defaultsIndexMap = {};

var PanelAvailableComponentsStore = Reflux.createStore({
    listenables: PanelAvailableComponentsActions,
    model: {},


    getModel: function(){
        this.model.itemsTree = Repository.getComponentsTree();
        return this.model;
    },

    onRefreshComponentList: function(){
        this.trigger(this.getModel());
    },

    onSelectComponentItem: function(componentId){
        this.model.selectedComponentId = componentId;

        this.model.componentDefaults = [];

        Server.invoke('loadComponentDefaults', {componentName: componentId},
            function(err){
                var htmlDefaults = HtmlComponents[componentId];
                if(htmlDefaults){
                    this.model.componentDefaults.push({
                        type: componentId,
                        props: htmlDefaults.props,
                        children: htmlDefaults.children,
                        text: htmlDefaults.text
                    });
                } else {
                    this.model.componentDefaults.push({
                        type: componentId
                    });
                }
                this.model.defaultsIndex = 0;
                this.copyToClipboard(this.model.componentDefaults[this.model.defaultsIndex]);
                Server.invoke('saveComponentDefaults',
                    {
                        componentName: componentId,
                        componentOptions: this.model.componentDefaults[0]
                    },
                    function(err){
                        console.error(JSON.stringify(err));
                    },
                    function(response){
                        // do nothing
                    }
                );
                //
            }.bind(this),
            function(response){
                this.model.componentDefaults = response.model;
                var defaultsIndex = defaultsIndexMap[componentId];
                if(!_.isNumber(defaultsIndex) || defaultsIndex >= this.model.componentDefaults.length){
                    defaultsIndex = 0;
                    defaultsIndexMap[componentId] = defaultsIndex;
                }
                //
                this.model.defaultsIndex = defaultsIndex;
                // some defaults don't have type value
                this.model.componentDefaults[defaultsIndex].type = componentId;
                //
                this.copyToClipboard(this.model.componentDefaults[defaultsIndex]);
                //
            }.bind(this)
        );
    },

    onSelectComponentItemDefaultsIndex: function(componentId, index){
        defaultsIndexMap[componentId] = index;
        this.copyToClipboard(this.model.componentDefaults[index]);
    },

    onDeselectComponentItem: function(){
        this.model.selectedComponentId = null;
        this.trigger(this.model);
    },

    copyToClipboard: function(options){
        DeskPageFrameActions.startClipboardForOptions({ options:{
            type: options.type,
            props: options.props || {},
            children: options.children || [],
            text: options.text
        }});
        this.trigger(this.model);
    }
});

module.exports = PanelAvailableComponentsStore;
