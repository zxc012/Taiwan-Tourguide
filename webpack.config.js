const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        filename: './scripts/[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.html$/i,
                use: 'html-loader'
            },
            {
                test: /\.(scss|sass)/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[hash][ext][query]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            img: path.resolve(__dirname, 'src/images')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].[contenthash].css'
        })
    ]
}