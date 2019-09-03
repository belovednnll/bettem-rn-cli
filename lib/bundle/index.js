const fs = require( 'fs' );
const path = require( 'path' );
const bundleIOS = require( './bundle-ios' );
const bundleAndroid = require( './bundle-android' );
const syncFile = require( './syncFile' );
// const zip = require( './zip' );
const upload = require( './upload_bundle_info' );

module.exports = async ( opt ) => {

    const { bundleConfig } = opt;

    const IOS_BUNDLE_NAME = bundleConfig.iosBundleName || 'index.ios.jsbundle';
    const ANDROID_BUNDLE_NAME = bundleConfig.androidBundleName || 'index.android.jsbundle';

    const BACKUP_PATH = bundleConfig.backupPath || 'rn_bundle';

    const CWD = process.cwd();
    
    const RN_VERSION = require( path.join( `${CWD}/package.json` ) ).version;

    const RN_BUNDLE_DIR = path.join( CWD, BACKUP_PATH );
    const RN_BUNDLE_IOS_DIR = path.join( RN_BUNDLE_DIR, '/ios' );
    const RN_BUNDLE_ANDROID_DIR = path.join( RN_BUNDLE_DIR, '/android' );

    const CURR_VERSION_BUNDLE_IOS_DIR = path.join( RN_BUNDLE_IOS_DIR, RN_VERSION );
    const CURR_VERSION_BUNDLE_ANDROID_DIR = path.join( RN_BUNDLE_ANDROID_DIR, RN_VERSION );

    

    const DEFAULT_IOS_JS_PATH = path.join( CWD, bundleConfig.iosBundlePath, IOS_BUNDLE_NAME );
    const DEFAULT_IOS_STATIC_PATH = path.join( CWD, bundleConfig.iosBundleStaticPath );
    const DEFAULT_ANDROID_JS_PATH = path.join( CWD, bundleConfig.androidBundlePath, ANDROID_BUNDLE_NAME );
    const DEFAULT_ANDROID_STATIC_PATH = path.join( CWD, bundleConfig.androidBundleStaticPath );

    // 打包类型
    const BUNDLE_TYPE = opt.type;
    // 是否测试环境
    const DEV = !opt.dev;

    // 创建对应目录
    {
        // 创建目录
        const exists = fs.existsSync( RN_BUNDLE_DIR );
        if ( !exists ) {
            fs.mkdirSync( RN_BUNDLE_DIR );
        }

        // 创建ios目录
        const exists_ios = fs.existsSync( RN_BUNDLE_IOS_DIR );
        if ( !exists_ios ) {
            fs.mkdirSync( RN_BUNDLE_IOS_DIR );
        }

        // 当前版本
        const exists_curr_version_ios = fs.existsSync( CURR_VERSION_BUNDLE_IOS_DIR );
        if ( !exists_curr_version_ios ) {
            fs.mkdirSync( CURR_VERSION_BUNDLE_IOS_DIR );
        }

        // 创建android目录
        const exists_android = fs.existsSync( RN_BUNDLE_ANDROID_DIR );
        if ( !exists_android ) {
            fs.mkdirSync( RN_BUNDLE_ANDROID_DIR );
        }

        // 当前版本
        const exists_curr_version_android = fs.existsSync( CURR_VERSION_BUNDLE_ANDROID_DIR );
        if ( !exists_curr_version_android ) {
            fs.mkdirSync( CURR_VERSION_BUNDLE_ANDROID_DIR );
        }

    }


    // 如果只是测试，那么只会普通打包到ios和android目录下
    if ( !DEV ) {
        switch ( BUNDLE_TYPE ) {
            case 'ios': await bundleIOS( DEFAULT_IOS_JS_PATH, DEFAULT_IOS_STATIC_PATH, 'true', { cwd: CWD } );
                break;
            case 'android': await bundleAndroid( DEFAULT_ANDROID_JS_PATH, DEFAULT_ANDROID_STATIC_PATH, 'true', { cwd: CWD } );
                break;
            default: await bundleIOS( DEFAULT_IOS_JS_PATH, DEFAULT_IOS_STATIC_PATH, 'true', { cwd: CWD } ); await bundleAndroid( DEFAULT_ANDROID_JS_PATH, DEFAULT_ANDROID_STATIC_PATH, 'true', { cwd: CWD } );
        }
    } else {
        const RELEASE_IOS_JS_PATH = path.join( CURR_VERSION_BUNDLE_IOS_DIR, IOS_BUNDLE_NAME );
        const RELEASE_IOS_STATIC_PATH = CURR_VERSION_BUNDLE_IOS_DIR;

        const RELEASE_ANDROID_JS_PATH = path.join( CURR_VERSION_BUNDLE_ANDROID_DIR, ANDROID_BUNDLE_NAME );
        const RELEASE_ANDROID_STATIC_PATH = path.join( CURR_VERSION_BUNDLE_ANDROID_DIR );
        // 构建到专门的目录下，不直接到ios和android的目录
        await bundleIOS( RELEASE_IOS_JS_PATH, RELEASE_IOS_STATIC_PATH, 'false', { cwd: CWD } );
        await bundleAndroid( RELEASE_ANDROID_JS_PATH, RELEASE_ANDROID_STATIC_PATH, 'false', { cwd: CWD } );

        // 需要将新版本的rn包同步到ios和安卓的目录中
        // node太蠢了，要循环文件读取文件内容写入到另外一个地方
        // 直接使用linux命令cp过去
        await syncFile( [
            {
                from: RELEASE_IOS_JS_PATH,
                to: DEFAULT_IOS_JS_PATH,
                type: 'file'
            },
            {
                from: path.join( RELEASE_IOS_STATIC_PATH, '/assets' ),
                to: DEFAULT_IOS_STATIC_PATH,
                type: 'dir'
            },
            {
                from: RELEASE_ANDROID_JS_PATH,
                to: DEFAULT_ANDROID_JS_PATH,
                type: 'file'
            },
            {
                from: path.join(RELEASE_ANDROID_STATIC_PATH, './drawable-hdpi'),
                to: DEFAULT_ANDROID_STATIC_PATH,
                type: 'dir'
            },
            {
                from: path.join(RELEASE_ANDROID_STATIC_PATH, './drawable-mdpi'),
                to: DEFAULT_ANDROID_STATIC_PATH,
                type: 'dir'
            },
            {
                from: path.join(RELEASE_ANDROID_STATIC_PATH, './drawable-ldpi'),
                to: DEFAULT_ANDROID_STATIC_PATH,
                type: 'dir'
            }
        ] );

        // console.log( '===============' );
        // console.log( '开始压缩文件'.green );
        // const ZIP_IOS_PATH = await zip( RN_VERSION, { type: 'ios', zipPath: CURR_VERSION_BUNDLE_IOS_DIR } );
        // const ZIP_ANDROID_PATH = await zip( RN_VERSION, { type: 'android', zipPath: CURR_VERSION_BUNDLE_ANDROID_DIR } );
        // console.log( '压缩文件完成'.green );

        // if (IS_POST_CDN) {
        //     let IOS_CDN_PATH = null;
        //     let ANDROID_CDN_PATH = null;

        //     if (ZIP_IOS_PATH) {
        //         IOS_CDN_PATH = await postcdn('ios', path.join(ZIP_IOS_PATH, '../'));
        //     }

        //     if (ZIP_ANDROID_PATH) {
        //         ANDROID_CDN_PATH = await postcdn('android', path.join(ZIP_ANDROID_PATH, '../'));
        //     }

        //     console.log(`ios cdn路径：${IOS_CDN_PATH}`.blue);
        //     console.log(`android cdn路径：${ANDROID_CDN_PATH}`.blue);
        //     // 提交到后端
        //     await upload('ios', RN_VERSION, IOS_CDN_PATH);
        //     await upload('android', RN_VERSION, ANDROID_CDN_PATH);
        // }

    }
}





