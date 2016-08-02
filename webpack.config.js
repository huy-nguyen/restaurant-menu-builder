const validate = require('webpack-validator');
const path = require('path');
const merge = require('webpack-merge');
const parts = require('./webpack-parts');
const pgk = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  scriptEnry: path.join(__dirname, 'src', 'ts'),
  app: path.join(__dirname, 'src'),
  style: path.join(__dirname, 'src', 'sass'),
  productionStylesheet: path.join(__dirname, 'src', 'sass', 'style.scss'),
  devStylesheet: path.join(__dirname, 'src', 'sass', 'dev_style.scss'),
  build: path.join(__dirname, 'dist')
};

const common = {
  entry: {
    app: PATHS.scriptEnry,
    devStylesheet: PATHS.devStylesheet,
    productionStylesheet: PATHS.productionStylesheet
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

let config, isProduction;

switch(process.env.npm_lifecycle_event) {
  // Triggered when `webpack` is run with `npm run build` or `npm run stats`:
  case 'build':
    // Intentional fall through:
  case 'stats':
    isProduction = true;
    config = merge(
      common,
      {
        output: {
          filename: '[name].[chunkhash].js',
          chunkFilename: '[chunkhash].js'
        },
        plugins: [
          new HtmlWebpackPlugin({
            title: 'Restaurant menu builder',
            template: 'src/index.hbs',
            chunks: ['productionStylesheet', 'manifest', 'vendor', 'app'],
            PRODUCTION: isProduction
          })
        ]
      },
      parts.clean(PATHS.build),
      // Enable production mode in React (no logging/warning, no `propTypes`
      // check):
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'),
      parts.setFreeVariable(
        'PRODUCTION',
        isProduction),
      parts.extractBundle({
        name: 'vendor',
        entries: Object.keys(pgk.dependencies)
      }),
      parts.minify(),
      parts.extractSASS(PATHS.style, 'chunkhash')
    );
    break;
  default:
    isProduction = false;
    config = merge(common,
      {
        devtool: 'source-map',
        module: {
          loaders: [
            {
              test: /\.scss$/,
              loaders: ['style', 'css?sourceMap', 'sass?sourceMap'],
              include: PATHS.style,
            }
          ]
        },
        plugins: [
          new HtmlWebpackPlugin({
            title: 'Restaurant menu builder',
            template: 'src/index.hbs',
            chunks: ['devStylesheet', 'manifest', 'app'],
            PRODUCTION: isProduction
          })
        ]
      },
      parts.setFreeVariable(
        'PRODUCTION',
        isProduction),
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
