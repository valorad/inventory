const { resolve } = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { root } = require('../lib/helpers');
const clientpath = root('src');

let extraConfig = {
  plugins: [

    new CopyWebpackPlugin([
      { 
        from: resolve(clientpath, "statics"),
        to: 'statics',
        ignore: [
          ".gitkeep"
        ]
      }
    ])

  ],
}

module.exports = extraConfig;