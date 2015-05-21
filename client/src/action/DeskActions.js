'use strict';

var Reflux = require('reflux');

var DeskActions = Reflux.createActions([
    'startEditMode',
    'startTextEditMode',
    'startLivePreviewMode',
    'toggleAvailableComponents',
    'toggleComponentOptions',
    'toggleStyleOptions',
    'toggleComponentsHierarchy',
    'startAddNewComponentMode',
    'stopAddNewComponentMode'
]);

module.exports = DeskActions;
