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
      // Try with extension
      if let bundleURL = Bundle.main.url(forResource: bundleName.replacingOccurrences(of: ".jsbundle", with: ""), withExtension: "jsbundle") {
        let fileSize = (try? bundleURL.resourceValues(forKeys: [.fileSizeKey]).fileSize) ?? 0
        if fileSize > 10000 { // Must be real bundle, not empty
          print("✅ [AppDelegate] Found bundle with extension: \(bundleName) at \(bundleURL) (size: \(fileSize) bytes)")
          return bundleURL
        }
      }

      // Try without extension
      if let bundleURL = Bundle.main.url(forResource: bundleName, withExtension: nil) {
        let fileSize = (try? bundleURL.resourceValues(forKeys: [.fileSizeKey]).fileSize) ?? 0
        if fileSize > 10000 { // Must be real bundle, not empty
          print("✅ [AppDelegate] Found bundle using Bundle.main.url: \(bundleName) at \(bundleURL) (size: \(fileSize) bytes)")
          return bundleURL
        }
      }
    }

    // Method 2: Direct file path check (fallback for simulator)
    let directPath = Bundle.main.bundlePath + "/main.jsbundle"
    if FileManager.default.fileExists(atPath: directPath) {
      let fileSize = (try? FileManager.default.attributesOfItem(atPath: directPath)[.size] as? Int) ?? 0
      if fileSize > 10000 { // Must be real bundle
        print("✅ [AppDelegate] Found bundle at direct path: \(directPath) (size: \(fileSize) bytes)")
        return URL(fileURLWithPath: directPath)
      } else {
        print("⚠️ [AppDelegate] Bundle at direct path is too small: \(fileSize) bytes")
      }
    }

    // Method 3: Recursive search in app bundle (for .ipa files)
    print("🔍 [AppDelegate] Searching recursively for bundle files...")
    if let foundBundle = findBundleRecursively(in: Bundle.main.bundlePath) {
      print("✅ [AppDelegate] Found bundle recursively: \(foundBundle)")
      return URL(fileURLWithPath: foundBundle)
    }

    // Method 4: Check all possible locations in .app bundle
    let possiblePaths = [
      Bundle.main.bundlePath + "/main.jsbundle",
      Bundle.main.bundlePath + "/assets/main.jsbundle",
      Bundle.main.bundlePath + "/www/main.jsbundle",
      Bundle.main.bundlePath + "/static/main.jsbundle"
    ]

    for path in possiblePaths {
      if FileManager.default.fileExists(atPath: path) {
        let fileSize = (try? FileManager.default.attributesOfItem(atPath: path)[.size] as? Int) ?? 0
        if fileSize > 10000 {
          print("✅ [AppDelegate] Found bundle at alternative path: \(path) (size: \(fileSize) bytes)")
          return URL(fileURLWithPath: path)
        }
      }
    }

    print("❌ [AppDelegate] No bundle found in main bundle!")
    print("🚨 [AppDelegate] Creating emergency bundle to prevent crash...")

    // Create emergency bundle IMMEDIATELY in Documents directory (writable!)
    let documentsPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0]
    let emergencyBundlePath = documentsPath + "/main.jsbundle"

    // Check if emergency bundle already exists and is valid
    if FileManager.default.fileExists(atPath: emergencyBundlePath) {
      if let bundleContent = try? String(contentsOfFile: emergencyBundlePath, encoding: .utf8),
         bundleContent.contains("COMPLETE JAVASCRIPT RUNTIME SETUP") && bundleContent.contains("global.console=console") {
        let fileSize = (try? FileManager.default.attributesOfItem(atPath: emergencyBundlePath)[.size] as? Int) ?? 0
        print("✅ [AppDelegate] Valid emergency bundle already exists: \(emergencyBundlePath) (size: \(fileSize) bytes)")
        return URL(fileURLWithPath: emergencyBundlePath)
      } else {
        print("⚠️ [AppDelegate] Outdated emergency bundle found, recreating...")
        try? FileManager.default.removeItem(atPath: emergencyBundlePath)
      }
    }
    let emergencyBundle = """
// COMPLETE JAVASCRIPT RUNTIME SETUP
var global=this;
var window=global;
var self=global;

// Console mock
var console={
  log:function(){return true;},
  warn:function(){return true;},
  error:function(){return true;},
  info:function(){return true;},
  debug:function(){return true;}
};
global.console=console;

// setTimeout/setInterval mocks
global.setTimeout=function(fn,delay){return 1;};
global.clearTimeout=function(id){};
global.setInterval=function(fn,delay){return 1;};
global.clearInterval=function(id){};

// JSON mock (if not available)
if(!global.JSON){
  global.JSON={
    stringify:function(obj){return String(obj);},
    parse:function(str){return {};}
  };
}

// Performance mock
global.performance={now:function(){return Date.now();}};
global.nativePerformanceNow=global.performance.now;

// React Native specific globals
var __BUNDLE_START_TIME__=Date.now();
var __DEV__=false;
var process=global.process||{env:{NODE_ENV:"production"}};
global.process=process;

// Module system
var modules=Object.create(null);
function __r(moduleId){
  var module=modules[moduleId];
  if(!module)throw new Error("Unknown module: "+moduleId);
  if(!module.isInitialized){
    module.isInitialized=true;
    module.publicModule={exports:{}};
    try{
      module.factory(global,__r,module.publicModule,module.publicModule.exports);
    }catch(e){
      console.error("Module error:",e);
    }
  }
  return module.publicModule.exports;
}
function __d(factory,moduleId,deps){
  modules[moduleId]={factory:factory,isInitialized:false,dependencies:deps||[]};
}

// React module
__d(function(global,require,module,exports){
  module.exports={
    createElement:function(type,props){
      return {type:type||"div",props:props||{},children:[]};
    },
    Component:function(){},
    Fragment:"Fragment"
  };
},"react");

// React Native module
__d(function(global,require,module,exports){
  module.exports={
    AppRegistry:{
      registerComponent:function(name,componentProvider){
        console.log("✅ Emergency Bundle: Registered component "+name);
        return true;
      },
      runApplication:function(){return true;}
    },
    View:"View",
    Text:"Text",
    StyleSheet:{
      create:function(styles){return styles;}
    }
  };
},"react-native");

// Main app
__d(function(global,require,module,exports){
  try{
    var React=require("react");
    var RN=require("react-native");

    console.log("🍭 Emergency Bundle: Creating Sugar Insider app...");

    var App=function(){
      return React.createElement("View",{
        style:{
          flex:1,
          justifyContent:"center",
          alignItems:"center",
          backgroundColor:"#ffc0cb"
        }
      },React.createElement("Text",{
        style:{
          fontSize:24,
          fontWeight:"bold",
          color:"#fff",
          textAlign:"center",
          padding:20
        }
      },"Sugar Insider\\n🍭\\nEmergency Bundle Loaded!\\n\\nApp is running from\\nDocuments directory"));
    };

    RN.AppRegistry.registerComponent("SugarInsiderApp",function(){return App;});
    console.log("✅ Emergency Bundle: App registered successfully!");

  }catch(e){
    console.error("❌ Emergency Bundle Error:",e);
  }
},0);

// Initialize
try{
  __r(0);
  console.log("🚀 Emergency Bundle: Initialization complete!");
}catch(e){
  console.error("💥 Emergency Bundle Fatal:",e);
}
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

    var foundBundles: [(path: String, size: Int)] = []

    while let file = enumerator.nextObject() as? String {
      if file.hasSuffix(".jsbundle") || file.hasSuffix(".bundle") || file.contains("main") && file.contains(".js") {
        let fullPath = directory + "/" + file
        if FileManager.default.fileExists(atPath: fullPath) {
          let fileSize = (try? FileManager.default.attributesOfItem(atPath: fullPath)[.size] as? Int) ?? 0
          if fileSize > 10000 { // Must be real bundle
            foundBundles.append((path: fullPath, size: fileSize))
            print("🔍 [AppDelegate] Found bundle candidate: \(fullPath) (size: \(fileSize) bytes)")
          }
        }
      }
    }

    // Return the largest bundle (most likely the real one)
    if let largestBundle = foundBundles.max(by: { $0.size < $1.size }) {
      print("✅ [AppDelegate] Selected largest bundle: \(largestBundle.path) (size: \(largestBundle.size) bytes)")
      return largestBundle.path
    }

    return nil
  }
}