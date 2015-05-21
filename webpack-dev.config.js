var webpack = require("webpack");

module.exports = [
    {
        name: "browser",
        entry: {
            main: './client/src/main.js'
        },
        output: {
            path: './build/html',
            filename: 'builder-bundle.js'
        },
        //devtool: "eval",
        debug: true,
        module: {
            loaders: [
                { test: /\.js$/, loader: 'jsx-loader?harmony' },
                { test: /\.css$/, loader: "style-loader!css-loader" },
                { test: /\.less$/, loader: "style-loader!css-loader!less-loader"},
                //{ test: /\.(eot|woff|ttf|svg|png|jpg)([\?]?.*)$/, loader: 'url-loader?limit=8000&name=[name]-[hash].[ext]' }
                { test: /\.(eot|woff|ttf|svg|png|jpg)([\?]?.*)$/, loader: 'url-loader' }
                //{ test: /\.(eot|woff|ttf)([\?]?.*)$/, loader: "file-loader" }
                //{ test: /[\\\/]node_modules[\\\/]modernizr[\\\/]modernizr-build\.js$/,
                //    loader: "imports?this=>window!exports?window.Modernizr" }
            ]
        },
        externals: {
            // require("jquery") is external and available
            //  on the global var jQuery
            "jquery": "jQuery"
        }
    },
    {
        name: "server",
        entry: {
            api: './server/src/api.js'
        },
        output: {
            path: './build/lib',
            filename: '[name].js',
            libraryTarget: 'commonjs2'
        },
        externals: /^[a-z\-0-9_]+$/
    }
];

