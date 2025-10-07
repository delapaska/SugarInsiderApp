import * as RNIap from 'react-native-iap';
import { Alert, Platform } from 'react-native';
import { t, Language } from './translations';

export interface PaymentProduct {
  productId: string;
  title: string;
  description: string;
  price: string;
  currency: string;
}

class PaymentService {
  private initialized = false;
  private products: any[] = [];
  private purchaseUpdateSubscription: any = null;
  private purchaseErrorSubscription: any = null;

  private readonly PRODUCT_IDS = {
    monthly: 'com.sugarinsiderapp.product1',
    yearly: 'com.sugarinsiderapp.product2',
  };

  async initialize(): Promise<void> {
    try {
      if (this.initialized) return;

      // Remove development mode check to use real payments

      await RNIap.initConnection();

      if (Platform.OS === 'android') {
        await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      }

      this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener((purchase: any) => {
        this.handlePurchaseUpdate(purchase);
      });

      this.purchaseErrorSubscription = RNIap.purchaseErrorListener((error: any) => {
        this.handlePurchaseError(error);
      });

      await this.loadProducts();

      this.initialized = true;
      console.log('Payment service initialized successfully');
    } catch (error: any) {
      console.error('Failed to initialize payment service:', error);

      if (error.code === 'E_IAP_NOT_AVAILABLE' || error.message?.includes('E_IAP_NOT_AVAILABLE')) {
        console.log('IAP not available, using mock products');
        this.products = this.getMockProducts();
        this.initialized = true;
        return;
      }

      console.log('Fallback to mock products due to error');
      this.products = this.getMockProducts();
      this.initialized = true;
    }
  }

  async loadProducts(): Promise<void> {
    try {
      const productIds = Object.values(this.PRODUCT_IDS);
      console.log('Loading subscriptions with IDs:', productIds);

      // Use getSubscriptions instead of getProducts for subscription products
      const subscriptions = await RNIap.getSubscriptions({skus: productIds});
      this.products = subscriptions;
      console.log('Loaded subscriptions:', subscriptions);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
      console.log('Falling back to mock products due to StoreKit unavailability');
      this.products = this.getMockProducts();
    }
  }

  getProducts(): PaymentProduct[] {
    return this.getPaymentProducts();
  }

  getProduct(productId: string): PaymentProduct | null {
    const product = this.products.find(p => p.productId === productId);
    if (!product) return null;

    return {
      productId: product.productId,
      title: product.title,
      description: product.description,
      price: product.localizedPrice || `$${product.price}`,
      currency: product.currency,
    };
  }

  async purchaseMonthlySubscription(): Promise<boolean> {
    return this.purchaseSubscription(this.PRODUCT_IDS.monthly);
  }

  async purchaseYearlySubscription(): Promise<boolean> {
    return this.purchaseSubscription(this.PRODUCT_IDS.yearly);
  }

  private async purchaseSubscription(productId: string): Promise<boolean> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      console.log('Available products:', this.products);
      console.log('Looking for product:', productId);

      // Ensure products is an array and contains valid objects
      if (!Array.isArray(this.products)) {
        console.log('Products is not an array, falling back to mock');
        throw new Error('Products not loaded properly');
      }

      const product = this.products.find(p => p && typeof p === 'object' && p.productId === productId);
      if (!product) {
        console.log('Product not found in loaded products, available products:', Array.isArray(this.products) ? this.products.map(p => p?.productId) : 'Not an array');
        throw new Error(`Product ${productId} not found`);
      }

      console.log('Initiating purchase for:', productId);

      await RNIap.requestSubscription({sku: productId});

      return true;
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  private handlePurchaseUpdate(purchase: any): void {
    console.log('Purchase updated:', purchase);


    if (purchase.purchaseStateAndroid === 1 || Platform.OS === 'ios') {
      this.onPurchaseSuccess(purchase);
    }
  }

  private handlePurchaseError(error: any): void {
    console.error('Purchase error:', error);

    if (error.code === 'E_USER_CANCELLED') {
      return;
    }

    Alert.alert(
      'Purchase Failed',
      `Failed to complete purchase: ${error.message}`,
      [{ text: 'OK' }]
    );
  }

  private async onPurchaseSuccess(purchase: any): Promise<void> {
    console.log('Purchase successful:', purchase.productId);

    try {
      // Finalize the subscription purchase
      await RNIap.finishTransaction({purchase, isConsumable: false});
      console.log('Subscription finalized successfully');

      this.updatePremiumStatus(purchase.productId);

      Alert.alert(
        'Purchase Successful!',
        'Your premium subscription has been activated.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to finalize subscription:', error);
    }
  }

  private updatePremiumStatus(productId: string): void {
    console.log('Updating premium status for product:', productId);

  }

  async restorePurchases(): Promise<void> {
    try {
      console.log('Restoring purchases...');

      const purchases = await RNIap.getAvailablePurchases();
      console.log('Available purchases:', purchases);

      if (purchases.length > 0) {
        // Process restored purchases
        purchases.forEach(purchase => {
          console.log('Restored purchase:', purchase.productId);
          // Add your logic to handle restored purchases
        });

        Alert.alert(
          'Restore Purchases',
          'Purchases restored successfully.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Restore Purchases',
          'No purchases found to restore.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      Alert.alert(
        'Restore Failed',
        'Failed to restore purchases. Please try again.',
        [{ text: 'OK' }]
      );
    }
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

      await RNIap.endConnection();
      this.initialized = false;
      console.log('Payment service destroyed');
    } catch (error) {
      console.error('Failed to destroy payment service:', error);
    }
  }

  getMockProducts(): any[] {
    return [
      {
        productId: this.PRODUCT_IDS.monthly,
        title: 'Sugar Insider Monthly Premium',
        description: 'Monthly subscription to Sugar Insider Premium features',
        localizedPrice: '$4.99',
        currency: 'USD',
        price: '4.99',
      },
      {
        productId: this.PRODUCT_IDS.yearly,
        title: 'Sugar Insider Yearly Premium',
        description: 'Yearly subscription to Sugar Insider Premium features',
        localizedPrice: '$49.99',
        currency: 'USD',
        price: '49.99',
      },
    ];
  }

  getPaymentProducts(): PaymentProduct[] {
    return this.products.map(product => ({
      productId: product.productId,
      title: product.title,
      description: product.description,
      price: product.localizedPrice || `$${product.price}`,
      currency: product.currency,
    }));
  }

  shouldUseMockPayments(): boolean {
    // Only use mock payments if products failed to load
    return this.products.length === 0;
  }
}

export const paymentService = new PaymentService();