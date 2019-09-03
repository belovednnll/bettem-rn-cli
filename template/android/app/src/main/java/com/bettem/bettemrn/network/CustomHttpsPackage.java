package com.bettem.bettemrn.network;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.bettem.bettemrn.webview.CustomReactWebViewManager;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import com.bettem.bettemrn.gps.GPSCheckModule;

public class CustomHttpsPackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules=new ArrayList<>();  
        //将我们创建的类添加进原生模块列表中  
        modules.add(new HttpsNetworkingModule(reactContext));  
        modules.add(new GPSCheckModule(reactContext));  
        return modules;  
    }


    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        List<ViewManager> viewManagerList=new ArrayList<>();
        viewManagerList.add(new CustomReactWebViewManager());
        return viewManagerList;
    }
}
