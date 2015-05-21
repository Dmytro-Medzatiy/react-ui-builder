'use strict';

var Reflux = require('reflux');
var <%= componentName %>Actions = require('../../actions/<%= componentGroup %>/<%= componentName %>Actions.js');

var defaultModel = {
};

var <%= componentName %>Store = Reflux.createStore({
    model: defaultModel,
    listenables: <%= componentName %>Actions,

    onProbeAction: function(){
        this.trigger(this.model);
    }

});

module.exports = <%= componentName %>Store;