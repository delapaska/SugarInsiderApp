import Foundation
import StoreKit
import React

@available(iOS 15.0, *)
@objc(NativeStoreKit)
class NativeStoreKit: NSObject {

    // Product IDs
    private let productIdentifiers = [
        "com.sugarinsiderapp.product1",  // Monthly
        "com.sugarinsiderapp.product2"   // Yearly
    ]

    private var products: [Product] = []

    // Promise blocks storage - using thread-safe storage
    private var promiseHandlers: [String: (resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock)] = [:]
    private let promiseQueue = DispatchQueue(label: "com.sugarinsiderapp.promises", attributes: .concurrent)

    @objc
    func fetchProducts(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        print("🔍 NativeStoreKit (SK2): Fetching products...")
        print("🔍 NativeStoreKit (SK2): Bundle ID: \(Bundle.main.bundleIdentifier ?? "unknown")")
        print("🔍 NativeStoreKit (SK2): Product IDs to request: \(productIdentifiers)")

        Task {
            do {
                let storeProducts = try await Product.products(for: productIdentifiers)
                self.products = storeProducts.sorted { $0.id < $1.id }

                print("✅ NativeStoreKit (SK2): Products loaded successfully: \(storeProducts.count)")

                let productData = storeProducts.map { product in
                    let formattedPrice = product.displayPrice
                    print("✅ NativeStoreKit (SK2): Product - ID: \(product.id)")
                    print("   - Title: \(product.displayName)")
                    print("   - Description: \(product.description)")
                    print("   - Price: \(formattedPrice)")

                    return [
                        "productId": product.id,
                        "title": product.displayName,
                        "description": product.description,
                        "price": String(describing: product.price),
                        "localizedPrice": formattedPrice,
                        "currency": product.priceFormatStyle.currencyCode ?? "USD"
                    ]
                }

                print("🎯 NativeStoreKit (SK2): Returning \(productData.count) products to JavaScript")
                resolve(productData)

            } catch {
                print("❌ NativeStoreKit (SK2): Failed to load products: \(error)")
                reject("FETCH_FAILED", error.localizedDescription, error)
            }
        }
    }

    @objc
    func purchaseProduct(_ productId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        print("🔍 NativeStoreKit (SK2): Purchasing product: \(productId)")

        guard let product = products.first(where: { $0.id == productId }) else {
            print("❌ NativeStoreKit (SK2): Product not found: \(productId)")
            reject("PRODUCT_NOT_FOUND", "Product not found: \(productId)", nil)
            return
        }

        Task {
            do {
                let result = try await product.purchase()

                switch result {
                case .success(let verification):
                    print("✅ NativeStoreKit (SK2): Purchase successful for: \(productId)")

                    switch verification {
                    case .verified(let transaction):
                        // Transaction is verified
                        await transaction.finish()
                        resolve(["success": true, "productId": productId])

                    case .unverified(let transaction, let error):
                        print("⚠️ NativeStoreKit (SK2): Transaction unverified: \(error)")
                        await transaction.finish()
                        reject("VERIFICATION_FAILED", "Transaction verification failed", error)
                    }

                case .userCancelled:
                    print("❌ NativeStoreKit (SK2): User cancelled purchase: \(productId)")
                    reject("USER_CANCELLED", "User cancelled the purchase", nil)

                case .pending:
                    print("⏳ NativeStoreKit (SK2): Purchase pending: \(productId)")
                    resolve(["success": false, "pending": true, "productId": productId])

                @unknown default:
                    print("❌ NativeStoreKit (SK2): Unknown purchase result: \(productId)")
                    reject("UNKNOWN_RESULT", "Unknown purchase result", nil)
                }

            } catch {
                print("❌ NativeStoreKit (SK2): Purchase failed: \(error)")
                reject("PURCHASE_FAILED", error.localizedDescription, error)
            }
        }
    }

    @objc
    func restorePurchases(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        print("🔍 NativeStoreKit (SK2): Restoring purchases...")

        Task {
            do {
                try await AppStore.sync()
                print("✅ NativeStoreKit (SK2): Purchases restored successfully")
                resolve(["success": true])

            } catch {
                print("❌ NativeStoreKit (SK2): Failed to restore purchases: \(error)")
                reject("RESTORE_FAILED", error.localizedDescription, error)
            }
        }
    }

    @objc
    func testMethod(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        print("🔍 NativeStoreKit (SK2): Test method called!")
        resolve(["status": "working", "version": "StoreKit 2"])
    }

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
}