const fs = require('fs')

/**
 * webpack自定义插件
 * 拷贝html文件到app下供 node服务使用
 */
class CopyViewsPlugin {
    constructor(options) {
        const { moduleNames, dist, dest } = options;
        this.moduleNames = moduleNames;
        this.dist = dist;
        this.dest = dest;
    }
    apply(compiler) {
        compiler.hooks.done.tap('CopyViewsPlugin',stats => {
            this.moduleNames.forEach(module => {
                if (fs.existsSync(`${this.dist}/${module}/index.html`)) {   // 此if兼容 webpack  dev server
                    fs.existsSync(`${this.dest}/${module}`) || fs.mkdirSync(`${this.dest}/${module}`);  // 如果父文件夹不存在则提前创建避免报错
                    fs.renameSync(`${this.dist}/${module}/index.html`, `${this.dest}/${module}/index.html`);  // move文件
                }
            })
        });
    }
}


module.exports = CopyViewsPlugin;
