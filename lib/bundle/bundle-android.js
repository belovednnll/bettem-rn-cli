const { spawn } = require( 'child_process' );
const colors = require('colors');

module.exports = async function(jsPath, staticPath, dev, opt = {}) {
    return new Promise((resole, reject) => {
        const ls = spawn('node', ['--max_old_space_size=4096', 'node_modules/react-native/local-cli/cli.js', 'bundle', '--entry-file', 'index.js', '--platform', 'android', '--dev', dev, '--bundle-output', jsPath, '--assets-dest', staticPath], opt);
        console.log( 'building android!'.green );
        ls.stdout.on( 'data', ( data ) => {
            data && data != '' && console.log( `bundle android: ${data}`.green );
        } );
        
        ls.stderr.on( 'data', ( data ) => {
            data && data != '' && console.log( `bundle android: ${data}`.green );
        } );

        ls.on('error', (err) => {
            console.log( `bundle android: ${err}`.red );
            resole();
        })

        ls.on( 'close', ( code ) => {
            console.log( 'android bundle success!'.green );
            resole();
        } );
    });
    
}