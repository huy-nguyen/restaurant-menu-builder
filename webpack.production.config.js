const validate = require('webpack-validator');
const merge = require('webpack-merge');
const parts = require('./webpack-parts');
const pgk = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = parts.PATHS;
const nodeEnvs = parts.nodeEnvs;

const NODE_ENV = nodeEnvs.production

const config = merge(
  {
    entry: {
      app: PATHS.scriptEntryWithoutStyle,
      productionStylesheet: PATHS.productionStylesheet
    },
    output: {
      path: PATHS.buildDir,
      publicPath: '/restaurant-menu-builder/',
      filename: '[name].[chunkhash].js',
      sourceMapFilename: '[file].map',
      chunkFilename: '[chunkhash].js'
    },
    externals: {
      // These libraries will be loaded from a CDN instead of be bundled in the
      // build. E.g. whenever we `require('redux')` inside the code, that
      // `require` call  will resolve to the variable `Redux` which has already
      // been attached to the global object by a CDN script in the `index.html`
      // file:
      'jquery': 'jQuery',
      'react': 'React',
      'react-dom': 'ReactDOM',
      'redux': 'Redux',
      'lodash': '_',
      'classnames': 'classNames',
      'react-redux': 'ReactRedux',
      'redux-thunk': 'ReduxThunk',
      'underscore.string': 's'
    },
    module: {
      loaders: [
        {
          test: /\.(ts|tsx)$/,
          loader: 'ts-loader',
          exclude: PATHS.testDir
        }
      ]
    }
  },
  parts.commonResolution,
  parts.commonLoaders,
  {
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Restaurant menu builder',
        template: PATHS.indexTemplate,
        chunks: ['productionStylesheet', 'manifest', 'vendor', 'app'],
        NODE_ENV
      })
    ]
  },
  parts.clean(PATHS.buildDir),
  // Enable production mode in React (no logging/warning, no `propTypes`
  // check):
  parts.setFreeVariable(
    'process.env.NODE_ENV',
    NODE_ENV
  ),
  parts.extractBundle({
    name: 'vendor',
    entries: Object.keys(pgk.dependencies)
  }),
  parts.minify(),
  parts.extractSASS(PATHS.styleDir, 'chunkhash')
);

module.exports = validate(config, {
  quiet: true
})
