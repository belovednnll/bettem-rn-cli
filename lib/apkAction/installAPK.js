const { exec } = require( 'child_process' );
const colors = require('colors');

module.exports = async function( config, opt = {}) {
    return new Promise((resole, reject) => {
        const ls = exec(`adb install ${config.androidAPKPath}`, opt);
        console.log( '开始安装安卓apk...'.green );
        ls.stdout.on( 'data', ( data ) => {
            data && data != '' && console.log( `安装apk: ${data}` );
        } );
        
        ls.stderr.on( 'data', ( data ) => {
            data && data != '' && console.log( `安装apk: ${data}` );
        } );

        ls.on('error', (err) => {
            console.log( `安装apk失败: ${err}`.red );
            resole();
        })

        ls.on( 'close', ( code ) => {
            console.log( '安装安卓apk结束'.green );
            resole();
        } );
    });
    
}