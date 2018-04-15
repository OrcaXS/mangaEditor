const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  devServer: {
    // contentBase: path.join(__dirname, "dist"),
    hot: true,
    compress: true,
    port: 9000,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.pug$/,
        include: path.join(__dirname, 'src'),
        use: {
          loader: 'pug-loader',
        },
      },
    ],
  },

  resolve: {
    alias: {
      '~': path.resolve(__dirname),
    },
  },

  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.pug',
      filename: './index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
