// ios/Golalita/GeofenceNative.swift

import Foundation
import CoreLocation

@objc(GeofenceNative)
class GeofenceNative: NSObject, CLLocationManagerDelegate {

  private let locationManager = CLLocationManager()
  private let prefs = UserDefaults.standard

  // URL бэкенда для геофенс-пинга
  private let BACKEND_URL = URL(string: "https://wallet-backend-golalita.vercel.app/api/geofence/ping")!

  private let KEY_USER_ID = "geofence_user_id"
  private let KEY_FCM_TOKEN = "geofence_fcm_token"
  private let KEY_DEVICE_ID = "geofence_device_id"

  // троттлинг нативных пингов (30 сек)
  private var lastPingAt: Date?

  private var userId: Int64 {
    get { Int64(prefs.integer(forKey: KEY_USER_ID)) }
    set { prefs.set(Int(newValue), forKey: KEY_USER_ID) }
  }

  private var fcmToken: String {
    get { prefs.string(forKey: KEY_FCM_TOKEN) ?? "" }
    set { prefs.set(newValue, forKey: KEY_FCM_TOKEN) }
  }

  private var deviceId: String {
    get {
      if let v = prefs.string(forKey: KEY_DEVICE_ID), !v.isEmpty {
        return v
      }
      let newId = UUID().uuidString
      prefs.set(newId, forKey: KEY_DEVICE_ID)
      return newId
    }
    set { prefs.set(newValue, forKey: KEY_DEVICE_ID) }
  }

  override init() {
    super.init()
    NSLog("[GeofenceNative][iOS] init")

    locationManager.delegate = self
    locationManager.desiredAccuracy = kCLLocationAccuracyBest
    locationManager.distanceFilter = kCLDistanceFilterNone
    locationManager.pausesLocationUpdatesAutomatically = false
    locationManager.allowsBackgroundLocationUpdates = true

    // Always
    locationManager.requestAlwaysAuthorization()
  }

  // MARK: - React Native module

  @objc
  static func moduleName() -> String! {
    return "GeofenceNative"
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }

  /// JS: GeofenceNative.setAuthData(userId, fcmToken)
  @objc
  func setAuthData(_ userId: NSNumber, token fcmToken: String) {
    NSLog("[GeofenceNative][iOS] setAuthData userId=%@ fcmTokenPrefix=%@...",
          userId,
          String(fcmToken.prefix(10)))

    self.userId = userId.int64Value
    self.fcmToken = fcmToken

    _ = self.deviceId // гарантируем, что девайс id создан

    // стартуем обновление локации
    DispatchQueue.main.async {
      self.locationManager.startUpdatingLocation()
      self.locationManager.startMonitoringSignificantLocationChanges()
    }
  }

  /// JS: GeofenceNative.registerMerchants(points, radiusMeters)
  /// Сейчас только логируем вызов. Если нужно — можно добавить CLCircularRegion.
  @objc
  func registerMerchants(_ points: NSArray, radiusMeters: NSNumber) {
    NSLog("[GeofenceNative][iOS] registerMerchants count=%ld radius=%@",
          points.count,
          radiusMeters)
    // TODO: при необходимости – создать регионы CLCircularRegion
  }

  // MARK: - CLLocationManagerDelegate

  func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
    NSLog("[GeofenceNative][iOS] auth status changed = %d", status.rawValue)
    if status == .authorizedAlways || status == .authorizedWhenInUse {
      manager.startUpdatingLocation()
      manager.startMonitoringSignificantLocationChanges()
    }
  }

  func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
    NSLog("[GeofenceNative][iOS] didFailWithError = %@", error.localizedDescription)
  }

  func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
    guard let loc = locations.last else { return }

    let now = Date()
    if let last = lastPingAt, now.timeIntervalSince(last) < 30 {
      // троттлинг 30 сек
      return
    }
    lastPingAt = now

    NSLog("[GeofenceNative][iOS] didUpdateLocations lat=%f lng=%f",
          loc.coordinate.latitude,
          loc.coordinate.longitude)

    sendPing(location: loc, source: "ios-locationUpdate")
  }

  func locationManager(_ manager: CLLocationManager, didEnterRegion region: CLRegion) {
    guard let clRegion = region as? CLCircularRegion else { return }
    let center = clRegion.center
    let loc = CLLocation(latitude: center.latitude, longitude: center.longitude)

    NSLog("[GeofenceNative][iOS] didEnterRegion id=%@ lat=%f lng=%f",
          clRegion.identifier,
          center.latitude,
          center.longitude)

    sendPing(location: loc, source: "ios-regionEnter")
  }

  // MARK: - Ping

  private func sendPing(location: CLLocation, source: String) {
    let lat = location.coordinate.latitude
    let lng = location.coordinate.longitude

    let uid = self.userId
    let token = self.fcmToken
    let did = self.deviceId

    var body: [String: Any] = [
      "userId": uid,
      "deviceId": did,
      "lat": lat,
      "lng": lng,
      "platform": "ios",
      "debug": [
        "source": source,
        "ts": Date().timeIntervalSince1970,
        "nativeSide": "ios"
      ]
    ]

    if !token.isEmpty {
      body["fcmToken"] = token
    }

    NSLog("[GeofenceNative][iOS] sendPing userId=%lld deviceId=%@ lat=%f lng=%f source=%@",
          uid, did, lat, lng, source)

    var request = URLRequest(url: BACKEND_URL)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")

    do {
      request.httpBody = try JSONSerialization.data(withJSONObject: body, options: [])
    } catch {
      NSLog("[GeofenceNative][iOS] JSON error = %@", error.localizedDescription)
      return
    }

    let task = URLSession.shared.dataTask(with: request) { _, response, error in
      if let error = error {
        NSLog("[GeofenceNative][iOS] ping error = %@", error.localizedDescription)
        return
      }
      if let http = response as? HTTPURLResponse {
        NSLog("[GeofenceNative][iOS] ping status = %ld", http.statusCode)
      }
    }

    task.resume()
  }
}
