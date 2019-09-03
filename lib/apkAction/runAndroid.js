const { exec } = require( 'child_process' );
const colors = require('colors');

module.exports = async function(opt = {}) {
    return new Promise((resole, reject) => {
        console.log( '开始运行安卓debug环境...'.green );
        const ls = exec('react-native run-android --variant channelDefEnvDefDebug --main-activity feature.home.launch.SplashActivity', opt);
        ls.stdout.on( 'data', ( data ) => {
            data && data != '' && console.log( `运行安卓debug环境: ${data}` );
        } );
        
        ls.stderr.on( 'data', ( data ) => {
            data && data != '' && console.log( `运行安卓debug环境: ${data}` );
        } );

        ls.on('error', (err) => {
            console.log( `运行安卓debug环境失败: ${err}`.red );
            resole();
        })

        ls.on( 'close', ( code ) => {
            console.log( '运行安卓debug环境结束'.green );
            resole();
        } );
    });
    
}