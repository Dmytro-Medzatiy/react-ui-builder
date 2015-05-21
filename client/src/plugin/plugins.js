'use strict';

/**
 * jQuery plugins repository
 *
 * @type {exports}
 */
var factory = require('../plugin/object-factory.js');
// modules of plugins
var componentOverlay = require('./component-overlay.js');


module.exports.init = function() {
    factory('umyComponentOverlay', componentOverlay);
};
