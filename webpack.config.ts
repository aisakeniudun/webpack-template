import path from 'path';
import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';


const config: webpack.Configuration = {
    mode: 'production',
    entry: {
        main:'./src/index.ts',
        test:'./src/test.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js',
        libraryTarget: 'global'
    },
    module: {
        rules: [
            {
                test: /\.(htm|html)$/,
                use: [
                    'raw-loader'
                ]
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },

            {
                test: /\.(sass|scss|css)$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
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
            },

            {
                test: /\.ts$/,
                enforce: 'pre',
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
                    }
                ]
            }
        ]
    },
    optimization: {
        minimize: true,
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
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ template: './src/index.html' }),

        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false,
        })
    ],
    devtool: 'source-map',

    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        host: 'localhost',
        port: 8080,
        hot: true,
        open: true,
        writeToDisk: true,
    }
};

export default config;