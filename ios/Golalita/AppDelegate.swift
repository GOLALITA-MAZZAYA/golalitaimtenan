import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import GoogleMaps
import Firebase           // FirebaseApp + Messaging
import UserNotifications
import RNBootSplash

@main
class AppDelegate: UIResponder,
  UIApplicationDelegate,
  UNUserNotificationCenterDelegate,
  MessagingDelegate
{
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // React Native bootstrap
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    // Google Maps
    GMSServices.provideAPIKey("AIzaSyAQdSJ757bWixdQLltgkgVNhqTWMfiSP1o")

    // Firebase
    FirebaseApp.configure()
    Messaging.messaging().delegate = self

    // Push: системный центр уведомлений
    let center = UNUserNotificationCenter.current()
    center.delegate = self

    // Запрос прав на пуши
    center.requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
      if let error = error {
        print("[Push] requestAuthorization error: \(error)")
        return
      }
      print("[Push] Notification permission granted: \(granted)")
      if granted {
        DispatchQueue.main.async {
          application.registerForRemoteNotifications()
        }
      }
    }

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "Golalita",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }

  // MARK: - APNs registration

  func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
  ) {
    Messaging.messaging().apnsToken = deviceToken
    print("[Push] didRegisterForRemoteNotificationsWithDeviceToken")
  }

  func application(
    _ application: UIApplication,
    didFailToRegisterForRemoteNotificationsWithError error: Error
  ) {
    print("[Push] didFailToRegisterForRemoteNotificationsWithError: \(error)")
  }

  // Получение data-пушей / silent-пушей
  func application(
    _ application: UIApplication,
    didReceiveRemoteNotification userInfo: [AnyHashable: Any],
    fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void
  ) {
    print("[Push] didReceiveRemoteNotification userInfo: \(userInfo)")
    completionHandler(.newData)
  }

  // MARK: - UNUserNotificationCenterDelegate

  // Пуш пришёл, когда приложение ОТКРЫТО (foreground)
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    completionHandler([.banner, .list, .sound, .badge])
  }

  // Пользователь нажал на пуш
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    didReceive response: UNNotificationResponse,
    withCompletionHandler completionHandler: @escaping () -> Void
  ) {
    let userInfo = response.notification.request.content.userInfo
    print("[Push] didReceive response userInfo: \(userInfo)")
    completionHandler()
  }

  // MARK: - Firebase MessagingDelegate

  func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
    print("[Push] FCM registration token:", fcmToken ?? "nil")
    // можно отправить токен на бек при необходимости
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func customize(_ rootView: RCTRootView) {
    super.customize(rootView)
    RNBootSplash.initWithStoryboard("BootSplash", rootView: rootView)
  }

  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
