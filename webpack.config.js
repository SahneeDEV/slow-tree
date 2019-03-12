const path = require('path');
const fs = require('fs');
const dotenv = require("dotenv");
const webpack = require('webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CopyPlugin = require('copy-webpack-plugin');
const CleanPlugin = require("clean-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";
process.env.NODE_ENV = isProduction ? "production" : "development";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: isProduction ? ".env.prod" : ".env.dev" });
dotenv.config({ path: ".env" });

console.log("Enviroment variables are:", {
  NODE_ENV: process.env.NODE_ENV,
  SERVICE_WORKER: process.env.SERVICE_WORKER,
  BROWSERSYNC: process.env.BROWSERSYNC
});

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
  WEBGL_RENDERER: JSON.stringify(true),
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  'process.env.SERVICE_WORKER': JSON.stringify(process.env.SERVICE_WORKER),
  'process.env.BROWSERSYNC': JSON.stringify(process.env.BROWSERSYNC)
}));
plugins.push(new CopyPlugin(["index.html", "manifest.json", { from: "assets", to: "assets" }]));
if (process.env.BROWSERSYNC === "true") {
  const hasCerts = fs.existsSync("ssl/key.pem") && fs.existsSync("ssl/cert.pem");
  if (!hasCerts) {
    console.log("No SSL Key/Certificate found in /ssl, serving over HTTP.");
  }
  plugins.push(new BrowserSyncPlugin({
    host: process.env.IP || 'localhost',
    port: process.env.PORT || 3000,
    server: {
      baseDir: ['./dist']
    },
    https: hasCerts && {
      key: "ssl/key.pem",
      cert: "ssl/cert.pem"
    },
    open: false
  }));
} else {
  plugins.push(new CleanPlugin());
}
if (process.env.SERVICE_WORKER === "true") {
  plugins.push(new WorkboxPlugin.GenerateSW({
    swDest: "serviceworker.js",
    clientsClaim: true,
    importWorkboxFrom: "local",
    skipWaiting: true
  }));
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
