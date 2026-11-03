package com.golalitaimtenanrewards
import expo.modules.ReactActivityDelegateWrapper

import android.os.Bundle
import android.view.WindowManager
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  private var secureWindowEnabled = true

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "golalitaimtenanrewards"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      ReactActivityDelegateWrapper(this, BuildConfig.IS_NEW_ARCHITECTURE_ENABLED, DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled))

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    applyScreenshotProtection()
  }

  override fun onResume() {
    super.onResume()
    setSecureWindow(secureWindowEnabled)
  }

  private fun applyScreenshotProtection() {
    setSecureWindow(true)
  }

  fun setSecureWindow(enabled: Boolean) {
    secureWindowEnabled = enabled
    if (enabled) {
      window.setFlags(
        WindowManager.LayoutParams.FLAG_SECURE,
        WindowManager.LayoutParams.FLAG_SECURE,
      )
    } else {
      window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
    }
  }
}
