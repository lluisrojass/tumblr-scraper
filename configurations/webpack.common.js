'use strict';

const { resolve } = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = { 
    entry: ['@babel/polyfill', resolve(__dirname, '../src/renderer/Loader.jsx')],
    output: {
        path: resolve(__dirname, '../public/js'),
        filename: 'bundle.js'
    },
    resolve: {
        alias: {
            constants: resolve(__dirname, '../src/shared/constants.js'),
            library: resolve(__dirname, '../src/renderer/library/'),
            utilities: resolve(__dirname, '../src/shared/utilities.js'),
            components: resolve(__dirname, '../src/renderer/components'),
            state: resolve(__dirname, '../src/renderer/state/'),
            IPCLibrary: resolve(__dirname, '../src/renderer/library/IPC/index.js'),
            globalCSS: resolve(__dirname, '../src/renderer/styles/global.less')
        },
        extensions: ['.js', '.jsx', '.json']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/i,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                    plugins: ['@babel/plugin-proposal-class-properties']
                }
            },
            {
                test: /\.(css|less)$/i,
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
                    { loader: 'less-loader' }
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
