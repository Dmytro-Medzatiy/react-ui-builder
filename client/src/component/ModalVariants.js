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
var ModalVariantsTriggerActions = require('../action/ModalVariantsTriggerActions.js');
var ModalVariantsFrame = require('./ModalVariantsFrame.js');

var Repository = require('../api/Repository.js');

var ModalVariants = React.createClass({

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
        $domNode.find('.panel-body').remove();
        //$domNode.find('.panel-body').remove();
        //
    },

    componentWillUnmount: function(){
    },

    render: function(){

        var iframeStyle = {
            "height" : "500px",
            //"height" : "100%",
            "width" : "100%",
            //"minWidth" : "320px",
            "margin" : "0",
            "padding" : "0",
            "border" : "1px solid #000000"
        };
        var pageFrameSrc = Repository.getHtmlForDesk();

        var items = [];
        for(var i = 0; i < this.props.defaultsCount; i++){
            var className = i === this.props.defaultsIndex ? 'active' : '';
            items.push(
                <li key={'defaultIndexItem' + i} role="presentation" className={className}>
                    <a style={{width: '100%'}} href="#" data-defaults-index={i} onClick={this._handleDefaultIndexSelect}>
                        {'#' + i}
                        <span className='badge' style={{position: 'absolute', right: '0.3em'}} onClick={this._handleDeleteDefaultIndex} data-defaults-index={i}>
                            <span className='fa fa-trash-o'></span>
                        </span>
                    </a>
                </li>
            )
        }

        var listOfDefaultsIndex = (
            <ul className="nav nav-pills nav-stacked">
                {items}
            </ul>
        );

        return (
            <Modal {...this.props} title='Variants' animation={true} backdrop={false} keyboard={true}>
                <div className='modal-body'>
                    <div className='container-fluid'>
                        <form action='' onSubmit={this._handleSubmit}>
                            <div className='row'>
                                <div className='col-xs-2' style={{padding: 0}}>
                                    <div style={{height: '500px', overflow: 'auto'}}>
                                        {listOfDefaultsIndex}
                                    </div>
                                </div>
                                <div className='col-xs-10' style={{padding: 0}}>
                                    <ModalVariantsFrame
                                        frameBorder="0"
                                        style={iframeStyle}
                                        src={pageFrameSrc}
                                        templatePageModel={this.props.templatePageModel}/>
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
                    <Button onClick={this._handleClose}>Close</Button>
                </div>
            </Modal>
        );
    },

    _handleDefaultIndexSelect: function(e){
        e.stopPropagation();
        e.preventDefault();

        ModalVariantsTriggerActions.selectDefaultsIndex(parseInt(e.currentTarget.attributes['data-defaults-index'].value));
    },

    _handleDeleteDefaultIndex: function(e){
        e.stopPropagation();
        e.preventDefault();
        if(confirm('Confirm component variant removing')){
            ModalVariantsTriggerActions.deleteDefaultsIndex(parseInt(e.currentTarget.attributes['data-defaults-index'].value));
        }
    },

    _handleClose: function(e){
        e.stopPropagation();
        e.preventDefault();
        ModalVariantsTriggerActions.hideModal();
    }

});

module.exports = ModalVariants;
