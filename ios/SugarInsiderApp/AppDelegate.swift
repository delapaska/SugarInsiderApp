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
    print("📱 [AppDelegate] Determining bundle URL...")

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
    let bundleURL = getBundleFromMainBundle()

    if bundleURL == nil {
      // Last resort - try to create emergency fallback
      print("🚨 [AppDelegate] CRITICAL: No bundle found! App may crash.")
      print("🚨 [AppDelegate] This indicates bundle was not properly included in the app.")
    }

    return bundleURL
  }

  private func getBundleFromMainBundle() -> URL? {
    print("📦 [AppDelegate] Looking for bundle in main bundle...")
    print("📂 [AppDelegate] Bundle path: \(Bundle.main.bundlePath)")

    // List all files in bundle for debugging
    if let bundleContents = try? FileManager.default.contentsOfDirectory(atPath: Bundle.main.bundlePath) {
      let relevantFiles = bundleContents.filter { $0.contains("bundle") || $0.contains(".js") }
      print("📋 [AppDelegate] Relevant files in bundle: \(relevantFiles)")
    }

    // Method 1: Try Bundle.main.url methods first (most reliable for .ipa)
    let bundleNames = ["main.jsbundle", "main", "index.ios.bundle", "index.bundle"]
    for bundleName in bundleNames {
      if let bundleURL = Bundle.main.url(forResource: bundleName.replacingOccurrences(of: ".jsbundle", with: ""), withExtension: "jsbundle") {
        print("✅ [AppDelegate] Found bundle with extension: \(bundleName) at \(bundleURL)")
        return bundleURL
      }

      if let bundleURL = Bundle.main.url(forResource: bundleName, withExtension: nil) {
        print("✅ [AppDelegate] Found bundle using Bundle.main.url: \(bundleName) at \(bundleURL)")
        return bundleURL
      }
    }

    // Method 2: Direct file path check (fallback for simulator)
    let directPath = Bundle.main.bundlePath + "/main.jsbundle"
    if FileManager.default.fileExists(atPath: directPath) {
      let fileSize = (try? FileManager.default.attributesOfItem(atPath: directPath)[.size] as? Int) ?? 0
      print("✅ [AppDelegate] Found bundle at direct path: \(directPath) (size: \(fileSize) bytes)")
      return URL(fileURLWithPath: directPath)
    }

    // Method 3: Recursive search in app bundle (for .ipa files)
    print("🔍 [AppDelegate] Searching recursively for bundle files...")
    if let foundBundle = findBundleRecursively(in: Bundle.main.bundlePath) {
      print("✅ [AppDelegate] Found bundle recursively: \(foundBundle)")
      return URL(fileURLWithPath: foundBundle)
    }

    print("❌ [AppDelegate] No bundle found in main bundle!")
    print("💥 [AppDelegate] This will cause 'No script URL provided' error")
    return nil
  }

  private func findBundleRecursively(in directory: String) -> String? {
    guard let enumerator = FileManager.default.enumerator(atPath: directory) else {
      return nil
    }

    while let file = enumerator.nextObject() as? String {
      if file.hasSuffix("main.jsbundle") || file.hasSuffix("index.bundle") {
        let fullPath = directory + "/" + file
        if FileManager.default.fileExists(atPath: fullPath) {
          let fileSize = (try? FileManager.default.attributesOfItem(atPath: fullPath)[.size] as? Int) ?? 0
          print("🔍 [AppDelegate] Found bundle recursively: \(fullPath) (size: \(fileSize) bytes)")
          return fullPath
        }
      }
    }
    return nil
  }
}
