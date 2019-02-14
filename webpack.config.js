var path = require('path');
var webpack = require('webpack');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
  entry: {
    app: [path.resolve(__dirname, 'src/index.ts')],
    vendor: ['phaser']
  },
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'dist'),
    publicPath: './dist/',
    filename: '[name].bundle.js'
  },
  watch: true,
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
    new BrowserSyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3000,
      server: {
        baseDir: ['./', './build']
      }
    })
  ],
  resolve: {
    extensions: ['.ts', '.js', '.vue']
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: path.join(__dirname, 'src'),
        options: {
          loaders: { js: 'ts-loader', },
          // esModule: true
          //if a custom element (anything but img) needs to resolve a path, add it to this
          //transformToRequire : {
          //  'image-cropper' : 'src'
          //}
        }
      },
      {
        test: /\.ts$/,
        use: ['awesome-typescript-loader'],
        include: path.join(__dirname, 'src')
      }
    ]
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'all'
    }
  }
}
