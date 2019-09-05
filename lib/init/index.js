const path = require( 'path' );
const fs = require('fs');
const copy = require('./copyFile');
const { log, info, error } = require('../log');
const warmPrompt = require('../warmPrompt');
const projectDependencies = require('../config/projectDependencies');
const projectScript = require('../config/projectScript');
const createDir = require('./createDir');
const packageConfig = require('../../template/package.json');

module.exports = async (projectName, isCover) => {
    const CURR_PATH = process.cwd();

    // // const dirName = await createDir();
    // const dirName = projectName;
    // if ( !dirName ) {
    //     error('目录名称不能为空！');
    //     return null;
    // }

    const lowerProjectName = projectName.toLowerCase()

    const PROJECT_PATH = path.join(CURR_PATH, projectName)

    const TEMPLATE_PATH = path.join( __dirname, '../../template' ); // 拷贝模板
    const cli_config_PATH = path.join( PROJECT_PATH, './bettem.cli.config.js' );
    const update_nodemodules_PATH = path.join( PROJECT_PATH, './bettem.update.nodemodules.js' );
    const cwd_package = path.join(PROJECT_PATH, './package.json');
    const cwd_app = path.join(PROJECT_PATH, './app.json');
    let currCWDPackageContent = null;

    if (fs.existsSync(cwd_package)) {
        let content = fs.readFileSync(cwd_package, 'utf8');
        currCWDPackageContent = JSON.parse(content);
    } else {
        currCWDPackageContent = packageConfig;
    }

    await copy( TEMPLATE_PATH, PROJECT_PATH, isCover );

    // 写入project name
    currCWDPackageContent.name = projectName;
    currCWDPackageContent.dependencies = Object.assign(currCWDPackageContent.dependencies, projectDependencies.dependencies);
    currCWDPackageContent.devDependencies = Object.assign(currCWDPackageContent.devDependencies, projectDependencies.devDependencies);
    currCWDPackageContent.devBundleConfig = Object.assign(currCWDPackageContent.devBundleConfig, projectDependencies.devBundleConfig);
    currCWDPackageContent.scripts = Object.assign(currCWDPackageContent.scripts, projectScript);;
    fs.writeFileSync(cwd_package, JSON.stringify(currCWDPackageContent, null,"\t"));

    // 写入app.json
    if (fs.existsSync(cwd_app)) {
        let content = fs.readFileSync(cwd_app, 'utf8');
        let newContent = JSON.parse(content);
        newContent.name = projectName;
        newContent.displayName = projectName;
        fs.writeFileSync(cwd_app, JSON.stringify(newContent,null,"\t"));
    }

    // 写入 bettem.cli.config.js
    if (fs.existsSync(cli_config_PATH)) {
        let content = fs.readFileSync(cli_config_PATH, 'utf8');
        let newContent = content.replace(/bettemrn/g,lowerProjectName);
        fs.writeFileSync(cli_config_PATH, newContent);
    }

    // 写入 bettem.update.nodemodules.js
    if (fs.existsSync(update_nodemodules_PATH)) {
        let content = fs.readFileSync(update_nodemodules_PATH, 'utf8');
        let newContent = content.replace(/bettemrn/g,lowerProjectName);
        fs.writeFileSync(update_nodemodules_PATH, newContent);
    }

    // 写入 app/utils/storage.js
    const app_storage_PATH = path.join( PROJECT_PATH, './app/utils/storage.js');
    if (fs.existsSync(app_storage_PATH)) {
        let content = fs.readFileSync(app_storage_PATH, 'utf8');
        let newContent = content.replace(/bettemrn/g,lowerProjectName);
        fs.writeFileSync(app_storage_PATH, newContent);
    }

    // 写入 app/index.js
    const appIndexPath = path.join(PROJECT_PATH, './app/index.js');
    if (fs.existsSync(appIndexPath)) {
        let content = fs.readFileSync(appIndexPath, 'utf8');
        let newContent = content.replace(/BettemRN/g,projectName);
        fs.writeFileSync(appIndexPath, newContent);
    }

    // 更新java目录名称
    const javaContentPath = './android/app/src/main/java/com/bettem/bettemrn'
    const androidJavaPath = path.join(PROJECT_PATH,javaContentPath)
    const androidJavaPathNew = path.join(PROJECT_PATH,javaContentPath.replace(/bettemrn/g,lowerProjectName));
    fs.renameSync(androidJavaPath,androidJavaPathNew) ;

    // 写入Android 工程
    updateJavaContent (PROJECT_PATH,projectName,lowerProjectName)

    // 修改androidManifest
    const androidManifestPath = path.join(PROJECT_PATH,'./android/app/src/main/AndroidManifest.xml')
    if (fs.existsSync(androidManifestPath)) {
        let androidManifestContent = fs.readFileSync(androidManifestPath, 'utf-8');
        androidManifestContent = androidManifestContent.replace(/bettemrn/g,lowerProjectName);
        fs.writeFileSync(androidManifestPath, androidManifestContent, 'utf8');
    }

    // 修改android/app/build.gradle
    const androidBuildPath = path.join(PROJECT_PATH,'./android/app/build.gradle')
    if (fs.existsSync(androidBuildPath)) {
        let androidBuildContent = fs.readFileSync(androidBuildPath, 'utf-8');
        androidBuildContent = androidBuildContent.replace(/.bettemrn/g,'.'+lowerProjectName);
        fs.writeFileSync(androidBuildPath, androidBuildContent, 'utf8');
    }
    // 修改android/settings.gradle
    const androidSettingPath = path.join(PROJECT_PATH,'./android/settings.gradle')
    if (fs.existsSync(androidSettingPath)) {
        let androidSettingsContent = fs.readFileSync(androidSettingPath, 'utf-8');
        androidSettingsContent = androidSettingsContent.replace(/BettemRN/g,projectName);
        fs.writeFileSync(androidSettingPath, androidSettingsContent, 'utf8');
    }

    // 修改res下的资源名称
    const androidResPath = path.join(PROJECT_PATH,'./android/app/src/main/res');
    if (fs.existsSync(androidResPath)) {
        updateResContent(androidResPath,lowerProjectName)
    }

    // 写入ios
    const iosProjectPbxprojPath = path.join(PROJECT_PATH,'./ios/BettemRN.xcodeproj/project.pbxproj')
    const iosTVOSxcschemePath = path.join(PROJECT_PATH,'./ios/BettemRN.xcodeproj/xcshareddata/xcschemes/BettemRN-tvOS.xcscheme')
    const iosXcschemePath = path.join(PROJECT_PATH,'./ios/BettemRN.xcodeproj/xcshareddata/xcschemes/BettemRN.xcscheme')
    const iosAppDelegatePath = path.join(PROJECT_PATH,'./ios/BettemRN/AppDelegate.m')
    const iosBettemRNTestsPath = path.join(PROJECT_PATH,'./ios/BettemRNTests/BettemRNTests.m')

    const iosReplaceContentPath = [iosProjectPbxprojPath,iosTVOSxcschemePath,iosXcschemePath,iosAppDelegatePath,iosBettemRNTestsPath]
    iosReplaceContentPath.forEach(iosProjectPath=>{
        if (fs.existsSync(iosProjectPath)) {
            let content = fs.readFileSync(iosProjectPath, 'utf-8');
            if(iosProjectPbxprojPath===iosProjectPath)
                content = content.replace(/.bettemrn/g,'.'+lowerProjectName);
            content = content.replace(/BettemRN/g,projectName);
            fs.writeFileSync(iosProjectPath, content, 'utf8');
        }
    })

    const iosProjectPath1 = './ios/BettemRN';
    const iosProjectPath2 = './ios/BettemRN-tvOS';
    const iosProjectPath3 = './ios/BettemRN.xcodeproj/xcshareddata/xcschemes/BettemRN.xcscheme';
    const iosProjectPath4 = './ios/BettemRN.xcodeproj/xcshareddata/xcschemes/BettemRN-tvOS.xcscheme';
    const iosProjectPath5 = './ios/BettemRNTests/BettemRNTests.m';
    const iosProjectPath6 = './ios/BettemRN-tvOSTests';

    const iosProjectPath7 ='./ios/BettemRN.xcodeproj';
    const iosProjectPath8 = './ios/BettemRNTests';

    const iosProjectPathArr =[iosProjectPath1,iosProjectPath2,iosProjectPath3,iosProjectPath4,iosProjectPath5,iosProjectPath6]

    iosProjectPathArr.forEach(iosProjectPath=>{
        let currentProjectPath = path.join(PROJECT_PATH,iosProjectPath)
        if (fs.existsSync(currentProjectPath)) {
            let newPath 
            if(iosProjectPath.indexOf('BettemRN.xcscheme')>0){
                newPath = iosProjectPath.replace(/BettemRN.xcscheme/g,projectName+'.xcscheme')
            }else  if(iosProjectPath.indexOf('BettemRN-tvOS.xcscheme')>0){
                newPath = iosProjectPath.replace(/BettemRN-tvOS.xcscheme/g,projectName+'-tvOS.xcscheme')
            }else  if(iosProjectPath.indexOf('BettemRNTests.m')>0){
                newPath = iosProjectPath.replace(/BettemRNTests.m/g,projectName+'Tests.m')
            }else
                newPath = iosProjectPath.replace(/BettemRN/g,projectName)
            newPath = path.join(PROJECT_PATH,newPath)
            fs.renameSync(currentProjectPath,newPath)
        }
    })

    fs.renameSync( path.join(PROJECT_PATH,iosProjectPath7),path.join(PROJECT_PATH,iosProjectPath7.replace(/BettemRN/g,projectName)))
    fs.renameSync(path.join(PROJECT_PATH,iosProjectPath8), path.join(PROJECT_PATH,iosProjectPath8.replace(/BettemRN/g,projectName)))
    warmPrompt();
}

