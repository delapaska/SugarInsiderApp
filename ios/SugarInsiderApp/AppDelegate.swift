import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "SugarInsiderApp",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    // In debug, try local first, then fallback to bundle
    if let bundleURL = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index"),
       bundleURL.scheme == "http" || bundleURL.scheme == "https" {
      print("🔧 [AppDelegate] Using Metro bundler URL: \(bundleURL)")
      return bundleURL
    }
    print("⚠️ [AppDelegate] Metro not available, falling back to bundle")
    return getBundleFromMainBundle()
#else
    // In production, ALWAYS use embedded bundle
    print("🚀 [AppDelegate] Production mode - loading embedded bundle")
    return getBundleFromMainBundle()
#endif
  }

  private func getBundleFromMainBundle() -> URL? {
    // Try multiple bundle names and log what we find
    let bundleNames = ["main.jsbundle", "main", "index.ios.bundle", "index.bundle"]

    print("📦 [AppDelegate] Looking for bundle in main bundle...")
    print("📂 [AppDelegate] Bundle path: \(Bundle.main.bundlePath)")

    // List all files in bundle for debugging
    if let bundleContents = try? FileManager.default.contentsOfDirectory(atPath: Bundle.main.bundlePath) {
      print("📋 [AppDelegate] Bundle contents: \(bundleContents.filter { $0.contains("bundle") || $0.contains(".js") })")
    }

    for bundleName in bundleNames {
      if let bundleURL = Bundle.main.url(forResource: bundleName, withExtension: nil) {
        print("✅ [AppDelegate] Found bundle: \(bundleName) at \(bundleURL)")
        return bundleURL
      } else if let bundleURL = Bundle.main.url(forResource: bundleName.replacingOccurrences(of: ".jsbundle", with: ""), withExtension: "jsbundle") {
        print("✅ [AppDelegate] Found bundle: \(bundleName) at \(bundleURL)")
        return bundleURL
      }
    }

    print("❌ [AppDelegate] No bundle found in main bundle!")

    // Last resort - check if file exists directly
    let directPath = Bundle.main.bundlePath + "/main.jsbundle"
    if FileManager.default.fileExists(atPath: directPath) {
      print("✅ [AppDelegate] Found bundle at direct path: \(directPath)")
      return URL(fileURLWithPath: directPath)
    }

    print("💥 [AppDelegate] Bundle completely missing - app will crash")
    return nil
  }
}
