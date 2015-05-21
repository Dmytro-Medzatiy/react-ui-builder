'use strict';

var Reflux = require('reflux');

var ApplicationActions = Reflux.createActions([
    'goToErrors',
    'goToDeskPage',
    'goToStartPage',
    'goToGallery',
    'refreshServerInfo',
    'storeBuilderConfig',
    'openLocalProject',
    'stopAutosaveProjectModel',
    'previewProject',
    'startDownloadProject',
    'downloadProject'
]);

module.exports = ApplicationActions;
