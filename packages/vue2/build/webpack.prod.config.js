const { merge } = require('webpack-merge');
const baseConfigFun = require('./webpack.base.config.js');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');


const prodConfig = {
    mode: 'production',
    output: {
        filename:'[name]/[name].[chunkhash].js',
        chunkFilename:'[name].[chunkhash].js'
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        // We want terser to parse ecma 8 code. However, we don't want it
                        // to apply any minification steps that turns valid ecma 5 code
                        // into invalid ecma 5 code. This is why the 'compress' and 'output'
                        // sections only apply transformations that are ecma 5 safe
                        // https://github.com/facebook/create-react-app/pull/4234
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        // Disabled because of an issue with Uglify breaking seemingly valid code:
                        // https://github.com/facebook/create-react-app/issues/2376
                        // Pending further investigation:
                        // https://github.com/mishoo/UglifyJS2/issues/2011
                        comparisons: false,
                        // Disabled because of an issue with Terser breaking valid code:
                        // https://github.com/facebook/create-react-app/issues/5250
                        // Pending further investigation:
                        // https://github.com/terser-js/terser/issues/120
                        inline: 0,
                        drop_console: true,
                        drop_debugger: true,
                        unused: false,
                        loops: false,
                    },
                    mangle: {
                        safari10: true,
                    },
                    // Added for profiling in devtools
                    keep_classnames: true,
                    keep_fnames: false,
                    output: {
                        ecma: 5,
                        comments: false,
                        // Turned on because emoji and regex is not minified properly using default
                        // https://github.com/facebook/create-react-app/issues/2488
                        ascii_only: true,
                    },
                },
                sourceMap: false,
            }),
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]/[name].[hash].css',
            chunkFilename:'[name].[hash].css',
            ignoreOrder: true,
        }),
        new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {
                parser: safePostCssParser,
                map: false,
            },
        }),
    ]
}

module.exports = merge(baseConfigFun('production'), prodConfig)