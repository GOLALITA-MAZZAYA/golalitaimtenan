package com.golalitaimtenanrewards.orientation

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule
import com.google.android.gms.location.DeviceOrientationListener
import com.google.android.gms.location.DeviceOrientationRequest
import com.google.android.gms.location.FusedOrientationProviderClient
import com.google.android.gms.location.LocationServices
import java.util.concurrent.Executors

@ReactModule(name = RNFusedOrientationModule.NAME)
class RNFusedOrientationModule(private val ctx: ReactApplicationContext)
  : ReactContextBaseJavaModule(ctx) {

  companion object {
    const val NAME = "RNFusedOrientation"
    private const val EVENT = "FOP_HEADING"
  }

  private val executor = Executors.newSingleThreadExecutor()
  private val client: FusedOrientationProviderClient? = try {
    LocationServices.getFusedOrientationProviderClient(ctx)
  } catch (e: Throwable) {
    null
  }

  private var listener: DeviceOrientationListener? = null

  override fun getName() = NAME

  private fun send(headingDeg: Float, accuracyDeg: Float?) {
    val map = Arguments.createMap()
    map.putDouble("heading", headingDeg.toDouble())
    accuracyDeg?.let { map.putDouble("accuracy", it.toDouble()) }
    ctx
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(EVENT, map)
  }

  @ReactMethod
  fun start(periodMs: Int, promise: Promise) {
    val orientationClient = client
    if (orientationClient == null) {
      promise.reject("FOP_UNAVAILABLE", "Fused orientation provider is unavailable")
      return
    }

    try {
      // periodMs -> микросекунды
      val micros = if (periodMs > 0) periodMs.toLong() * 1000L
                   else DeviceOrientationRequest.OUTPUT_PERIOD_DEFAULT

      val req = DeviceOrientationRequest.Builder(micros).build()

      // Если уже слушаем — сначала снимаем
      stop()

      listener = DeviceOrientationListener { orientation ->
        try {
          // Правильные геттеры у FOP:
          val heading = orientation.headingDegrees              // float
          val err = orientation.headingErrorDegrees             // float (≈ точность)
          send(heading, err)
        } catch (_: Throwable) {
          // Ignore malformed orientation payloads.
        }
      }

      val l = listener ?: run {
        promise.reject("FOP_START", "Listener is null")
        return
      }

      orientationClient.requestOrientationUpdates(req, executor, l)
        .addOnSuccessListener { promise.resolve(null) }
        .addOnFailureListener { e -> promise.reject("FOP_START", e) }
    } catch (e: Throwable) {
      promise.reject("FOP_START", e)
    }
  }

  @ReactMethod
  fun stop() {
    val orientationClient = client ?: return
    try {
      listener?.let { orientationClient.removeOrientationUpdates(it) }
    } catch (_: Throwable) {
      // Ignore cleanup failures.
    } finally {
      listener = null
    }
  }

  // Эти 2 метода нужны для NativeEventEmitter в RN 0.80+
  @ReactMethod
  fun addListener(eventName: String) { /* no-op */ }

  @ReactMethod
  fun removeListeners(count: Int) { /* no-op */ }
}
