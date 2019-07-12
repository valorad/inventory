const { resolve, join } = require('path');
const { readdirSync } = require('fs');

const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const { root } = require('../lib/helpers');
const serverpath = root('src');

let config = {
  mode: "production",

  entry: {
    'inventory': resolve(serverpath, 'inventory')
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  target: 'node',

  node: {
    __dirname: false,
    __filename: false
  },

  externals: nodeExternals(),

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude:  /node_modules/
      },
      {
        test: /\.graphql|\.gql$/,
        exclude: /node_modules/,
        use: 'graphql-tag/loader'
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      { 
        from: resolve(serverpath, "config"),
        to: 'config',
        ignore: [
          ".gitkeep"
        ]
      },
      { 
        from: resolve(serverpath, "static"),
        to: 'static',
        ignore: [
          ".gitkeep"
        ]
      }
    ]),

  ],

  output: {
    path: root('dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].[hash].chunk.js'
  }


}

module.exports = config;
