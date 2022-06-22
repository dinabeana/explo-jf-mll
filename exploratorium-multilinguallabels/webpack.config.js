const path = require('path');
const webpack = require('webpack');

const { HotModuleReplacementPlugin } = webpack;

const config = {
  entry: {
    script: './src/js/script.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name].js',
  },
  devServer: {
    contentBase: './src',
    hot: true,
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },
  stats: {
    colors: true,
  },
  devtool: 'source-map',
  plugins: [],
};

if (process.env.NODE_ENV === 'development') {
  config.plugins.push(new HotModuleReplacementPlugin());
}

module.exports = config;
