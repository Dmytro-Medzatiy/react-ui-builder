'use strict';

var Reflux = require('reflux');

var ModalCodeGeneratorTriggerActions = Reflux.createActions([
    'showModal',
    'hideModal',
    'toggleModal',
    'showMessage'
]);

module.exports = ModalCodeGeneratorTriggerActions;
