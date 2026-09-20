package com.golalitaimtenanrewards

import android.os.Bundle
import android.view.MotionEvent
import android.view.WindowManager
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  private var secureWindowEnabled = true
  private var tapjackingProtectionEnabled = true

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
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    applyScreenshotProtection()
    applyTapjackingProtection(tapjackingProtectionEnabled)
  }

  override fun onResume() {
    super.onResume()
    setSecureWindow(secureWindowEnabled)
    applyTapjackingProtection(tapjackingProtectionEnabled)
  }

  override fun dispatchTouchEvent(event: MotionEvent): Boolean {
    // Camera SurfaceView on AR marks overlay touches as partially obscured.
    // Dropping them breaks merchant card presses — skip while protection is off.
    if (tapjackingProtectionEnabled && isTouchObscured(event)) {
      return false
    }

    return super.dispatchTouchEvent(event)
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

  fun setTapjackingProtection(enabled: Boolean) {
    tapjackingProtectionEnabled = enabled
    applyTapjackingProtection(enabled)
  }

  private fun applyTapjackingProtection(enabled: Boolean) {
    window.decorView.rootView.filterTouchesWhenObscured = enabled
  }

  private fun isTouchObscured(event: MotionEvent): Boolean {
    return event.flags and MotionEvent.FLAG_WINDOW_IS_OBSCURED != 0 ||
        event.flags and MotionEvent.FLAG_WINDOW_IS_PARTIALLY_OBSCURED != 0
  }
}
