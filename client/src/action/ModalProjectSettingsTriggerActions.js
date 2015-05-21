'use strict';

var Reflux = require('reflux');

var ModalProjectSettingsTriggerActions = Reflux.createActions([
    'showModal',
    'saveSettings',
    'hideModal',
    'toggleModal'
]);

module.exports = ModalProjectSettingsTriggerActions;
