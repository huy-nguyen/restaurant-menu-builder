// Configuration of webpack plugins:
const assert = require('assert');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const PATHS = {
  tsDir: path.join(__dirname, 'src', 'ts'),
  appDir: path.join(__dirname, 'src'),
  styleDir: path.join(__dirname, 'src', 'sass'),
  productionStylesheet: path.join(__dirname, 'src', 'sass', 'style.scss'),
  devStylesheet: path.join(__dirname, 'src', 'sass', 'dev_style.scss'),
  buildDir: path.join(__dirname, 'dist'),
  testDir: path.join(__dirname, 'src', 'specs'),
  handlebarsHelpersDir: path.join(__dirname, 'handlebars_helpers')
}
exports.PATHS = PATHS;

exports.commonResolution = {
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  }
}

exports.nodeEnvs = {
  production: 'production',
  test: 'test',
  'development': 'development'
}

exports.commonLoaders = {
  module: {
    loaders: [
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        // Inline small woff files and output them below font/.
        // Set mimetype just in case.
        loader: 'url',
        query: {
          name: 'font/[hash].[ext]',
          limit: 5000,
          mimetype: 'application/font-woff'
        },
      },
      {
        test: /\.(ttf|eot|svg)$/,
        loader: 'file',
        query: {
          name: 'font/[hash].[ext]'
        },
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
        query: {
          helperDirs: PATHS.handlebarsHelpersDir,
        }

      },
      {
        test: /\.json$/,
        loader: 'file-loader',
        query: {
          name: '[hash].[name].[ext]'
        }
      }
    ]
  }
}


exports.devServer = function(options) {
  return {
    devServer: {
      hot: true,
      inline: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      host: options.host, // Defaults to `localhost`
      port: options.port // Defaults to 8080
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      })
    ]
  };
}

exports.clean = function(path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path], {
        root: process.cwd()
      })
    ]
  }
}

exports.minify = function() {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  }
}

exports.setFreeVariable = function(key, value) {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env)
    ]
  };
}

exports.extractBundle = function(options) {
  const entry = {};
  entry[options.name] = options.entries;

  return {
    entry: entry,
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        names: [options.name, 'manifest']
      })
    ]
  }
}

// `hashMethod` can either be 'hash' for dev or 'chunkhash` for // production.
exports.extractSASS = function(paths, hashMethod) {
  assert(hashMethod === 'hash' || hashMethod === 'chunkhash', 'Invalid value for hashMethod');
  return {
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass?sourceMap'),
          include: paths
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin('[name].[' + hashMethod +'].css')
    ]
  }
}
