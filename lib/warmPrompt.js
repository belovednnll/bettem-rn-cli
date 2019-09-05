module.exports = () => {
    console.log('');
    console.log(`来自小前端的温馨提示！！！
    请按照以下步骤执行：
        1.已经为您构建好目录结构了。

        2.npm config get registry 查看是否为淘宝源，如果不是执行 npm config set registry=https://registry.npm.taobao.org/ -g

        3.npm i 或 yarn 
        
        4.修改android/local.properties 中sdk.dir，改为你电脑上的androidSDK路径

        5.android运行需要配置 android/app/build.grade 中的第 126行~ 129行

        6.ios运行需要配置，链接地址 https://www.jianshu.com/p/bbfd3bfb6066
    `.green.bold
    );
}