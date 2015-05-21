'use strict';

var React = require('react/addons');
var _ = require('underscore');
var Server = require('../api/Server.js');
var DeskPageFrameStore = require('../store/DeskPageFrameStore.js');
var DeskPageFrameActions = require('../action/DeskPageFrameActions.js');
var FormMixin = require('./FormMixin.js');

var Repository = require('../api/Repository.js');


var DeskPageFrame = React.createClass({
    mixins: [FormMixin],

    getInitialState: function(){
        return Repository.getCurrentPageModel();
    },

    render: function() {
        return (<iframe {...this.props} />);
    },

    componentDidMount: function() {
        //this._hideModalProgress();
        this.unsubscribe = DeskPageFrameStore.listen(this._changeFrameContent);
        //
        var domNode = React.findDOMNode(this);
        domNode.onload = (function(){
            //console.log('IFrame is loaded and ready');
            this._renderFrameContent();
        }).bind(this);
        //
        Server.onSocketEmit('compilerWatcher.errors', function(data){
            var messages = [];
            _.each(data, function(item){
                _.each(item, function(message){
                    messages.push(message);
                });
            });
            this._showModalMessageArray(messages);
            //console.error(JSON.stringify(data, null, 4));
        }.bind(this));
        Server.onSocketEmit('compilerWatcher.success', function(data){
            //this._hideModalProgress();
            //this._showModalProgress('Please wait. Loading page...', 0);
            if(data.compiledProcessCount > 1){
                if(domNode.contentDocument && domNode.contentDocument.documentElement){
                    this.contentScrollTop = domNode.contentDocument.documentElement.scrollTop;
                }
                domNode.src = Repository.getHtmlForDesk();
            }
        }.bind(this));
        //
    },

    componentWillUnmount: function(){
        this.unsubscribe();
        this.frameEndpoint.onComponentDidUpdate = null;
        this.frameEndpoint.onComponentWillUpdate = null;
        this.frameEndpoint  = null;
    },

    _renderFrameContent: function() {
        //this._showModalProgress('Please wait. Loading page...', 400);
        var domNode = React.findDOMNode(this);
        var doc = domNode.contentDocument;
        var win = domNode.contentWindow;
        if(doc.readyState === 'complete' && win.endpoint && win.endpoint.Page) {

            //console.log('Page is loaded...');

            Repository.setCurrentPageDocument(doc);
            Repository.setCurrentPageWindow(win);

            var self = this;
            this.frameEndpoint = win.endpoint;
            self.frameEndpoint.onComponentDidUpdate = function(){
                self._mapDomNodes();
            };
            self.frameEndpoint.onComponentWillUpdate = function(){
                DeskPageFrameActions.deselectComponent();
            };
            this._changeFrameContent();

            this._hideModalProgress();

            if(this.contentScrollTop){
                doc.documentElement.scrollTop = this.contentScrollTop;
            }
        }
    },

    _changeFrameContent: function(){
        if(this.frameEndpoint){
            this.frameEndpoint.replaceState(Repository.getCurrentPageModel());
        }
    },

    _mapDomNodes: function(){
        Repository.resetCurrentPageDomNodes();
        React.addons.TestUtils.findAllInRenderedTree(this.frameEndpoint.Page,
            function(component){
                var props = component.props;
                //console.log(props);
                if(props && props['data-umyid'] && props['data-umyid'].length > 0){
                    var dataumyid = props['data-umyid'];
                    if(!Repository.getCurrentPageDomNode(dataumyid)){
                            var domNode = this.frameEndpoint.Page.findDOMNodeInPage(component);
                            Repository.setCurrentPageDomNode(dataumyid, domNode);
                            $(domNode).on("mousedown.umy", (function(_dataumyid){
                                return function(e){
                                    if(!e.metaKey && !e.ctrlKey){
                                        e.stopPropagation();
                                        e.preventDefault();
                                        //console.log(e.metaKey);
                                        DeskPageFrameActions.deselectComponent();
                                        DeskPageFrameActions.selectComponentById(_dataumyid);
                                    }
                                };
                            })(dataumyid));
                        //console.log("Set domNode into Repository: %o, %o", dataumyid, component.getDOMNode());
                    }
                }
                return true;
            }.bind(this)
        );
        DeskPageFrameActions.didRenderPageFrame();
    }


});

module.exports = DeskPageFrame;
