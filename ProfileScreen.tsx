import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { formatWeight, formatHeight, parseWeight, parseHeight, convertWeight, convertHeight, UnitSystem } from './unitConversion';
import { t, Language } from './translations';

const { width, height } = Dimensions.get('window');


interface ProfileScreenProps {
  onBack: () => void;
  onDiaryPress: () => void;
  onStatisticsPress: () => void;
  onPersonalDataPress: () => void;
  onSettingsPress: () => void;
  weight?: string;
  height?: string;
  userName?: string;
  birthDate?: string;
  unitSystem?: UnitSystem;
  language?: Language;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack, onDiaryPress, onStatisticsPress, onPersonalDataPress, onSettingsPress, weight = '60kg', height: heightProp = '160cm', userName = 'Name', birthDate = '2007/9/17', unitSystem = 'european', language = 'English' }) => {
  const [avatarSource, setAvatarSource] = useState(require('./assets/Profile/Avatar.png'));

  // Переносим определение устройства внутрь компонента
  const screenData = Dimensions.get('screen');
  const screenWidth = screenData.width;
  const screenHeight = screenData.height;
  const screenMinDimension = Math.min(screenWidth, screenHeight);

  const aspectRatio = Math.max(width, height) / Math.min(width, height);
  const isPossibleTablet = Platform.OS === 'ios' && (
    screenMinDimension >= 768 ||
    (width === 375 && height === 667 && aspectRatio < 2.2)
  );

  const isTablet = isPossibleTablet; // Только для iPad
  const isLandscape = width > height;

  console.log('ProfileScreen Device info:', {
    window: { width, height },
    screen: { width: screenWidth, height: screenHeight },
    aspectRatio,
    isPossibleTablet,
    isTablet,
    isLandscape
  });

  const getBottomNavHeight = () => {
    if (isTablet) {
      const result = isLandscape ? Math.min(65, height * 0.08) : Math.min(70, height * 0.09);
      console.log('ProfileScreen getBottomNavHeight:', result);
      return result;
    }
    return (280 / 1242) * width;
  };

  // Переносим логику определения устройства внутрь компонента
  const getStyles = () => {
    return StyleSheet.create({
      ...baseStyles,
      bottomNavContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: width,
        height: getBottomNavHeight(),
        backgroundColor: '#FFFFFF',
        opacity: 1,
      },
      diaryTab: {
        position: 'absolute',
        left: (1242 / 6 - 34) / 1242 * width, // Center of first third
        top: isTablet ? 8 : (2453 - 2429) / (1242 / width),
        alignItems: 'center',
      },
      statisticsTab: {
        position: 'absolute',
        left: (1242 / 2 - 34) / 1242 * width, // Center of screen
        top: isTablet ? 8 : (2453 - 2429) / (1242 / width),
        alignItems: 'center',
      },
      profileTab: {
        position: 'absolute',
        left: (5 * 1242 / 6 - 34) / 1242 * width, // Center of last third
        top: isTablet ? 8 : (2453 - 2429) / (1242 / width),
        alignItems: 'center',
      },
      diaryIcon: {
        width: isTablet ? Math.min(45, width * 0.05) : (68 / 1242) * width,
        height: isTablet ? Math.min(45, width * 0.05) : (68 / 1242) * width,
        opacity: 1,
      },
      statisticsIcon: {
        width: isTablet ? Math.min(45, width * 0.05) : (68 / 1242) * width,
        height: isTablet ? Math.min(45, width * 0.05) : (68 / 1242) * width,
        opacity: 1,
      },
      profileIcon: {
        width: isTablet ? Math.min(45, width * 0.05) : (68 / 1242) * width,
        height: isTablet ? Math.min(45, width * 0.05) : (68 / 1242) * width,
        opacity: 1,
      },
      diaryText: {
        width: (140 / 1242) * width,
        marginTop: isTablet ? 4 : (2537 - 2453 - 68) / (1242 / width),
        fontFamily: 'System',
        fontWeight: '400',
        fontSize: isTablet ? Math.min(14, width * 0.017) : (32 / 1242) * width,
        textAlign: 'center',
        color: '#A2A2A2',
        textTransform: 'capitalize',
        opacity: 1,
      },
      statisticsText: {
        marginTop: isTablet ? 4 : (2536 - 2453 - 68) / (1242 / width),
        fontFamily: 'System',
        fontWeight: '400',
        fontSize: isTablet ? Math.min(13, width * 0.016) : (30 / 1242) * width,
        textAlign: 'center',
        color: '#A2A2A2',
        textTransform: 'capitalize',
        opacity: 1,
        minWidth: (180 / 1242) * width,
      },
      profileTextActive: {
        marginTop: isTablet ? 4 : (2537 - 2453 - 68) / (1242 / width),
        fontFamily: 'System',
        fontWeight: '400',
        fontSize: isTablet ? Math.min(14, width * 0.017) : (32 / 1242) * width,
        textAlign: 'center',
        color: '#FF77C0',
        textTransform: 'capitalize',
        opacity: 1,
        minWidth: (140 / 1242) * width,
      },
      // Адаптивные стили для основного контента
      profileRectangle: {
        position: 'absolute',
        left: (51 / 1242) * width,
        top: isTablet ? (280 / 1242) * width : (341 / 1242) * width,
        width: (1140 / 1242) * width,
        height: isTablet ? (550 / 1242) * width : (682 / 1242) * width,
        borderRadius: (75 / 1242) * width,
        backgroundColor: '#FFFFFF',
        shadowColor: '#B4ADB1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.69,
        shadowRadius: 8.8,
        elevation: 8,
        opacity: 1,
        transform: [{ rotate: '0deg' }],
      },
      avatarImage: {
        position: 'absolute',
        left: (111 / 1242) * width,
        top: isTablet ? (340 / 1242) * width : (411 / 1242) * width,
        width: isTablet ? (200 / 1242) * width : (260 / 1242) * width,
        height: isTablet ? (200 / 1242) * width : (260 / 1242) * width,
        opacity: 1,
        transform: [{ rotate: '0deg' }],
      },
      avatarEditButton: {
        position: 'absolute',
        left: isTablet ? (254 / 1242) * width : (294 / 1242) * width,
        top: isTablet ? (480 / 1242) * width : (578 / 1242) * width,
        width: isTablet ? (70 / 1242) * width : (93 / 1242) * width,
        height: isTablet ? (70 / 1242) * width : (93 / 1242) * width,
        borderRadius: isTablet ? (35 / 1242) * width : (93 / 2 / 1242) * width,
        backgroundColor: '#FF77C0',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 1,
        transform: [{ rotate: '0deg' }],
      },
      userNameText: {
        position: 'absolute',
        left: isTablet ? (350 / 1242) * width : (456 / 1242) * width,
        top: isTablet ? (360 / 1242) * width : (449 / 1242) * width,
        width: (597 / 1242) * width,
        height: (92 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (70 / 1242) * width : (90 / 1242) * width,
        lineHeight: isTablet ? (70 * 0.99) / 1242 * width : (90 * 0.99) / 1242 * width,
        color: '#303539',
        textTransform: 'capitalize',
        opacity: 1,
        transform: [{ rotate: '0deg' }],
        zIndex: 2,
      },
      ageText: {
        position: 'absolute',
        left: isTablet ? (350 / 1242) * width : (456 / 1242) * width,
        top: isTablet ? (420 / 1242) * width : (541 / 1242) * width,
        width: (597 / 1242) * width,
        height: (92 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (50 / 1242) * width : (64 / 1242) * width,
        lineHeight: isTablet ? (50 * 0.99) / 1242 * width : (64 * 0.99) / 1242 * width,
        color: '#303539',
        textTransform: 'capitalize',
        opacity: 1,
        transform: [{ rotate: '0deg' }],
        zIndex: 2,
      },
      weightText: {
        position: 'absolute',
        left: (111 / 1242) * width,
        top: isTablet ? (600 / 1242) * width : (771 / 1242) * width,
        width: (706 / 1242) * width,
        height: (60 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (45 / 1242) * width : (60 / 1242) * width,
        lineHeight: isTablet ? (45 * 0.99) / 1242 * width : (60 * 0.99) / 1242 * width,
        color: '#303539',
        textTransform: 'capitalize',
        opacity: 1,
        zIndex: 2,
        transform: [{ rotate: '0deg' }],
      },
      weightValue: {
        position: 'absolute',
        left: (425 / 1242) * width,
        top: isTablet ? (605 / 1242) * width : (779 / 1242) * width,
        width: (706 / 1242) * width,
        height: (60 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (45 / 1242) * width : (60 / 1242) * width,
        lineHeight: isTablet ? (45 * 0.99) / 1242 * width : (60 * 0.99) / 1242 * width,
        textAlign: 'right',
        color: '#303539',
        textTransform: 'capitalize',
        opacity: 1,
        zIndex: 2,
        transform: [{ rotate: '0deg' }],
      },
      heightText: {
        position: 'absolute',
        left: (111 / 1242) * width,
        top: isTablet ? (680 / 1242) * width : (881 / 1242) * width,
        width: (706 / 1242) * width,
        height: (60 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (45 / 1242) * width : (60 / 1242) * width,
        lineHeight: isTablet ? (45 * 0.99) / 1242 * width : (60 * 0.99) / 1242 * width,
        color: '#303539',
        textTransform: 'capitalize',
        opacity: 1,
        zIndex: 2,
        transform: [{ rotate: '0deg' }],
      },
      heightValue: {
        position: 'absolute',
        left: (425 / 1242) * width,
        top: isTablet ? (685 / 1242) * width : (889 / 1242) * width,
        width: (706 / 1242) * width,
        height: (60 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (45 / 1242) * width : (60 / 1242) * width,
        lineHeight: isTablet ? (45 * 0.99) / 1242 * width : (60 * 0.99) / 1242 * width,
        textAlign: 'right',
        color: '#303539',
        textTransform: 'capitalize',
        opacity: 1,
        zIndex: 2,
        transform: [{ rotate: '0deg' }],
      },
      dividerLine: {
        position: 'absolute',
        left: (53 / 1242) * width,
        top: isTablet ? (560 / 1242) * width : (721 / 1242) * width,
        width: (1140 / 1242) * width,
        height: 0,
        borderTopWidth: 1,
        borderTopColor: '#DBD7DB',
        opacity: 1,
        transform: [{ rotate: '0deg' }],
      },
      individualSettingsText: {
        position: 'absolute',
        left: (110 / 1242) * width,
        top: isTablet ? (850 / 1242) * width : (1122 / 1242) * width,
        width: (1020 / 1242) * width,
        height: (60 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (40 / 1242) * width : (52 / 1242) * width,
        lineHeight: isTablet ? (40 * 1.1) / 1242 * width : (52 * 1.1) / 1242 * width,
        color: '#303539',
        opacity: 1,
        transform: [{ rotate: '0deg' }],
      },
      settingsRectangle: {
        position: 'absolute',
        left: (51 / 1242) * width,
        top: isTablet ? (920 / 1242) * width : (1216 / 1242) * width,
        width: (1140 / 1242) * width,
        height: isTablet ? (170 / 1242) * width : (219 / 1242) * width,
        borderRadius: (75 / 1242) * width,
        backgroundColor: '#FFFFFF',
        shadowColor: '#B4ADB1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.69,
        shadowRadius: 8.8,
        elevation: 8,
        opacity: 1,
        transform: [{ rotate: '0deg' }],
      },
      personalDataText: {
        position: 'absolute',
        left: (111 / 1242) * width,
        top: isTablet ? (980 / 1242) * width : (1296 / 1242) * width,
        width: (706 / 1242) * width,
        height: (60 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (45 / 1242) * width : (60 / 1242) * width,
        lineHeight: isTablet ? (45 * 0.99) / 1242 * width : (60 * 0.99) / 1242 * width,
        color: '#303539',
        textTransform: 'capitalize',
        opacity: 1,
        transform: [{ rotate: '0deg' }],
      },
      arrowGreyIcon: {
        position: 'absolute',
        left: (1105 / 1242) * width,
        top: isTablet ? (990 / 1242) * width : (1305 / 1242) * width,
        width: (26 / 1242) * width,
        height: (42 / 1242) * width,
        opacity: 1,
        transform: [{ rotate: '0deg' }],
      },
      additionalRectangle: {
        position: 'absolute',
        left: (51 / 1242) * width,
        top: isTablet ? (1180 / 1242) * width : (1483 / 1242) * width,
        width: (1140 / 1242) * width,
        height: isTablet ? (800 / 1242) * width : (914 / 1242) * width,
        borderRadius: (75 / 1242) * width,
        backgroundColor: '#FFFFFF',
        shadowColor: '#B4ADB1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.69,
        shadowRadius: 8.8,
        elevation: 8,
        opacity: 1,
        transform: [{ rotate: '0deg' }],
      },
      upgradeText: {
        position: 'absolute',
        left: (60 / 1242) * width,
        top: isTablet ? (56 / 1242) * width : (56 / 1242) * width,
        width: (1020 / 1242) * width,
        height: isTablet ? (150 / 1242) * width : (194 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (40 / 1242) * width : (50 / 1242) * width,
        lineHeight: isTablet ? (40 * 1.1) / 1242 * width : (50 * 1.1) / 1242 * width,
        textAlign: 'center',
        color: '#303539',
        opacity: 1,
        transform: [{ rotate: '0deg' }],
      },
      photoImage: {
        position: 'absolute',
        left: isTablet ? (270 / 1242) * width : (200 / 1242) * width,
        top: isTablet ? (200 / 1242) * width : (210 / 1242) * width,
        width: isTablet ? (600 / 1242) * width : (741 / 1242) * width,
        height: isTablet ? (400 / 1242) * width : (494 / 1242) * width,
        opacity: 1,
        transform: [{ rotate: '0deg' }],
      },
      upgradeButton: {
        position: 'absolute',
        left: isTablet ? (250 / 1242) * width : (160 / 1242) * width,
        top: isTablet ? (620 / 1242) * width : (688 / 1242) * width,
        width: isTablet ? (640 / 1242) * width : (807 / 1242) * width,
        height: isTablet ? (140 / 1242) * width : (176 / 1242) * width,
        borderRadius: isTablet ? (70 / 1242) * width : (88 / 1242) * width,
        backgroundColor: '#FF77C0',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        opacity: 1,
        transform: [{ rotate: '0deg' }],
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
    });
  };

  const styles = getStyles();

  
  const getDisplayWeight = () => {
    const weightValue = parseWeight(weight);
    const currentWeightInKg = weight.includes('lbs') ? convertWeight(weightValue, 'american', 'european') : weightValue;
    const displayWeight = unitSystem === 'european' ? currentWeightInKg : convertWeight(currentWeightInKg, 'european', 'american');
    return formatWeight(displayWeight, unitSystem);
  };

  const getDisplayHeight = () => {
    const heightValue = parseHeight(heightProp);
    const currentHeightInCm = heightProp.includes("'") ? convertHeight(heightValue, 'american', 'european') : heightValue;
    const displayHeight = unitSystem === 'european' ? currentHeightInCm : convertHeight(currentHeightInCm, 'european', 'american');
    return formatHeight(displayHeight, unitSystem);
  };

  const calculateAge = (birthDateString: string) => {
    const [year, month, day] = birthDateString.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const selectImage = (useCamera: boolean) => {
    console.log(useCamera ? 'Camera selected' : 'Gallery selected');
  };

  const handleAvatarPress = () => {
    Alert.alert(
      'Change Avatar',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => selectImage(true),
        },
        {
          text: 'Gallery',
          onPress: () => selectImage(false),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5A8D4" />

      <Image
        source={require('./assets/Profile/Background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Image
          source={require('./assets/Profile/arrow.png')}
          style={styles.backArrowImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Text style={styles.profileTitle}>{t('profile', language)}</Text>

      <TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress}>
        <Image
          source={require('./assets/Profile/settings.png')}
          style={styles.settingsIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View style={styles.profileRectangle} />

      <Image
        source={avatarSource}
        style={styles.avatarImage}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.avatarEditButton} onPress={handleAvatarPress}>
        <Text style={styles.avatarEditText}>+</Text>
      </TouchableOpacity>

      <Text style={styles.userNameText}>{userName}</Text>

      <Text style={styles.ageText}>{t('Age:', language)} {calculateAge(birthDate)}</Text>

      <View style={styles.dividerLine} />

      <Text style={styles.weightText}>{t('Weight', language)}</Text>

      <Text style={styles.weightValue}>{getDisplayWeight()}</Text>

      <Text style={styles.heightText}>{t('Height', language)}</Text>

      <Text style={styles.heightValue}>{getDisplayHeight()}</Text>

      <Text style={styles.individualSettingsText}>{t('Individual Settings', language)}</Text>

      <View style={styles.settingsRectangle} />

      <Text style={styles.personalDataText}>{t('Personal Data', language)}</Text>

      <TouchableOpacity onPress={onPersonalDataPress}>
        <Image
          source={require('./assets/Profile/arrowGrey.png')}
          style={styles.arrowGreyIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View style={styles.bottomNavContainer}>
        <View style={styles.topBorder} />

        <View style={styles.bottomNavContent}>
          <TouchableOpacity style={styles.diaryTab} onPress={onDiaryPress}>
            <Image
              source={require('./assets/Diary/Parts/notepad1.png')}
              style={styles.diaryIcon}
              resizeMode="contain"
            />
            <Text style={styles.diaryText}>{t('diary', language)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statisticsTab} onPress={onStatisticsPress}>
            <Image
              source={require('./assets/Diary/Parts/Statistics.png')}
              style={styles.statisticsIcon}
              resizeMode="contain"
            />
            <Text style={styles.statisticsText}>{t('statistics', language)}</Text>
          </TouchableOpacity>

          <View style={styles.profileTab}>
            <Image
              source={require('./assets/Diary/Parts/prof.png')}
              style={styles.profileIcon}
              resizeMode="contain"
            />
            <Text style={styles.profileTextActive}>{t('profile', language)}</Text>
          </View>

        </View>
      </View>


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
    width: 1248,
    height: 2700,
    top: 0,
    left: -3,
    transform: [{ rotate: '0deg' }],
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
  },
  backArrowImage: {
    width: (45 / 1242) * width,
    height: (72 / 1242) * width,
    opacity: 1,

  },
  profileTitle: {
    position: 'absolute',
    left: (268 / 1242) * width,
    top: (173 / 1242) * width,
    width: (706 / 1242) * width,
    height: (92 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (64 / 1242) * width,
    lineHeight: (64 * 0.99) / 1242 * width,
    textAlign: 'center',
    color: '#303539',
    textTransform: 'capitalize',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  settingsButton: {
    position: 'absolute',
    left: (1117 / 1242) * width,
    top: (203 / 1242) * width,
    width: (76 / 1242) * width,
    height: (76 / 1242) * width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    width: (76 / 1242) * width,
    height: (76 / 1242) * width,
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  avatarEditText: {
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: (70 / 1242) * width,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  weightText: {
    position: 'absolute',
    left: (111 / 1242) * width,
    top: (771 / 1242) * width,
    width: (706 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (60 / 1242) * width,
    lineHeight: (60 * 0.99) / 1242 * width,
    color: '#303539',
    textTransform: 'capitalize',
    opacity: 1,
    zIndex: 2,
    transform: [{ rotate: '0deg' }],
  },
  weightValue: {
    position: 'absolute',
    left: (425 / 1242) * width,
    top: (779 / 1242) * width,
    width: (706 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (60 / 1242) * width,
    lineHeight: (60 * 0.99) / 1242 * width,
    textAlign: 'right',
    color: '#303539',
    textTransform: 'capitalize',
    opacity: 1,
    zIndex: 2,
    transform: [{ rotate: '0deg' }],
  },
  heightText: {
    position: 'absolute',
    left: (111 / 1242) * width,
    top: (881 / 1242) * width,
    width: (706 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (60 / 1242) * width,
    lineHeight: (60 * 0.99) / 1242 * width,
    color: '#303539',
    textTransform: 'capitalize',
    opacity: 1,
    zIndex: 2,
    transform: [{ rotate: '0deg' }],
  },
  heightValue: {
    position: 'absolute',
    left: (425 / 1242) * width,
    top: (889 / 1242) * width,
    width: (706 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (60 / 1242) * width,
    lineHeight: (60 * 0.99) / 1242 * width,
    textAlign: 'right',
    color: '#303539',
    textTransform: 'capitalize',
    opacity: 1,
    zIndex: 2,
    transform: [{ rotate: '0deg' }],
  },
  dividerLine: {
    position: 'absolute',
    left: (53 / 1242) * width,
    top: (721 / 1242) * width,
    width: (1140 / 1242) * width,
    height: 0,
    borderTopWidth: 1,
    borderTopColor: '#DBD7DB',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  individualSettingsText: {
    position: 'absolute',
    left: (110 / 1242) * width,
    top: (1122 / 1242) * width,
    width: (1020 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (52 / 1242) * width,
    lineHeight: (52 * 1.1) / 1242 * width,
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  settingsRectangle: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (1216 / 1242) * width,
    width: (1140 / 1242) * width,
    height: (219 / 1242) * width,
    borderRadius: (75 / 1242) * width,
    backgroundColor: '#FFFFFF',
    shadowColor: '#B4ADB1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.69,
    shadowRadius: 8.8,
    elevation: 8,
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  personalDataText: {
    position: 'absolute',
    left: (111 / 1242) * width,
    top: (1296 / 1242) * width,
    width: (706 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (60 / 1242) * width,
    lineHeight: (60 * 0.99) / 1242 * width,
    color: '#303539',
    textTransform: 'capitalize',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  topBorder: {
    position: 'absolute',
    top: -6,
    left: 0,
    right: 0,
    width: (1243 / 1242) * width,
    height: 3,
    backgroundColor: '#DBD7DB',
    opacity: 1,
  },
  bottomNavContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 3,
  },
  arrowGreyIcon: {
    position: 'absolute',
    left: (1105 / 1242) * width,
    top: (1305 / 1242) * width,
    width: (26 / 1242) * width,
    height: (42 / 1242) * width,
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  additionalRectangle: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (1483 / 1242) * width,
    width: (1140 / 1242) * width,
    height: (914 / 1242) * width,
    borderRadius: (75 / 1242) * width,
    backgroundColor: '#FFFFFF',
    shadowColor: '#B4ADB1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.69,
    shadowRadius: 8.8,
    elevation: 8,
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  premiumText: {
    textTransform: 'uppercase',
  },
  upgradeButtonText: {
    width: (706 / 1242) * width,
    height: (92 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (70 / 1242) * width,
    lineHeight: (70 * 0.99) / 1242 * width,
    textAlign: 'center',
    color: '#FFFFFF',
    opacity: 1,
  },
  userNameText: {
    position: 'absolute',
    left: (456 / 1242) * width,
    top: (449 / 1242) * width,
    width: (597 / 1242) * width,
    height: (92 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (90 / 1242) * width,
    lineHeight: (90 * 0.99) / 1242 * width,
    color: '#303539',
    textTransform: 'capitalize',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 2,
  },
  ageText: {
    position: 'absolute',
    left: (456 / 1242) * width,
    top: (541 / 1242) * width,
    width: (597 / 1242) * width,
    height: (92 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (64 / 1242) * width,
    lineHeight: (64 * 0.99) / 1242 * width,
    color: '#303539',
    textTransform: 'capitalize',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 2,
  },
});

export default ProfileScreen;