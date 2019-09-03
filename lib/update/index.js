const path = require( 'path' );
const fs = require('fs');
const packageConfig = require('../config/projectDependencies');
const projectScript = require('../config/projectScript');
const { log, error } = require('../log');

module.exports = () => {
    log('更新package依赖文件版本')
    const CURR_PATH = process.cwd();
    const cwd_package = path.join(CURR_PATH, './package.json');

    // 写入project name
    if (fs.existsSync(cwd_package)) {
        let content = fs.readFileSync(cwd_package, 'utf8');
        let newContent = JSON.parse(content);
        
        newContent.dependencies = Object.assign(newContent.dependencies, packageConfig.dependencies)
        newContent.devDependencies = Object.assign(newContent.devDependencies, packageConfig.devDependencies)
        newContent.devBundleConfig = Object.assign(newContent.devBundleConfig, packageConfig.devBundleConfig);
        newContent.scripts = Object.assign(newContent.scripts, projectScript);

        fs.writeFileSync(cwd_package, JSON.stringify(newContent, null,"\t"));

        log('更新package依赖文件完成，请自行install');
    } else {
        error('没有找到package.json文件');
    }
}