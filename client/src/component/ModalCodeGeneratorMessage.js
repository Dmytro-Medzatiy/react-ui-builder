'use strict';

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Panel = ReactBootstrap.Panel;
var PanelGroup = ReactBootstrap.PanelGroup;
var Alert = ReactBootstrap.Alert;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var Nav = ReactBootstrap.Nav;
var Navbar = ReactBootstrap.Navbar;
var NavItem = ReactBootstrap.NavItem;
var TabbedArea = ReactBootstrap.TabbedArea;
var TabPane = ReactBootstrap.TabPane;
var Table = ReactBootstrap.Table;
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;
var Badge = ReactBootstrap.Badge;
var Modal = ReactBootstrap.Modal;
var ModalCodeGeneratorTriggerActions = require('../action/ModalCodeGeneratorTriggerActions.js');

var ModalCodeGeneratorMessage = React.createClass({

    getDefaultProps: function () {
        return {
            onRequestHide: null
        };
    },

    componentDidMount: function(){
        var $domNode = $(React.findDOMNode(this));
        $domNode.css({
            'z-index': 1060
        });
        $domNode.find('.modal-dialog').addClass('modal-lg');
        //$domNode.find('.panel-body').remove();
        //
    },

    componentWillUnmount: function(){
    },

    render: function(){
        return (
            <Modal {...this.props} title='Export as React application' animation={true} backdrop={false} keyboard={true}>
                <div className='modal-body'>
                    <div className='container-fluid'>
                        <form action='' onSubmit={this._handleSubmit}>
                            <div className='row'>
                                <div className='col-xs-12'>
                                    <p>{this.props.message}</p>
                                </div>
                                {/*
                                <div className='col-xs-3'>
                                    <p className='text-muted'>Help text</p>
                                </div>
                                */}
                            </div>
                            {/*
                            <div className='row'>
                                <div className='col-xs-9'>
                                    <Input
                                        type="checkbox"
                                        label="Add webpack config"
                                        ref="webpackAddCheckbox" />
                                </div>
                                <div className='col-xs-3'>
                                    <p className='text-muted'>Help text</p>
                                </div>
                            </div>
                            */}
                        </form>
                    </div>
                </div>
                <div className="modal-footer">
                    <Button bsStyle='primary' onClick={this._handleClose}>Close</Button>
                </div>
            </Modal>
        );
    },

    _handleClose: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalCodeGeneratorTriggerActions.hideModal();
    }

});

module.exports = ModalCodeGeneratorMessage;
