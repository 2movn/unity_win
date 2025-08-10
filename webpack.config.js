const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  
  return {
    entry: './renderer/dev/index.tsx',
    output: {
      path: path.resolve(__dirname, 'build/renderer'),
      filename: 'bundle.js',
      clean: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './renderer/dev/index.html',
        filename: 'index.html',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'renderer/dev/assets'),
            to: path.resolve(__dirname, 'build/renderer/assets'),
          },
          {
            from: path.resolve(__dirname, 'assets'),
            to: path.resolve(__dirname, 'build/renderer/assets'),
          },
        ],
      }),
    ],
    devtool: isDevelopment ? 'eval-source-map' : 'source-map',
    devServer: isDevelopment ? {
      hot: true,
      port: 3000,
      static: {
        directory: path.join(__dirname, 'build/renderer'),
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      allowedHosts: 'all',
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
        progress: true,
        logging: 'info',
      },
      compress: true,
      historyApiFallback: true,
      open: false,
      liveReload: true,
      watchFiles: {
        paths: ['renderer/dev/**/*', 'renderer/styles.css'],
        options: {
          usePolling: true,
          interval: 1000,
        },
      },
    } : undefined,
    watch: isDevelopment,
    watchOptions: {
      ignored: /node_modules/,
      poll: 1000,
      aggregateTimeout: 300,
    },
  };
}; 