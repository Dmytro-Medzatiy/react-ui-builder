'use strict';

var React = require('react');
var OverlayMixin = require('react-bootstrap').OverlayMixin;
var ModalPropsEditor = require('./ModalPropsEditor.js');
var ModalPropsEditorTriggerStore = require('../store/ModalPropsEditorTriggerStore.js');
var ModalPropsEditorTriggerActions = require('../action/ModalPropsEditorTriggerActions.js');

var ModalPropsEditorTrigger = React.createClass({
    mixins:[OverlayMixin],

    getInitialState: function () {
        return ModalPropsEditorTriggerStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },
    componentDidMount: function() {
        this.unsubscribe = ModalPropsEditorTriggerStore.listen(this.onModelChange);
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },

    render: function () {
        return (
            <span/>
        );
    },

    renderOverlay: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        }

        return (
            <ModalPropsEditor {...this.state}
                onRequestHide={this._handleClose}/>
        );
    },

    _handleClose: function(){
        ModalPropsEditorTriggerActions.toggleModal();
    }

});

module.exports = ModalPropsEditorTrigger;
