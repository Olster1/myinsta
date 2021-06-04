const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './app/index.js',
  output: {
    path: path.resolve(__dirname, './app/public'),
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'SERVICE_URL': JSON.stringify('http://localhost:8080')
    })
  ], 
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};