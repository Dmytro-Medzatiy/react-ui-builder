'use strict';

var React = require('react');
var OverlayMixin = require('react-bootstrap').OverlayMixin;
var ModalCodeGenerator = require('./ModalCodeGenerator.js');
var ModalCodeGeneratorMessage = require('./ModalCodeGeneratorMessage.js');
var ModalCodeGeneratorTriggerStore = require('../store/ModalCodeGeneratorTriggerStore.js');
var ModalCodeGeneratorTriggerActions = require('../action/ModalCodeGeneratorTriggerActions.js');

var ModalCodeGeneratorTrigger = React.createClass({
    mixins:[OverlayMixin],

    getInitialState: function () {
        return ModalCodeGeneratorTriggerStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },
    componentDidMount: function() {
        this.unsubscribe = ModalCodeGeneratorTriggerStore.listen(this.onModelChange);
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

        if(this.state.message){
            return (
                <ModalCodeGeneratorMessage
                    message={this.state.message}
                    onRequestHide={this._handleClose}/>
            );
        } else {
            return (
                <ModalCodeGenerator
                    dirPath={this.state.dirPath}
                    submitCallback={this.state.submitCallback}
                    onRequestHide={this._handleClose}/>
            );
        }

    },

    _handleClose: function(){
        ModalCodeGeneratorTriggerActions.toggleModal();
    }

});

module.exports = ModalCodeGeneratorTrigger;
