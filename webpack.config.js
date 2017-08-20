const { resolve } = require('path')

module.exports = {
  context: __dirname,
  entry: './src/index.js',
  devtool: 'source-map',

  output: {
    library: 'scanty',
    libraryTarget: 'umd',
    path: resolve('lib'),
    filename: 'scanty.min.js',
  },

  resolve: {
    extensions: ['.js'],
    modules: [resolve('node_modules'), resolve('src')],
  },

  module: {
    loaders: [
      {
        use: ['babel-loader'],
        test: /\.js$/,
        exclude: [resolve('node_modules')],
      },
    ],
  },
}
