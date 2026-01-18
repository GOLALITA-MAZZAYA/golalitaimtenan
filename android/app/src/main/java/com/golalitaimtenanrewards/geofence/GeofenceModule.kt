package com.golalitaimtenanrewards.geofence

import android.content.Intent
import android.content.Context
import android.content.SharedPreferences
import android.util.Log
import com.facebook.react.bridge.*

class GeofenceModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val TAG = "[GeofenceModule]"
        private const val PREFS_NAME = "geofence_prefs"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_FCM_TOKEN = "fcm_token"
    }

    override fun getName(): String = "GeofenceNative"

    private fun prefs(): SharedPreferences =
        reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    @ReactMethod
    fun setAuthData(userId: Double, fcmToken: String, promise: Promise) {
        try {
            val uid = userId.toLong()
            val tokenStart = if (fcmToken.length >= 10) fcmToken.substring(0, 10) else fcmToken

            Log.d(TAG, "setAuthData called, userId=$uid, tokenStart=$tokenStart")

            prefs().edit()
                .putLong(KEY_USER_ID, uid)
                .putString(KEY_FCM_TOKEN, fcmToken)
                .apply()

            // Запускаем foreground-сервис
            Log.d(TAG, "Starting GeofenceLocationService as foreground service")
            val intent = Intent(reactContext, GeofenceLocationService::class.java)
            reactContext.startForegroundService(intent)

            promise.resolve(null)
        } catch (e: Exception) {
            Log.e(TAG, "Error in setAuthData", e)
            promise.reject("GEOFENCE_SET_AUTH_ERROR", e)
        }
    }

    @ReactMethod
    fun registerMerchants(merchantsArray: ReadableArray, radiusMeters: Double, promise: Promise) {
        try {
            val list = mutableListOf<MerchantPoint>()

            for (i in 0 until merchantsArray.size()) {
                val item: ReadableMap? = merchantsArray.getMap(i)
                if (item == null) continue

                val id = if (item.hasKey("id") && !item.isNull("id")) {
                    item.getString("id") ?: ""
                } else {
                    ""
                }

                val lat = if (item.hasKey("lat") && !item.isNull("lat")) {
                    item.getDouble("lat")
                } else {
                    Double.NaN
                }

                val lng = if (item.hasKey("lng") && !item.isNull("lng")) {
                    item.getDouble("lng")
                } else {
                    Double.NaN
                }

                if (id.isNotEmpty() && !lat.isNaN() && !lng.isNaN()) {
                    list.add(MerchantPoint(id, lat, lng))
                } else {
                    Log.w(
                        TAG,
                        "skip merchant: invalid data (id=$id, lat=$lat, lng=$lng)"
                    )
                }
            }

            if (list.isEmpty()) {
                Log.w(TAG, "registerMerchants called with empty/invalid list")
                promise.resolve(null)
                return
            }

            Log.d(TAG, "registerMerchants called, size=${list.size}")
            GeofenceManager.registerGeofences(
                reactContext,
                list,
                radiusMeters.toFloat()
            )

            promise.resolve(null)
        } catch (e: Exception) {
            Log.e(TAG, "Error in registerMerchants", e)
            promise.reject("GEOFENCE_REGISTER_ERROR", e)
        }
    }
}
