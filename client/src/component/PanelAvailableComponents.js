'use strict';

var _ = require('underscore');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Button = ReactBootstrap.Button;
var Panel = ReactBootstrap.Panel;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;
var Badge = ReactBootstrap.Badge;
var PanelGroup = ReactBootstrap.PanelGroup;

var DeskPageFrameActions = require('../action/DeskPageFrameActions.js');
var PanelAvailableComponentsActions = require('../action/PanelAvailableComponentsActions.js');
var PanelAvailableComponentsStore = require('../store/PanelAvailableComponentsStore.js');
var ModalVariantsTriggerActions = require('../action/ModalVariantsTriggerActions.js');
var Repository = require('../api/Repository.js');

var PanelComponentItem = React.createClass({

    render: function(){

        if(this.props.selected){
            var variantSelectorElement = null;
            if(this.props.defaults && this.props.defaults.length > 1){
                variantSelectorElement = (
                    <a key={1} href='#' onClick={this._handlePreview}>Select variant</a>
                );
            }
            var titleComponentName = this.props.componentName;
            if(titleComponentName.length > 13){
                titleComponentName = titleComponentName.substr(0, 13) + '...';
            }
            return (
                <ListGroupItem header={titleComponentName}>
                    {variantSelectorElement}
                </ListGroupItem>
            );
        } else {
            var componentName = this.props.componentName;
            if(componentName.length > 20){
                componentName = componentName.substr(0, 20) + '...';
            }
            return (
                <ListGroupItem style={{cursor: 'pointer'}} onClick={this._handleClick}>
                    <span>{componentName}</span>
                </ListGroupItem>
            );
        }
    },

    _handleClick: function(){
        PanelAvailableComponentsActions.selectComponentItem(this.props.componentId);
    },

    _handlePreview: function(e){
        e.preventDefault();
        e.stopPropagation();
        ModalVariantsTriggerActions.showModal(this.props.componentId, this.props.defaults, this.props.defaultsIndex);
    }

});

var PanelAvailableComponents = React.createClass({

    getInitialState: function () {
        return PanelAvailableComponentsStore.getModel();
    },

    onModelChange: function (model) {
        this.setState(model);
    },

    componentDidMount: function () {
        this.unsubscribe = PanelAvailableComponentsStore.listen(this.onModelChange);
        $(React.findDOMNode(this)).find('.panel-body').remove();
    },

    componentDidUpdate: function(){
        $(React.findDOMNode(this)).find('.panel-body').remove();
    },

    componentWillUnmount: function () {
        this.unsubscribe();
    },

    render: function(){
        var style = {
            //display: this.props.displayStyle,
            width: '100%',
            overflowY: 'auto',
            overflowX: 'hidden'
        };

        var self = this;
        var componentTreeModel = this.state.itemsTree;
        var libGroups = [];
        var groupHeaderKey = 0;
        var componentsWithNoGroup = [];
        var counter = 0;
        _.mapObject(componentTreeModel, function(group, groupName){
            if(_.isObject(group)){
                var components = [];
                _.mapObject(group, function(componentTypeValue, componentId){
                    components.push(
                        <PanelComponentItem key={'item' + componentId + counter}
                            defaultsIndex={self.state.defaultsIndex}
                            defaults={self.state.componentDefaults}
                            componentId={componentId}
                            selected={self.state.selectedComponentId === componentId}
                            componentName={componentId}/>
                    );
                });
                var key = '' + ++groupHeaderKey;
                libGroups.push(
                    <Panel collapsable header={groupName} eventKey={key} key={'group' + groupName + counter}>
                        <ListGroup fill>
                            {components}
                        </ListGroup>
                        <div style={{height: '0'}}></div>
                    </Panel>
                );
            } else {
                componentsWithNoGroup.push(
                    <PanelComponentItem key={'item' + groupName + counter}
                        defaultsIndex={self.state.defaultsIndex}
                        defaults={self.state.componentDefaults}
                        componentId={groupName}
                        selected={self.state.selectedComponentId === groupName}
                        componentName={groupName}/>
                );
            }
            counter++;
        });
        if(componentsWithNoGroup.length > 0){
            libGroups.push(
                <div style={{marginTop: '0.3em'}} key={'groupWithNoGroup' + counter}>
                    <ListGroup fill>
                        {componentsWithNoGroup}
                    </ListGroup>
                </div>
            );
        }

        return (
            <div style={style}>
                <PanelGroup>
                    {libGroups}
                </PanelGroup>
            </div>
        );
    }

});

module.exports = PanelAvailableComponents;
