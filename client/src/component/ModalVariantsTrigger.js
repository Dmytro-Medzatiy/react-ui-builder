'use strict';

var React = require('react');
var OverlayMixin = require('react-bootstrap').OverlayMixin;
var ModalVariants = require('./ModalVariants.js');
var ModalVariantsTriggerStore = require('../store/ModalVariantsTriggerStore.js');
var ModalVariantsTriggerActions = require('../action/ModalVariantsTriggerActions.js');

var ModalVariantsTrigger = React.createClass({
    mixins:[OverlayMixin],

    getInitialState: function () {
        return ModalVariantsTriggerStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },
    componentDidMount: function() {
        this.unsubscribe = ModalVariantsTriggerStore.listen(this.onModelChange);
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
            <ModalVariants {...this.state} onRequestHide={this._handleClose}/>
        );

    },

    _handleClose: function(){
        ModalVariantsTriggerActions.hideModal();
    }

});

module.exports = ModalVariantsTrigger;
