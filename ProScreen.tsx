import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { t, Language } from './translations';
import { nativePaymentService as paymentService, PaymentProduct } from './NativePaymentService';

const { width, height } = Dimensions.get('window');

interface ProScreenProps {
  onBack: () => void;
  language?: Language;
  onPurchaseSuccess?: () => void;
}

const ProScreen: React.FC<ProScreenProps> = ({ onBack, language = 'English', onPurchaseSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<PaymentProduct[]>([]);
  const [initialized, setInitialized] = useState(false);

  // iPad detection logic
  const screenData = Dimensions.get('screen');
  const screenWidth = screenData.width;
  const screenHeight = screenData.height;
  const screenMinDimension = Math.min(screenWidth, screenHeight);

  const aspectRatio = Math.max(width, height) / Math.min(width, height);
  const isPossibleTablet = Platform.OS === 'ios' && (
    screenMinDimension >= 768 ||
    (width === 375 && height === 667 && aspectRatio < 2.2)
  );

  const isTablet = isPossibleTablet;
  const isLandscape = width > height;

  useEffect(() => {
    initializePayments();
  }, []);

  const initializePayments = async () => {
    try {
      setLoading(true);
      await paymentService.initialize();

      setProducts(paymentService.getProducts());

      setInitialized(true);
    } catch (error) {
      console.error('Failed to initialize payments:', error);
      setProducts(paymentService.getProducts());
      setInitialized(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase12Months = async () => {
    if (paymentService.shouldUseMockPayments()) {
      Alert.alert(
        'Purchase Confirmation',
        'Purchase 12 Months Pro subscription for $49.99?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Purchase',
            onPress: () => {
              if (onPurchaseSuccess) onPurchaseSuccess();
              Alert.alert('Success!', 'Pro subscription activated for 12 months!', [
                { text: 'OK', onPress: onBack }
              ]);
            },
          },
        ]
      );
    } else {
      try {
        setLoading(true);
        await paymentService.purchaseYearlySubscription();
        if (onPurchaseSuccess) onPurchaseSuccess();
      } catch (error) {
        console.error('Purchase failed:', error);
        Alert.alert('Purchase Failed', 'Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePurchase1Month = async () => {
    if (paymentService.shouldUseMockPayments()) {
      Alert.alert(
        'Purchase Confirmation',
        'Purchase 1 Month Pro subscription for $4.99?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Purchase',
            onPress: () => {
              if (onPurchaseSuccess) onPurchaseSuccess();
              Alert.alert('Success!', 'Pro subscription activated for 1 month!', [
                { text: 'OK', onPress: onBack }
              ]);
            },
          },
        ]
      );
    } else {
      try {
        setLoading(true);
        await paymentService.purchaseMonthlySubscription();
        if (onPurchaseSuccess) onPurchaseSuccess();
      } catch (error) {
        console.error('Purchase failed:', error);
        Alert.alert('Purchase Failed', 'Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setLoading(true);
      await paymentService.restorePurchases();
    } catch (error) {
      console.error('Restore failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getYearlyPrice = () => {
    const yearlyProduct = products.find(p => p.productId.includes('yearly'));
    return yearlyProduct ? yearlyProduct.price : '$49.99';
  };

  const getMonthlyPrice = () => {
    const monthlyProduct = products.find(p => p.productId.includes('monthly'));
    return monthlyProduct ? monthlyProduct.price : '$4.99';
  };

  // Create adaptive styles function
  const getStyles = () => {
    return StyleSheet.create({
      ...baseStyles,
      proText: {
        position: 'absolute',
        width: (1100 / 1242) * width,
        height: isTablet ? (300 / 1242) * width : (400 / 1242) * width,
        top: isTablet ? (200 / 1242) * width : (260 / 1242) * width,
        left: (70 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (50 / 1242) * width : (70 / 1242) * width,
        lineHeight: isTablet ? (50 * 0.99 / 1242) * width : (70 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textAlign: 'center',
        color: '#303539',
        zIndex: 10,
      },
      unlimitedText: {
        position: 'absolute',
        width: (900 / 1242) * width,
        height: (120 / 1242) * width,
        top: isTablet ? (380 / 1242) * width : (478 / 1242) * width,
        left: (150 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (50 / 1242) * width : (64 / 1242) * width,
        lineHeight: isTablet ? (50 * 0.99 / 1242) * width : (64 * 0.99 / 1242) * width,
        letterSpacing: 0,
        color: '#303539',
        zIndex: 10,
      },
      personalChartsText: {
        position: 'absolute',
        width: (900 / 1242) * width,
        height: (120 / 1242) * width,
        top: isTablet ? (460 / 1242) * width : (580 / 1242) * width,
        left: (150 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (50 / 1242) * width : (64 / 1242) * width,
        lineHeight: isTablet ? (50 * 0.99 / 1242) * width : (64 * 0.99 / 1242) * width,
        letterSpacing: 0,
        color: '#303539',
        zIndex: 10,
      },
      recommendationsText: {
        position: 'absolute',
        width: (900 / 1242) * width,
        height: (120 / 1242) * width,
        top: isTablet ? (540 / 1242) * width : (682 / 1242) * width,
        left: (150 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (50 / 1242) * width : (64 / 1242) * width,
        lineHeight: isTablet ? (50 * 0.99 / 1242) * width : (64 * 0.99 / 1242) * width,
        letterSpacing: 0,
        color: '#303539',
        zIndex: 10,
      },
      photoImage: {
        position: 'absolute',
        width: isTablet ? (700 / 1242) * width : (869 / 1242) * width,
        height: isTablet ? (700 / 1242) * width : (869 / 1242) * width,
        top: isTablet ? (650 / 1242) * width : (744 / 1242) * width,
        left: isTablet ? (270 / 1242) * width : (172 / 1242) * width,
        opacity: 1,
        zIndex: 10,
      },
      smallRectangle: {
        position: 'absolute',
        width: (248 / 1242) * width,
        height: (86 / 1242) * width,
        top: isTablet ? (1420 / 1242) * width : (1640 / 1242) * width,
        left: (863 / 1242) * width,
        backgroundColor: '#FF1C95',
        zIndex: 10,
      },
      popularText: {
        position: 'absolute',
        width: (320 / 1242) * width,
        height: (92 / 1242) * width,
        top: isTablet ? (1445 / 1242) * width : (1665 / 1242) * width,
        left: (822 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: (40 / 1242) * width,
        lineHeight: (40 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textAlign: 'center',
        textTransform: 'capitalize',
        color: '#FFFFFF',
        zIndex: 11,
      },
      rectangleButton: {
        position: 'absolute',
        width: (1140 / 1242) * width,
        height: isTablet ? (180 / 1242) * width : (219 / 1242) * width,
        top: isTablet ? (1500 / 1242) * width : (1719 / 1242) * width,
        left: (54 / 1242) * width,
        borderRadius: (75 / 1242) * width,
        borderWidth: (12 / 1242) * width,
        backgroundColor: '#FFFFFF',
        borderColor: '#FF1C95',
        shadowColor: '#B4ADB1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.69,
        shadowRadius: (8.8 / 1242) * width,
        elevation: 8,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: (74 / 1242) * width,
      },
      secondRectangleButton: {
        position: 'absolute',
        width: (1140 / 1242) * width,
        height: isTablet ? (180 / 1242) * width : (219 / 1242) * width,
        top: isTablet ? (1720 / 1242) * width : (1978 / 1242) * width,
        left: (54 / 1242) * width,
        borderRadius: (75 / 1242) * width,
        borderWidth: (12 / 1242) * width,
        backgroundColor: '#FFFFFF',
        borderColor: '#FF1C95',
        shadowColor: '#B4ADB1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.69,
        shadowRadius: (8.8 / 1242) * width,
        elevation: 8,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: (74 / 1242) * width,
      },
      unlimitedTextRussian: {
        top: isTablet ? (430 / 1242) * width : (550 / 1242) * width,
      },
      personalChartsTextRussian: {
        top: isTablet ? (510 / 1242) * width : (652 / 1242) * width,
      },
      recommendationsTextRussian: {
        top: isTablet ? (590 / 1242) * width : (754 / 1242) * width,
      },
      unlimitedTextFrench: {
        top: isTablet ? (410 / 1242) * width : (530 / 1242) * width,
      },
      personalChartsTextFrench: {
        top: isTablet ? (490 / 1242) * width : (632 / 1242) * width,
      },
      recommendationsTextFrench: {
        top: isTablet ? (570 / 1242) * width : (734 / 1242) * width,
      },
    });
  };

  const styles = getStyles();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5A8D4" />

      <Image
        source={require('./assets/Pro/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <Text style={styles.proText}>
        {t('pro_main_text', language)}
      </Text>

      <Text style={[
        styles.unlimitedText,
        language === 'Russian' && styles.unlimitedTextRussian,
        language === 'French' && styles.unlimitedTextFrench
      ]}>
        {t('unlimited_accounting', language)}
      </Text>

      <Text style={[
        styles.personalChartsText,
        language === 'Russian' && styles.personalChartsTextRussian,
        language === 'French' && styles.personalChartsTextFrench
      ]}>
        {t('personal_charts', language)}
      </Text>

      <Text style={[
        styles.recommendationsText,
        language === 'Russian' && styles.recommendationsTextRussian,
        language === 'French' && styles.recommendationsTextFrench
      ]}>
        {t('recommendations', language)}
      </Text>

      <Image
        source={require('./assets/Pro/photo.png')}
        style={styles.photoImage}
        resizeMode="contain"
      />

      <View style={styles.smallRectangle} />

      <Text style={styles.popularText}>{t('popular', language)}</Text>

      <TouchableOpacity
        style={[styles.rectangleButton, loading && styles.disabledButton]}
        onPress={handlePurchase12Months}
        disabled={loading}
      >
        <Text style={styles.monthsText}>{t('12_months', language)}</Text>
        <Text style={styles.priceText}>{getYearlyPrice()}</Text>
        {loading && (
          <ActivityIndicator
            style={styles.loadingIndicator}
            size="small"
            color="#FF2097"
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.secondRectangleButton, loading && styles.disabledButton]}
        onPress={handlePurchase1Month}
        disabled={loading}
      >
        <Text style={styles.oneMonthText}>{t('1_month', language)}</Text>
        <Text style={styles.secondPriceText}>{getMonthlyPrice()}</Text>
        {loading && (
          <ActivityIndicator
            style={styles.loadingIndicator}
            size="small"
            color="#FF2097"
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Image
          source={require('./assets/Profile/arrow.png')}
          style={styles.backArrowImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.restoreButton}
        onPress={handleRestorePurchases}
        disabled={loading}
      >
        <Text style={styles.restoreText}>Restore Purchases</Text>
      </TouchableOpacity>

    </View>
  );
};

const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5A8D4',
  },
  backgroundImage: {
    position: 'absolute',
    width: (1248 / 1242) * width,
    height: (2700 / 1242) * width,
    top: 0,
    left: 0,
    opacity: 1,
  },
  backButton: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (205 / 1242) * width,
    width: (45 / 1242) * width,
    height: (72 / 1242) * width,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backArrowImage: {
    width: (45 / 1242) * width,
    height: (72 / 1242) * width,
    opacity: 1,
  },
  monthsText: {
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (70 / 1242) * width,
    lineHeight: (70 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textTransform: 'capitalize',
    color: '#FF2097',
  },
  priceText: {
    position: 'absolute',
    width: (706 / 1242) * width,
    height: (92 / 1242) * width,
    top: (64 / 1242) * width,
    left: (369 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (70 / 1242) * width,
    lineHeight: (70 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textAlign: 'right',
    textTransform: 'capitalize',
    color: '#FFA8D6',
  },
  oneMonthText: {
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (70 / 1242) * width,
    lineHeight: (70 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textTransform: 'capitalize',
    color: '#FF2097',
  },
  secondPriceText: {
    position: 'absolute',
    width: (706 / 1242) * width,
    height: (92 / 1242) * width,
    top: (64 / 1242) * width,
    left: (369 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (70 / 1242) * width,
    lineHeight: (70 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textAlign: 'right',
    textTransform: 'capitalize',
    color: '#FFA8D6',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingIndicator: {
    position: 'absolute',
    right: (30 / 1242) * width,
    top: '50%',
    marginTop: -(12 / 1242) * width,
  },
  restoreButton: {
    position: 'absolute',
    bottom: (50 / 1242) * width,
    left: (54 / 1242) * width,
    right: (54 / 1242) * width,
    height: (50 / 1242) * width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restoreText: {
    fontFamily: 'Alatsi',
    fontSize: (24 / 1242) * width,
    color: '#303539',
    textDecorationLine: 'underline',
  },
});

export default ProScreen;