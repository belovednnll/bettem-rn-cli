const colors = require( 'colors' );

module.exports = {
    log: (text) => { console.log(text.green) },
    info: (text) => { console.log(text.blue) },
    warn: (text) => { console.log(text.yellow) },
    error: (text) => { console.log(text.red) },
    inlineLog: (text) => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`${text}`.green);
    }
}