'use strict';

var React = require('react');
var OverlayButtons = require('./OverlayButtons.js');
var DeskPageFrameActions = require('../action/DeskPageFrameActions.js');
var Repository = require('../api/Repository.js');
var Common = require('../api/Common.js');
var ModalPropsEditorTriggerActions = require('../action/ModalPropsEditorTriggerActions.js');

var OverlayTreeviewItem = React.createClass({

    componentDidMount: function(){

    },

    componentDidUpdate: function(){

    },

    render: function(){
        var searchResult = Repository.findInCurrentPageModelByUmyId(this.props.domNodeId);

        var overlayModel = {
            onClose: DeskPageFrameActions.deselectComponent,
            buttons: []
        };

        overlayModel.buttons.push(
            {
                icon: "fa-mail-forward fa-rotate-270",
                onClick: (function (_nodeId) {
                    return function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        DeskPageFrameActions.selectParentComponent(_nodeId);
                    }
                })(this.props.domNodeId)
            });
        if(searchResult.foundProp === '/!#child') {
            overlayModel.buttons.push(
                {
                    icon: 'fa-arrow-up',
                    onClick: (function (_nodeId) {
                        return function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            DeskPageFrameActions.moveUpComponent(_nodeId);
                        }
                    })(this.props.domNodeId)
                });
            overlayModel.buttons.push(
                {
                    icon: 'fa-arrow-down',
                    onClick: (function (_nodeId) {
                        return function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            DeskPageFrameActions.moveDownComponent(_nodeId);
                        }
                    })(this.props.domNodeId)
                });
        }
        overlayModel.buttons.push(
            {
                icon: 'fa-cut',
                onClick: (function (_nodeId) {
                    return function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        DeskPageFrameActions.startCutPasteComponent(_nodeId);
                    }
                })(this.props.domNodeId)
            });
        overlayModel.buttons.push(
            {
                icon: 'fa-clipboard',
                onClick: (function (_nodeId) {
                    return function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        DeskPageFrameActions.startCopyComponent(_nodeId);
                    }
                })(this.props.domNodeId)
            });
        overlayModel.buttons.push(
            {
                icon: 'fa-copy',
                onClick: (function (_nodeId) {
                    return function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        DeskPageFrameActions.duplicateComponent(_nodeId);
                    }
                })(this.props.domNodeId)
            });
        overlayModel.buttons.push(
            {
                icon: 'fa-trash-o',
                onClick: (function (_nodeId) {
                    return function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        DeskPageFrameActions.deleteComponent(_nodeId);
                    }
                })(this.props.domNodeId)
            });
        overlayModel.buttons.push(
            {
                icon: 'fa-gears',
                onClick: (function (_nodeId) {
                    return function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        DeskPageFrameActions.showPropertyEditor();
                    }
                })(this.props.domNodeId)
            });
        return (
            <OverlayButtons {...overlayModel} />
        );
    }


});

module.exports = OverlayTreeviewItem;
