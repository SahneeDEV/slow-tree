var path = require('path');
var webpack = require('webpack');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const VueLoaderPlugin = require("vue-loader/lib/plugin");

const isProduction = process.env.NODE_ENV === "production";

console.log("Running in production mode?", isProduction);

// ===============================================
// MISC SETTINGS
// ===============================================
const mode = isProduction ? "production" : "development";
const devtool = isProduction ? "none" : "inline-source-map";
const watch = !isProduction;
// ===============================================
// PLUGINS
// ===============================================
const plugins = [];
plugins.push(new VueLoaderPlugin());
plugins.push(new webpack.DefinePlugin({
  CANVAS_RENDERER: JSON.stringify(true),
  WEBGL_RENDERER: JSON.stringify(true)
}));
if (!isProduction) {
  plugins.push(new BrowserSyncPlugin({
    host: process.env.IP || 'localhost',
    port: process.env.PORT || 3000,
    server: {
      baseDir: ['./', './build']
    }
  }));
}

module.exports = {
  entry: {
    app: [path.resolve(__dirname, 'src/index.ts')],
    vendor: ['phaser']
  },
  mode: mode,
  devtool: devtool,
  output: {
    //pathinfo: true,
    path: path.resolve(__dirname, 'dist'),
    publicPath: './dist/',
    filename: '[name].bundle.js'
  },
  watch: watch,
  plugins: plugins,
  resolve: {
    extensions: ['.ts', '.js', '.vue'],
    alias: {
      "@":  path.resolve(__dirname, 'src/')
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      },
    ]
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'all'
    }
  }
}
