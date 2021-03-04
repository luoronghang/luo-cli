const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const projectConfig = require('../projectConfig')

const CopyViewsPlugin = require('./webpackPlugins/CopyViewsPlugin');



module.exports = function (webpackEnv) {
    const isEnvDevelopment = webpackEnv === 'development';
    const isEnvProduction = webpackEnv === 'production';
    const SRC_PATH = path.resolve(__dirname, '../static/modules/'); //模块目录

    const moduleNames = fs.readdirSync(SRC_PATH)
    const entryJs = {}, pluginTpls = [];
    moduleNames.forEach(module => {
        // 收集入口文件
        if (fs.existsSync(path.join(SRC_PATH, `/${module}/index.js`))) {
            entryJs[module] = path.join(SRC_PATH, `/${module}/index.js`)
            // 收集html模板  生成HtmlWebpackPlugin 配置文件
            if (fs.existsSync(path.join(SRC_PATH, `/${module}/${module}.html`))) {
                pluginTpls.push(new HtmlWebpackPlugin(Object.assign({
                    template: path.join(SRC_PATH, `/${module}/${module}.html`),
                    filename: `${module}/index.html`,
                    chunks: [module],
                }, isEnvProduction
                    ? {
                        minify: {   // http://perfectionkills.com/experimenting-with-html-minifier   配置项相关文档
                            removeComments: true,   // 移除注释
                            collapseWhitespace: true,   // 移除标签内的空格  SCRIPT, STYLE, PRE or TEXTAREA.除外
                            removeRedundantAttributes: true,
                            useShortDoctype: true,
                            removeEmptyAttributes: true,  // 移除标签空属性
                            removeStyleLinkTypeAttributes: true,
                            keepClosingSlash: true,
                            minifyJS: true,
                            minifyCSS: true,
                            minifyURLs: true,
                        },
                    }
                    : undefined)))
            } else {
                throw ('\033[31m错误：模块 [' + module + '] 未给出正确的html模板 '+module+'.html\033[0m');
            }
        } else {
            console.log('\033[33m警告：模块 [' + module + '] 未给出正确的入口文件 index.js\033[0m')
        }
    })
    return {
        entry: entryJs,
        output: {
            path: path.resolve(__dirname, '../' + projectConfig.distDir),
            publicPath: `${projectConfig.publicPath}`,
            chunkFilename:'[name].js'
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'vue-loader',
                    }
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    [
                                        '@babel/preset-env',
                                        {
                                            "useBuiltIns": "usage",
                                            "corejs": 3,
                                        }
                                    ]
                                ],
                                plugins: [
                                    ["@babel/plugin-proposal-decorators", { "legacy": true }],
                                    ["@babel/plugin-proposal-class-properties", { "loose" : true }],
                                    "@babel/plugin-transform-runtime",
                                    ['import', {
                                        libraryName: 'vant',
                                        libraryDirectory: 'es',
                                        style: true
                                    }, 'vant']   // vant 按需加载   https://youzan.github.io/vant/#/zh-CN/quickstart
                                ],
                                cacheDirectory: true,
                                cacheCompression: false,
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    oneOf: [
                        // this matches `<style module>`
                        {
                            resourceQuery: /module/,
                            use: [
                                MiniCssExtractPlugin.loader,
                                {
                                    loader: 'css-loader',
                                    options: {
                                        importLoaders: 1,
                                        modules: {
                                            localIdentName: '[local]_[hash:base64:5]'
                                        },
                                    }
                                },
                                {
                                    loader: 'postcss-loader',
                                    options: {
                                        ident: 'postcss',
                                        plugins: [
                                            require('postcss-import')(),
                                            require('postcss-url')(),
                                            require('postcss-preset-env')({ // 可使用css 最新的语法功能
                                                stage: 3,
                                                features: {
                                                    'nesting-rules': true,
                                                }
                                            }),
                                            require('postcss-pxtorem')({
                                                rootValue: 50,
                                                propList: ['*'],
                                            }),
                                        ]
                                    }
                                }
                            ]
                        },
                        // this matches plain `<style>` or `<style scoped>`
                        {
                            use: [
                                MiniCssExtractPlugin.loader,
                                {
                                    loader: 'css-loader',
                                    options: {
                                        importLoaders: 1,
                                    }
                                },
                                {
                                    loader: 'postcss-loader',
                                    options: {
                                        ident: 'postcss',
                                        plugins: [
                                            require('postcss-import')(),
                                            require('postcss-url')(),
                                            require('postcss-preset-env')({ // 可使用css 最新的语法功能
                                                stage: 3,
                                                features: {
                                                    'nesting-rules': true,
                                                }
                                            }),
                                            require('postcss-pxtorem')({
                                                rootValue: 50,
                                                propList: ['*'],
                                            }),
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    exclude: /node_modules/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 5,
                            name: '[name].[hash:8].[ext]',
                            outputPath: 'images/',
                            esModule:false
                        }
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)$/i,
                    exclude: /node_modules/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'fonts/[name].[ext]'
                        }
                    }
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.vue', '.ts', '.json']
        },
        plugins: [
            new VueLoaderPlugin(),
            ...pluginTpls
            // new BundleAnalyzerPlugin()   // 查看包的大小
        ],
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        name: 'chunk-vendors',
                        test: /[\\/]node_modules[\\/](?!vant)/,    // 排除vant组件 vant组件按需加载 跟随业务模块打包   polyfill单独抽出
                        priority: -10,
                        chunks: 'initial',
                    },

                    common: {
                        name: 'chunk-common',
                        minChunks: 2,
                        minSize: 0,
                        priority: -20,
                        chunks: 'all',
                    }
                }
            },
            runtimeChunk: {
                name: 'runtime',
            },
        }
    };
}
