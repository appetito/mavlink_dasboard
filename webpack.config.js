 const path = require('path');
 const webpack = require('webpack');
 // const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
   mode: 'development',
   module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
   entry: {
     index: './src/index.js',
     bundle: './src/bundle.js',
   },
   devtool: 'inline-source-map',
  devServer: {
    // contentBase: './dist',
    port: 3001,
    host: '0.0.0.0',
  },
   // plugins: [
   //   new HtmlWebpackPlugin({
   //     title: 'Development',
   //   }),
   // ],
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
     clean: true,
   },
plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_DEBUG': false,
    })
],
};
