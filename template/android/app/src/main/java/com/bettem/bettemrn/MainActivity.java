package com.bettem.bettemrn;

import android.os.Bundle; // here
import com.facebook.react.ReactActivity;
import com.umeng.analytics.MobclickAgent;
import org.devio.rn.splashscreen.SplashScreen; // 启动页设置添加代码
import com.burnweb.rnpermissions.RNPermissionsPackage; 


public class MainActivity extends ReactActivity {

     /**
      * 设置启动页
      */
      @Override
      protected void onCreate(Bundle savedInstanceState) {
          SplashScreen.show(this); // 展示启动页设置代码
          super.onCreate(savedInstanceState);
          MobclickAgent.setSessionContinueMillis(20000); // 20s
      }
 
      @Override
      protected void onResume() {
          super.onResume();
          MobclickAgent.onResume(this);
      }
 
      @Override
      protected void onPause() {
          super.onPause();
          MobclickAgent.onPause(this);
      }
 
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "BettemRN";
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        RNPermissionsPackage.onRequestPermissionsResult(requestCode, permissions, grantResults); // very important event callback
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
}
