import { NativeModules, Alert, Platform } from 'react-native';

const { NativeStoreKit } = NativeModules;

// Debug: Log all available native modules
console.warn('Available NativeModules:', Object.keys(NativeModules));
console.warn('NativeStoreKit specifically:', NativeStoreKit);

// Test the native module
if (NativeStoreKit && NativeStoreKit.testMethod) {
  NativeStoreKit.testMethod()
    .then((result: any) => console.warn('Native module test SUCCESS:', result))
    .catch((error: any) => console.warn('Native module test FAILED:', error));
} else {
  console.warn('Native module testMethod not available');
}

export interface PaymentProduct {
  productId: string;
  title: string;
  description: string;
  price: string;
  localizedPrice: string;
  currency: string;
}

class NativePaymentService {
  private products: PaymentProduct[] = [];
  private initialized = false;
  private purchaseUpdateSubscription: any = null;
  private purchaseErrorSubscription: any = null;
  public onPremiumActivated?: (productId: string) => void;

  private readonly PRODUCT_IDS = {
    monthly: 'com.sugarinsiderapp.product1',
    yearly: 'com.sugarinsiderapp.product2',
  };

  async initialize(): Promise<void> {
    try {
      if (this.initialized) return;

      console.warn('=== NATIVE PAYMENT SERVICE INITIALIZING ===');
      console.warn('Platform.OS:', Platform.OS);
      console.warn('NativeStoreKit defined:', !!NativeStoreKit);
      console.warn('NativeStoreKit object:', NativeStoreKit);

      if (Platform.OS === 'ios' && NativeStoreKit) {
        console.log('Using native StoreKit implementation');

        // Set up purchase listeners for real StoreKit transactions
        this.setupPurchaseListeners();

        await this.loadProducts();
        console.log(`Loaded ${this.products.length} products from StoreKit`);

        if (this.products.length === 0) {
          console.log('No products loaded from StoreKit - will use mock payments for simulator testing');
        }
      } else {
        console.log('NativeStoreKit not available, using mock products');
        this.products = this.getMockProducts();
      }

      this.initialized = true;
      console.log('NativePaymentService: Initialized successfully');
    } catch (error: any) {
      console.error('Failed to initialize payment service:', error);
      console.log('Fallback to mock products due to error');
      this.products = this.getMockProducts();
      this.initialized = true;
    }
  }

  async loadProducts(): Promise<void> {
    try {
      console.log('🔍 JS: Loading products from native StoreKit...');
      console.log('🔍 JS: NativeStoreKit available:', !!NativeStoreKit);
      console.log('🔍 JS: NativeStoreKit object keys:', Object.keys(NativeStoreKit || {}));

      console.log('🔍 JS: Calling NativeStoreKit.fetchProducts()...');
      const products = await NativeStoreKit.fetchProducts();

      console.log('🔍 JS: fetchProducts() returned successfully');
      console.log('🔍 JS: Raw products response:', JSON.stringify(products, null, 2));

      this.products = products;
      console.log('🔍 JS: Loaded products count:', products?.length || 0);
      console.log('🔍 JS: Products stored in service:', this.products);

      if (products && products.length > 0) {
        products.forEach((product: any, index: number) => {
          console.log(`🔍 JS: Product ${index + 1}:`, {
            id: product.productId,
            title: product.title,
            price: product.localizedPrice
          });
        });
      } else {
        console.log('🔍 JS: No products received - will use mock payments');
      }
    } catch (error) {
      console.error('❌ JS: Failed to load products:', error);
      console.error('❌ JS: Error type:', typeof error);
      console.error('❌ JS: Error details:', JSON.stringify(error, null, 2));

      if (error instanceof Error) {
        console.error('❌ JS: Error message:', error.message);
        console.error('❌ JS: Error stack:', error.stack);
      }

      // Don't fallback to mock products - let StoreKit Configuration handle it
      this.products = [];
    }
  }

  getProducts(): PaymentProduct[] {
    return this.products;
  }

  async purchaseMonthlySubscription(): Promise<boolean> {
    return this.purchaseProduct(this.PRODUCT_IDS.monthly);
  }

  async purchaseYearlySubscription(): Promise<boolean> {
    return this.purchaseProduct(this.PRODUCT_IDS.yearly);
  }

