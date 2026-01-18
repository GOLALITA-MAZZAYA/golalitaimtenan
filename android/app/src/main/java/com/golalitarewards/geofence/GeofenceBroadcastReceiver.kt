package com.golalitarewards.geofence

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import com.google.android.gms.location.Geofence
import com.google.android.gms.location.GeofencingEvent

class GeofenceBroadcastReceiver : BroadcastReceiver() {

    companion object {
        private const val TAG = "[GeofenceReceiver]"
        const val ACTION_START_GEOFENCE = "com.golalitarewards.START_GEOFENCE"
    }

    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action
        Log.d(TAG, "onReceive action = $action, intent = $intent")

        when (action) {
            Intent.ACTION_BOOT_COMPLETED -> {
                Log.d(TAG, "ACTION_BOOT_COMPLETED received, starting service")
                startGeofenceService(context)
            }

            ACTION_START_GEOFENCE -> {
                Log.d(TAG, "ACTION_START_GEOFENCE received, starting service")
                startGeofenceService(context)
            }

            else -> {
                handleGeofenceTransition(context, intent)
            }
        }
    }

    private fun startGeofenceService(context: Context) {
        try {
            val serviceIntent = Intent(context, GeofenceLocationService::class.java)

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Log.d(TAG, "Starting foreground service (O+)")
                context.startForegroundService(serviceIntent)
            } else {
                Log.d(TAG, "Starting service (pre-O)")
                context.startService(serviceIntent)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error starting GeofenceLocationService", e)
        }
    }

    private fun handleGeofenceTransition(context: Context, intent: Intent) {
        val geofencingEvent = GeofencingEvent.fromIntent(intent)
        if (geofencingEvent == null) {
            Log.w(TAG, "GeofencingEvent is null, probably not a geofence transition, ignore")
            return
        }

        if (geofencingEvent.hasError()) {
            val errorCode = geofencingEvent.errorCode
            Log.e(TAG, "GeofencingEvent hasError, code = $errorCode")
            return
        }

        val transitionType = geofencingEvent.geofenceTransition
        Log.d(TAG, "Geofence transition type = $transitionType")

        if (transitionType != Geofence.GEOFENCE_TRANSITION_ENTER) {
            Log.d(TAG, "Not ENTER transition, ignoring")
            return
        }

        val triggeringGeofences = geofencingEvent.triggeringGeofences
        if (triggeringGeofences.isNullOrEmpty()) {
            Log.w(TAG, "No triggering geofences")
            return
        }

        val ids = triggeringGeofences.map { it.requestId }
        Log.d(TAG, "Triggered geofences ids = $ids")

        try {
            val serviceIntent = Intent(context, GeofenceLocationService::class.java).apply {
                putStringArrayListExtra("merchant_ids", ArrayList(ids))
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(serviceIntent)
            } else {
                context.startService(serviceIntent)
            }

            Log.d(TAG, "GeofenceLocationService started from geofence event with ids = $ids")
        } catch (e: Exception) {
            Log.e(TAG, "Error starting GeofenceLocationService from geofence event", e)
        }
    }
}
