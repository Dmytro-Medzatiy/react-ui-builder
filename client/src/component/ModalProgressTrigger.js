'use strict';

var React = require('react');
var OverlayMixin = require('react-bootstrap').OverlayMixin;
var ModalProgress = require('./ModalProgress.js');
var ModalProgressTriggerStore = require('../store/ModalProgressTriggerStore.js');
var ModalProgressTriggerActions = require('../action/ModalProgressTriggerActions.js');

var ModalProgressTrigger = React.createClass({
    mixins:[OverlayMixin],

    getInitialState: function () {
        return ModalProgressTriggerStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },
    componentDidMount: function() {
        this.unsubscribe = ModalProgressTriggerStore.listen(this.onModelChange);
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
            <ModalProgress {...this.state} onRequestHide={this._handleClose}/>
        );
    },

    _handleClose: function(){
        ModalProgressTriggerActions.toggleModal();
    }

});

module.exports = ModalProgressTrigger;