function updateJavaContent (PROJECT_PATH,projectName,lowerProjectName){
    const androidJavaPath = path.join(PROJECT_PATH,'./android/app/src/main/java/com/bettem/'+lowerProjectName)
    fs.readdir(androidJavaPath, function(err, files) {
        // files是名称数组
        files.forEach(function(filename) {
            //运用正则表达式替换oldPath中不想要的部分
        //获取当前文件的绝对路径
            var filedir = path.join(androidJavaPath,filename);
            fs.stat(filedir,function(eror,stats){
                if(eror){
                    console.warn(filedir,'获取java文件失败');
                }else{
                    var isFile = stats.isFile();//是文件
                    var isDir = stats.isDirectory();//是文件夹
                    if(isFile){
                        let fileContent = fs.readFileSync(filedir, 'utf-8');
                        if(filename==="MainActivity.java"){
                            fileContent = fileContent.replace(/"BettemRN"/g,'"'+projectName+'"');
                        }
                        fileContent = fileContent.replace(/.bettemrn/g,'.'+lowerProjectName);
                        fs.writeFileSync(filedir, fileContent, 'utf8');
                    }
                    if(isDir){
                        updateJavaContentSub(filedir,lowerProjectName);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                    }
                }
            }) 
        })
    })    
}

function updateJavaContentSub (androidJavaPath,lowerProjectName){
    fs.readdir(androidJavaPath, function(err, files) {
        // files是名称数组
        files.forEach(function(filename) {
            //运用正则表达式替换oldPath中不想要的部分
        //获取当前文件的绝对路径
            var filedir = path.join(androidJavaPath,filename);
            fs.stat(filedir,function(eror,stats){
                if(eror){
                    console.warn('获取文件stats失败');
                }else{
                    let fileContent = fs.readFileSync(filedir, 'utf-8');
                    fileContent = fileContent.replace(/.bettemrn/g,'.'+lowerProjectName);
                    fs.writeFileSync(filedir, fileContent, 'utf8');
                }
            }) 
        })
    })     
}

