const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const { resolve } = require('path');
const { VueLoaderPlugin } = require('vue-loader');

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
        loader: 'pug-plain-loader',
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
    ],
  },

  resolve: {
    modules: [resolve(__dirname, 'lib'), 'node_modules'],
    extensions: ['.js', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '~': resolve(__dirname),
      '@': resolve(__dirname, 'src'),
      // your aliases go here.
    },
  },

  plugins: [

    new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebPackPlugin({
      // template: './src/index.pug',
      template: './src/index.html',
      inject: true,
    }),
  ],
};
