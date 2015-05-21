'use strict';

var _ = require('underscore');
var React = require('react');
var PanelComponentsHierarchyStore = require('../store/PanelComponentsHierarchyStore.js');
var PanelComponentsHierarchyActions = require('../action/PanelComponentsHierarchyActions.js');
var DeskPageFrameActions = require('../action/DeskPageFrameActions.js');
var OverlayTreeviewItemPaste = require('./OverlayTreeviewItemPaste.js');
var OverlayTreeviewItem = require('./OverlayTreeviewItem.js');

var PanelComponentItem = React.createClass({

    render: function(){

        var overlay = null;
        if(this.props.selected === this.props.umyid){
            if(this.props.clipboardActive){
                overlay = <OverlayTreeviewItemPaste />
            } else {
                overlay = <OverlayTreeviewItem domNodeId={this.props.umyid} />
            }
        }

        var content = null;

        var className = 'umy-treeview-list-item' + (this.props.selected === this.props.umyid ? ' bg-info' : '');
        if(this.props.copyMark === this.props.umyid){
            className += ' umy-grid-basic-border-copy';
        }
        if(this.props.cutMark === this.props.umyid){
            className += ' umy-grid-basic-border-cut';
        }
        //
        var linkClassName = '';
        var label = this.props.type;
        //
        if(this.props.children && this.props.children.length > 0){
            content = (
                <li className={className}>
                    {overlay}
                    <a key={'toplink'} className={linkClassName} href='#' onClick={this._handleClick}>
                        <span>{'<' + label + '>'}</span>
                    </a>
                    {this.props.children}
                    <a key={'bottomlink'} className={linkClassName} href='#' onClick={this._handleClick}>
                        <span>{'</' + label + '>'}</span>
                    </a>
                </li>
            );
        } else {
            content = (
                <li className={className}>
                    {overlay}
                    <a  className={linkClassName} href='#' onClick={this._handleClick}>
                        <span>{'<' + label + '/>'}</span>
                    </a>
                </li>
            );
        }

        return content;
    },

    _handleClick: function(e){
        e.preventDefault();
        e.stopPropagation();
        DeskPageFrameActions.deselectComponent();
        DeskPageFrameActions.selectComponentById(this.props.umyid);
    }

});

var scrollToSelected = function($frameWindow){
    setTimeout((function(_frameWindow){
        return function(){
            var $selected = _frameWindow.find(".bg-info");
            if($selected && $selected.length > 0){
                var diff = ($selected.offset().top + _frameWindow.scrollTop()) - _frameWindow.offset().top;
                var margin = parseInt(_frameWindow.css("height"))/5;
                _frameWindow[0].scrollTop = (diff - margin);
                //console.log("Scroll to " + (diff - margin));
                //_frameWindow.animate(
                //    { scrollTop: (diff - margin) },
                //    200
                //);
                diff = null;
                margin = null;
            }
            $selected = null;
        }
    })($frameWindow), 0);

};

var PanelComponentsHierarchy = React.createClass({

    getInitialState: function () {
        return PanelComponentsHierarchyStore.getModel();
    },

    onModelChange: function (model) {
        this.setState(model);
    },

    componentDidMount: function () {
        this.unsubscribe = PanelComponentsHierarchyStore.listen(this.onModelChange);
        PanelComponentsHierarchyActions.setFrameWindow(React.findDOMNode(this));
        this.$frameWindow = $(React.findDOMNode(this));
        scrollToSelected(this.$frameWindow);
    },

    componentDidUpdate: function(){
        if(this.state.selectedUmyId){
            scrollToSelected(this.$frameWindow);
        }
    },

    componentWillUnmount: function () {
        this.unsubscribe();
        this.$frameWindow = null;
    },

    render: function () {

        var style = {
            //display: this.props.displayStyle,
            padding: '2em 1em 1em 1em',
            height: '100%',
            overflow: 'auto'
            //border: '1px solid #ffffff'
        };
        //
        var pageModel = this.state.currentPageModel;
        var self = this;
        var listItems = [];
        if(pageModel){
            if (pageModel.props){
                _.mapObject(pageModel.props, function(value, prop){
                    if(_.isObject(value) && value.type){
                        listItems.push(self._buildNode(value));
                    }
                });
            }
            if (pageModel.children) {
                _.map(pageModel.children, function (child) {
                    listItems.push(self._buildNode(child));
                });
            }
        }

        //
        return (
            <div style={style}>
                <ul className='umy-treeview-list' style={{border: 0}}>
                    {listItems}
                </ul>
            </div>
        );
    },

    _buildNode: function (rootItem) {
        var self = this;
        var inner = [];
        if (rootItem.text) {
            var text = rootItem.text;
            if (text && text.length > 150) {
                text = text.substr(0, 150) + " [...]";
            }
            inner.push(
                <span key={'text' + rootItem.props['data-umyid']} className='text-muted'> {text} </span>
            )
        }
        var innerProps = [];
        if (rootItem.props){
            _.mapObject(rootItem.props, function(value, prop){
                if(_.isObject(value) && value.type){
                    innerProps.push(self._buildNode(value));
                }
            });
        }
        var children = [];
        if (rootItem.children && rootItem.children.length > 0) {
            _.map(rootItem.children, function (child) {
                children.push(self._buildNode(child));
            });
        }
        if(innerProps.length > 0 || children.length > 0){
            inner.push(
                <ul key={'list' + rootItem.props['data-umyid']} className='umy-treeview-list'>
                    {innerProps}
                    {children}
                </ul>
            );
        }

        return (
            <PanelComponentItem
                key={'listitem' + rootItem.props['data-umyid']}
                componentName={rootItem.componentName}
                selected={this.state.selectedUmyId}
                umyid={rootItem.props['data-umyid']}
                copyMark={this.state.copyMarkUmyId}
                cutMark={this.state.cutMarkUmyId}
                type={rootItem.type}

                clipboardActive={this.state.clipboardActive}>
                {inner}
            </PanelComponentItem>
        );
    }

});

module.exports = PanelComponentsHierarchy;
