"use strict";

const { resolve } = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = { 
    entry: resolve(__dirname, "../components/renderer/loader.js"),
    output: {
        path: resolve(__dirname, "../public/js"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/i,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: ["@babel/preset-env", "@babel/preset-react"],
                    plugins: ["@babel/plugin-proposal-class-properties"]
                }
            },
            {
                test: /\.css$/i,
                use: [
                    { 
                        loader: "style-loader" 
                    }, 
                    { 
                        loader:"css-loader",
                        options: {
                            modules: true,
                            localIdentName: "[name]__[local]_[hash:base64:5]",
                            camelCase: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            title: "Tumblr Scrape Tool",
            filename: resolve(__dirname, "../index.html"),
            template: resolve(__dirname, "../template.html"),
            meta: {
                viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
                charset: "UTF-8"
            }
        })
    ]
}
