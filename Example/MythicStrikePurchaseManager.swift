import Foundation
import StoreKit
import SwiftUI

@MainActor
@available(iOS 15.0, *)
class MythicStrikePurchaseManager: ObservableObject {
    static let shared = MythicStrikePurchaseManager()
    
    @Published var products: [Product] = []
    @Published var purchasedLevels: Set<Int> = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    // Идентификаторы продуктов для уровней 3 и 4
    private let productIdentifiers = [
        "com.Bubka.mythicstrike.level3",
        "com.Bubka.mythicstrike.level4"
    ]
    
    private init() {
        Task {
            await loadProducts()
            await loadPurchasedLevels()
        }
    }
    
    // MARK: - Загрузка продуктов
    
    func loadProducts() async {
        isLoading = true
        errorMessage = nil
        
        do {
            let storeProducts = try await Product.products(for: productIdentifiers)
            self.products = storeProducts.sorted { $0.id < $1.id }
            print("✅ Продукты загружены: \(products.map { $0.displayName })")
        } catch {
            errorMessage = "Ошибка загрузки продуктов: \(error.localizedDescription)"
            print("❌ Ошибка загрузки продуктов: \(error)")
        }
        
        isLoading = false
    }
    
    // MARK: - Покупка уровней
    
    func purchaseLevel(_ level: Int) async -> Bool {
        guard let product = products.first(where: { $0.id == getProductId(for: level) }) else {
            errorMessage = "Продукт для уровня \(level) не найден"
            return false
        }
        
        do {
            let result = try await product.purchase()
            
            switch result {
            case .success(let verification):
                let transaction = try checkVerified(verification)
                await transaction.finish()
                
                // Добавляем уровень в купленные
                await MainActor.run {
                    purchasedLevels.insert(level)
                    savePurchasedLevels()
                }
                
                print("✅ Уровень \(level) успешно куплен!")
                return true
                
            case .userCancelled:
                print("❌ Пользователь отменил покупку уровня \(level)")
                return false
                
            case .pending:
                print("⏳ Покупка уровня \(level) ожидает подтверждения")
                return false
                
            @unknown default:
                print("❌ Неизвестный результат покупки уровня \(level)")
                return false
            }
        } catch {
            errorMessage = "Ошибка покупки: \(error.localizedDescription)"
            print("❌ Ошибка покупки уровня \(level): \(error)")
            return false
        }
    }
    
    // MARK: - Восстановление покупок
    
    func restorePurchases() async {
        isLoading = true
        errorMessage = nil
        
        do {
            try await AppStore.sync()
            await loadPurchasedLevels()
            print("✅ Покупки восстановлены")
        } catch {
            errorMessage = "Ошибка восстановления покупок: \(error.localizedDescription)"
            print("❌ Ошибка восстановления покупок: \(error)")
        }
        
        isLoading = false
    }
    
    // MARK: - Проверка статуса покупок
    
    func isLevelPurchased(_ level: Int) -> Bool {
        let result = purchasedLevels.contains(level)
        print("🔍 PurchaseManager: isLevelPurchased(\(level)) = \(result), purchasedLevels = \(purchasedLevels)")
        return result
    }
    
    func canPurchaseLevel(_ level: Int) -> Bool {
        return level >= 3 && level <= 4 && !isLevelPurchased(level)
    }
    
    func getProductId(for level: Int) -> String {
        return "com.Bubka.mythicstrike.level\(level)"
    }
    
    func getProduct(for level: Int) -> Product? {
        return products.first { $0.id == getProductId(for: level) }
    }
    
    // MARK: - Приватные методы
    
    private func loadPurchasedLevels() async {
        var purchased: Set<Int> = []
        
        for await result in Transaction.currentEntitlements {
            do {
                let transaction = try checkVerified(result)
                
                // Проверяем, какой уровень был куплен
                if transaction.productID == getProductId(for: 3) {
                    purchased.insert(3)
                } else if transaction.productID == getProductId(for: 4) {
                    purchased.insert(4)
                }
            } catch {
                print("❌ Ошибка проверки транзакции: \(error)")
            }
        }
        
        purchasedLevels = purchased
        savePurchasedLevels()
    }
    
    private func savePurchasedLevels() {
        UserDefaults.standard.set(Array(purchasedLevels), forKey: "mythicStrikePurchasedLevels")
    }
    
    private func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified:
            throw StoreError.failedVerification
        case .verified(let safe):
            return safe
        }
    }
}

// MARK: - Ошибки

enum StoreError: Error, LocalizedError {
    case failedVerification
    
    var errorDescription: String? {
        switch self {
        case .failedVerification:
            return "Ошибка проверки покупки"
        }
    }
}
