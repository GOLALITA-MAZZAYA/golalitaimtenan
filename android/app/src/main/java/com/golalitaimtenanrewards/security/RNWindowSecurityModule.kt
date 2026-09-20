package com.golalitaimtenanrewards.security

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule
import com.golalitaimtenanrewards.MainActivity

@ReactModule(name = RNWindowSecurityModule.NAME)
class RNWindowSecurityModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  companion object {
    const val NAME = "RNWindowSecurity"
  }

  override fun getName() = NAME

  @ReactMethod
  fun setSecureWindow(enabled: Boolean) {
    val activity = reactApplicationContext.currentActivity as? MainActivity
    activity?.runOnUiThread {
      activity.setSecureWindow(enabled)
    }
  }

  @ReactMethod
  fun setTapjackingProtection(enabled: Boolean) {
    val activity = reactApplicationContext.currentActivity as? MainActivity
    activity?.runOnUiThread {
      activity.setTapjackingProtection(enabled)
    }
  }
}
