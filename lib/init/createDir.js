
const readline = require( 'readline' );

function readSyncByRl( tips ) {
    tips = tips || '> ';
    return new Promise( ( resolve ) => {
        let dirName = '';
        const rl = readline.createInterface( {
            input: process.stdin,
            output: process.stdout
        } );
        rl.question( tips, ( answer ) => {
            dirName = answer != '' ? answer.trim() : '';
            rl.close();
            resolve( dirName );
        } );
    } );
}

module.exports = async () => {
    return new Promise((resolve, reject) => {
        readSyncByRl( '输入创建目录名：' ).then( ( dirName ) => {
            if ( dirName == '' ) {
                resolve(null);
            } else {
                resolve(dirName);
            }
        } );
    })
}

