'use strict';

const browserslist = require('browserslist');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { EsbuildPlugin } = require('esbuild-loader');
const { resolveToEsbuildTarget } = require('esbuild-plugin-browserslist');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const { DefinePlugin, EnvironmentPlugin } = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { merge } = require('webpack-merge');
const WebpackBar = require('webpackbar');

const getEnvConfig = require('./env-util.js');
const HTMLWebpackCSSChunks = require('./plugins/HTMLWebpackCSSChunks');
const common = require('./webpack.common.js');
const esbuildTargets = resolveToEsbuildTarget(browserslist(), { printUnknownTargets: false });

// esbuild-loader 3.0.0+ requires format to be set to prevent it
// from defaulting to 'iife' which breaks monaco/loader once minified.
const esbuildOptions = {
  target: esbuildTargets,
  format: undefined,
};

const envConfig = getEnvConfig();

module.exports = (env = {}) =>
  merge(common, {
    mode: 'production',
    devtool: 'source-map',

    entry: {
      app: './public/app/index.ts',
      dark: './public/sass/grafana.dark.scss',
      light: './public/sass/grafana.light.scss',
      fn_dashboard: './public/app/fn_dashboard.ts',
      swagger: './public/swagger/index.tsx',
    },

    module: {
      // Note: order is bottom-to-top and/or right-to-left
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'esbuild-loader',
            options: esbuildOptions,
          },
        },
        require('./sass.rule.js')({
          sourceMap: false,
          preserveUrl: false,
        }),
      ],
    },
    optimization: {
      nodeEnv: 'production',
      minimize: parseInt(env.noMinify, 10) !== 1,
      minimizer: [new EsbuildPlugin(esbuildOptions), new CssMinimizerPlugin()],
    },

    // enable persistent cache for faster builds
    cache: {
      type: 'filesystem',
      name: 'grafana-default-production',
      buildDependencies: {
        config: [__filename],
      },
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: 'grafana.[name].[contenthash].css',
      }),
      new ESLintPlugin({
        cache: true,
        lintDirtyModulesOnly: true, // don't lint on start, only lint changed files
        extensions: ['.ts', '.tsx'],
      }),
      new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, '../../public/views/error.html'),
        template: path.resolve(__dirname, '../../public/views/error-template.html'),
        inject: false,
        chunksSortMode: 'none',
        excludeChunks: ['dark', 'light', 'fn_dashboard'],
      }),
      new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, '../../public/views/index.html'),
        template: path.resolve(__dirname, '../../public/views/index-template.html'),
        inject: false,
        chunksSortMode: 'none',
        excludeChunks: ['dark', 'light', 'fn_dashboard'],
      }),
      new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, '../../public/microfrontends/fn_dashboard/index.html'),
        template: path.resolve(__dirname, '../../public/views/index-microfrontend-template.html'),
        inject: false,
        chunksSortMode: 'none',
        excludeChunks: ['dark', 'light', 'app', 'swagger'],
      }),
      new HTMLWebpackCSSChunks(),
      new WebpackAssetsManifest({
        entrypoints: true,
        integrity: true,
        publicPath: true,
      }),
      new WebpackManifestPlugin({
        fileName: path.join(process.cwd(), 'manifest.json'),
        filter: (file) => !file.name.endsWith('.map'),
      }),
      function () {
        this.hooks.done.tap('Done', function (stats) {
          if (stats.compilation.errors && stats.compilation.errors.length) {
            console.log(stats.compilation.errors);
            process.exit(1);
          }
        });
      },
      new EnvironmentPlugin({
        ...envConfig,
        SHOULD_LOG: 'false',
      }),
      new WebpackBar({
        color: '#eb7b18',
        name: 'Grafana',
      }),
    ],
  });
