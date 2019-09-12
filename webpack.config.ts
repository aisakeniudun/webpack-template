import 'babel-polyfill';
import Path from 'path';
import Webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';


const config: Webpack.Configuration = {
    
    mode: process.env.NODE_ENV.trim() as "development" | "production" | "none",
    entry: {
        main: [ 'babel-polyfill', './src/index.ts' ],
    },
    output: {
        path: Path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js',
        libraryTarget: 'global',
        // library: 'myLibrary',
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.(htm|html)$/,
                exclude: /node_modules/,
                use: [
                    'raw-loader'
                ]
            },
            {
                test: /\.(m?js|ts|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    },
                    {
                        loader: 'tslint-loader',
                        options: {
                            tsConfigFile: 'tsconfig.json',
                            configFile: 'tslint.json',
                            formatter: "json",
                        }
                    },
                    { 
                        loader: "ts-loader" 
                    }
                ]
            },
            {
                test: /\.(sass|scss|css)$/i,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV.trim()  === 'development',
                        },
                    },

                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                    
                ],
            }
        ]
    },
    optimization: {
        minimize: process.env.NODE_ENV.trim() !== 'development',
        minimizer: [
            new UglifyJsPlugin({
                test: /\.js$/i,
                sourceMap: false,
                uglifyOptions: {
                    warnings: false,
                    compress: true,
                    mangle: true,
                    toplevel: true,
                    ie8: true,
                    keep_fnames: false,
                    keep_classnames: false,
                    ecma: 5
                }
            })
        ]
    },
    
    plugins: [
        new Webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ template: './src/index.html' }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false,
        })
    ],

    devtool: process.env.NODE_ENV.trim() === 'development'?'source-map' : false,

    devServer: {
        contentBase: Path.join(__dirname, "dist"),
        compress: true,
        host: 'localhost',
        port: 8080,
        hot: true,
        open: false,
        writeToDisk: true,
    }
};

export default config;