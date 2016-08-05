var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  entry: './app.js',
  output: {
    path: './static',
    publicPath: '/static/',
    filename: 'app.js'
  },
  module: {
    // avoid webpack trying to shim process
    noParse: /es6-promise\.js$/,
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        // excluding some local linked packages.
        // for normal use cases only node_modules is needed.
        exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
        loader: 'babel'
      },
      // {
      //   test: /\.css$/,
      //   loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      // },
      // Optionally extract less files
      // or any other compile-to-css language
      // {
      //   test: /\.scss$/,
      //   loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
      // },
      // {
      //   test: /.scss$/,
      //   loader: ExtractTextPlugin.extract('style', 'css!sass')
      // }
    ]
  },
  // vue: {
  //   loaders: {
  //     css: ExtractTextPlugin.extract('vue-style-loader', 'css-loader', 'sass-loader')
  //   }
  // },
  // plugins: [
  //   new ExtractTextPlugin('./static/app.css', {
  //     allChunks: true,
  //   }),
  // ],
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  }
}

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ]
} else {
  module.exports.devtool = '#source-map'
}