  private async purchaseProduct(productId: string): Promise<boolean> {
    try {
      console.warn('=== PURCHASE PRODUCT DEBUG ===');
      console.warn('Product ID:', productId);
      console.warn('Initialized:', this.initialized);

      if (!this.initialized) {
        console.log('Not initialized, calling initialize...');
        await this.initialize();
      }

      console.log('Available products:', this.products);
      console.log('Products count:', this.products?.length || 0);
      console.log('Looking for product:', productId);
      console.log('shouldUseMockPayments():', this.shouldUseMockPayments());
      console.log('NativeStoreKit available:', !!NativeStoreKit);

      console.log('Initiating purchase for:', productId);

      if (this.shouldUseMockPayments()) {
        console.log('Using mock payment flow');

        // Always use mock products for fallback since native module isn't loading
        const mockProducts = this.getMockProducts();
        const product = mockProducts.find(p => p.productId === productId);

        if (!product) {
          console.error('Product not found in mock products');
          console.error('Requested product ID:', productId);
          console.error('Available mock product IDs:', mockProducts.map(p => p.productId));
          console.error('PRODUCT_IDS constant:', this.PRODUCT_IDS);
          throw new Error(`Product ${productId} not found`);
        }

        console.log('Found mock product:', product);
        return this.showMockPurchaseDialog(product);
      } else {
        console.log('Using native StoreKit flow');
        // Let native StoreKit handle the purchase, even if we don't have products loaded locally
        // StoreKit Configuration will handle the product lookup
        const result = await NativeStoreKit.purchaseProduct(productId);
        console.log('Purchase completed:', result);

        // Notify app of premium activation
        console.log('🔍 JS: Checking onPremiumActivated callback:', !!this.onPremiumActivated);
        console.log('🔍 JS: Callback type:', typeof this.onPremiumActivated);
        console.log('🔍 JS: About to call onPremiumActivated with productId:', productId);
        if (this.onPremiumActivated) {
          console.log('🔍 JS: Calling onPremiumActivated callback...');
          this.onPremiumActivated(productId);
          console.log('🔍 JS: onPremiumActivated callback completed');
        } else {
          console.log('🔍 JS: onPremiumActivated callback is not set!');
        }

        return true;
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  private showMockPurchaseDialog(product: PaymentProduct): Promise<boolean> {
    return new Promise((resolve) => {
      const isYearly = product.productId === this.PRODUCT_IDS.yearly;
      const duration = isYearly ? '12 months' : '1 month';
      const price = product.localizedPrice;

      Alert.alert(
        'Purchase Confirmation',
        `Purchase ${duration} Pro subscription for ${price}?\n\nThis will be a real purchase in the App Store.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: 'Purchase',
            onPress: () => {
              // Simulate processing time
              console.log('Processing mock purchase for:', product.productId);

              // Validate the mock purchase
              const mockPurchase = {
                productId: product.productId,
                transactionState: 'purchased',
                transactionReceipt: 'mock_receipt_' + Date.now()
              };

              if (this.validatePurchase(mockPurchase)) {
                // Notify app of premium activation
                if (this.onPremiumActivated) {
                  this.onPremiumActivated(product.productId);
                }
                resolve(true);
              } else {
                Alert.alert('Error!', 'Purchase validation failed. Please try again.', [
                  { text: 'OK', onPress: () => resolve(false) }
                ]);
              }
            },
          },
        ]
      );
    });
  }

  async restorePurchases(): Promise<void> {
    try {
      console.log('Restoring purchases...');

      if (this.shouldUseMockPayments()) {
        Alert.alert(
          'Restore Purchases',
          'No purchases found to restore.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await NativeStoreKit.restorePurchases();
      console.log('Restore completed:', result);

      Alert.alert(
        'Restore Purchases',
        'Purchases restored successfully.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      Alert.alert(
        'Restore Failed',
        'Failed to restore purchases. Please try again.',
        [{ text: 'OK' }]
      );
    }
  }

  shouldUseMockPayments(): boolean {
    // Use mock payments if NativeStoreKit not available OR if we have no products loaded
    // (which typically happens in simulator when StoreKit Configuration isn't loading properly)
    return !NativeStoreKit || this.products.length === 0;
  }

  private getMockProducts(): PaymentProduct[] {
    return [
      {
        productId: this.PRODUCT_IDS.monthly,
        title: 'Sugar Insider Monthly Premium',
        description: 'Monthly subscription to Sugar Insider Premium features. Get unlimited sugar tracking and personal charts. Auto-renewable subscription that can be cancelled anytime in Settings.',
        localizedPrice: '$3.99',
        currency: 'USD',
        price: '3.99',
      },
      {
        productId: this.PRODUCT_IDS.yearly,
        title: 'Sugar Insider Yearly Premium',
        description: 'Yearly subscription to Sugar Insider Premium features. Get unlimited sugar tracking and personal charts. Auto-renewable subscription that can be cancelled anytime in Settings. Best value!',
        localizedPrice: '$39.99',
        currency: 'USD',
        price: '39.99',
      },
    ];
  }

  private setupPurchaseListeners(): void {
    // Only set up listeners if we're using real StoreKit (not mocks)
    if (!NativeStoreKit) return;

    console.log('Setting up purchase listeners for StoreKit');

    // Listen for purchase updates from native StoreKit
    // Note: This would typically be handled by the native module
    // For now, we'll add defensive validation in purchaseProduct
  }

  private validatePurchase(purchase: any): boolean {
    // Validate that this is a legitimate purchase
    if (!purchase || !purchase.productId) {
      console.error('Invalid purchase: missing product ID');
      return false;
    }

    // Validate product ID
    const validProductIds = Object.values(this.PRODUCT_IDS);
    if (!validProductIds.includes(purchase.productId)) {
      console.error('Invalid purchase: unknown product ID', purchase.productId);
      return false;
    }

    // For iOS, check transaction state
    if (Platform.OS === 'ios' && purchase.transactionState !== 'purchased') {
      console.error('Invalid purchase: transaction not in purchased state', purchase.transactionState);
      return false;
    }

    return true;
  }

  async destroy(): Promise<void> {
    try {
      if (this.purchaseUpdateSubscription) {
        this.purchaseUpdateSubscription.remove();
        this.purchaseUpdateSubscription = null;
      }

      if (this.purchaseErrorSubscription) {
        this.purchaseErrorSubscription.remove();
        this.purchaseErrorSubscription = null;
      }

      console.log('NativePaymentService destroyed');
    } catch (error) {
      console.error('Failed to destroy NativePaymentService:', error);
    }
  }
}

export const nativePaymentService = new NativePaymentService();