var React = require('react/addons');
var components = require('../lib_components/components.js');
<% _.forEach(libs, function(lib) { %>var <%= lib %> = components.<%= lib %>;<% }); %>
<% _.mapObject(componentGroups, function(val, key) { %>var <%= key %> = <%= val %>;<% }); %>
<% _.forEach(projectComponents, function(projectComponent) { if(projectComponent !== pageName){ %>var <%= projectComponent %> = require('./components/<%= projectComponent %>.js');<% } }); %>

var <%= pageName %> = React.createClass({

    render: function(){
        return (
        <div>
        <% if(children && children.length > 0) { _.forEach(children, function(child) { %>
        <%= processChild(child) %>
        <% } ); }%>
        </div>
        );
    }

});

React.render(<<%= pageName %>/>, document.getElementById('body'));
