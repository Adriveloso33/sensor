/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable indent */

const path = require('path');
const fs = require('fs-extra');

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const srcRoot = path.resolve(__dirname, 'src');
const appRoot = path.resolve(srcRoot, 'app');

const { enviroment = 'dev', operator = 'att', server = 'development' } = process.env;

module.exports = (env = {}) => {
  const configFile = `./src/app/config/general/config.${operator}.${server}.js`;
  fs.copy(configFile, './src/app/config/config.js');

  const isDev = enviroment === 'dev';

  let devtool = isDev ? 'eval' : 'cheap-source-map';
  if (env.debugger) devtool = 'inline-source-map';

  return {
    mode: isDev ? 'development' : 'production',
    context: path.resolve(__dirname),
    entry: {
      main: ['@babel/polyfill', './src/app/index.js'],
      vendor: ['react', 'react-dom', 'jquery', 'moment', 'react-bootstrap', 'lodash'],
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: isDev ? 'js/[name].bundle.js' : 'js/[name].[chunkhash].bundle.js',
      sourceMapFilename: isDev ? 'js/[name].bundle.map' : 'js/[name].[chunkhash].bundle.map',
      chunkFilename: isDev ? 'js/[id].chunk.js' : 'js/[id].[chunkhash].chunk.js',
      publicPath: '',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader'],
          }),
        },
        {
          test: /\.less$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: { url: false, sourceMap: true },
              },
              {
                loader: 'less-loader',
                options: { relativeUrls: false, sourceMap: true },
              },
            ],
          }),
        },
        {
          test: /\.(jpe?g|png|gif)$/,
          loader: 'file-loader',
          query: {
            name: 'assets/img/[name].[ext]',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: [appRoot, 'node_modules'],
      alias: {
        jquery: path.resolve(path.join(__dirname, 'node_modules', 'jquery')),
      },
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      port: 2200,
      compress: true,
      disableHostCheck: true,
      historyApiFallback: true,
      stats: {
        colors: true,
        errors: true,
        errorDetails: false,
        warnings: true,
        hash: false,
        version: false,
        timings: false,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        publicPath: false,
      },
    },
    stats: 'minimal',
    performance: {
      hints: false,
    },
    // cheap-source-map: fast, inline-source-map: better to debug, eval: fast to all but hard to debug
    devtool,
    optimization: !isDev
      ? {
          minimizer: [
            new UglifyJsPlugin({
              parallel: true,
              uglifyOptions: {
                keep_fnames: true,
                comments: false,
                compress: {
                  warnings: false,
                  drop_console: true,
                  dead_code: true,
                  drop_debugger: true,
                  inline: false,
                },
              },
            }),
          ],
          runtimeChunk: false,
          splitChunks: {
            cacheGroups: {
              default: false,
              commons: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendor_app',
                chunks: 'all',
                minChunks: 2,
              },
            },
          },
        }
      : undefined,
    plugins: [
      new CopyWebpackPlugin([{ from: './src/index.html' }, { from: './src/assets', to: './assets' }]),
      new ExtractTextPlugin({ filename: 'assets/custom-style.css' }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new HtmlWebpackPlugin({
        template: path.resolve(srcRoot, 'index.html'),
        chunksSortMode: 'dependency',
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        jquery: 'jquery',
        moment: 'moment',
        _: 'lodash',
        axios: 'axios',
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
        globals: JSON.stringify(process.env),
      }),
    ].concat(
      isDev === false
        ? [new CleanWebpackPlugin(['dist'])].concat(env.analyzer === 'true' ? [new BundleAnalyzerPlugin()] : [])
        : []
    ),
  };
};
