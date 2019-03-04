'use strict';
const { resolve } = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = { 
  target: 'electron-renderer',
  entry: [ 
    '@babel/polyfill', 
    resolve(__dirname, '../src/client/loader.jsx')
  ],
  output: {
    path: resolve(__dirname, '../public/js'),
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      '@ts/config': resolve(__dirname, '../src/client/ui.json'),
      '@ts/type-map': resolve(__dirname, '../src/types.json'),
      '@ts/global-styles': resolve(__dirname, '../src/client/library/css/global.css'),
      '@ts/lib': resolve(__dirname, '../src/client/library/'),
      '@ts/components': resolve(__dirname, '../src/client/components'),
      '@ts/base-components': resolve(__dirname, '../src/client/library/components'),
      '@ts/containers': resolve(__dirname, '../src/client/containers/'),
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
            '@babel/preset-react',
            '@babel/preset-flow'
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties'
          ]
        }
      },
      {
        test: /\.svg$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env', 
                '@babel/preset-react',
                '@babel/preset-flow'
              ]
            }
          }, 
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true
            }
          }
        ]
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
      },
      { 
        test: /\.otf$/, 
        loader: 'url-loader' ,
        options: {
          limit: 100000
        }
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
