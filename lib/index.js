const fs = require( 'fs' );
const path = require( 'path' );
const program = require( 'commander' );
const colors = require( 'colors' );
const pkg = require( '../package.json' );
const init = require( './init' );
const bundle = require( './bundle' );
const update = require('./update');
const warmPrompt = require( './warmPrompt' );
const buildAPK = require('./apkAction/buildAPK');
const installAPK = require('./apkAction/installAPK');
const runAndroid = require('./apkAction/runAndroid');

const CWD = process.cwd();

program
    .version( pkg.version, '-v, --version' );

// 初始化项目
program
    .command( 'init' )
    .alias( 'i' )
    .description( '初始化项目' )
    .option( '-n --name <String>', '初始化项目' )
    .option( '-c --cover', '是否强制覆盖文件' )
    .action( async ( opt ) => {
        if ( opt.name && opt.name != '' && typeof opt.name == 'string' ) {
            await init( opt.name, opt.cover );
        } else {
            program.help();
        }
    } )

// 构建bundle文件
program
    .command( 'bundle' )
    .alias( 'b' )
    .description( '构建bundle文件' )
    .option( '-t --type <ios|android>', '构建bundle文件', 'all' )
    .option( '-d, --dev', '是否测试环境' )
    .option( '-c, --config <String>', '配置文件路径' )
    .action( ( opt ) => {
        const CONFIG_PATH = opt.config ? path.join( `${CWD}/${opt.config}` ) : path.join( `${CWD}/bettem.cli.config.js` );
        if ( fs.existsSync( CONFIG_PATH ) ) {
            const config = require( CONFIG_PATH );
            bundle( { type: opt.type, dev: opt.dev, bundleConfig: config } );
        } else {
            throw '缺少配置文件，在根目录下默认需要一个bettem.cli.config.js，或者通过-c <path>指定配置文件目录';
        }
    } )

// 更新依赖
program
    .command( 'update' )
    .alias( 'u' )
    .description( '更新依赖文件' )
    .action( ( opt ) => {
        update();
    } )

// 运行安卓
program
    .command( 'run-android' )
    .description( '运行安卓debug' )
    .action( async () => {
        await runAndroid({cwd: CWD});
    } )

// 打包apk
program
    .command( 'build-apk' )
    .description( '构建安卓apk' )
    .action( async () => {
        await buildAPK({cwd: CWD});
    } )

// 安卓apk
program
    .command( 'install-apk' )
    .description( '安装安卓apk' )
    .option( '-c, --config <String>', '配置文件路径' )
    .action( async (opt) => {
        const CONFIG_PATH = opt.config ? path.join( `${CWD}/${opt.config}` ) : path.join( `${CWD}/bettem.cli.config.js` );
        if ( fs.existsSync( CONFIG_PATH ) ) {
            const config = require( CONFIG_PATH );
            await installAPK( { ...config },{cwd: CWD} );
        } else {
            throw '缺少配置文件，在根目录下默认需要一个bettem.cli.config.js，或者通过-c <path>指定配置文件目录';
        }
    } )

program.on( '--help', function () {
    console.log( '' )
    console.log( 'Examples:' );
    console.log( '  $ bettem-rn-cli init -n 你的项目名' );
    console.log( '  $ bettem-rn-cli bundle -t <ios|android> [-c <config path>] [-d]  --->  构建项目，不传-t默认ios和android一起构建' );
    console.log( '  $ bettem-rn-cli update  --->  更新依赖，devDependencies和dependencies依赖包的版本' );
    console.log( '  $ bettem-rn-cli bundle-apk  --->  构建安卓apk' );
    console.log( '  $ bettem-rn-cli install-apk [-c <config path>] --->  安装apk到设备' );
    console.log( '' );
    warmPrompt();

} );


program.parse( process.argv );
