<% if(children && children.length > 0) { _.forEach(children, function(child) { %>
<%= processChild(child) %> <% } ); } %>