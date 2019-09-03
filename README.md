# 百得React-Native bettem-rn-cli

公司做了几个RN应用后，基于最常用的第三方依赖和常用的组件做了一个脚手架，集成了[dva](https://github.com/dvajs/dva)  and [react-navigation](https://github.com/react-community/react-navigation)

## 安装
安装脚手架到全局
```bash
npm install bettem-rn-cli -g
```
验证是否安装成功
```bash
bettem-rn-cli -v # 执行完之后会出现版本号
```

## 使用

用VSCode或者 命令行窗口打开你的工作目录
```bash
bettem-rn-cli init -n yourProjectName # 创建工程
```
然后安装所有依赖
```bash
cd yourProjectName

yarn # 或者 npm install
```
执行项目依赖优化
```bash
npm run optimize
```
运行项目
```
react-native run-ios # or react-native run-android
```

## 目录结构
创建完成后目录中将会出现以下结构：

```
├── __tests__ // RN测试文件 
├── android // android工程目录
├── app // 项目业务代码存放文件
├── ios // ios工程目录
├── .babelrc
├── .buckconfig
├── .flowconfig
├── .gitattributes
├── .gitignore
├── .watchmanconfig
├── app.json
├── bettem.cli.config.js
├── bettem.update.nodemodules.js
├── index.js
├── jsconfig.json
├── metro.config.js
├── package.json
├── README.md
```
如果要运行Android工程，须修改 android/local.properties 中sdk.dir，改为你电脑上的androidSDK路径
## 帮助
运行-help命令来获得帮助
```shell
bettem-rn-cli --help
```

## 构建
运行 bundle命令来构建你的应用
```shell
bettem-rn-cli bundle -t <ios|android 默认all>
```
更多的参数配置可以参考--help来获得。

## 更新
切勿自行更新自己项目中的RN以及一切和RN相关的文件，例如React，简单来说，项目初始化时就已经存在的依赖请勿自行更新，如果需要更新版本来获得一些新的特性，请联系原生开发组以及我来更新脚手架的配置进行更新。
```shell
bettem-rn-cli update
```
update命令会将脚手架中最新的配置更新到项目的package中，然后需要您自行install即可。

## 安卓apk构建及安卓
```shell
bettem-rn-cli build-apk      // 构建apk
bettem-rn-cli install-apk     // 安卓apk到设备
```

## 配置文件
配置文件会在执行`init`命令时自动创建，可后期自行根据需求修改。
以下为默认配置：
```JavaScript
module.exports = {
    iosBundlePath: './ios/bundle', // ios bundle file path
    iosBundleStaticPath: './ios/bundle', // ios bundle static file path
    androidBundlePath: './android/out/assets',// android bundle file path
    androidBundleStaticPath: './android/out/res/',  // android bundle static file path
    iosBundleName: 'bettemrn.jsbundle', // ios bundle file name
    androidBundleName: 'index.bettemrn.android.bundle', // android bundle file name
    backupPath: 'rn_bundle', // backup ios and android bundle files dir path
    androidAPKPath: './android/app/build/outputs/apk/bettemrn.apk' // build android apk output path
}
```