function updateResContent (androidResPath,lowerProjectName){
    fs.readdir(androidResPath, function(err, files) {
        // files是名称数组
        files.forEach(function(filename) {
            //运用正则表达式替换oldPath中不想要的部分
        //获取当前文件的绝对路径
            const filedir = path.join(androidResPath,filename);
            fs.stat(filedir,function(eror,stats){
                if(eror){
                    console.warn('获取文件stats失败');
                }else{
                    if(stats.isDirectory()){ //是文件夹
                        fs.readdir(filedir, function(err, files) {
                            // files是名称数组
                            files.forEach(function(subfilename) {
                                const oldFile = path.join(filedir,subfilename);

                                //运用正则表达式替换oldPath中不想要的部分
                                //获取当前文件的绝对路径
                                if(subfilename==='bettemrn_anim.xml'||subfilename==='bettemrn_launch_screen.xml'){
                                    let fileContent = fs.readFileSync(oldFile, 'utf-8');
                                    fileContent = fileContent.replace(/bettemrn/g,lowerProjectName);
                                    fs.writeFileSync(oldFile, fileContent, 'utf8');
                                }
                                if(subfilename.indexOf('bettemrn')>-1){
                                    const newFile = path.join(filedir,subfilename.replace('bettemrn',lowerProjectName))
                                    fs.renameSync(oldFile,newFile) 
                                }
                            })
                        })     
                    }
                }
            }) 
        })     
    })    
}
