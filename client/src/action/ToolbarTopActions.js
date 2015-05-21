'use strict';

var Reflux = require('reflux');

var ToolbarTopActions = Reflux.createActions([
    'startAddNewComponentMode',
    'stopAddNewComponentMode',
    'refreshPageList',
    'currentPageNameChange',
    'addNewPage',
    'deletePage',
    'copyPage',
    'switchToPage',
    'undo',
    'redo'
]);

module.exports = ToolbarTopActions;
