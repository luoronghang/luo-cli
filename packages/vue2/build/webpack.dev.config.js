const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const baseConfigFun = require('./webpack.base.config.js')
const projectConfig = require('../projectConfig')
const axios = require('axios')
const artTemplate = require('art-template');
const {site} = require('../config/kfz_sys.js');

const devConfig = {
    mode: 'development',
    devtool:'source-map',
    output: {
        filename:'[name]/[name].js',
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]/[name].css',
            chunkFilename:'[name].css',
            ignoreOrder: true,    // Enable to remove warnings about conflicting order   https://github.com/webpack-contrib/mini-css-extract-plugin/blob/v0.8.0/README.md#remove-order-warnings
        })
    ],
    devServer: {
        host: projectConfig.devServerHost || '0.0.0.0',
        port: projectConfig.devServerPort || '8080',
        compress: true,
        clientLogLevel: 'none',
        transportMode: 'ws',
        disableHostCheck: true,
        hot: true,
        quiet: false,
        stats: 'errors-only',
        proxy: projectConfig.devServerProxy,
        before(app, server, compiler) {
            // 遍历devServerRender 根据配置渲染不同的html文件
            projectConfig.devServerRender.forEach(item => {
                app.get(item.matchUrl, async (req, res, next) => {
                    const reqPath = req.path || ''
                    if (item.externalPath.every(ignorePath => reqPath.indexOf(ignorePath) !== 0 )) {
                        const htmlRes = (await axios({
                            method: 'GET',
                            url: `http://${projectConfig.devServerHost}:${projectConfig.devServerPort}/${projectConfig.distDir}/${item.moduleName}/index.html`
                        })).data
                        res.set('Content-Type', 'text/html');
                        res.send(artTemplate.render(htmlRes, {data: {site}}));
                    } else {
                        await next();
                    }
                })
            })
        }
    }
}

module.exports = merge(baseConfigFun('development'), devConfig)
