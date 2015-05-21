'use strict';

var Reflux = require('reflux');

var ModalPropsEditorTriggerActions = Reflux.createActions([
    'showModal',
    'hideModal',
    'toggleModal',
    'saveProperties',
    'saveOptionsVariant',
    'generateComponentCode',
    'generateComponentChildrenCode'
]);

module.exports = ModalPropsEditorTriggerActions;
