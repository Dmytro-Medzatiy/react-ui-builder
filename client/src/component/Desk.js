'use strict';

var React = require('react');
var DeskStore = require('../store/DeskStore.js');
var ToolbarLeft = require('./ToolbarLeft.js');
var PanelAvailableComponents = require('./PanelAvailableComponents.js');
var PanelComponentsHierarchy = require('./PanelComponentsHierarchy.js');
var ModalPropsEditorTrigger = require('./ModalPropsEditorTrigger.js');
var ModalCodeGeneratorTrigger = require('./ModalCodeGeneratorTrigger.js');
var ToolbarTop = require('./ToolbarTop.js');
var DeskPageFrame = require('./DeskPageFrame.js');
var DeskPageFramePreview = require('./DeskPageFramePreview.js');
var Repository = require('../api/Repository.js');
var ToolbarTopActions = require('../action/ToolbarTopActions.js');

var Desk = React.createClass({

    getInitialState: function(){
        return DeskStore.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },

    componentDidMount: function() {
        this.unsubscribe = DeskStore.listen(this.onModelChange);
        ToolbarTopActions.refreshPageList();
    },

    componentWillUnmount: function() {
        this.unsubscribe();
    },

    render: function(){

        var leftPanelWidth = 0;
        var leftPanelInner = null;
        if(this.state.isAvailableComponentsButtonActive){
            leftPanelWidth = 200;
            leftPanelInner = (<PanelAvailableComponents />);
        }

        var bottomPanelHeight = 0;
        var bottomPanelInner = null;
        if(this.state.isComponentsHierarchyButtonActive){
            bottomPanelHeight = 300;
            bottomPanelInner = (<PanelComponentsHierarchy />);
        }

        var leftPanelStyle = {
            position: 'absolute',
            top: 0,
            left: '4em',
            bottom: '0px',
            width: leftPanelWidth + "px",
            paddingRight: '5px',
            overflow: 'auto'
        };

        var bottomPanelStyle = {
            position: 'absolute',
            left: 'calc(4em + ' + leftPanelWidth +'px)',
            right: '5px',
            bottom: '0px',
            height: bottomPanelHeight + "px"
        };

        var toolbarTopStyle = {
            position: 'absolute',
            //display: 'table',
            top: 0,
            left: 'calc(4em + ' + leftPanelWidth + 'px)',
            right: '5px',
            height: '4em'
        };

        var topComponent = null;
        var topPanelHeight = 0;
        if(!this.state.isLivePreviewMode){
            topComponent = <ToolbarTop style={toolbarTopStyle}/>;
            topPanelHeight = 4;
        }

        var bodyStyle = {
            position: 'absolute',
            top: topPanelHeight + 'em',
            left: 'calc(4em + ' + leftPanelWidth + 'px)',
            //bottom: 'calc(5px + ' + bottomPanelHeight + 'px)',
            overflow: 'auto',
            bottom: bottomPanelHeight + 'px',
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

        var pageFrame = null;
        var pageFrameSrc = Repository.getHtmlForDesk();
        if(this.state.isLivePreviewMode){
            pageFrame = (
                <DeskPageFramePreview frameBorder="0" style={iframeStyle} src={pageFrameSrc} />
            );
        } else {
            pageFrame = (
                <DeskPageFrame frameBorder="0" style={iframeStyle} src={pageFrameSrc} />
            );
        }

        return (
            <div>
                <ToolbarLeft {...this.state} />
                <div style={leftPanelStyle}>
                    {leftPanelInner}
                </div>
                {topComponent}
                <div style={bodyStyle}>
                    {pageFrame}
                </div>
                <div style={bottomPanelStyle}>
                    {bottomPanelInner}
                </div>
                <ModalPropsEditorTrigger/>
                <ModalCodeGeneratorTrigger/>
            </div>
        )
    }

});

module.exports = Desk;
