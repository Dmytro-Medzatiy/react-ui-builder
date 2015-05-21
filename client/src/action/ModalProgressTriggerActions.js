'use strict';

var Reflux = require('reflux');

var ModalProgressTriggerActions = Reflux.createActions([
    'showModalProgress',
    'showModalMessageArray',
    'updateMessage',
    'hideModalProgress',
    'toggleModalProgress'
]);

module.exports = ModalProgressTriggerActions;
