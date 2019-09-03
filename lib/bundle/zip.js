const archiver = require( 'archiver' );
const path = require( 'path' );
const fs = require( 'fs' );

const ZIP_DIR = path.join( process.cwd(), '/.zip' );
const exists_zip_dir = fs.existsSync( ZIP_DIR );
if ( !exists_zip_dir ) {
    fs.mkdirSync( ZIP_DIR );
}

const SIZES = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
function bytesToSize(bytes) {
    if (bytes === 0) {
        return '0 Byte';
    }
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + SIZES[i];
}

async function zip ( version, zipPathConfig ) {
    return new Promise( ( resolve, reject ) => {

        const { type, zipPath } = zipPathConfig;
        const ZIP_TO_PATH = path.join( ZIP_DIR, type );

        console.log(`---------------->${type}<---------------`)
        console.log( `压缩目录: ${zipPath}`.green );
        console.log( `压缩到: ${ZIP_TO_PATH}`.green );

        const exists_zip_type_path = fs.existsSync( ZIP_TO_PATH );
        if ( !exists_zip_type_path ) {
            fs.mkdirSync( ZIP_TO_PATH );
        }

        const archive = archiver( 'zip', {
            zlib: { level: 9 } // Sets the compression level.
        } );

        const ZIP_PATH = path.join( ZIP_TO_PATH + `/rn-${version}.zip` );
        const ZIP_OUTPUT_STREAM = fs.createWriteStream( ZIP_PATH );

        ZIP_OUTPUT_STREAM.on( 'close', function () {
            process.stdout.write("\n");
            console.log( `压缩完成, 压缩后大少：${bytesToSize(archive.pointer())}`.green );
            resolve(ZIP_PATH);
        } );

        ZIP_OUTPUT_STREAM.on( 'end', function () {
            console.log( 'Data has been drained'.green );
            resolve();
        } );

        archive.on( 'progress', function (data) {
            const {entries, fs} = data;
            const {total, processed} = entries;
            const {totalBytes, processedBytes} = fs;
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write(`共${total}文件/${totalBytes}字节，已处理${processed}文件/${processedBytes}字节`.green);
        } );

        archive.on( 'error', function ( err ) {
            throw err;
        } );

        archive.pipe( ZIP_OUTPUT_STREAM );
        archive.glob( '**/*', {
            cwd: zipPath,
            dot: false,
            matchBase: true
        } );
        archive.finalize();
        
    } );
}

module.exports = async ( version, config ) => {
    return await zip( version, config );
}