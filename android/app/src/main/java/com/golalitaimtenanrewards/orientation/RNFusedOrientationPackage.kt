package com.golalitaimtenanrewards.orientation

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class RNFusedOrientationPackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext) =
    listOf(RNFusedOrientationModule(reactContext))

  override fun createViewManagers(reactContext: ReactApplicationContext):
    List<ViewManager<*, *>> = emptyList()
}
