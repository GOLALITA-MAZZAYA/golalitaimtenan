// src/api/geofence.js

const BACKEND_URL = 'https://wallet-backend-golalita.vercel.app/api';

export async function sendGeofencePing({ userId, deviceId, fcmToken, lat, lng }) {
  try {
    const res = await fetch(`${BACKEND_URL}/geofence/ping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        deviceId,
        fcmToken,
        lat,
        lng,
      }),
    });

    if (!res.ok) {
      console.log('[Geofence] ping failed with status', res.status);
      return null;
    }

    const json = await res.json();
    console.log('[Geofence] ping response', json);
    return json;
  } catch (e) {
    console.log('[Geofence] ping error', e);
    return null;
  }
}
