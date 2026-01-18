package com.golalitarewards.geofence

import android.app.*
import android.content.Context
import android.content.Intent
import android.location.Location
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.golalitarewards.R
import com.google.android.gms.location.*
import org.json.JSONObject
import java.io.OutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.util.*

class GeofenceLocationService : Service() {

    companion object {
        private const val TAG = "[GeofenceService]"
        private const val CHANNEL_ID = "geofence_location_channel"

        private const val BACKEND_URL =
            "https://wallet-backend-golalita.vercel.app/api/geofence/ping"

        private const val PREFS_NAME = "geofence_prefs"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_FCM_TOKEN = "fcm_token"
    }

    private lateinit var fusedClient: FusedLocationProviderClient
    private var callback: LocationCallback? = null

    private var userId: Long = 0L
    private var fcmToken: String = ""
    private var deviceId: String = ""

    override fun onCreate() {
        super.onCreate()

        val prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        userId = prefs.getLong(KEY_USER_ID, 0L)
        fcmToken = prefs.getString(KEY_FCM_TOKEN, "") ?: ""

        deviceId = "native-" + UUID.randomUUID().toString()

        fusedClient = LocationServices.getFusedLocationProviderClient(this)

        createNotificationChannel()
        startForegroundServiceNotification()
        startLocationUpdates()

        Log.d(
            TAG,
            "Service created, userId=$userId, tokenStart=${fcmToken.take(10)}, deviceId=$deviceId"
        )
    }

    override fun onDestroy() {
        super.onDestroy()
        callback?.let { fusedClient.removeLocationUpdates(it) }
        Log.d(TAG, "Service destroyed")
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun startForegroundServiceNotification() {
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Location active")
            .setContentText("Tracking geofence events…")
            .setSmallIcon(R.drawable.icon)
            .setOngoing(true)
            .build()

        startForeground(1, notification)
    }

    private fun createNotificationChannel() {
        val channel = NotificationChannel(
            CHANNEL_ID,
            "Geofence Location Service",
            NotificationManager.IMPORTANCE_LOW
        )

        val nm = getSystemService(NotificationManager::class.java)
        nm.createNotificationChannel(channel)
    }

    private fun startLocationUpdates() {
        val request = LocationRequest.Builder(
            Priority.PRIORITY_HIGH_ACCURACY,
            30_000L
        )
            .setMinUpdateDistanceMeters(0f)
            .setWaitForAccurateLocation(false)
            .build()

        callback = object : LocationCallback() {
            override fun onLocationResult(result: LocationResult) {
                val location: Location = result.lastLocation ?: return

                val lat = location.latitude
                val lng = location.longitude

                Log.d(TAG, "Location update: $lat, $lng")
                sendPingToBackend(lat, lng)
            }
        }

        fusedClient.requestLocationUpdates(
            request,
            callback as LocationCallback,
            mainLooper
        )

        Log.d(TAG, "Location updates started (interval 30s)")
    }

    private fun sendPingToBackend(lat: Double, lng: Double) {
        Thread {
            var conn: HttpURLConnection? = null
            try {
                val url = URL(BACKEND_URL)
                conn = url.openConnection() as HttpURLConnection

                conn.requestMethod = "POST"
                conn.doOutput = true
                conn.doInput = true
                conn.connectTimeout = 15000
                conn.readTimeout = 15000
                conn.setRequestProperty("Content-Type", "application/json")

                val json = JSONObject().apply {
                    put("userId", userId)
                    put("deviceId", deviceId)
                    put("fcmToken", fcmToken)
                    put("lat", lat)
                    put("lng", lng)
                }

                val os: OutputStream = conn.outputStream
                os.write(json.toString().toByteArray())
                os.flush()
                os.close()

                Log.d(TAG, "Backend response code: ${conn.responseCode}")
            } catch (e: Exception) {
                Log.e(TAG, "Error sending ping", e)
            } finally {
                conn?.disconnect()
            }
        }.start()
    }
}
