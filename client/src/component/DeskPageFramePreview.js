'use strict';

var React = require('react/addons');
var _ = require("underscore");
var FormMixin = require('./FormMixin.js');
var Repository = require('../api/Repository.js');


var DeskPageFramePreview = React.createClass({
    mixins: [FormMixin],

    render: function() {
        return (<iframe {...this.props} />);
    },

    componentDidMount: function() {
        var domNode = React.findDOMNode(this);
        domNode.onload = (function(){
            this._renderFrameContent();
        }).bind(this);
    },

    _renderFrameContent: function() {
        var doc = React.findDOMNode(this).contentDocument;
        var win = React.findDOMNode(this).contentWindow;
        if(doc.readyState === 'complete' && win.endpoint && win.endpoint.Page) {
            win.endpoint.replaceState(Repository.getCurrentPageModel());

        }
    }


});

module.exports = DeskPageFramePreview;
