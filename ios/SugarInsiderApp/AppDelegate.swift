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
    // Always try Metro first in development, then fallback to embedded bundle
    // This works for both Debug and Release builds

#if DEBUG
    // In debug, try Metro first
    if let bundleURL = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index"),
       bundleURL.scheme == "http" || bundleURL.scheme == "https" {
      print("🔧 [AppDelegate] Using Metro bundler URL: \(bundleURL)")
      return bundleURL
    }
    print("⚠️ [AppDelegate] Metro not available in Debug, falling back to embedded bundle")
#else
    print("🚀 [AppDelegate] Release mode - using embedded bundle")
#endif

    // Fallback to embedded bundle for both Debug and Release
    return getBundleFromMainBundle()
  }

  private func getBundleFromMainBundle() -> URL? {
    print("📦 [AppDelegate] Looking for bundle in main bundle...")
    print("📂 [AppDelegate] Bundle path: \(Bundle.main.bundlePath)")

    // List all files in bundle for debugging
    if let bundleContents = try? FileManager.default.contentsOfDirectory(atPath: Bundle.main.bundlePath) {
      let relevantFiles = bundleContents.filter { $0.contains("bundle") || $0.contains(".js") }
      print("📋 [AppDelegate] Relevant files in bundle: \(relevantFiles)")
    }

    // Method 1: Direct file path check (most reliable)
    let directPath = Bundle.main.bundlePath + "/main.jsbundle"
    if FileManager.default.fileExists(atPath: directPath) {
      let fileSize = (try? FileManager.default.attributesOfItem(atPath: directPath)[.size] as? Int) ?? 0
      print("✅ [AppDelegate] Found bundle at direct path: \(directPath) (size: \(fileSize) bytes)")
      return URL(fileURLWithPath: directPath)
    }

    // Method 2: Try Bundle.main.url methods
    let bundleNames = ["main.jsbundle", "main", "index.ios.bundle", "index.bundle"]
    for bundleName in bundleNames {
      if let bundleURL = Bundle.main.url(forResource: bundleName, withExtension: nil) {
        print("✅ [AppDelegate] Found bundle using Bundle.main.url: \(bundleName) at \(bundleURL)")
        return bundleURL
      }

      if let bundleURL = Bundle.main.url(forResource: bundleName.replacingOccurrences(of: ".jsbundle", with: ""), withExtension: "jsbundle") {
        print("✅ [AppDelegate] Found bundle with extension: \(bundleName) at \(bundleURL)")
        return bundleURL
      }
    }

    print("❌ [AppDelegate] No bundle found in main bundle!")
    print("💥 [AppDelegate] This will cause 'No script URL provided' error")
    return nil
  }
}
