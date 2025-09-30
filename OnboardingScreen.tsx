import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { t, Language } from './translations';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onNavigate: (screen: 'onboarding' | 'diary') => void;
  language?: Language;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onNavigate, language = 'English' }) => {
  const handleStartPress = () => {
    onNavigate('diary');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#F5A8D4" />

      <Image
        source={require('./Onboarding/Parts/5 1.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <View style={styles.logoContainer}>
        <Image
          source={require('./Onboarding/Parts/Group 67 1.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.descriptionText}>
          {t('onboardingDescription', language)}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartPress}>
          <Text style={styles.startButtonText}>
            {t('startButton', language)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5A8D4',
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  logoImage: {
    width: width * 0.8,
    height: height * 0.4,
  },
  textContainer: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    alignItems: 'center',
  },
  descriptionText: {
    width: width * 0.8,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 1.2) / 1242 * width,
    textAlign: 'center',
    color: '#303539',
    opacity: 1,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    paddingBottom: 80,
    alignItems: 'center',
  },
  startButton: {
    width: width * 0.8,
    height: (176 / 1242) * width,
    borderRadius: (88 / 1242) * width,
    backgroundColor: '#FF77C0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  startButtonText: {
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (64 / 1242) * width,
    textAlign: 'center',
    color: '#FFFFFF',
    textTransform: 'capitalize',
    opacity: 1,
  },
});

export default OnboardingScreen;