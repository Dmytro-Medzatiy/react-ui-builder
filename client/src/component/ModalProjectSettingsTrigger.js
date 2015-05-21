'use strict';

var React = require('react');
var OverlayMixin = require('react-bootstrap').OverlayMixin;
var ModalProjectSettings = require('./ModalProjectSettings.js');
var ModalProjectSettingsTriggerStore = require('../store/ModalProjectSettingsTriggerStore.js');
var ModalProjectSettingsTriggerActions = require('../action/ModalProjectSettingsTriggerActions.js');

var ModalProjectSettingsTrigger = React.createClass({
    mixins:[OverlayMixin],

    getInitialState: function () {
        return ModalProjectSettingsTriggerStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },
    componentDidMount: function() {
        this.unsubscribe = ModalProjectSettingsTriggerStore.listen(this.onModelChange);
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },

    render: function () {
        return (
            <span/>
        );
    },

    // This is called by the `OverlayMixin` when this component
    // is mounted or updated and the return value is appended to the body.
    renderOverlay: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        }

        return (
            <ModalProjectSettings {...this.state} onRequestHide={this._handleClose}/>
        );
    },

    _handleClose: function(){
        ModalProjectSettingsTriggerActions.hideModal();
    }
});

module.exports = ModalProjectSettingsTrigger;
