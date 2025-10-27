import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { t, Language } from './translations';

const { width, height } = Dimensions.get('window');

interface PremiumWelcomeScreenProps {
  onClose: () => void;
  onGoToCharts: () => void;
  language?: Language;
}

const PremiumWelcomeScreen: React.FC<PremiumWelcomeScreenProps> = ({
  onClose,
  onGoToCharts,
  language = 'English'
}) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.congratsTitle}>{t('purchase_success_title', language)}</Text>
        <Text style={styles.congratsSubtitle}>{t('you_are_now_pro', language)}</Text>
      </View>

      {/* Features List */}
      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>{t('purchase_success_message', language)}</Text>

        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.featureText}>{t('unlimited_accounting', language)}</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.featureText}>{t('personal_charts', language)}</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.featureText}>{t('recommendations', language)}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.chartsButton} onPress={onGoToCharts}>
          <Text style={styles.chartsButtonText}>{t('go_to_charts', language)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F5A8D4',
    zIndex: 1000,
    justifyContent: 'space-between',
    paddingVertical: (50 / 1242) * width,
  },
  header: {
    paddingTop: (80 / 1242) * width,
    paddingHorizontal: (30 / 1242) * width,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  congratsTitle: {
    fontFamily: 'System',
    fontSize: (60 / 1242) * width,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: (25 / 1242) * width,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  congratsSubtitle: {
    fontFamily: 'System',
    fontSize: (48 / 1242) * width,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: (40 / 1242) * width,
  },
  featuresContainer: {
    paddingHorizontal: (30 / 1242) * width,
    flex: 2,
    justifyContent: 'center',
  },
  featuresTitle: {
    fontFamily: 'System',
    fontSize: (32 / 1242) * width,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: (60 / 1242) * width,
    lineHeight: (40 / 1242) * width,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featuresList: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: (25 / 1242) * width,
    paddingVertical: (40 / 1242) * width,
    paddingHorizontal: (30 / 1242) * width,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: (35 / 1242) * width,
    paddingLeft: (15 / 1242) * width,
  },
  bulletPoint: {
    width: (16 / 1242) * width,
    height: (16 / 1242) * width,
    backgroundColor: '#4CAF50',
    borderRadius: (8 / 1242) * width,
    marginRight: (25 / 1242) * width,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  featureText: {
    fontFamily: 'System',
    fontSize: (28 / 1242) * width,
    color: '#FFFFFF',
    fontWeight: 'bold',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonsContainer: {
    paddingHorizontal: (30 / 1242) * width,
    paddingBottom: (40 / 1242) * width,
    flex: 1,
    justifyContent: 'flex-end',
  },
  chartsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: (35 / 1242) * width,
    paddingVertical: (22 / 1242) * width,
    paddingHorizontal: (40 / 1242) * width,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  chartsButtonText: {
    fontFamily: 'System',
    fontSize: (24 / 1242) * width,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default PremiumWelcomeScreen;