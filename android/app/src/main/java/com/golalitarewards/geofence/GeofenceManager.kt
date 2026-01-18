package com.golalitarewards.geofence

import android.Manifest
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.util.Log
import androidx.core.app.ActivityCompat
import com.google.android.gms.location.Geofence
import com.google.android.gms.location.GeofencingClient
import com.google.android.gms.location.GeofencingRequest
import com.google.android.gms.location.LocationServices

data class MerchantPoint(
    val id: String,
    val lat: Double,
    val lng: Double
)

object GeofenceManager {

    private const val TAG = "[GeofenceManager]"
    private const val GEOFENCE_RADIUS_METERS_DEFAULT = 150f
    private const val GEOFENCE_EXPIRATION = Geofence.NEVER_EXPIRE

    private fun getGeofencingClient(context: Context): GeofencingClient {
        return LocationServices.getGeofencingClient(context.applicationContext)
    }

    private fun getGeofencePendingIntent(context: Context): PendingIntent {
        val intent = Intent(context.applicationContext, GeofenceBroadcastReceiver::class.java)
        return PendingIntent.getBroadcast(
            context.applicationContext,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }

    fun registerGeofences(
        context: Context,
        merchants: List<MerchantPoint>,
        radiusMeters: Float = GEOFENCE_RADIUS_METERS_DEFAULT
    ) {
        if (merchants.isEmpty()) {
            Log.w(TAG, "registerGeofences: merchants list is empty, nothing to register")
            return
        }

        val appContext = context.applicationContext

        val fineGranted = ActivityCompat.checkSelfPermission(
            appContext,
            Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        val coarseGranted = ActivityCompat.checkSelfPermission(
            appContext,
            Manifest.permission.ACCESS_COARSE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        if (!fineGranted && !coarseGranted) {
            Log.e(TAG, "registerGeofences: location permission NOT granted, cannot add geofences")
            return
        }

        val geofencingClient = getGeofencingClient(appContext)

        val geofences = merchants.map { m ->
            Geofence.Builder()
                .setRequestId(m.id)
                .setCircularRegion(
                    m.lat,
                    m.lng,
                    radiusMeters
                )
                .setExpirationDuration(GEOFENCE_EXPIRATION)
                .setTransitionTypes(Geofence.GEOFENCE_TRANSITION_ENTER)
                .build()
        }

        val request = GeofencingRequest.Builder()
            .setInitialTrigger(GeofencingRequest.INITIAL_TRIGGER_ENTER)
            .addGeofences(geofences)
            .build()

        val pendingIntent = getGeofencePendingIntent(appContext)

        geofencingClient
            .removeGeofences(pendingIntent)
            .addOnCompleteListener {
                Log.d(TAG, "Old geofences removed, now adding new ones: count=${geofences.size}")

                geofencingClient
                    .addGeofences(request, pendingIntent)
                    .addOnSuccessListener {
                        Log.d(TAG, "Geofences successfully registered: count=${geofences.size}")
                    }
                    .addOnFailureListener { e ->
                        Log.e(TAG, "Failed to add geofences", e)
                    }
            }
    }
}
