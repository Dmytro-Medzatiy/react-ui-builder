'use strict';

var React = require('react');
<% if(fluxVariables && fluxVariables.length > 0) { _.forEach(fluxVariables, function(fluxVariable){ %><%= fluxVariable.replace(/\\/g, '/') %><%});}%>
<% _.forEach(variables, function(variable){ %><%= variable.replace(/\\/g, '/') %>
<% }); %><% _.forEach(components, function(component){ %><%= component.replace(/\\/g, '/') %>
<% }); %>

var <%= componentName %> = React.createClass({
    <% if(fluxVariables && fluxVariables.length > 0) { %>
    getInitialState: function(){
        return <%= componentName %>Store.model;
    },

    onModelChange: function(model) {
        this.setState(model);
    },

    componentDidMount: function() {
        this.unsubscribe = <%= componentName %>Store.listen(this.onModelChange);
    },

    componentWillUnmount: function() {
        this.unsubscribe();
    },

    _handleProbeEvent: function(e){
        e.stopPropagation();
        <%= componentName %>Actions.probeAction();
    },<%}%>

    <% if(processDefaultProps) { %>getDefaultProps: function () {
        return {<%= processDefaultProps(props) %>};
    },
    <%}%>
    render: function(){
        return (
            <<%= type %> {...this.props} >
            <% if(children && children.length > 0) { _.forEach(children, function(child) { %>
            <%= processChild(child) %> <% } ); } else {%> {this.props.children} <%}%>
            <% if(text && text.length > 0){ %><%= text %><%}%>
            </<%= type %>>
        );
    }

});

module.exports = <%= componentName %>;