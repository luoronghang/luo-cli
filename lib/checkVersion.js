/**
 * 检查脚手架是否有更新
 */
const chalk = require('chalk');
const axios = require('axios');
const semver = require('semver');
const localPackageConfig = require('../package.json');
module.exports = function checkVersion(done){
  axios.get('https://registry.npmjs.org/@luoronghang/cli')
  .then(function(res){
    if(res.status ===200){
      const latestVersion = res.data['dist-tags'].latest;
      const localVersion = localPackageConfig.version;
      if(semver.lt(localVersion,latestVersion)){
        console.log(chalk.yellow('  A newer version is available'));
        console.log();
        console.log('  latest:     ' + chalk.green(latestVersion));
        console.log('  installed:  ' + chalk.red(localVersion));
        console.log();
      }
    }
    done();
  }).catch(function(err){
    done();
  })
}