/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.bettem.bettemrn.gps;

import android.app.Activity;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;

import android.content.Context;
import android.content.Intent;
import android.location.LocationManager;
import android.provider.Settings;




/**
 * Implements the XMLHttpRequest JavaScript interface.
 */

public final class GPSCheckModule extends ReactContextBaseJavaModule  {

  protected static final String NAME = "GPSCheckModule";
  private int GPS_REQUEST_CODE = 1000;

  /**
   * @param context the ReactContext of the application
   */
  public GPSCheckModule(final ReactApplicationContext context) {
    super(context);
  }

  @Override
  public String getName() {
    return NAME;
  }

  private boolean returnCheckGPSIsOpen() {
      boolean isOpen;
      LocationManager locationManager = (LocationManager) getCurrentActivity().getSystemService(Context.LOCATION_SERVICE);
      isOpen = locationManager.isProviderEnabled(android.location.LocationManager.GPS_PROVIDER);
      return isOpen;
  }

  @ReactMethod
  public void checkGPSIsOpen(Callback resultCallback) {
      resultCallback.invoke(returnCheckGPSIsOpen());
  }

  @ReactMethod
  public void goToGpsSetting(){
      //跳转GPS设置界面
      Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
      getCurrentActivity().startActivityForResult(intent,GPS_REQUEST_CODE);
  }

  @ReactMethod
  public void exit() {
      Activity activity = getCurrentActivity();
      if (activity != null) {
          activity.finish();
      }
      System.exit(0);
  }
//   @Override
//   public void onActivityResult(Activity activity, final int requestCode, final int resultCode, final Intent data) {
//       if(requestCode==GPS_REQUEST_CODE){
//           if(!returnCheckGPSIsOpen()){
//               goToGpsSetting();
//           }
//       }
//   }

//   @Override
//   public void onNewIntent(Intent intent){

//   }
}
