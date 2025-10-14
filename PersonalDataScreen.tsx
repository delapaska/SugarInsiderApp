import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { formatWeight, formatHeight, parseWeight, parseHeight as parseHeightUtil, convertWeight, convertHeight, UnitSystem } from './unitConversion';
import { t, Language } from './translations';

const { width } = Dimensions.get('window');

interface PersonalDataScreenProps {
  onBack: () => void;
  onWeightSave?: (weight: string) => void;
  currentWeight?: string;
  onHeightSave?: (height: string) => void;
  currentHeight?: string;
  onDateSave?: (date: string) => void;
  currentDate?: string;
  unitSystem?: UnitSystem;
  language?: Language;
  onDiaryPress: () => void;
  onStatisticsPress?: () => void;
  onProfilePress: () => void;
  onProPress: () => void;
}

const PersonalDataScreen: React.FC<PersonalDataScreenProps> = ({ onBack, onWeightSave, currentWeight, onHeightSave, currentHeight, onDateSave, currentDate, unitSystem = 'european', language = 'English', onDiaryPress, onStatisticsPress, onProfilePress, onProPress }) => {
  const [isWeightModalVisible, setIsWeightModalVisible] = useState(false);
  const [isHeightModalVisible, setIsHeightModalVisible] = useState(false);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [isYearDropdownVisible, setIsYearDropdownVisible] = useState(false);
  const [isMonthDropdownVisible, setIsMonthDropdownVisible] = useState(false);
  const [isDayDropdownVisible, setIsDayDropdownVisible] = useState(false);

  
  const initializeWeight = () => {
    if (!currentWeight) return unitSystem === 'european' ? 60 : 132;
    const weightValue = parseWeight(currentWeight);
    const isCurrentlyInKg = currentWeight.includes('kg');

    if (unitSystem === 'european') {
      return isCurrentlyInKg ? weightValue : convertWeight(weightValue, 'american', 'european');
    } else {
      return isCurrentlyInKg ? convertWeight(weightValue, 'european', 'american') : weightValue;
    }
  };

  const initializeHeight = () => {
    if (!currentHeight) return unitSystem === 'european' ? 175 : 70;
    const heightValue = parseHeightUtil(currentHeight);
    const isCurrentlyInCm = !currentHeight.includes("'");

    if (unitSystem === 'european') {
      return isCurrentlyInCm ? heightValue : convertHeight(heightValue, 'american', 'european');
    } else {
      return isCurrentlyInCm ? convertHeight(heightValue, 'european', 'american') : heightValue;
    }
  };

  const [weight, setWeight] = useState(Math.round(initializeWeight()));
  const [height, setHeight] = useState(Math.round(initializeHeight()));

  
  const parseWeightParts = () => {
    if (unitSystem === 'european') {
      if (currentWeight && currentWeight.includes(',')) {
        const match = currentWeight.match(/(\d+),(\d+)kg/);
        if (match) {
          return {
            major: parseInt(match[1], 10), 
            minor: parseInt(match[2], 10)  
          };
        }
      }
      const baseWeight = Math.floor(weight);
      return {
        major: baseWeight,
        minor: Math.round((weight - baseWeight) * 10)
      };
    } else {
      
      if (currentWeight && currentWeight.includes(',')) {
        const match = currentWeight.match(/(\d+),(\d+)lbs/);
        if (match) {
          return {
            major: parseInt(match[1], 10), 
            minor: parseInt(match[2], 10)  
          };
        }
      }
      const totalOunces = weight * 16; 
      const pounds = Math.floor(totalOunces / 16);
      const ounces = Math.round(totalOunces % 16);
      return {
        major: pounds,
        minor: ounces
      };
    }
  };

  
  const [isEditingMajor, setIsEditingMajor] = useState(true); 
  const [isEditingMinor, setIsEditingMinor] = useState(false); 
  const initialWeightParts = parseWeightParts();
  const [weightMajor, setWeightMajor] = useState(initialWeightParts.major);
  const [weightMinor, setWeightMinor] = useState(initialWeightParts.minor);

  
  const isEditingKg = isEditingMajor;
  const isEditingG = isEditingMinor;
  const weightKg = weightMajor;
  const weightG = weightMinor;
  const setIsEditingKg = setIsEditingMajor;
  const setIsEditingG = setIsEditingMinor;
  const setWeightKg = setWeightMajor;
  const setWeightG = setWeightMinor;

  const parseHeight = (height: string) => {
    const match = height.match(/(\d+)cm/);
    return match ? parseInt(match[1], 10) : 160;
  };

  const [heightCm, setHeightCm] = useState(parseHeight(currentHeight || '160cm'));

  const parseDate = (date: string) => {
    const match = date.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
    if (match) {
      return {
        year: parseInt(match[1], 10),
        month: parseInt(match[2], 10),
        day: parseInt(match[3], 10)
      };
    }
    return { year: 2007, month: 9, day: 17 };
  };

  const initialDate = parseDate(currentDate || '2007/9/17');
  const [dateYear, setDateYear] = useState(initialDate.year);
  const [dateMonth, setDateMonth] = useState(initialDate.month);
  const [dateDay, setDateDay] = useState(initialDate.day);

  const handleWeightPress = () => {
    setIsWeightModalVisible(true);
  };

  const handleCloseWeightModal = () => {
    setIsWeightModalVisible(false);
  };

  const handleSaveWeight = () => {
    setIsWeightModalVisible(false);
    if (onWeightSave) {
      onWeightSave(getDisplayedWeight());
    }
  };

  const getDisplayedWeight = () => {
    if (unitSystem === 'european') {
      return `${weightMajor},${weightMinor}kg`;
    } else {
      return `${weightMajor},${weightMinor}lbs`;
    }
  };

  const handleMinusPress = () => {
    if (isEditingMajor) {
      if (unitSystem === 'european') {
        setWeightMajor(Math.max(1, weightMajor - 1)); 
      } else {
        setWeightMajor(Math.max(1, weightMajor - 1)); 
      }
    } else if (isEditingMinor) {
      if (unitSystem === 'european') {
        setWeightMinor(Math.max(0, weightMinor - 1)); 
      } else {
        setWeightMinor(Math.max(0, weightMinor - 1)); 
      }
    }
  };

  const handlePlusPress = () => {
    if (isEditingMajor) {
      if (unitSystem === 'european') {
        setWeightMajor(Math.min(300, weightMajor + 1)); 
      } else {
        setWeightMajor(Math.min(660, weightMajor + 1)); 
      }
    } else if (isEditingMinor) {
      if (unitSystem === 'european') {
        setWeightMinor(Math.min(9, weightMinor + 1)); 
      } else {
        setWeightMinor(Math.min(15, weightMinor + 1)); 
      }
    }
  };

  const handleKgPress = () => {
    setIsEditingMajor(true);
    setIsEditingMinor(false);
  };

  const handleGPress = () => {
    setIsEditingMajor(false);
    setIsEditingMinor(true);
  };

  const getMajorColor = () => {
    return isEditingMajor ? '#303539' : '#8E9091';
  };

  const getMinorColor = () => {
    return isEditingMinor ? '#303539' : '#8E9091';
  };

  
  const getKgColor = getMajorColor;
  const getGColor = getMinorColor;

  const handleHeightPress = () => {
    setIsHeightModalVisible(true);
  };

  const handleCloseHeightModal = () => {
    setIsHeightModalVisible(false);
  };

  const handleSaveHeight = () => {
    setIsHeightModalVisible(false);
    if (onHeightSave) {
      onHeightSave(getDisplayedHeight());
    }
  };

  const getDisplayedHeight = () => {
    return formatHeight(height, unitSystem);
  };

  const handleWeightMinusPress = () => {
    const minValue = unitSystem === 'european' ? 30 : 66; 
    setWeight(Math.max(minValue, weight - 1));
  };

  const handleWeightPlusPress = () => {
    const maxValue = unitSystem === 'european' ? 200 : 440; 
    setWeight(Math.min(maxValue, weight + 1));
  };

  const handleHeightMinusPress = () => {
    const minValue = unitSystem === 'european' ? 100 : 40; 
    setHeight(Math.max(minValue, height - 1));
  };

  const handleHeightPlusPress = () => {
    const maxValue = unitSystem === 'european' ? 220 : 87; 
    setHeight(Math.min(maxValue, height + 1));
  };



  const handleDatePress = () => {
    setIsDateModalVisible(true);
  };

  const handleCloseDateModal = () => {
    setIsDateModalVisible(false);
  };

  const handleSaveDate = () => {
    setIsDateModalVisible(false);
    if (onDateSave) {
      onDateSave(`${dateYear}/${dateMonth}/${dateDay}`);
    }
  };

  const getDisplayedDateForButton = () => {
    return `${dateYear}/${dateMonth}/${dateDay}`;
  };


  const handleYearRectanglePress = () => {
    setIsYearDropdownVisible(!isYearDropdownVisible);
  };

  const handleYearSelect = (year: number) => {
    setDateYear(year);
    setIsYearDropdownVisible(false);
  };

  const generateYears = () => {
    const years = [];
    for (let year = 2024; year >= 1900; year--) {
      years.push(year);
    }
    return years;
  };

  const handleMonthRectanglePress = () => {
    setIsMonthDropdownVisible(!isMonthDropdownVisible);
  };

  const handleMonthSelect = (month: number) => {
    setDateMonth(month);
    setIsMonthDropdownVisible(false);
  };

  const generateMonths = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  };

  const handleDayRectanglePress = () => {
    setIsDayDropdownVisible(!isDayDropdownVisible);
  };

  const handleDaySelect = (day: number) => {
    setDateDay(day);
    setIsDayDropdownVisible(false);
  };

  const generateDays = () => {
    const daysInMonth = getDaysInMonth(dateYear, dateMonth);
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
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

      <Text style={styles.personalDataTitle}>{t('Personal Data', language)}</Text>

      <View style={styles.mainRectangle} />

      <View style={styles.dividerLine} />

      <View style={styles.secondDividerLine} />

      <Text style={styles.weightText}>{t('Weight', language)}</Text>

      <Text style={styles.heightText}>{t('Height', language)}</Text>

      <Text style={styles.dateOfBirthText}>{t('Date of birth', language)}</Text>

      <TouchableOpacity onPress={handleWeightPress}>
        <Text style={styles.weightValue}>{getDisplayedWeight()}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleHeightPress}>
        <Text style={styles.heightValue}>{getDisplayedHeight()}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDatePress}>
        <Text style={styles.dateOfBirthValue}>{getDisplayedDateForButton()}</Text>
      </TouchableOpacity>

      <Modal
        visible={isWeightModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseWeightModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseWeightModal}
        >
          <View style={styles.modalRectangle}>
            <Text style={styles.modalTitle}>{t('Update weight data', language)}</Text>

            <TouchableOpacity style={styles.minusButton} onPress={handleMinusPress}>
              <Text style={styles.minusText}>-</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.plusButton} onPress={handlePlusPress}>
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>

            <View style={styles.weightContainer}>
              <TouchableOpacity onPress={handleKgPress}>
                <Text style={[styles.weightNumber, { color: getMajorColor() }]}>
                  {unitSystem === 'european'
                    ? weightMajor.toString().padStart(2, '0')
                    : weightMajor.toString().padStart(3, '0')
                  }
                </Text>
              </TouchableOpacity>
              <Text style={styles.comma}>,</Text>
              <TouchableOpacity onPress={handleGPress}>
                <Text style={[styles.weightNumber, { color: getMinorColor() }]}>
                  {unitSystem === 'european'
                    ? weightMinor.toString()
                    : weightMinor.toString().padStart(2, '0')
                  }
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.kgText}>
              {unitSystem === 'european' ? t('KG', language) : `${t('LBS', language)}`}
            </Text>
            {unitSystem === 'american' && (
              <Text style={styles.ozText}>oz</Text>
            )}

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveWeight}>
              <Text style={styles.saveText}>{t('Save', language)}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={isHeightModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseHeightModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseHeightModal}
        >
          <View style={styles.modalRectangle}>
            <Text style={styles.modalTitle}>{t('Update height data', language)}</Text>

            <TouchableOpacity style={styles.minusButton} onPress={handleHeightMinusPress}>
              <Text style={styles.minusText}>-</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.plusButton} onPress={handleHeightPlusPress}>
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>

            <View style={styles.weightContainer}>
              <Text style={styles.weightNumber}>
                {unitSystem === 'european' ? height.toString() : `${Math.floor(height / 12)}'${height % 12}"`}
              </Text>
            </View>

            <Text style={styles.kgText}>{unitSystem === 'european' ? t('CM', language) : ''}</Text>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveHeight}>
              <Text style={styles.saveText}>{t('Save', language)}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={isDateModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseDateModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseDateModal}
        >
          <View style={styles.modalRectangle}>
            <Text style={styles.dateModalTitle}>Specify your date of birth</Text>

            <TouchableOpacity style={styles.yearRectangle} onPress={handleYearRectanglePress}>
              <Text style={styles.yearText}>{dateYear}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.monthRectangle} onPress={handleMonthRectanglePress}>
              <Text style={styles.monthText}>{dateMonth}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dayRectangle} onPress={handleDayRectanglePress}>
              <Text style={styles.dayText}>{dateDay}</Text>
            </TouchableOpacity>

            {isYearDropdownVisible && (
              <View style={styles.dropdownContainer}>
                <ScrollView style={styles.dropdown} showsVerticalScrollIndicator={false}>
                  {generateYears().map((year, index) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.dropdownItem,
                        index === generateYears().length - 1 && styles.lastDropdownItem
                      ]}
                      onPress={() => handleYearSelect(year)}
                    >
                      <Text style={[styles.dropdownText, year === dateYear && styles.selectedYear]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {isMonthDropdownVisible && (
              <View style={styles.monthDropdownContainer}>
                <ScrollView style={styles.monthDropdown} showsVerticalScrollIndicator={false}>
                  {generateMonths().map((month, index) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.dropdownItem,
                        index === generateMonths().length - 1 && styles.lastDropdownItem
                      ]}
                      onPress={() => handleMonthSelect(month)}
                    >
                      <Text style={[styles.dropdownText, month === dateMonth && styles.selectedYear]}>
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {isDayDropdownVisible && (
              <View style={styles.dayDropdownContainer}>
                <ScrollView style={styles.dayDropdown} showsVerticalScrollIndicator={false}>
                  {generateDays().map((day, index) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dropdownItem,
                        index === generateDays().length - 1 && styles.lastDropdownItem
                      ]}
                      onPress={() => handleDaySelect(day)}
                    >
                      <Text style={[styles.dropdownText, day === dateDay && styles.selectedYear]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveDate}>
              <Text style={styles.saveText}>{t('Save', language)}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

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
  personalDataTitle: {
    position: 'absolute',
    left: (53 / 1242) * width,
    top: (364 / 1242) * width,
    width: (706 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (64 / 1242) * width,
    lineHeight: (64 * 0.99) / 1242 * width,
    color: '#303539',
    textTransform: 'capitalize',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  mainRectangle: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (485 / 1242) * width,
    width: (1140 / 1242) * width,
    height: (604 / 1242) * width,
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
  dividerLine: {
    position: 'absolute',
    left: (53 / 1242) * width,
    top: (697 / 1242) * width,
    width: (1140 / 1242) * width,
    height: 0,
    borderTopWidth: 3,
    borderTopColor: '#DBD7DB',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  secondDividerLine: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (887 / 1242) * width,
    width: (1140 / 1242) * width,
    height: 0,
    borderTopWidth: 3,
    borderTopColor: '#DBD7DB',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  weightText: {
    position: 'absolute',
    left: (110 / 1242) * width,
    top: (567 / 1242) * width,
    width: (706 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (60 / 1242) * width,
    lineHeight: (60 * 0.99) / 1242 * width,
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  heightText: {
    position: 'absolute',
    left: (110 / 1242) * width,
    top: (745 / 1242) * width,
    width: (706 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (60 / 1242) * width,
    lineHeight: (60 * 0.99) / 1242 * width,
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  dateOfBirthText: {
    position: 'absolute',
    left: (110 / 1242) * width,
    top: (945 / 1242) * width,
    width: (706 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (60 / 1242) * width,
    lineHeight: (60 * 0.99) / 1242 * width,
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  weightValue: {
    position: 'absolute',
    left: (432 / 1242) * width,
    top: (567 / 1242) * width,
    width: (706 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: '400',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 0.99) / 1242 * width,
    textAlign: 'right',
    color: '#8E9091',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  modalOverlay: {
    flex: 1,
    width: (1242 / 1242) * width,
    height: (2688 / 1242) * width,
    backgroundColor: 'rgba(0, 0, 0, 0.84)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    opacity: 1,
  },
  modalRectangle: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (705 / 1242) * width,
    width: (1140 / 1242) * width,
    height: (1272 / 1242) * width,
    borderRadius: (75 / 1242) * width,
    backgroundColor: '#FFFFFF',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  modalTitle: {
    position: 'absolute',
    left: (169 / 1242) * width,
    top: (58 / 1242) * width,
    width: (802 / 1242) * width,
    height: (245 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (72 / 1242) * width,
    lineHeight: (72 * 1.1) / 1242 * width,
    textAlign: 'center',
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  minusButton: {
    position: 'absolute',
    left: (60 / 1242) * width,
    top: (579 / 1242) * width,
    width: (113 / 1242) * width,
    height: (113 / 1242) * width,
    borderRadius: (113 / 2 / 1242) * width,
    backgroundColor: '#FF77C0',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  minusText: {
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: (80 / 1242) * width,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  plusButton: {
    position: 'absolute',
    left: (967 / 1242) * width,
    top: (579 / 1242) * width,
    width: (113 / 1242) * width,
    height: (113 / 1242) * width,
    borderRadius: (113 / 2 / 1242) * width,
    backgroundColor: '#FF77C0',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  plusText: {
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: (80 / 1242) * width,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  kgText: {
    position: 'absolute',
    left: (169 / 1242) * width,
    top: (770 / 1242) * width,
    width: (802 / 1242) * width,
    height: (245 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: '400',
    fontSize: (96 / 1242) * width,
    lineHeight: (96 * 0.99) / 1242 * width,
    textAlign: 'center',
    color: '#303539',
    textTransform: 'uppercase',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  ozText: {
    position: 'absolute',
    left: (169 / 1242) * width,
    top: (850 / 1242) * width,
    width: (802 / 1242) * width,
    height: (100 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: '400',
    fontSize: (64 / 1242) * width,
    lineHeight: (64 * 0.99) / 1242 * width,
    textAlign: 'center',
    color: '#8E9091',
    textTransform: 'uppercase',
    opacity: 1,
  },
  weightContainer: {
    position: 'absolute',
    left: (272 / 1242) * width,
    top: (526 / 1242) * width,
    width: (597 / 1242) * width,
    height: (210 / 1242) * width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weightNumber: {
    fontFamily: 'Alatsi',
    fontWeight: '400',
    fontSize: (230 / 1242) * width,
    lineHeight: (230 * 0.99) / 1242 * width,
    textAlign: 'center',
    textTransform: 'capitalize',
    opacity: 1,
  },
  comma: {
    fontFamily: 'Alatsi',
    fontWeight: '400',
    fontSize: (230 / 1242) * width,
    lineHeight: (230 * 0.99) / 1242 * width,
    color: '#303539',
    marginHorizontal: (10 / 1242) * width,
  },
  saveButton: {
    position: 'absolute',
    left: (60 / 1242) * width,
    top: (1043 / 1242) * width,
    width: (1021 / 1242) * width,
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
    transform: [{ rotate: '0deg' }],
  },
  saveText: {
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (70 / 1242) * width,
    lineHeight: (70 * 0.99) / 1242 * width,
    textAlign: 'center',
    color: '#FFFFFF',
    textTransform: 'capitalize',
    opacity: 1,
  },
  heightValue: {
    position: 'absolute',
    left: (432 / 1242) * width,
    top: (757 / 1242) * width,
    width: (706 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: '400',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 0.99) / 1242 * width,
    textAlign: 'right',
    color: '#8E9091',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  dateOfBirthValue: {
    position: 'absolute',
    left: (432 / 1242) * width,
    top: (951 / 1242) * width,
    width: (706 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: '400',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 0.99) / 1242 * width,
    textAlign: 'right',
    color: '#8E9091',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  dateContainer: {
    position: 'absolute',
    left: (272 / 1242) * width,
    top: (526 / 1242) * width,
    width: (597 / 1242) * width,
    height: (210 / 1242) * width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateNumber: {
    fontFamily: 'Alatsi',
    fontWeight: '400',
    fontSize: (230 / 1242) * width,
    lineHeight: (230 * 0.99) / 1242 * width,
    textAlign: 'center',
    textTransform: 'capitalize',
    opacity: 1,
  },
  dateSlash: {
    fontFamily: 'Alatsi',
    fontWeight: '400',
    fontSize: (230 / 1242) * width,
    lineHeight: (230 * 0.99) / 1242 * width,
    color: '#303539',
    marginHorizontal: (10 / 1242) * width,
  },
  dateModalTitle: {
    position: 'absolute',
    left: (169 / 1242) * width,
    top: (58 / 1242) * width,
    width: (802 / 1242) * width,
    height: (245 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: '400',
    fontSize: (96 / 1242) * width,
    lineHeight: (96 * 0.99) / 1242 * width,
    textAlign: 'center',
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  yearRectangle: {
    position: 'absolute',
    left: (61 / 1242) * width,
    top: (506 / 1242) * width,
    width: (316 / 1242) * width,
    height: (177 / 1242) * width,
    borderRadius: (40 / 1242) * width,
    backgroundColor: '#EFEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  yearText: {
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (64 / 1242) * width,
    lineHeight: (64 * 0.99) / 1242 * width,
    textAlign: 'center',
    color: '#303539',
    opacity: 1,
  },
  dropdownContainer: {
    position: 'absolute',
    left: (61 / 1242) * width,
    top: (683 / 1242) * width,
    width: (316 / 1242) * width,
    height: (5 * 177) / 1242 * width,
    backgroundColor: '#EFEEEE',
    borderRadius: (40 / 1242) * width,
    zIndex: 1000,
    overflow: 'hidden',
  },
  dropdown: {
    height: (5 * 177) / 1242 * width,
  },
  dropdownItem: {
    width: (316 / 1242) * width,
    height: (177 / 1242) * width,
    backgroundColor: '#EFEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D0D0D0',
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  dropdownText: {
    fontFamily: 'Alatsi',
    fontWeight: '400',
    fontSize: (64 / 1242) * width,
    lineHeight: (64 * 0.99) / 1242 * width,
    textAlign: 'center',
    color: '#6E777F',
  },
  selectedYear: {
    fontWeight: 'bold',
    color: '#FF77C0',
  },
  monthRectangle: {
    position: 'absolute',
    left: (414 / 1242) * width,
    top: (506 / 1242) * width,
    width: (316 / 1242) * width,
    height: (177 / 1242) * width,
    borderRadius: (40 / 1242) * width,
    backgroundColor: '#EFEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  monthText: {
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (64 / 1242) * width,
    lineHeight: (64 * 0.99) / 1242 * width,
    textAlign: 'center',
    color: '#303539',
    opacity: 1,
  },
  monthDropdownContainer: {
    position: 'absolute',
    left: (414 / 1242) * width,
    top: (683 / 1242) * width,
    width: (316 / 1242) * width,
    height: (5 * 177) / 1242 * width,
    backgroundColor: '#EFEEEE',
    borderRadius: (40 / 1242) * width,
    zIndex: 1000,
    overflow: 'hidden',
  },
  monthDropdown: {
    height: (5 * 177) / 1242 * width,
  },
  dayRectangle: {
    position: 'absolute',
    left: (767 / 1242) * width,
    top: (506 / 1242) * width,
    width: (316 / 1242) * width,
    height: (177 / 1242) * width,
    borderRadius: (40 / 1242) * width,
    backgroundColor: '#EFEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  dayText: {
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (64 / 1242) * width,
    lineHeight: (64 * 0.99) / 1242 * width,
    textAlign: 'center',
    color: '#303539',
    opacity: 1,
  },
  dayDropdownContainer: {
    position: 'absolute',
    left: (767 / 1242) * width,
    top: (683 / 1242) * width,
    width: (316 / 1242) * width,
    height: (5 * 177) / 1242 * width,
    backgroundColor: '#EFEEEE',
    borderRadius: (40 / 1242) * width,
    zIndex: 1000,
    overflow: 'hidden',
  },
  dayDropdown: {
    height: (5 * 177) / 1242 * width,
  },
});

export default PersonalDataScreen;