const validate = require('webpack-validator');
const merge = require('webpack-merge');
const parts = require('./webpack-parts');
const pgk = require('./package.json');

const PATHS = parts.PATHS;
const nodeEnvs = parts.nodeEnvs;

const NODE_ENV = nodeEnvs.test;

const config = merge(
  {
    entry: {
      // No style output for test.
      app: PATHS.scriptEntryWithoutStyle,
    },
    output: {
      path: PATHS.buildDir,
      filename: '[name].[chunkhash].js',
      sourceMapFilename: '[file].map',
      chunkFilename: '[chunkhash].js'
    },
    module: {
      loaders: [
        {
          test: /\.(ts|tsx)$/,
          loader: 'ts-loader',
          query: {
            compilerOptions: {
              // Disable all type checking and treat TS purely as a transpiler
              // because any type error would have been detected during dev
              // because type checking is alays on in dev mode:
              noImplicitAny: false
            }
          }
        }
      ]
    }
  },
  parts.commonResolution,
  parts.commonLoaders,
  parts.setFreeVariable(
    'process.env.NODE_ENV',
    NODE_ENV
  )
);

module.exports = validate(config, {
  quiet: true
})
