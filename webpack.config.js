const validate = require('webpack-validator');
const path = require('path');

const config = {
  entry: './src/ts/index.js',
  output: {
    filename: './dist/bundle.js'
  },
  // devtool: 'eval', // This enables better blackboxing in Chrome:
  devtool: 'source-map', // Change back to this for production
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {test: /\.scss$/, loaders: ['style', 'css', 'sass']}
    ]
  }
}

module.exports = validate(config);
