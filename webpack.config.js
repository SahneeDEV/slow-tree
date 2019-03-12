const path = require('path');
const webpack = require('webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CopyPlugin = require('copy-webpack-plugin');
const CleanPlugin = require("clean-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

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
plugins.push(new CleanPlugin());
plugins.push(new VueLoaderPlugin());
plugins.push(new webpack.DefinePlugin({
  CANVAS_RENDERER: JSON.stringify(true),
  WEBGL_RENDERER: JSON.stringify(true),
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
}));
plugins.push(new CopyPlugin(["index.html", { from: "assets", to: "assets" }]));
if (!isProduction) {
  plugins.push(new BrowserSyncPlugin({
    host: process.env.IP || 'localhost',
    port: process.env.PORT || 3000,
    server: {
      baseDir: ['./dist']
    }
  }));
}
if (isProduction) {
  plugins.push(new WorkboxPlugin.GenerateSW({
    swDest: "serviceworker.js",
    clientsClaim: true,
    importWorkboxFrom: "local",
    skipWaiting: true
  }))
}

module.exports = {
  entry: {
    app: [path.resolve(__dirname, 'src/index.ts')],
    //sw: [path.resolve(__dirname, 'src/serviceworker/index.ts')],
    vendor: ['phaser']
  },
  mode: mode,
  devtool: devtool,
  output: {
    //pathinfo: true,
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].bundle.js'
  },
  watch: watch,
  plugins: plugins,
  resolve: {
    extensions: ['.ts', '.js', '.vue'],
    alias: {
      "@": path.resolve(__dirname, 'src/')
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
