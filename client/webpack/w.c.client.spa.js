const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const baseConfig = require('./w.c.client.base');
const { root } = require('../lib/helpers');

let config = merge(baseConfig, {
  
  mode: "development",

  output: {
    path: root('dist'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  devtool: 'eval-source-map',

  optimization: {}


});



if (process.env.NODE_ENV === 'production') {

  config.mode = "production";
  config.devtool = 'source-map';

  config.optimization.minimizer = [
    new UglifyJSPlugin({
      uglifyOptions: {
        cache: true,
        parallel: true,
        keep_fnames: true
      }
    }),
    new OptimizeCSSAssetsPlugin({})
  ]

  config.plugins = (config.plugins || []).concat([

    new CleanWebpackPlugin([root('dist')], {root: root(), verbose: false})

  ]);
}

module.exports = config;