'use strict';

var Reflux = require('reflux');

var DeskPageFrameActions = Reflux.createActions([
    'renderPageFrame',
    'reloadPageFrame',
    'didRenderPageFrame',
    'selectComponentById',
    'selectParentComponent',
    'deselectComponent',
    'startClipboardForOptions',
    'stopClipboardForOptions',
    'startCopyComponent',
    'startCutPasteComponent',
    'deleteComponent',
    'duplicateComponent',
    'moveUpComponent',
    'moveDownComponent',
    'addBefore',
    'insertFirst',
    'insertLast',
    'addAfter',
    'wrap',
    'replace',
    'showPropertyEditor',
    'saveProperties',
    'saveOptionsVariant',
    'showProjectComponents'
]);

module.exports = DeskPageFrameActions;
