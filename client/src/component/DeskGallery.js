'use strict';

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Panel = ReactBootstrap.Panel;
var Alert = ReactBootstrap.Alert;
var Button = ReactBootstrap.Button;
var SplitButton = ReactBootstrap.SplitButton;
var MenuItem = ReactBootstrap.MenuItem;
var ApplicationActions = require('../action/ApplicationActions.js');

var Desk = React.createClass({

    getInitialState: function(){
        return {
            activePageIndex: 0
        };
    },

    render: function(){

        var toolbarTopStyle = {
            position: 'absolute',
            //display: 'table',
            top: '5px',
            left: '5px',
            right: '5px',
            height: '4em'
        };

        var topPanelHeight = 4;

        var bodyStyle = {
            position: 'absolute',
            top: topPanelHeight + 'em',
            left: '5px',
            //bottom: 'calc(5px + ' + bottomPanelHeight + 'px)',
            overflow: 'auto',
            bottom: '5px',
            WebkitOverflowScrolling: 'touch',
            right: '5px'
        };

        var iframeStyle = {
            "height" : "calc(100% - 5px)",
            //"height" : "100%",
            "width" : "100%",
            "minWidth" : "320px",
            "margin" : "0",
            "padding" : "0",
            "border" : "1px solid #000000"
        };

        var pageSwitcher = null;
        if(this.props.projectModel.pages && this.props.projectModel.pages.length > 0){
            var items = [];
            for(var i = 0; i < this.props.projectModel.pages.length; i++){
                items.push(
                    <li key={'item' + i} role="presentation">
                        <a role="menuitem" href="#" onClick={this._handleChangePage} data-page-index={i}>
                            {this.props.projectModel.pages[i].pageName}
                        </a>
                    </li>
                );
            }
            pageSwitcher = (
                <div className="dropdown">
                    <button className="btn btn-default btn-xs dropdown-toggle"
                            type="button"
                            id="dropdownMenu"
                            data-toggle="dropdown"
                            aria-expanded="true">
                        <span>{this.props.projectModel.pages[this.state.activePageIndex].pageName}</span>
                        <span className="fa fa-caret-down fa-fw"></span>
                    </button>
                    <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">
                        {items}
                    </ul>
                </div>
            );
        }

        return (
            <div>
                <div style={toolbarTopStyle}>
                    <table style={{width: '100%'}}>
                        <tr>
                            <td><h4 style={{marginRight: '0.5em'}}>Page:</h4></td>
                            <td style={{width: '90%'}}>
                                {pageSwitcher}
                            </td>
                            <td>
                                <Button bsStyle='primary' onClick={this._handleClone}>Clone project</Button>
                            </td>
                            <td>
                                <Button bsStyle='warning' onClick={this._handleClosePreview}>Back to gallery</Button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div style={bodyStyle}>
                    <iframe style={iframeStyle} ref='iframeElement' src={this.props.src} />
                </div>
            </div>
        )
    },

    componentDidMount: function() {
        var domNode = React.findDOMNode(this.refs.iframeElement);
        domNode.onload = (function(){
            this._renderFrameContent(this.state.activePageIndex);
        }).bind(this);
    },

    componentDidUpdate: function(){
        this._renderFrameContent(this.state.activePageIndex);
    },

    _renderFrameContent: function(pageIndex) {
        var iframeDOMNode = React.findDOMNode(this.refs.iframeElement);
        var doc = iframeDOMNode.contentDocument;
        var win = iframeDOMNode.contentWindow;
        if(doc.readyState === 'complete' && win.endpoint && win.endpoint.Page) {
            win.endpoint.replaceState(this.props.projectModel.pages[pageIndex]);
        }
    },

    _handleChangePage: function(e){
        e.stopPropagation();
        e.preventDefault();
        this.setState({
            activePageIndex: e.currentTarget.attributes['data-page-index'].value
        });
    },

    _handleClosePreview: function(e){
        e.stopPropagation();
        e.preventDefault();
        ApplicationActions.goToGallery();
    },

    _handleClone: function (e) {
        e.preventDefault();
        e.stopPropagation();
        ApplicationActions.startDownloadProject(this.props.projectId);
    }

});

module.exports = Desk;
