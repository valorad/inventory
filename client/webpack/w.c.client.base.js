const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const { AngularCompilerPlugin } = require('@ngtools/webpack');
const { root } = require('../lib/helpers');

const devMode = process.env.NODE_ENV !== 'production';

const globalscss = [
  root('src/styles.scss')
];

let config = {
  entry: {
    'polyfills': root('src/polyfills.ts'),
    'vendor': root('src/vendor.ts'),
    'app': [
      root('src/main.ts')
    ]
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [
      {
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        use: [
          {
            loader: '@ngtools/webpack',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        use: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: false // workaround for ng2
            }
          }
        ]
      },
      {
        /* Scoped scss */
        test: /\.scss$/,
        include: root('src/app'),
        use: ['raw-loader', 'postcss-loader', 'sass-loader']
      },
      {
        /* Global scss */
        test: /\.scss$/,
        include: globalscss,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader?sourceMap',
          'postcss-loader',
          "sass-loader"
        ]
      }
    ]
  },

  devServer: {
    historyApiFallback: true,
    stats: 'minimal',
    port: 4199,
    overlay: {
      errors: true,
      warnings: false
    }
  },

  optimization: {
    runtimeChunk: true,
    splitChunks: {
      name: true,
      cacheGroups: {
        app: {
          name: "app"
        },
        vendor: {
          name: "vendor"
        },
        polyfills: {
          name: "polyfills"
        },
      }
    }
  },


  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       vendor: {
  //         chunks: 'all',
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendor',
  //         enforce: true
  //       }
  //     }
  //   }
  // },

  plugins: [

    // Workaround for angular/angular#11580
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)@angular/,
      root('src'), 
      {} // a map of your routes
    ),

    new AngularCompilerPlugin({
      tsConfigPath: root('tsconfig.json'),
      entryModule: root('src/app/app.module#AppModule')
    }),

    new HtmlWebpackPlugin({
      template: 'src/index.html',
      // unable to lazyload 2nd depth module because of the weird "Cyclic dependency error"
      // the following is the workround
      // https://github.com/jantimon/html-webpack-plugin/issues/870
      // https://github.com/marcelklehr/toposort/issues/20
      chunksSortMode: function (a, b) {
        const entryPoints = ["inline", "polyfills", "vendor", "app"];
        return entryPoints.indexOf(a.names[0]) - entryPoints.indexOf(b.names[0]);
      },

      inject: 'body',
      xhtml: true,

      // minify: devMode
      // ? false
      // : {
      //     caseSensitive: true,
      //     collapseWhitespace: true,
      //     keepClosingSlash: true
      //   }
      minify: {
        caseSensitive: true,
        collapseWhitespace: true,
        keepClosingSlash: true
      }
      
    }),

    new ScriptExtHtmlWebpackPlugin({
      sync: /inline|polyfills|vendor/,
      defaultAttribute: 'async',
      preload: [/polyfills|vendor|app/],
      prefetch: [/chunk/]
    }),

    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    })

  ]

 
};

module.exports = config;
