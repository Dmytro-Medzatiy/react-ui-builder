'use strict';

// third-party libs
require('../lib/bootstrap/css/yeti/bootstrap.min.css');
require('../lib/bootstrap/js/bootstrap.min.js');
require('../lib/font-awesome/css/font-awesome.min.css');
// umyproto libs
require('../css/umyproto.deskpage.css');
//
var React = require('react/addons');
var plugins = require('./plugin/plugins.js');
var docCookie = require('./api/cookies.js');

var Server = require('./api/Server.js');
var Application = require('./component/Application.js');
var ApplicationActions = require('./action/ApplicationActions.js');

$(document).ready(function(){

    var user = docCookie.getItem("umyproto-react-builder-user");
    var pass = docCookie.getItem("umyproto-react-builder-pass");

    plugins.init();

    React.render(<Application/>, document.body, function(){
        ApplicationActions.refreshServerInfo();
    });

    Server.init({io: window.io});

    window.onbeforeunload = function(e) {
        ApplicationActions.stopAutosaveProjectModel();

    };

});

