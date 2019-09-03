const { spawnSync } = require( 'child_process' );
module.exports = ( config ) => {
    console.log('==============')
    console.log('开始同步打包文件到原生项目中...'.green)
    for (let i = 0; i < config.length; i++){
        const curr = config[i];
        if ( curr.type == 'file' ) {
            spawnSync('cp',[curr.from, curr.to])
        } else if (curr.type == 'dir') {
            spawnSync('cp',['-r', curr.from, curr.to])
        }
    }
    console.log('同步完成...'.green)
    console.log('==============')
}