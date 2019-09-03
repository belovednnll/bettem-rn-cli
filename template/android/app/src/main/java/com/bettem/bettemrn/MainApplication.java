package com.bettem.bettemrn;

import android.app.Application;

import com.facebook.react.ReactApplication;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import cn.qiuxiang.react.geolocation.AMapGeolocationPackage;
import com.burnweb.rnpermissions.RNPermissionsPackage;
import com.bolan9999.SpringScrollViewPackage;
import com.theweflex.react.WeChatPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.lenny.modules.upgrade.UpgradeReactPackage;
import com.bettem.bettemrn.network.CustomHttpsPackage;
import com.facebook.soloader.SoLoader;
import java.util.Arrays;
import java.util.List;
import com.umeng.commonsdk.UMConfigure;
import com.bettem.bettemrn.umeng.RNUMConfigure;


public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SplashScreenReactPackage(),
            new AMapGeolocationPackage(),
            new RNPermissionsPackage(),
            new SpringScrollViewPackage(),
            new WeChatPackage(),
          new FastImageViewPackage(),
          new PickerPackage(),
          new VectorIconsPackage(),
          new UpgradeReactPackage(),
          new CustomHttpsPackage()
        );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    RNUMConfigure.init(this, "5d5226163fc195c76a000711", "Umeng", UMConfigure.DEVICE_TYPE_PHONE,"");

  }
}
