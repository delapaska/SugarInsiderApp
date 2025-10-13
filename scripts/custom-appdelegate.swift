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

    // ALWAYS TRY EMBEDDED BUNDLE FIRST TO PREVENT 'No script URL provided'
    print("🔄 [AppDelegate] Trying embedded bundle first...")
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
    print("🚨 [AppDelegate] Creating emergency bundle to prevent crash...")

    // Create emergency bundle IMMEDIATELY in Documents directory (writable!)
    let documentsPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0]
    let emergencyBundlePath = documentsPath + "/main.jsbundle"

    // Check if emergency bundle already exists
    if FileManager.default.fileExists(atPath: emergencyBundlePath) {
      let fileSize = (try? FileManager.default.attributesOfItem(atPath: emergencyBundlePath)[.size] as? Int) ?? 0
      print("✅ [AppDelegate] Emergency bundle already exists: \(emergencyBundlePath) (size: \(fileSize) bytes)")
      return URL(fileURLWithPath: emergencyBundlePath)
    }
    let emergencyBundle = """
var __BUNDLE_START_TIME__=this.nativePerformanceNow?nativePerformanceNow():Date.now(),__DEV__=false,process=this.process||{};
process.env=process.env||{};process.env.NODE_ENV=process.env.NODE_ENV||"production";
var modules=Object.create(null);
function __r(moduleId){
  var module=modules[moduleId];
  if(!module)throw new Error("Unknown module: "+moduleId);
  if(!module.isInitialized){
    module.isInitialized=true;
    module.publicModule={exports:{}};
    module.factory(global,__r,module.publicModule,module.publicModule.exports);
  }
  return module.publicModule.exports;
}
function __d(factory,moduleId){modules[moduleId]={factory:factory,isInitialized:false};}
__d(function(global,require,module,exports){
  var React=require("react");
  var AppRegistry=require("react-native").AppRegistry;
  var App=function(){
    return React.createElement("View",{style:{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"#ffc0cb"}},
      React.createElement("Text",{style:{fontSize:24,fontWeight:"bold",color:"#fff",textAlign:"center"}},
        "Sugar Insider\\n🍭 Emergency Bundle Loaded!"
      )
    );
  };
  AppRegistry.registerComponent("SugarInsiderApp",function(){return App;});
},0,[]);
__r(0);
"""

    do {
      try emergencyBundle.write(toFile: emergencyBundlePath, atomically: true, encoding: .utf8)
      print("✅ [AppDelegate] Emergency bundle created at: \(emergencyBundlePath)")

      let fileSize = (try? FileManager.default.attributesOfItem(atPath: emergencyBundlePath)[.size] as? Int) ?? 0
      print("📦 [AppDelegate] Emergency bundle size: \(fileSize) bytes")

      return URL(fileURLWithPath: emergencyBundlePath)
    } catch {
      print("❌ [AppDelegate] Failed to create emergency bundle: \(error)")

      // ABSOLUTE LAST RESORT - return Documents path
      let documentsPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0]
      let fallbackPath = documentsPath + "/emergency.jsbundle"
      print("🆘 [AppDelegate] Returning fallback path: \(fallbackPath)")
      return URL(fileURLWithPath: fallbackPath)
    }
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