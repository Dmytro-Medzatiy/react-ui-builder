var webpack = require("webpack");

module.exports = [
    {
        name: "browser",
        entry: {
            <% _.forEach(pages, function(page, index) { %>'<%= page.pageName %>': ['./app/<%= page.pageName %>.js']<% if(index < pages.length - 1){%><%= ",\n\t\t\t" %><%}%><% }); %>
        },
        output: {
            path: './static',
            filename: '[name].js'
        },
        module: {
            loaders: [
                { test: /\.js$/, loader: 'jsx-loader?harmony' },
                { test: /\.css$/, loader: "style-loader!css-loader" },
                { test: /\.less$/, loader: "style-loader!css-loader!less-loader"},
                { test: /\.(eot|woff|ttf|svg|png|jpg)([\?]?.*)$/, loader: 'url-loader' }
            ]
        },
        externals: {
            // require("jquery") is external and available
            //  on the global var jQuery
            "jquery": "jQuery"
        }
    }
];