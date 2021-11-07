const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production'
const Dotenv = require('dotenv-webpack');

module.exports = {
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
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.css/i,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset',
                generator: {
                    filename: 'images/[hash][ext][query]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[hash][ext][query]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            img: path.resolve(__dirname, 'src/images'),
            font: path.resolve(__dirname, 'src/fonts')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        devMode ? new MiniCssExtractPlugin({
            filename: 'styles/[name].[contenthash].css'
        }) : {},
        new Dotenv()
    ]
}