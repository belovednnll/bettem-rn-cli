module.exports = () => {
    console.log('');
    console.log(`来自小前端的温馨提示！！！
    请按照以下步骤执行：
        1.已经为您构建好目录结构了。
        2.联系原生团队为您开通zzc_ios、zzc_android、zzc_video_android和zzc_android_libs的相关权限。
        3.开通好权限后可以运行npm run init。时间会比较长，建议可以先去吃个饭，init过程中会为你拉取相关原生仓库的的代码，以及React Native开发的相关依赖。
        4.如第三步没有任何问题的情况下，那么可以使用xcode或者Android Studio进行原生项目的环境依赖。
        5.如果第四步遇到问题可以与原生开发的同事联系，获得帮助！
    更新方式：
        1.如果在开发React Native业务当中遇到了默认依赖包更新的问题，请与原生开发同事联系，需要统一React Native的运行环境统一。
        2.确认必须更新后，可以使用cli提供的update命令对React Native版本进行升级。
        3.切勿自己手动升级，否则将有可能带来严重的后果！！！
    `.green.bold
    );
}