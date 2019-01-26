
const { resolve } = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

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
            'lib/constants': resolve(__dirname, '../src/shared/constants'),
            'lib/utils': resolve(__dirname, '../src/shared/utils'),
            'rlib/constants': resolve(__dirname, '../src/renderer/library/constants'),
            'rlib/utils': resolve(__dirname, '../src/renderer/library/utils'),
            config: resolve(__dirname, '../ui.config.json'),
            constants: resolve(__dirname, '../src/shared/constants.js'),
            library: resolve(__dirname, '../src/renderer/library/'),
            utilities: resolve(__dirname, '../src/shared/utilities.js'),
            components: resolve(__dirname, '../src/renderer/components'),
            containers: resolve(__dirname, '../src/renderer/containers/'),
            IPCLibrary: resolve(__dirname, '../src/renderer/library/IPC/index.js'),
            globalCSS: resolve(__dirname, '../src/library/css/global.css')
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
                test: /\.(css|pcss)$/i,
                use: [
                    { 
                        loader: 'style-loader' 
                    }, 
                    { 
                        loader:'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[name]__[local]_[hash:base64:5]',
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