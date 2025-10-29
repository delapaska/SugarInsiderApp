import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Keyboard,
  Alert,
  ScrollView,
} from 'react-native';

const { width } = Dimensions.get('window');

import { UnitSystem, getSugarUnit, getSugarDisplayValue, convertSugar } from './unitConversion';
import { t, Language } from './translations';
import NotificationService from './NotificationService';

interface SettingsScreenProps {
  onBack: () => void;
  userName?: string;
  onUserNameChange?: (newName: string) => void;
  unitSystem?: UnitSystem;
  onUnitSystemChange?: (unitSystem: UnitSystem) => void;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
  onAccountDeleted?: () => void;
  onDiaryPress: () => void;
  onStatisticsPress?: () => void;
  onProfilePress: () => void;
  reminderEnabled?: boolean;
  onReminderChange?: (enabled: boolean) => void;
  reminderTime?: string;
  onReminderTimeChange?: (time: string) => void;
  sugarLimitEnabled?: boolean;
  onSugarLimitChange?: (enabled: boolean) => void;
  dailySugarLimit?: number;
  onSugarLimitValueChange?: (limit: number) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, userName = 'Name', onUserNameChange, unitSystem = 'european', onUnitSystemChange, language = 'English', onLanguageChange, onAccountDeleted, onDiaryPress, onStatisticsPress, onProfilePress, reminderEnabled = false, onReminderChange, reminderTime = '12:00', onReminderTimeChange, sugarLimitEnabled = false, onSugarLimitChange, dailySugarLimit = 50, onSugarLimitValueChange }) => {
  const [showAccountScreen, setShowAccountScreen] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showUnitsScreen, setShowUnitsScreen] = useState(false);
  const [showLanguageScreen, setShowLanguageScreen] = useState(false);
  const [showNotificationsScreen, setShowNotificationsScreen] = useState(false);
  const [showTimePickerModal, setShowTimePickerModal] = useState(false);
  const [showSugarLimitScreen, setShowSugarLimitScreen] = useState(false);
  const [currentName, setCurrentName] = useState(userName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(unitSystem);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [notificationEnabled, setNotificationEnabled] = useState(reminderEnabled);
  const [selectedTime, setSelectedTime] = useState(reminderTime);
  const [tempHour, setTempHour] = useState(parseInt(reminderTime.split(':')[0]));
  const [tempMinute, setTempMinute] = useState(parseInt(reminderTime.split(':')[1]));
  const [sugarLimitNotificationEnabled, setSugarLimitNotificationEnabled] = useState(sugarLimitEnabled);
  const [currentSugarLimit, setCurrentSugarLimit] = useState(dailySugarLimit);
  const [displaySugarLimit, setDisplaySugarLimit] = useState(getSugarDisplayValue(dailySugarLimit, selectedUnit));

  
  useEffect(() => {
    NotificationService.updateSettings({
      enabled: notificationEnabled,
      time: selectedTime,
      sugarLimitEnabled: sugarLimitNotificationEnabled,
      dailySugarLimit: currentSugarLimit,
      language: selectedLanguage,
      unitSystem: selectedUnit
    });
  }, [selectedLanguage, selectedUnit]);

  
  useEffect(() => {
    const newDisplayValue = getSugarDisplayValue(currentSugarLimit, selectedUnit);
    setDisplaySugarLimit(newDisplayValue);
  }, [selectedUnit, currentSugarLimit]);

  const handleAccountPress = () => {
    setShowAccountScreen(true);
  };

  const handleAccountBack = () => {
    setShowAccountScreen(false);
  };

  const handleNamePress = () => {
    setShowNameModal(true);
  };

  const handleNameModalClose = () => {
    setShowNameModal(false);
    setIsEditingName(false);
  };

  const handleNameEdit = () => {
    setIsEditingName(true);
    setTimeout(() => {
      Keyboard.dismiss();
      setTimeout(() => {
        setIsEditingName(true);
      }, 50);
    }, 10);
  };

  const handleNameSave = (newName: string) => {
    setCurrentName(newName);
    setIsEditingName(false);
    setShowNameModal(false);
    if (onUserNameChange) {
      onUserNameChange(newName);
    }
  };

  const handleUnitsPress = () => {
    setShowUnitsScreen(true);
  };

  const handleUnitsBack = () => {
    setShowUnitsScreen(false);
  };

  const handleUnitSelect = (unit: UnitSystem) => {
    setSelectedUnit(unit);
    if (onUnitSystemChange) {
      onUnitSystemChange(unit);
    }
  };

  const handleLanguagePress = () => {
    setShowLanguageScreen(true);
  };

  const handleLanguageBack = () => {
    setShowLanguageScreen(false);
  };

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLanguage(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  const handleNotificationsPress = () => {
    setShowNotificationsScreen(true);
  };

  const handleNotificationsBack = () => {
    setShowNotificationsScreen(false);
  };

  const handleReminderToggle = () => {
    const newValue = !notificationEnabled;
    setNotificationEnabled(newValue);
    if (onReminderChange) {
      onReminderChange(newValue);
    }

    
    NotificationService.updateSettings({
      enabled: newValue,
      time: selectedTime,
      sugarLimitEnabled: sugarLimitNotificationEnabled,
      dailySugarLimit: currentSugarLimit,
      language: selectedLanguage,
      unitSystem: selectedUnit
    });
  };

  const handleTimePress = () => {
    setShowTimePickerModal(true);
  };

  const handleTimePickerClose = () => {
    setShowTimePickerModal(false);
  };

  const handleTimePickerSave = () => {
    const newTime = `${tempHour.toString().padStart(2, '0')}:${tempMinute.toString().padStart(2, '0')}`;
    setSelectedTime(newTime);
    setShowTimePickerModal(false);
    if (onReminderTimeChange) {
      onReminderTimeChange(newTime);
    }

    
    NotificationService.updateSettings({
      enabled: notificationEnabled,
      time: newTime,
      sugarLimitEnabled: sugarLimitNotificationEnabled,
      dailySugarLimit: currentSugarLimit,
      language: selectedLanguage,
      unitSystem: selectedUnit
    });
  };

  const handleTestNotification = () => {
    NotificationService.testNotification();
  };

  const handleSugarLimitPress = () => {
    setShowSugarLimitScreen(true);
  };

  const handleSugarLimitBack = () => {
    setShowSugarLimitScreen(false);
  };

  const handleSugarLimitToggle = () => {
    const newValue = !sugarLimitNotificationEnabled;
    setSugarLimitNotificationEnabled(newValue);
    if (onSugarLimitChange) {
      onSugarLimitChange(newValue);
    }

    
    NotificationService.updateSettings({
      enabled: notificationEnabled,
      time: selectedTime,
      sugarLimitEnabled: newValue,
      dailySugarLimit: currentSugarLimit,
      language: selectedLanguage,
      unitSystem: selectedUnit
    });
  };

  const handleSugarLimitValueChange = (value: string) => {
    const displayValue = parseFloat(value) || 0;
    setDisplaySugarLimit(displayValue);

    
    let gramValue;
    if (selectedUnit === 'european') {
      gramValue = displayValue; 
    } else {
      gramValue = displayValue * 28.3495; 
    }

    setCurrentSugarLimit(Math.round(gramValue));
    if (onSugarLimitValueChange) {
      onSugarLimitValueChange(Math.round(gramValue));
    }

    
    NotificationService.updateSettings({
      enabled: notificationEnabled,
      time: selectedTime,
      sugarLimitEnabled: sugarLimitNotificationEnabled,
      dailySugarLimit: Math.round(gramValue),
      language: selectedLanguage,
      unitSystem: selectedUnit
    });
  };

  const generateHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    return hours;
  };

  const generateMinutes = () => {
    const minutes = [];
    for (let i = 0; i < 60; i++) { 
      minutes.push(i);
    }
    return minutes;
  };

  const handleResetDataPress = () => {
    Alert.alert(
      t('Reset All Data', selectedLanguage),
      t('Are you sure you want to reset all data to default settings? This action cannot be undone.', selectedLanguage),
      [
        {
          text: t('Cancel', selectedLanguage),
          style: 'cancel',
        },
        {
          text: t('Reset', selectedLanguage),
          style: 'destructive',
          onPress: () => {
            
            setCurrentName('Name');
            setSelectedUnit('european');
            setSelectedLanguage('English');

            
            if (onUserNameChange) {
              onUserNameChange('Name');
            }
            if (onUnitSystemChange) {
              onUnitSystemChange('european');
            }
            if (onLanguageChange) {
              onLanguageChange('English');
            }

            Alert.alert(
              t('Success', selectedLanguage),
              t('All data has been reset to default settings.', selectedLanguage)
            );
          },
        },
      ]
    );
  };

  const handleDeleteAccountPress = () => {
    Alert.alert(
      t('Delete an account', selectedLanguage),
      t('Are you sure you want to delete your account? All your data will be permanently lost and cannot be recovered.', selectedLanguage),
      [
        {
          text: t('Cancel', selectedLanguage),
          style: 'cancel',
        },
        {
          text: t('Delete', selectedLanguage),
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              t('Account Deleted', selectedLanguage),
              t('Your account has been successfully deleted.', selectedLanguage),
              [
                {
                  text: t('OK', selectedLanguage),
                  onPress: () => {
                    
                    if (onAccountDeleted) {
                      onAccountDeleted();
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  if (showNotificationsScreen) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5A8D4" />

        <Image
          source={require('./assets/Settings/background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        <TouchableOpacity style={styles.backButton} onPress={handleNotificationsBack}>
          <Image
            source={require('./assets/Profile/arrow.png')}
            style={styles.backArrowImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.notificationsScreenTitle}>{t('Setting up Notifications', selectedLanguage)}</Text>

        <View style={styles.notificationsScreenRectangle} />

        <Text style={styles.reminderScreenText}>{t('Remind me to record a sweet', selectedLanguage)}</Text>

        <TouchableOpacity onPress={handleReminderToggle}>
          <View style={[styles.reminderToggle, notificationEnabled && styles.reminderToggleEnabled]}>
            <View style={[styles.reminderToggleButton, notificationEnabled && styles.reminderToggleButtonEnabled]} />
          </View>
        </TouchableOpacity>


        {notificationEnabled && (
          <>
            <View style={styles.timeSettingRectangle} />

            <Text style={styles.timeSettingLabel}>{t('reminder_time', selectedLanguage)}</Text>
            <TouchableOpacity onPress={handleTimePress}>
              <Text style={styles.timeSettingValue}>{selectedTime}</Text>
            </TouchableOpacity>
          </>
        )}

        {showTimePickerModal && (
          <View style={styles.timePickerOverlay}>
            <View style={styles.timePickerModal}>
              <Text style={styles.timePickerTitle}>{t('select_time', selectedLanguage)}</Text>

              <View style={styles.timePickerContainer}>
                <ScrollView style={styles.hourPicker} showsVerticalScrollIndicator={false}>
                  {generateHours().map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={styles.timePickerItem}
                      onPress={() => setTempHour(hour)}
                    >
                      <Text style={[
                        styles.timePickerText,
                        tempHour === hour && styles.timePickerTextSelected
                      ]}>
                        {hour.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.timeSeparator}>:</Text>

                <ScrollView style={styles.minutePicker} showsVerticalScrollIndicator={false}>
                  {generateMinutes().map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={styles.timePickerItem}
                      onPress={() => setTempMinute(minute)}
                    >
                      <Text style={[
                        styles.timePickerText,
                        tempMinute === minute && styles.timePickerTextSelected
                      ]}>
                        {minute.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.timePickerButtons}>
                <TouchableOpacity style={styles.timePickerCancelButton} onPress={handleTimePickerClose}>
                  <Text style={styles.timePickerCancelText}>{t('cancel', selectedLanguage)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.timePickerSaveButton} onPress={handleTimePickerSave}>
                  <Text style={styles.timePickerSaveText}>{t('save', selectedLanguage)}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }

  if (showSugarLimitScreen) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5A8D4" />

        <Image
          source={require('./assets/Settings/background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        <TouchableOpacity style={styles.backButton} onPress={handleSugarLimitBack}>
          <Image
            source={require('./assets/Profile/arrow.png')}
            style={styles.backArrowImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.sugarLimitScreenTitle}>{t('Daily sugar limit', selectedLanguage)}</Text>

        <View style={styles.sugarLimitScreenRectangle} />

        <Text style={styles.sugarLimitToggleText}>{t('sugar_limit_notification', selectedLanguage)}</Text>

        <TouchableOpacity onPress={handleSugarLimitToggle}>
          <View style={[styles.sugarLimitToggle, sugarLimitNotificationEnabled && styles.sugarLimitToggleEnabled]}>
            <View style={[styles.sugarLimitToggleButton, sugarLimitNotificationEnabled && styles.sugarLimitToggleButtonEnabled]} />
          </View>
        </TouchableOpacity>

        {sugarLimitNotificationEnabled && (
          <>
            <View style={styles.sugarLimitValueRectangle} />

            <Text style={styles.sugarLimitValueLabel}>{t('Daily sugar limit', selectedLanguage)}:</Text>
            <TextInput
              style={styles.sugarLimitValueInput}
              value={displaySugarLimit.toString()}
              onChangeText={handleSugarLimitValueChange}
              keyboardType="numeric"
              placeholder={selectedUnit === 'european' ? "50" : "1.8"}
            />
            <Text style={styles.sugarLimitUnit}>{getSugarUnit(selectedUnit, selectedLanguage)}</Text>

            <TouchableOpacity style={styles.testSugarLimitButton} onPress={() => {
              
              const testValue = currentSugarLimit + 10;
              NotificationService.checkSugarLimit(testValue);
            }}>
              <Text style={styles.testSugarLimitButtonText}>{t('test_notification', selectedLanguage)}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }

  if (showLanguageScreen) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5A8D4" />

        <Image
          source={require('./assets/Settings/background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        <TouchableOpacity style={styles.backButton} onPress={handleLanguageBack}>
          <Image
            source={require('./assets/Profile/arrow.png')}
            style={styles.backArrowImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.languageScreenTitle}>{t('Language', selectedLanguage)}</Text>

        <TouchableOpacity onPress={() => handleLanguageSelect('English')}>
          <View style={[styles.languageOption, selectedLanguage === 'English' && styles.languageOptionSelected]}>
            {selectedLanguage === 'English' && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        <Text style={styles.englishLanguageText}>English</Text>

        <TouchableOpacity onPress={() => handleLanguageSelect('French')}>
          <View style={[styles.languageOption, styles.languageOptionFrench, selectedLanguage === 'French' && styles.languageOptionSelected]}>
            {selectedLanguage === 'French' && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        <Text style={styles.frenchLanguageText}>French</Text>

        <TouchableOpacity onPress={() => handleLanguageSelect('Russian')}>
          <View style={[styles.languageOption, styles.languageOptionRussian, selectedLanguage === 'Russian' && styles.languageOptionSelected]}>
            {selectedLanguage === 'Russian' && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        <Text style={styles.russianLanguageText}>Russian</Text>
      </View>
    );
  }

  if (showUnitsScreen) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5A8D4" />

        <Image
          source={require('./assets/Settings/background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        <TouchableOpacity style={styles.backButton} onPress={handleUnitsBack}>
          <Image
            source={require('./assets/Profile/arrow.png')}
            style={styles.backArrowImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.unitsScreenTitle}>{t('The system of units', selectedLanguage)}</Text>

        <TouchableOpacity onPress={() => handleUnitSelect('european')}>
          <View style={[styles.unitOption, selectedUnit === 'european' && styles.unitOptionSelected]}>
            {selectedUnit === 'european' && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        <Text style={styles.unitsEuropeanText}>{t('The European system', selectedLanguage)}</Text>

        <TouchableOpacity onPress={() => handleUnitSelect('american')}>
          <View style={[styles.unitOption, styles.unitOptionAmerican, selectedUnit === 'american' && styles.unitOptionSelected]}>
            {selectedUnit === 'american' && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        <Text style={styles.unitsAmericanText}>{t('The American system', selectedLanguage)}</Text>
      </View>
    );
  }

  if (showAccountScreen) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5A8D4" />

        <Image
          source={require('./assets/Settings/background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        <TouchableOpacity style={styles.backButton} onPress={handleAccountBack}>
          <Image
            source={require('./assets/Profile/arrow.png')}
            style={styles.backArrowImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.accountScreenTitle}>{t('Setting up an account', selectedLanguage)}</Text>

        <View style={styles.accountScreenRectangle} />

        <TouchableOpacity onPress={handleNamePress}>
          <Text style={styles.nameText}>{currentName}</Text>
        </TouchableOpacity>

        <View style={styles.accountDivider} />

        <Text style={styles.systemOfUnitsText}>{t('The system of units', selectedLanguage)}</Text>

        <TouchableOpacity onPress={handleUnitsPress}>
          <Text style={styles.europeanSystemText}>
            {selectedUnit === 'european' ? t('The European system', selectedLanguage) : t('The American system', selectedLanguage)}
          </Text>
        </TouchableOpacity>

        <View style={styles.accountDivider2} />

        <Text style={styles.languageText}>{t('Language', selectedLanguage)}</Text>

        <TouchableOpacity onPress={handleLanguagePress}>
          <Text style={styles.englishText}>{selectedLanguage}</Text>
        </TouchableOpacity>

        <View style={styles.accountDivider3} />

        <Text style={styles.consentText}>{t('Consent to data processing', selectedLanguage)}</Text>

        <Image
          source={require('./assets/Profile/arrowGrey.png')}
          style={styles.consentArrowIcon}
          resizeMode="contain"
        />

        <View style={styles.additionalRectangle} />

        <TouchableOpacity onPress={handleResetDataPress}>
          <Text style={styles.resetDataText}>{t('Reset All Data', selectedLanguage)}</Text>
        </TouchableOpacity>

        <View style={styles.additionalDividerLine} />

        <TouchableOpacity onPress={handleDeleteAccountPress}>
          <Text style={styles.deleteAccountText}>{t('Delete an account', selectedLanguage)}</Text>
        </TouchableOpacity>

        {showNameModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.nameModalRectangle} />
            <Text style={styles.nameModalTitle}>{t('Name', selectedLanguage)}</Text>
            {isEditingName ? (
              <TextInput
                style={styles.currentNameText}
                value={currentName}
                onChangeText={setCurrentName}
                onSubmitEditing={() => handleNameSave(currentName)}
                onBlur={() => handleNameSave(currentName)}
                autoFocus={true}
                selectTextOnFocus={true}
              />
            ) : (
              <TouchableOpacity onPress={handleNameEdit}>
                <Text style={styles.currentNameText}>{currentName}</Text>
              </TouchableOpacity>
            )}
            <View style={styles.nameModalDivider} />

            <TouchableOpacity style={styles.saveButton} onPress={() => handleNameSave(currentName)}>
              <Text style={styles.saveButtonText}>{t('Save', selectedLanguage)}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5A8D4" />

      <Image
        source={require('./assets/Settings/background.png')}
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

      <Text style={styles.settingsTitle}>{t('Settings', selectedLanguage)}</Text>

      <Text style={styles.accountTitle}>{t('Account', selectedLanguage)}</Text>

      <View style={styles.accountRectangle} />

      <Text style={styles.settingUpAccountText}>{t('Setting up an account', selectedLanguage)}</Text>

      <TouchableOpacity onPress={handleAccountPress}>
        <Image
          source={require('./assets/Profile/arrowGrey.png')}
          style={styles.arrowGreyIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View style={styles.dividerLine} />

      <Text style={styles.accountTypeText}>{t('Account type', selectedLanguage)}</Text>

      <Text style={styles.accountTypeValue}>{t('Premium', selectedLanguage)}</Text>

      <Text style={styles.notificationsTitle}>{t('Setting up Notifications', selectedLanguage)}</Text>

      <View style={styles.notificationsRectangle} />

      <Text style={styles.remindMeText}>{t('Remind me to record a sweet', selectedLanguage)}</Text>

      <TouchableOpacity onPress={handleNotificationsPress}>
        <Image
          source={require('./assets/Profile/arrowGrey.png')}
          style={styles.notificationsArrowIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View style={styles.notificationsDividerLine} />

      <Text style={styles.dailySugarLimitText}>{t('Daily sugar limit', selectedLanguage)}</Text>

      <TouchableOpacity onPress={handleSugarLimitPress}>
        <Image
          source={require('./assets/Profile/arrowGrey.png')}
          style={styles.sugarLimitArrowIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

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
    width: (1248 / 1242) * width,
    height: (2700 / 1242) * width,
    top: 0,
    left: (-3 / 1242) * width,
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
  settingsTitle: {
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
    textTransform: 'capitalize',
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  accountTitle: {
    position: 'absolute',
    left: (53 / 1242) * width,
    top: (364 / 1242) * width,
    width: (706 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (64 / 1242) * width,
    lineHeight: (64 * 0.99) / 1242 * width,
    textTransform: 'capitalize',
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  accountRectangle: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (485 / 1242) * width,
    width: (1140 / 1242) * width,
    height: (372 / 1242) * width,
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
  settingUpAccountText: {
    position: 'absolute',
    left: (110 / 1242) * width,
    top: (562 / 1242) * width,
    width: (950 / 1242) * width,
    height: (70 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (52 / 1242) * width,
    lineHeight: (52 * 1.3) / 1242 * width,
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 2,
  },
  arrowGreyIcon: {
    position: 'absolute',
    left: (1107 / 1242) * width,
    top: (570.7 / 1242) * width,
    width: (26 / 1242) * width,
    height: (39.5544319152832 / 1242) * width,
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  dividerLine: {
    position: 'absolute',
    left: (53 / 1242) * width,
    top: (660.17 / 1242) * width,
    width: (1140 / 1242) * width,
    height: 0,
    borderTopWidth: 3,
    borderTopColor: '#DBD7DB',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  accountTypeText: {
    position: 'absolute',
    left: (110 / 1242) * width,
    top: (736 / 1242) * width,
    width: (706 / 1242) * width,
    height: (56.50632858276367 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (60 / 1242) * width,
    lineHeight: (60 * 0.99) / 1242 * width,
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 2,
  },
  accountTypeValue: {
    position: 'absolute',
    left: (426 / 1242) * width,
    top: (730 / 1242) * width,
    width: (706 / 1242) * width,
    height: (56.50632858276367 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 0.99) / 1242 * width,
    textAlign: 'right',
    color: '#8E9091',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 2,
  },
  notificationsTitle: {
    position: 'absolute',
    left: (55 / 1242) * width,
    top: (979 / 1242) * width,
    width: (1100 / 1242) * width,
    height: (80 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (56 / 1242) * width,
    lineHeight: (56 * 1.2) / 1242 * width,
    textTransform: 'capitalize',
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  notificationsRectangle: {
    position: 'absolute',
    left: (53 / 1242) * width,
    top: (1100 / 1242) * width,
    width: (1140 / 1242) * width,
    height: (372 / 1242) * width,
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
  remindMeText: {
    position: 'absolute',
    left: (112 / 1242) * width,
    top: (1165 / 1242) * width,
    width: (980 / 1242) * width,
    height: (80 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (52 / 1242) * width,
    lineHeight: (52 * 1.3) / 1242 * width,
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 2,
  },
  notificationsDividerLine: {
    position: 'absolute',
    left: (53 / 1242) * width,
    top: (1286 / 1242) * width,
    width: (1140 / 1242) * width,
    height: 0,
    borderTopWidth: 3,
    borderTopColor: '#DBD7DB',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  notificationsArrowIcon: {
    position: 'absolute',
    left: (1109 / 1242) * width,
    top: (1185.7 / 1242) * width,
    width: (26 / 1242) * width,
    height: (39.5544319152832 / 1242) * width,
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 3,
  },
  dailySugarLimitText: {
    position: 'absolute',
    left: (112 / 1242) * width,
    top: (1351 / 1242) * width,
    width: (980 / 1242) * width,
    height: (80 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (52 / 1242) * width,
    lineHeight: (52 * 1.3) / 1242 * width,
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 2,
  },
  accountScreenTitle: {
    position: 'absolute',
    left: (53 / 1242) * width,
    top: (364 / 1242) * width,
    width: (1100 / 1242) * width,
    height: (80 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (52 / 1242) * width,
    lineHeight: (52 * 1.3) / 1242 * width,
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  accountScreenRectangle: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (485 / 1242) * width,
    width: (1140 / 1242) * width,
    height: (744 / 1242) * width,
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
  nameText: {
    position: 'absolute',
    left: (110 / 1242) * width,
    top: (548 / 1242) * width,
    width: (706 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (60 / 1242) * width,
    lineHeight: (60 * 0.99) / 1242 * width,
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 2,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: (1242 / 1242) * width,
    height: (2688 / 1242) * width,
    backgroundColor: '#000000D6',
    opacity: 1,
    zIndex: 10,
  },
  nameModalRectangle: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (804 / 1242) * width,
    width: (1140 / 1242) * width,
    height: (763 / 1242) * width,
    borderRadius: (75 / 1242) * width,
    backgroundColor: '#FFFFFF',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  nameModalTitle: {
    position: 'absolute',
    left: (220 / 1242) * width,
    top: (857 / 1242) * width,
    width: (802 / 1242) * width,
    height: (131 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (96 / 1242) * width,
    lineHeight: (96 * 0.99) / 1242 * width,
    textAlign: 'center',
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 11,
  },
  currentNameText: {
    position: 'absolute',
    left: (146 / 1242) * width,
    top: (1113 / 1242) * width,
    width: (706 / 1242) * width,
    height: (80 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (64 / 1242) * width,
    lineHeight: (64 * 1.1) / 1242 * width,
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 11,
    textAlignVertical: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    includeFontPadding: false,
  },
  nameModalDivider: {
    position: 'absolute',
    left: (122 / 1242) * width,
    top: (1186 / 1242) * width,
    width: (998 / 1242) * width,
    height: 0,
    borderTopWidth: 3,
    borderTopColor: '#DBD7DB',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 11,
  },
  saveButton: {
    position: 'absolute',
    left: (299 / 1242) * width,
    top: (1333 / 1242) * width,
    width: (644 / 1242) * width,
    height: (176 / 1242) * width,
    borderRadius: (88 / 1242) * width,
    backgroundColor: '#FF77C0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (64 / 1242) * width,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  accountDivider: {
    position: 'absolute',
    left: (53 / 1242) * width,
    top: (671 / 1242) * width,
    width: (1140 / 1242) * width,
    height: 0,
    borderTopWidth: 3,
    borderTopColor: '#DBD7DB',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 2,
  },
  accountDivider2: {
    position: 'absolute',
    left: (53 / 1242) * width,
    top: (857 / 1242) * width,
    width: (1140 / 1242) * width,
    height: 0,
    borderTopWidth: 3,
    borderTopColor: '#DBD7DB',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 2,
  },
  accountDivider3: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (1043 / 1242) * width,
    width: (1140 / 1242) * width,
    height: 0,
    borderTopWidth: 3,
    borderTopColor: '#DBD7DB',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 2,
  },
  systemOfUnitsText: {
    position: 'absolute',
    left: (112 / 1242) * width,
    top: (734 / 1242) * width,
    width: (880 / 1242) * width,
    height: (70 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (52 / 1242) * width,
    lineHeight: (52 * 1.3) / 1242 * width,
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 2,
  },
  europeanSystemText: {
    position: 'absolute',
    left: (750 / 1242) * width,
    top: (720 / 1242) * width,
    width: (380 / 1242) * width,
    height: (90 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (38 / 1242) * width,
    lineHeight: (38 * 1.1) / 1242 * width,
    textAlign: 'right',
    color: '#8E9091',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 2,
  },
  unitsScreenTitle: {
    position: 'absolute',
    left: (150 / 1242) * width,
    top: (173 / 1242) * width,
    width: (942 / 1242) * width,
    height: (100 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 1.2) / 1242 * width,
    textAlign: 'center',
    textTransform: 'capitalize',
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  unitsEuropeanText: {
    position: 'absolute',
    left: (179 / 1242) * width,
    top: (358 / 1242) * width,
    width: (900 / 1242) * width,
    height: (100 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 1.2) / 1242 * width,
    textTransform: 'capitalize',
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  unitsAmericanText: {
    position: 'absolute',
    left: (179 / 1242) * width,
    top: (481 / 1242) * width,
    width: (900 / 1242) * width,
    height: (100 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 1.2) / 1242 * width,
    textTransform: 'capitalize',
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  languageText: {
    position: 'absolute',
    left: (112 / 1242) * width,
    top: (920 / 1242) * width,
    width: (300 / 1242) * width,
    height: (70 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (52 / 1242) * width,
    lineHeight: (52 * 1.3) / 1242 * width,
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 2,
  },
  englishText: {
    position: 'absolute',
    left: (427 / 1242) * width,
    top: (920 / 1242) * width,
    width: (706 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 0.99) / 1242 * width,
    textAlign: 'right',
    color: '#8E9091',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 2,
  },
  languageScreenTitle: {
    position: 'absolute',
    left: (268 / 1242) * width,
    top: (173 / 1242) * width,
    width: (706 / 1242) * width,
    height: (100 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 1.2) / 1242 * width,
    textAlign: 'center',
    textTransform: 'capitalize',
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  languageOption: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (358 / 1242) * width,
    width: (89 / 1242) * width,
    height: (89 / 1242) * width,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#818284',
    borderRadius: (89 / 2 / 1242) * width,
    opacity: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageOptionFrench: {
    top: (481 / 1242) * width,
  },
  languageOptionRussian: {
    top: (604 / 1242) * width,
  },
  languageOptionSelected: {
    backgroundColor: '#21BA3C',
    borderColor: '#21BA3C',
  },
  englishLanguageText: {
    position: 'absolute',
    left: (179 / 1242) * width,
    top: (358 / 1242) * width,
    width: (900 / 1242) * width,
    height: (100 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 1.2) / 1242 * width,
    textTransform: 'capitalize',
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  frenchLanguageText: {
    position: 'absolute',
    left: (179 / 1242) * width,
    top: (481 / 1242) * width,
    width: (900 / 1242) * width,
    height: (100 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 1.2) / 1242 * width,
    textTransform: 'capitalize',
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  russianLanguageText: {
    position: 'absolute',
    left: (179 / 1242) * width,
    top: (604 / 1242) * width,
    width: (900 / 1242) * width,
    height: (100 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 1.2) / 1242 * width,
    textTransform: 'capitalize',
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  unitOption: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (361 / 1242) * width,
    width: (89 / 1242) * width,
    height: (89 / 1242) * width,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#818284',
    borderRadius: (89 / 2 / 1242) * width,
    opacity: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitOptionAmerican: {
    top: (481 / 1242) * width,
  },
  unitOptionSelected: {
    backgroundColor: '#21BA3C',
    borderColor: '#21BA3C',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: (50 / 1242) * width,
    fontWeight: 'bold',
  },
  consentText: {
    position: 'absolute',
    left: (110 / 1242) * width,
    top: (1106 / 1242) * width,
    width: (980 / 1242) * width,
    height: (80 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (52 / 1242) * width,
    lineHeight: (52 * 1.3) / 1242 * width,
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 2,
  },
  consentArrowIcon: {
    position: 'absolute',
    left: (1107 / 1242) * width,
    top: (1116 / 1242) * width,
    width: (26 / 1242) * width,
    height: (42 / 1242) * width,
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 3,
  },
  additionalRectangle: {
    position: 'absolute',
    left: (53 / 1242) * width,
    top: (1387 / 1242) * width,
    width: (1140 / 1242) * width,
    height: (372 / 1242) * width,
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
  resetDataText: {
    position: 'absolute',
    left: (112 / 1242) * width,
    top: (1450 / 1242) * width,
    width: (980 / 1242) * width,
    height: (80 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (52 / 1242) * width,
    lineHeight: (52 * 1.3) / 1242 * width,
    color: '#FF2F33',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 2,
  },
  deleteAccountText: {
    position: 'absolute',
    left: (112 / 1242) * width,
    top: (1636 / 1242) * width,
    width: (980 / 1242) * width,
    height: (80 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (52 / 1242) * width,
    lineHeight: (52 * 1.3) / 1242 * width,
    color: '#FF2F33',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 2,
  },
  additionalDividerLine: {
    position: 'absolute',
    left: (53 / 1242) * width,
    top: (1573 / 1242) * width,
    width: (1140 / 1242) * width,
    height: 0,
    borderTopWidth: 3,
    borderTopColor: '#DBD7DB',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  notificationsScreenTitle: {
    position: 'absolute',
    left: (100 / 1242) * width,
    top: (173 / 1242) * width,
    width: (1042 / 1242) * width,
    height: (100 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 1.2) / 1242 * width,
    textAlign: 'center',
    textTransform: 'capitalize',
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  notificationsScreenRectangle: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (358 / 1242) * width,
    width: (1140 / 1242) * width,
    height: (200 / 1242) * width,
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
  reminderScreenText: {
    position: 'absolute',
    left: (112 / 1242) * width,
    top: (430 / 1242) * width,
    width: (850 / 1242) * width,
    height: (80 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (52 / 1242) * width,
    lineHeight: (52 * 1.3) / 1242 * width,
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 2,
  },
  reminderToggle: {
    position: 'absolute',
    left: (1000 / 1242) * width,
    top: (445 / 1242) * width,
    width: (130 / 1242) * width,
    height: (65 / 1242) * width,
    borderRadius: (32.5 / 1242) * width,
    backgroundColor: '#E0E0E0',
    opacity: 1,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: (5 / 1242) * width,
  },
  reminderToggleEnabled: {
    backgroundColor: '#21BA3C',
    alignItems: 'flex-end',
    paddingRight: (5 / 1242) * width,
    paddingLeft: 0,
  },
  reminderToggleButton: {
    width: (55 / 1242) * width,
    height: (55 / 1242) * width,
    borderRadius: (27.5 / 1242) * width,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  reminderToggleButtonEnabled: {
    backgroundColor: '#FFFFFF',
  },
  reminderStatusText: {
    position: 'absolute',
    left: (1000 / 1242) * width,
    top: (530 / 1242) * width,
    width: (130 / 1242) * width,
    height: (40 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (32 / 1242) * width,
    lineHeight: (32 * 1.2) / 1242 * width,
    textAlign: 'center',
    color: '#8E9091',
    opacity: 1,
    zIndex: 2,
  },
  timeSettingRectangle: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (600 / 1242) * width,
    width: (1140 / 1242) * width,
    height: (200 / 1242) * width,
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
  timeSettingLabel: {
    position: 'absolute',
    left: (112 / 1242) * width,
    top: (670 / 1242) * width,
    width: (600 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (52 / 1242) * width,
    lineHeight: (52 * 1.3) / 1242 * width,
    color: '#303539',
    opacity: 1,
    zIndex: 2,
  },
  timeSettingValue: {
    position: 'absolute',
    left: (432 / 1242) * width,
    top: (670 / 1242) * width,
    width: (706 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 0.99) / 1242 * width,
    textAlign: 'right',
    color: '#8E9091',
    opacity: 1,
    zIndex: 2,
  },
  timePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: (1242 / 1242) * width,
    height: (2688 / 1242) * width,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  timePickerModal: {
    width: (800 / 1242) * width,
    height: (600 / 1242) * width,
    backgroundColor: '#FFFFFF',
    borderRadius: (40 / 1242) * width,
    padding: (40 / 1242) * width,
    alignItems: 'center',
  },
  timePickerTitle: {
    fontSize: (56 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    color: '#303539',
    marginBottom: (30 / 1242) * width,
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: (300 / 1242) * width,
  },
  hourPicker: {
    width: (150 / 1242) * width,
    height: (300 / 1242) * width,
  },
  minutePicker: {
    width: (150 / 1242) * width,
    height: (300 / 1242) * width,
  },
  timeSeparator: {
    fontSize: (60 / 1242) * width,
    fontWeight: 'bold',
    color: '#303539',
    marginHorizontal: (20 / 1242) * width,
  },
  timePickerItem: {
    height: (60 / 1242) * width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timePickerText: {
    fontSize: (44 / 1242) * width,
    fontFamily: 'Alatsi',
    color: '#8E9091',
  },
  timePickerTextSelected: {
    color: '#FF77C0',
    fontWeight: 'bold',
  },
  timePickerButtons: {
    flexDirection: 'row',
    marginTop: (40 / 1242) * width,
    gap: (20 / 1242) * width,
  },
  timePickerCancelButton: {
    paddingHorizontal: (40 / 1242) * width,
    paddingVertical: (15 / 1242) * width,
    borderRadius: (25 / 1242) * width,
    backgroundColor: '#E0E0E0',
  },
  timePickerSaveButton: {
    paddingHorizontal: (40 / 1242) * width,
    paddingVertical: (15 / 1242) * width,
    borderRadius: (25 / 1242) * width,
    backgroundColor: '#FF77C0',
  },
  timePickerCancelText: {
    fontSize: (36 / 1242) * width,
    fontFamily: 'Alatsi',
    color: '#303539',
  },
  timePickerSaveText: {
    fontSize: (36 / 1242) * width,
    fontFamily: 'Alatsi',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sugarLimitArrowIcon: {
    position: 'absolute',
    left: (1109 / 1242) * width,
    top: (1371.7 / 1242) * width,
    width: (26 / 1242) * width,
    height: (39.5544319152832 / 1242) * width,
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 3,
  },
  sugarLimitScreenTitle: {
    position: 'absolute',
    left: (100 / 1242) * width,
    top: (173 / 1242) * width,
    width: (1042 / 1242) * width,
    height: (100 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 1.2) / 1242 * width,
    textAlign: 'center',
    textTransform: 'capitalize',
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  sugarLimitScreenRectangle: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (358 / 1242) * width,
    width: (1140 / 1242) * width,
    height: (200 / 1242) * width,
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
  sugarLimitToggleText: {
    position: 'absolute',
    left: (112 / 1242) * width,
    top: (430 / 1242) * width,
    width: (850 / 1242) * width,
    height: (80 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (52 / 1242) * width,
    lineHeight: (52 * 1.3) / 1242 * width,
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    zIndex: 2,
  },
  sugarLimitToggle: {
    position: 'absolute',
    left: (1000 / 1242) * width,
    top: (445 / 1242) * width,
    width: (130 / 1242) * width,
    height: (65 / 1242) * width,
    borderRadius: (32.5 / 1242) * width,
    backgroundColor: '#E0E0E0',
    opacity: 1,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: (5 / 1242) * width,
  },
  sugarLimitToggleEnabled: {
    backgroundColor: '#21BA3C',
    alignItems: 'flex-end',
    paddingRight: (5 / 1242) * width,
    paddingLeft: 0,
  },
  sugarLimitToggleButton: {
    width: (55 / 1242) * width,
    height: (55 / 1242) * width,
    borderRadius: (27.5 / 1242) * width,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  sugarLimitToggleButtonEnabled: {
    backgroundColor: '#FFFFFF',
  },
  sugarLimitValueRectangle: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (600 / 1242) * width,
    width: (1140 / 1242) * width,
    height: (200 / 1242) * width,
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
  sugarLimitValueLabel: {
    position: 'absolute',
    left: (112 / 1242) * width,
    top: (680 / 1242) * width,
    width: (580 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (38 / 1242) * width,
    lineHeight: (38 * 1.3) / 1242 * width,
    color: '#303539',
    opacity: 1,
    zIndex: 2,
  },
  sugarLimitValueInput: {
    position: 'absolute',
    left: (720 / 1242) * width,
    top: (665 / 1242) * width,
    width: (230 / 1242) * width,
    height: (70 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 0.99) / 1242 * width,
    textAlign: 'right',
    color: '#303539',
    opacity: 1,
    zIndex: 2,
    paddingRight: (10 / 1242) * width,
  },
  sugarLimitUnit: {
    position: 'absolute',
    left: (965 / 1242) * width,
    top: (670 / 1242) * width,
    width: (120 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 0.99) / 1242 * width,
    color: '#8E9091',
    opacity: 1,
    zIndex: 2,
  },
  testSugarLimitButton: {
    position: 'absolute',
    left: (300 / 1242) * width,
    top: (850 / 1242) * width,
    width: (642 / 1242) * width,
    height: (150 / 1242) * width,
    borderRadius: (75 / 1242) * width,
    backgroundColor: '#FF77C0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    opacity: 1,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  testSugarLimitButtonText: {
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default SettingsScreen;