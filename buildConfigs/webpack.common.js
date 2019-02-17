'use strict';
const { resolve } = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = { 
    target: 'electron-renderer',
    entry: [ 
        '@babel/polyfill', 
        resolve(__dirname, '../client/loader.jsx')
    ],
    output: {
        path: resolve(__dirname, '../public/js'),
        filename: 'bundle.js'
    },
    resolve: {
        alias: {
            '@ts/utils': resolve(__dirname, '../client/library/utils'),
            '@ts/constants': resolve(__dirname, '../client/library/constants'),
            '@ts/config': resolve(__dirname, '../ui.config.json'),
            '@ts/lib': resolve(__dirname, '../client/library/'),
            '@ts/components': resolve(__dirname, '../client/components'),
            '@ts/containers': resolve(__dirname, '../client/containers/'),
            '@ts/global-styles': resolve(__dirname, '../src/library/css/global.css')
        },
        extensions: [
            '.js', 
            '.jsx', 
            '.json'
        ]
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/i,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: [
                        '@babel/preset-env', 
                        '@babel/preset-react'
                    ],
                    plugins: [
                        '@babel/plugin-proposal-class-properties'
                    ]
                }
            },
            {
                test: /\.css$/i,
                use: [
                    { 
                        loader: 'style-loader' 
                    }, 
                    { 
                        loader:'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[name]_[local]-[hash:base64:5]',
                            camelCase: true
                        }
                    },
                    { 
                        loader: 'postcss-loader',
                        options: {
                            config: {
                                path: __dirname
                            } 
                        } 
                    }
                ]
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            title: 'Tumblr Scrape Tool',
            filename: resolve(__dirname, '../index.html'),
            template: resolve(__dirname, '../template.html'),
            meta: {
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
                charset: 'UTF-8'
            }
        })
    ]
};
