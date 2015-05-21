'use strict';

var Reflux = require('reflux');

var ModalVariantsTriggerActions = Reflux.createActions([
    'showModal',
    'selectDefaultsIndex',
    'deleteDefaultsIndex',
    'hideModal',
    'toggleModal',
    'showMessage'
]);

module.exports = ModalVariantsTriggerActions;
