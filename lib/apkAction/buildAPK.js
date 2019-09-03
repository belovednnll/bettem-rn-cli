const { exec } = require( 'child_process' );
const colors = require('colors');

module.exports = async function(opt = {}) {
    return new Promise((resole, reject) => {
        const ls = exec('cd android && rm -rf ./app/src/main/res/drawable-mdpi && ./gradlew clean && ./gradlew assembleChannelDefEnvDefRelease', opt);
        console.log( '开始打包安卓apk...'.green );
        ls.stdout.on( 'data', ( data ) => {
            data && data != '' && console.log( `构建apk: ${data}` );
        } );
        
        ls.stderr.on( 'data', ( data ) => {
            data && data != '' && console.log( `构建apk: ${data}` );
        } );

        ls.on('error', (err) => {
            console.log( `构建apk失败: ${err}`.red );
            resole();
        })

        ls.on( 'close', ( code ) => {
            console.log( '打包安卓apk结束'.green );
            resole();
        } );
    });
    
}