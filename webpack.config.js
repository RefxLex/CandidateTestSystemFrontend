const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ASSET_PATH = process.env.ASSET_PATH || '/';


module.exports = {

  entry:"./src/index.js",
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js',
    clean: true,
    assetModuleFilename: '[name][ext]',
    publicPath: ASSET_PATH,
  },
  devServer: {
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      favicon: "./src/images/favicon2.png"
    }),
    new MiniCssExtractPlugin(),
  ],
}