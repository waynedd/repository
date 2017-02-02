var webpack = require('webpack');

module.exports = {

  entry: {
    index: './entry.jsx'
  },
  output: {
    path: '../public/react-build',
    filename: '[name].bundle.js'
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [{
      test: /.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react']  // es2015 for ES6，react for jsx
      }
    }]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]

};