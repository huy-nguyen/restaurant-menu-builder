const validate = require('webpack-validator');
const merge = require('webpack-merge');
const parts = require('./webpack-parts');
const pgk = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const PATHS = parts.PATHS;
const nodeEnvs = parts.nodeEnvs;

const NODE_ENV = nodeEnvs.development;

const config = merge(
  {
    entry: {
      app: PATHS.tsDir,
      devStylesheet: PATHS.devStylesheet,
    },
    devtool: 'source-map',
    output: {
      path: PATHS.buildDir,
      // Dev environment uses `hash` and production environment uses `chunkhash`
      // because `chunkhash` doesn't work with Hot Module Replacement.
      filename: '[name].[hash].js',
      sourceMapFilename: '[file].map',
      chunkFilename: '[hash].js'
    },
    module: {
      loaders: [
        {
          test: /\.(ts|tsx)$/,
          loader: 'ts-loader',
          exclude: PATHS.testDir
        },
        // Unlike in production, we don't need to extract CSS out of the bundle
        // in dev so loaders doesn't use the extract plugin.
        {
          test: /\.scss$/,
          loaders: ['style', 'css?sourceMap', 'sass?sourceMap'],
          include: PATHS.styleDir,
        }
      ]
    }
  },
  parts.commonResolution,
  parts.commonLoaders,
  {
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Development',
        template: 'src/index.hbs',
        chunks: ['devStylesheet', 'manifest', 'app'],
        NODE_ENV
      })
    ]
  },
  parts.setFreeVariable(
    'process.env.NODE_ENV',
    NODE_ENV
  ),
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT
  })
);

module.exports = validate(config, {
  quiet: true
})
