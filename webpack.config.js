const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: { uncutbk: './src/index.tsx' },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].bundle.js',
  },
  devtool: 'inline-source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx??$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
          test:/\.css$/,
          use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [ 'file-loader' ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ]
  },
  plugins: [
    new CopyPlugin([
      {
        from: path.resolve(__dirname, 'public'),
        to: path.resolve(__dirname, 'dist')
      },
    ]),
    // new BundleAnalyzerPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
};