const path = require('path');
const webpack = require("webpack");
const fs = require("fs");

module.exports = {
    entry: {
        "cube": path.resolve(__dirname, '../src/Cube.js'),
        "cube.min": path.resolve(__dirname, '../src/Cube.js'),
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js',
        library: "Cube",
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader"
            }
        ]
    },
    plugins: [
	    new webpack.BannerPlugin(fs.readFileSync('./LICENSE', 'utf8')),
	    new webpack.optimize.UglifyJsPlugin({
		    include: /\.min\.js$/,
		    minimize: true
	    })
    ]
};