const copydir = require( 'copy-dir' );
const {error, log} = require('../log');
module.exports = async function( from, to, isCover ) {
    log('构建目录中.....');
    return new Promise((resolve, reject) => {
        try {
            copydir.sync( from, to, {
                utimes: true,  // keep add time and modify time
                mode: true,    // keep file mode
                cover: !!isCover    // cover file when exists, default is true
            } );
            log('构建目录完成！');
            resolve(true);
        } catch( err ) {
            error(`构建目录失败：${err}`);
            reject(false);
        }
    })
}