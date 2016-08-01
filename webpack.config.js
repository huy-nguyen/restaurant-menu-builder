const validate = require('webpack-validator');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const parts = require('./webpack-parts');
const pgk = require('./package.json');

const PATHS = {
  scriptEnry: path.join(__dirname, 'src', 'ts'),
  app: path.join(__dirname, 'src'),
  style: path.join(__dirname, 'src', 'sass', 'style.scss'),
  cssOutput: path.join(__dirname, 'src', 'css', 'style.css'),
  build: path.join(__dirname, 'dist')
};

const common = {
  entry: {
    app: PATHS.scriptEnry,
    style: PATHS.style
  },
  output: {
    path: PATHS.build,
    // Dev environment uses `hash` and production environment uses `chunkhash`
    // because `chunkhash` doesn't work with Hot Module Replacement.
    filename: '[name].[hash].js',
    sourceMapFilename: '[file].map',
    chunkFilename: '[hash].js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Restaurant menu builder',
      template: 'src/index.hbs'
    })
  ],
  module: {
    loaders: [
      {
        // Use unmodified `tsconfig.json` for non-test ts files i.e. files that
        // don't contain `spec` in their names:
        test: absPath => absPath.match(/\.tsx?$/) && !absPath.match(/\.spec\.tsx?$/),
        loader: 'ts-loader'
      },
      {
        // Override `compilerOptions` in `tsconfig.json` with the options
        // specified here for test ts files. The main reason is that it's very
        // inconvenient to declare typing info for every variable created during
        // tests:
        test: /\.spec\.tsx?$/,
        loader: 'ts-loader',
        query: {
          compilerOptions: {
            noImplicitAny: false
          }
        }
      },
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
        loader: 'handlebars-loader'
      }
    ]
  }
}

var config;

switch(process.env.npm_lifecycle_event) {
  // Triggered when `webpack` is run with `npm run build` or `npm run stats`:
  case 'build':
    // Intentional fall through:
  case 'stats':
    config = merge(
      common,
      {
        output: {
          filename: '[name].[chunkhash].js',
          chunkFilename: '[chunkhash].js'
        }
      },
      parts.clean(PATHS.build),
      // Enable production mode in React (no logging/warning, no `propTypes`
      // check):
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'),
      parts.setFreeVariable(
        'PRODUCTION',
        true),
      parts.extractBundle({
        name: 'vendor',
        entries: Object.keys(pgk.dependencies)
      }),
      parts.minify(),
      parts.extractSASS(PATHS.style, 'chunkhash')
    );
    break;
  default:
    config = merge(common,
      {
        devtool: 'source-map',
      },
      parts.setFreeVariable(
        'PRODUCTION',
        false),
      parts.extractSASS(PATHS.style, 'hash'),
      parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
      })
      );
    break;
}

module.exports = validate(config, {
  quiet: true
});
