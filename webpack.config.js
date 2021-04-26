 const path = require('path');
 // const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
   mode: 'development',
   entry: {
     index: './src/index.js',
     bundle: './src/bundle.js',
   },
   devtool: 'inline-source-map',
  devServer: {
    // contentBase: './dist',
    port: 3000,
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
 };
