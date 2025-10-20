import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList,
  Platform,
} from 'react-native';
import { t, Language } from './translations';
import { UnitSystem } from './unitConversion';

const { width, height } = Dimensions.get('window');

interface ProductDetailScreenProps {
  onBack: () => void;
  product: {
    id: number;
    name: string;
    calories: number;
    sugar: number;
    protein: number;
    carbohydrates: number;
    fats: number;
    sodium: number;
    cholesterol: number;
    potassium: number;
  };
  language?: Language;
  onProPress?: () => void;
  isPremium?: boolean;
  onSave?: (savedData: any) => void;
  unitSystem?: UnitSystem;
  selectedDate?: Date;
  isEditing?: boolean;
  currentAmount?: string;
}

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ onBack, product, language = 'English', onProPress, isPremium = false, onSave, unitSystem = 'european', selectedDate, isEditing = false, currentAmount }) => {
  const [selectedAmount, setSelectedAmount] = useState(
    currentAmount || (unitSystem === 'american' ? '3.5oz' : '100g')
  );
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [customInput, setCustomInput] = useState('');

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

  const predefinedAmounts = unitSystem === 'american'
    ? ['3.5oz', '7oz', '10.5oz', '14oz', '17.5oz']
    : ['100g', '200g', '300g', '400g', '500g'];

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    setIsDropdownVisible(false);
    setCustomInput('');
  };

  const handleCustomInput = (value: string) => {
    setCustomInput(value);
    if (value) {
      const suffix = unitSystem === 'american' ? 'oz' : 'g';
      setSelectedAmount(value + suffix);
    }
  };

  
  const getAmountInGrams = (amount: string): number => {
    if (amount.includes('oz')) {
      const ozValue = parseFloat(amount.replace('oz', ''));
      return Math.round(ozValue * 28.35); 
    } else {
      return parseInt(amount.replace('g', ''));
    }
  };

  const handleSave = () => {
    const amountInGrams = getAmountInGrams(selectedAmount);
    const multiplier = amountInGrams / 100;
    const dateToUse = selectedDate || new Date();
    const currentDate = dateToUse.toISOString().split('T')[0]; 

    const savedData = {
      productId: product.id,
      productName: product.name,
      selectedAmount: selectedAmount,
      amountInGrams: amountInGrams,
      calculatedNutrition: {
        calories: Math.round(product.calories * multiplier),
        sugar: Math.round(product.sugar * multiplier),
        protein: Math.round(product.protein * multiplier),
        carbohydrates: Math.round(product.carbohydrates * multiplier),
        fats: Math.round(product.fats * multiplier),
        sodium: Math.round(product.sodium * multiplier),
        cholesterol: Math.round(product.cholesterol * multiplier),
        potassium: Math.round(product.potassium * multiplier),
      },
      date: currentDate,
      savedAt: new Date().toISOString(),
    };

    if (onSave) {
      onSave(savedData);
    }

    console.log('Saved nutrition data for date:', currentDate, savedData);

    
    onBack();
  };

  // Create adaptive styles function
  const getStyles = () => {
    return StyleSheet.create({
      ...baseStyles,
      productName: {
        position: 'absolute',
        width: (580 / 1242) * width,
        height: (92 / 1242) * width,
        top: isTablet ? (280 / 1242) * width : (366 / 1242) * width,
        left: (51 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (40 / 1242) * width : (48 / 1242) * width,
        lineHeight: isTablet ? (40 * 0.99 / 1242) * width : (48 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textTransform: 'capitalize',
        color: '#303539',
        zIndex: 10,
      },
      productCalories: {
        position: 'absolute',
        width: (706 / 1242) * width,
        height: (60 / 1242) * width,
        top: isTablet ? (330 / 1242) * width : (441 / 1242) * width,
        left: (51 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (30 / 1242) * width : (36 / 1242) * width,
        lineHeight: isTablet ? (30 * 0.99 / 1242) * width : (36 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textTransform: 'capitalize',
        color: '#444343',
        zIndex: 10,
      },
      whiteRectangle: {
        position: 'absolute',
        width: isTablet ? (400 / 1242) * width : (531 / 1242) * width,
        height: isTablet ? (120 / 1242) * width : (150 / 1242) * width,
        top: isTablet ? (270 / 1242) * width : (359 / 1242) * width,
        left: isTablet ? (700 / 1242) * width : (660 / 1242) * width,
        borderRadius: (34 / 1242) * width,
        backgroundColor: '#FFFFFF',
        shadowColor: '#B4ADB1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.69,
        shadowRadius: (8.8 / 1242) * width,
        elevation: 8,
        zIndex: 5,
      },
      defaultText: {
        position: 'absolute',
        width: isTablet ? (350 / 1242) * width : (475 / 1242) * width,
        height: (92 / 1242) * width,
        top: isTablet ? (300 / 1242) * width : (400 / 1242) * width,
        left: isTablet ? (715 / 1242) * width : (680 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (50 / 1242) * width : (64 / 1242) * width,
        lineHeight: isTablet ? (50 * 0.99 / 1242) * width : (64 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textAlign: 'left',
        textTransform: 'capitalize',
        color: '#303539',
        zIndex: 10,
      },
      arrowDownContainer: {
        position: 'absolute',
        width: (46 / 1242) * width,
        height: (75 / 1242) * width,
        top: isTablet ? (295 / 1242) * width : (411 / 1242) * width,
        left: isTablet ? (1030 / 1242) * width : (1070 / 1242) * width,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
      nutritionRectangle: {
        position: 'absolute',
        width: (1140 / 1242) * width,
        height: isTablet ? (1420 / 1242) * width : (1714 / 1242) * width,
        top: isTablet ? (420 / 1242) * width : (570 / 1242) * width,
        left: (51 / 1242) * width,
        borderRadius: (75 / 1242) * width,
        backgroundColor: '#FFFFFF',
        shadowColor: '#B4ADB1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.69,
        shadowRadius: (8.8 / 1242) * width,
        elevation: 8,
        zIndex: 5,
      },
      caloriesLabel: {
        position: 'absolute',
        width: (500 / 1242) * width,
        height: (60 / 1242) * width,
        top: isTablet ? (480 / 1242) * width : (681 / 1242) * width,
        left: (100 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (45 / 1242) * width : (60 / 1242) * width,
        lineHeight: isTablet ? (45 * 0.99 / 1242) * width : (60 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textTransform: 'capitalize',
        color: '#303539',
        zIndex: 10,
      },
      caloriesValue: {
        position: 'absolute',
        width: (350 / 1242) * width,
        height: (60 / 1242) * width,
        top: isTablet ? (480 / 1242) * width : (681 / 1242) * width,
        left: (790 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (40 / 1242) * width : (50 / 1242) * width,
        lineHeight: isTablet ? (40 * 0.99 / 1242) * width : (50 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textAlign: 'right',
        textTransform: 'capitalize',
        color: '#303539',
        zIndex: 10,
      },
      sugarLabel: {
        position: 'absolute',
        width: (500 / 1242) * width,
        height: (60 / 1242) * width,
        top: isTablet ? (590 / 1242) * width : (825 / 1242) * width,
        left: (96 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (45 / 1242) * width : (60 / 1242) * width,
        lineHeight: isTablet ? (45 * 0.99 / 1242) * width : (60 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textTransform: 'capitalize',
        color: '#303539',
        zIndex: 10,
      },
      sugarValue: {
        position: 'absolute',
        width: (280 / 1242) * width,
        height: (60 / 1242) * width,
        top: isTablet ? (590 / 1242) * width : (825 / 1242) * width,
        left: (860 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (40 / 1242) * width : (50 / 1242) * width,
        lineHeight: isTablet ? (40 * 0.99 / 1242) * width : (50 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textAlign: 'right',
        textTransform: 'capitalize',
        color: '#303539',
        zIndex: 10,
      },
      proteinLabel: {
        position: 'absolute',
        width: (500 / 1242) * width,
        height: (60 / 1242) * width,
        top: isTablet ? (690 / 1242) * width : (955 / 1242) * width,
        left: (96 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (45 / 1242) * width : (60 / 1242) * width,
        lineHeight: isTablet ? (45 * 0.99 / 1242) * width : (60 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textTransform: 'capitalize',
        color: '#303539',
        zIndex: 10,
      },
      proteinValue: {
        position: 'absolute',
        width: (280 / 1242) * width,
        height: (60 / 1242) * width,
        top: isTablet ? (690 / 1242) * width : (955 / 1242) * width,
        left: (860 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (40 / 1242) * width : (50 / 1242) * width,
        lineHeight: isTablet ? (40 * 0.99 / 1242) * width : (50 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textAlign: 'right',
        textTransform: 'capitalize',
        color: '#303539',
        zIndex: 10,
      },
      carbohydratesLabel: {
        position: 'absolute',
        width: (500 / 1242) * width,
        height: (60 / 1242) * width,
        top: isTablet ? (790 / 1242) * width : (1085 / 1242) * width,
        left: (96 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (45 / 1242) * width : (60 / 1242) * width,
        lineHeight: isTablet ? (45 * 0.99 / 1242) * width : (60 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textTransform: 'capitalize',
        color: '#303539',
        zIndex: 10,
      },
      carbohydratesValue: {
        position: 'absolute',
        width: (280 / 1242) * width,
        height: (60 / 1242) * width,
        top: isTablet ? (790 / 1242) * width : (1085 / 1242) * width,
        left: (860 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (40 / 1242) * width : (50 / 1242) * width,
        lineHeight: isTablet ? (40 * 0.99 / 1242) * width : (50 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textAlign: 'right',
        textTransform: 'capitalize',
        color: '#303539',
        zIndex: 10,
      },
      fatsLabel: {
        position: 'absolute',
        width: (500 / 1242) * width,
        height: (60 / 1242) * width,
        top: isTablet ? (890 / 1242) * width : (1215 / 1242) * width,
        left: (96 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (45 / 1242) * width : (60 / 1242) * width,
        lineHeight: isTablet ? (45 * 0.99 / 1242) * width : (60 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textTransform: 'capitalize',
        color: '#303539',
        zIndex: 10,
      },
      fatsValue: {
        position: 'absolute',
        width: (280 / 1242) * width,
        height: (60 / 1242) * width,
        top: isTablet ? (890 / 1242) * width : (1215 / 1242) * width,
        left: (860 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (40 / 1242) * width : (50 / 1242) * width,
        lineHeight: isTablet ? (40 * 0.99 / 1242) * width : (50 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textAlign: 'right',
        textTransform: 'capitalize',
        color: '#303539',
        zIndex: 10,
      },
      dividerLine: {
        position: 'absolute',
        width: (1140 / 1242) * width,
        height: 0,
        top: isTablet ? (980 / 1242) * width : (1373 / 1242) * width,
        left: (51 / 1242) * width,
        borderWidth: (3 / 1242) * width,
        borderColor: '#DBD7DB',
        zIndex: 10,
      },
      otherText: {
        position: 'absolute',
        width: (500 / 1242) * width,
        height: (60 / 1242) * width,
        top: isTablet ? (1030 / 1242) * width : (1437 / 1242) * width,
        left: (100 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (45 / 1242) * width : (60 / 1242) * width,
        lineHeight: isTablet ? (45 * 0.99 / 1242) * width : (60 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textTransform: 'capitalize',
        color: '#303539',
        zIndex: 10,
      },
      sodiumLabel: {
        position: 'absolute',
        width: (500 / 1242) * width,
        height: (60 / 1242) * width,
        top: isTablet ? (1120 / 1242) * width : (1535 / 1242) * width,
        left: (100 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (32 / 1242) * width : (40 / 1242) * width,
        lineHeight: isTablet ? (32 * 0.99 / 1242) * width : (40 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textTransform: 'capitalize',
        color: '#303539',
        zIndex: 10,
      },
      sodiumValue: {
        position: 'absolute',
        width: (280 / 1242) * width,
        height: (60 / 1242) * width,
        top: isTablet ? (1120 / 1242) * width : (1535 / 1242) * width,
        left: (860 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (32 / 1242) * width : (40 / 1242) * width,
        lineHeight: isTablet ? (32 * 0.99 / 1242) * width : (40 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textAlign: 'right',
        textTransform: 'capitalize',
        color: '#303539',
        zIndex: 10,
      },
      cholesterolLabel: {
        position: 'absolute',
        width: (500 / 1242) * width,
        height: (60 / 1242) * width,
        top: isTablet ? (1220 / 1242) * width : (1630 / 1242) * width,
        left: (100 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (32 / 1242) * width : (40 / 1242) * width,
        lineHeight: isTablet ? (32 * 0.99 / 1242) * width : (40 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textTransform: 'capitalize',
        color: '#303539',
        zIndex: 10,
      },
      cholesterolValue: {
        position: 'absolute',
        width: (280 / 1242) * width,
        height: (60 / 1242) * width,
        top: isTablet ? (1220 / 1242) * width : (1630 / 1242) * width,
        left: (860 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (32 / 1242) * width : (40 / 1242) * width,
        lineHeight: isTablet ? (32 * 0.99 / 1242) * width : (40 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textAlign: 'right',
        textTransform: 'capitalize',
        color: '#303539',
        zIndex: 10,
      },
      potassiumLabel: {
        position: 'absolute',
        width: (500 / 1242) * width,
        height: (60 / 1242) * width,
        top: isTablet ? (1320 / 1242) * width : (1725 / 1242) * width,
        left: (100 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (32 / 1242) * width : (40 / 1242) * width,
        lineHeight: isTablet ? (32 * 0.99 / 1242) * width : (40 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textTransform: 'capitalize',
        color: '#303539',
        zIndex: 10,
      },
      potassiumValue: {
        position: 'absolute',
        width: (280 / 1242) * width,
        height: (60 / 1242) * width,
        top: isTablet ? (1320 / 1242) * width : (1725 / 1242) * width,
        left: (860 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (32 / 1242) * width : (40 / 1242) * width,
        lineHeight: isTablet ? (32 * 0.99 / 1242) * width : (40 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textAlign: 'right',
        textTransform: 'capitalize',
        color: '#303539',
        zIndex: 10,
      },
      // Premium overlays adaptations
      premiumOverlay: {
        position: 'absolute',
        width: (205 / 1242) * width,
        height: (82 / 1242) * width,
        top: isTablet ? (670 / 1242) * width : (927 / 1242) * width,
        left: (931 / 1242) * width,
        borderRadius: (88 / 1242) * width,
        backgroundColor: '#21BA3C',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 8,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,
      },
      carbohydratesOverlay: {
        position: 'absolute',
        width: (205 / 1242) * width,
        height: (82 / 1242) * width,
        top: isTablet ? (770 / 1242) * width : (1057 / 1242) * width,
        left: (931 / 1242) * width,
        borderRadius: (88 / 1242) * width,
        backgroundColor: '#21BA3C',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 8,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,
      },
      fatsOverlay: {
        position: 'absolute',
        width: (205 / 1242) * width,
        height: (82 / 1242) * width,
        top: isTablet ? (870 / 1242) * width : (1187 / 1242) * width,
        left: (931 / 1242) * width,
        borderRadius: (88 / 1242) * width,
        backgroundColor: '#21BA3C',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 8,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,
      },
      sodiumOverlay: {
        position: 'absolute',
        width: (205 / 1242) * width,
        height: (82 / 1242) * width,
        top: isTablet ? (1100 / 1242) * width : (1507 / 1242) * width,
        left: (931 / 1242) * width,
        borderRadius: (88 / 1242) * width,
        backgroundColor: '#21BA3C',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 8,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,
      },
      cholesterolOverlay: {
        position: 'absolute',
        width: (205 / 1242) * width,
        height: (82 / 1242) * width,
        top: isTablet ? (1200 / 1242) * width : (1602 / 1242) * width,
        left: (931 / 1242) * width,
        borderRadius: (88 / 1242) * width,
        backgroundColor: '#21BA3C',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 8,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,
      },
      potassiumOverlay: {
        position: 'absolute',
        width: (205 / 1242) * width,
        height: (82 / 1242) * width,
        top: isTablet ? (1300 / 1242) * width : (1697 / 1242) * width,
        left: (931 / 1242) * width,
        borderRadius: (88 / 1242) * width,
        backgroundColor: '#21BA3C',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 8,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,
      },
      // Dropdown adaptations
      dropdownItem: {
        position: 'absolute',
        width: isTablet ? (400 / 1242) * width : (531 / 1242) * width,
        height: isTablet ? (120 / 1242) * width : (150 / 1242) * width,
        left: isTablet ? (700 / 1242) * width : (660 / 1242) * width,
        borderRadius: (34 / 1242) * width,
        backgroundColor: '#FFFFFF',
        shadowColor: '#B4ADB1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.69,
        shadowRadius: (8.8 / 1242) * width,
        elevation: 8,
        justifyContent: 'center',
        alignItems: 'center',
      },
      dropdownItemText: {
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (50 / 1242) * width : (64 / 1242) * width,
        color: '#303539',
      },
      customInput: {
        width: '100%',
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (50 / 1242) * width : (64 / 1242) * width,
        color: '#303539',
        textAlign: 'center',
        backgroundColor: 'transparent',
      },
      saveButton: {
        position: 'absolute',
        width: (1111 / 1242) * width,
        height: (176 / 1242) * width,
        top: isTablet ? height - (280 / 1242) * width : (2353 / 1242) * width,
        left: (65 / 1242) * width,
        borderRadius: (88 / 1242) * width,
        backgroundColor: '#FF77C0',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 8,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
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

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Image
          source={require('./assets/Profile/arrow.png')}
          style={styles.backArrowImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Text style={styles.productName}>{t(product.name, language)}</Text>

      <Text style={styles.productCalories}>
        {product.calories} {unitSystem === 'american' ? 'Calories' : 'kcal'}
      </Text>

      <TouchableOpacity
        style={styles.whiteRectangle}
        onPress={() => setIsDropdownVisible(!isDropdownVisible)}
      />

      <Text style={styles.defaultText}>{selectedAmount}</Text>

      <TouchableOpacity
        style={styles.arrowDownContainer}
        onPress={() => setIsDropdownVisible(!isDropdownVisible)}
      >
        <Image
          source={require('./assets/Profile/arrowGrey.png')}
          style={styles.arrowDown}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View style={styles.nutritionRectangle} />

      <Text style={styles.caloriesLabel}>{t('calories', language)}</Text>

      <Text style={styles.caloriesValue}>
        {Math.round((product.calories * getAmountInGrams(selectedAmount) / 100))} {unitSystem === 'american' ? 'Calories' : 'kcal'}
      </Text>

      <Text style={styles.sugarLabel}>{t('sugar', language)}</Text>

      <Text style={styles.sugarValue}>
        {unitSystem === 'american'
          ? Math.round((product.sugar * getAmountInGrams(selectedAmount) / 100) / 28.35 * 100) / 100
          : Math.round((product.sugar * getAmountInGrams(selectedAmount) / 100))
        }{unitSystem === 'american' ? 'oz' : 'g'}
      </Text>

      <Text style={styles.proteinLabel}>{t('protein', language)}</Text>

      {isPremium && (
        <Text style={styles.proteinValue}>
          {unitSystem === 'american'
            ? Math.round((product.protein * getAmountInGrams(selectedAmount) / 100) / 28.35 * 100) / 100
            : Math.round((product.protein * getAmountInGrams(selectedAmount) / 100))
          }{unitSystem === 'american' ? 'oz' : 'g'}
        </Text>
      )}

      <Text style={styles.carbohydratesLabel}>{t('carbohydrates', language)}</Text>

      {isPremium && (
        <Text style={styles.carbohydratesValue}>
          {unitSystem === 'american'
            ? Math.round((product.carbohydrates * getAmountInGrams(selectedAmount) / 100) / 28.35 * 100) / 100
            : Math.round((product.carbohydrates * getAmountInGrams(selectedAmount) / 100))
          }{unitSystem === 'american' ? 'oz' : 'g'}
        </Text>
      )}

      <Text style={styles.fatsLabel}>{t('fats', language)}</Text>

      {isPremium && (
        <Text style={styles.fatsValue}>
          {unitSystem === 'american'
            ? Math.round((product.fats * getAmountInGrams(selectedAmount) / 100) / 28.35 * 100) / 100
            : Math.round((product.fats * getAmountInGrams(selectedAmount) / 100))
          }{unitSystem === 'american' ? 'oz' : 'g'}
        </Text>
      )}

      <View style={styles.dividerLine} />

      <Text style={styles.otherText}>{t('other', language)}:</Text>

      <Text style={styles.sodiumLabel}>{t('sodium', language)}</Text>

      {isPremium && (
        <Text style={styles.sodiumValue}>
          {Math.round((product.sodium * getAmountInGrams(selectedAmount) / 100))}mg
        </Text>
      )}

      <Text style={styles.cholesterolLabel}>{t('cholesterol', language)}</Text>

      {isPremium && (
        <Text style={styles.cholesterolValue}>
          {Math.round((product.cholesterol * getAmountInGrams(selectedAmount) / 100))}mg
        </Text>
      )}

      <Text style={styles.potassiumLabel}>{t('potassium', language)}</Text>

      {isPremium && (
        <Text style={styles.potassiumValue}>
          {Math.round((product.potassium * getAmountInGrams(selectedAmount) / 100))}mg
        </Text>
      )}

      {!isPremium && (
        <TouchableOpacity style={styles.premiumOverlay} onPress={onProPress}>
          <Text style={styles.premiumText}>{t('look', language)}</Text>
        </TouchableOpacity>
      )}

      {!isPremium && (
        <TouchableOpacity style={styles.carbohydratesOverlay} onPress={onProPress}>
          <Text style={styles.premiumText}>{t('look', language)}</Text>
        </TouchableOpacity>
      )}

      {!isPremium && (
        <TouchableOpacity style={styles.fatsOverlay} onPress={onProPress}>
          <Text style={styles.premiumText}>{t('look', language)}</Text>
        </TouchableOpacity>
      )}

      {!isPremium && (
        <TouchableOpacity style={styles.sodiumOverlay} onPress={onProPress}>
          <Text style={styles.premiumText}>{t('look', language)}</Text>
        </TouchableOpacity>
      )}

      {!isPremium && (
        <TouchableOpacity style={styles.cholesterolOverlay} onPress={onProPress}>
          <Text style={styles.premiumText}>{t('look', language)}</Text>
        </TouchableOpacity>
      )}

      {!isPremium && (
        <TouchableOpacity style={styles.potassiumOverlay} onPress={onProPress}>
          <Text style={styles.premiumText}>{t('look', language)}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{t('save', language)}</Text>
      </TouchableOpacity>

      {isDropdownVisible && (
        <View style={styles.dropdownContainer}>
          {predefinedAmounts.map((item, index) => (
            <TouchableOpacity
              key={item}
              style={[styles.dropdownItem, {
                top: isTablet
                  ? (400 + index * 140) / 1242 * width
                  : (520 + index * 170) / 1242 * width
              }]}
              onPress={() => handleAmountSelect(item)}
            >
              <Text style={styles.dropdownItemText}>{item}</Text>
            </TouchableOpacity>
          ))}

          <View style={[styles.dropdownItem, styles.customInputContainer, {
            top: isTablet
              ? (400 + predefinedAmounts.length * 140) / 1242 * width
              : (520 + predefinedAmounts.length * 170) / 1242 * width
          }]}>
            <TextInput
              style={styles.customInput}
              placeholder={t('enter_amount', language)}
              value={customInput}
              onChangeText={(value) => {

                const numericValue = value.replace(/[^0-9]/g, '');
                handleCustomInput(numericValue);
              }}
              keyboardType="numeric"
            />
          </View>
        </View>
      )}

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
    transform: [{ rotate: '180deg' }],
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
  productName: {
    position: 'absolute',
    width: (580 / 1242) * width,
    height: (92 / 1242) * width,
    top: (366 / 1242) * width,
    left: (51 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textTransform: 'capitalize',
    color: '#303539',
    zIndex: 10,
  },
  productCalories: {
    position: 'absolute',
    width: (706 / 1242) * width,
    height: (60 / 1242) * width,
    top: (441 / 1242) * width,
    left: (51 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (36 / 1242) * width,
    lineHeight: (36 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textTransform: 'capitalize',
    color: '#444343',
    zIndex: 10,
  },
  whiteRectangle: {
    position: 'absolute',
    width: (531 / 1242) * width,
    height: (150 / 1242) * width,
    top: (359 / 1242) * width,
    left: (660 / 1242) * width,
    borderRadius: (34 / 1242) * width,
    backgroundColor: '#FFFFFF',
    shadowColor: '#B4ADB1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.69,
    shadowRadius: (8.8 / 1242) * width,
    elevation: 8,
    zIndex: 5,
  },
  defaultText: {
    position: 'absolute',
    width: (475 / 1242) * width,
    height: (92 / 1242) * width,
    top: (400 / 1242) * width,
    left: (680 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (64 / 1242) * width,
    lineHeight: (64 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textAlign: 'left',
    textTransform: 'capitalize',
    color: '#303539',
    zIndex: 10,
  },
  arrowDownContainer: {
    position: 'absolute',
    width: (46 / 1242) * width,
    height: (75 / 1242) * width,
    top: (411 / 1242) * width,
    left: (1070 / 1242) * width,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowDown: {
    width: (46 / 1242) * width,
    height: (75 / 1242) * width,
    transform: [{ rotate: '90deg' }],
    opacity: 1,
  },
  dropdownContainer: {
    position: 'absolute',
    zIndex: 20,
  },
  dropdownItem: {
    position: 'absolute',
    width: (531 / 1242) * width,
    height: (150 / 1242) * width,
    left: (660 / 1242) * width,
    borderRadius: (34 / 1242) * width,
    backgroundColor: '#FFFFFF',
    shadowColor: '#B4ADB1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.69,
    shadowRadius: (8.8 / 1242) * width,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownItemText: {
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (64 / 1242) * width,
    color: '#303539',
  },
  customInput: {
    width: '100%',
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (64 / 1242) * width,
    color: '#303539',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  gramSuffix: {
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (64 / 1242) * width,
    color: '#303539',
    marginLeft: (10 / 1242) * width,
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutritionRectangle: {
    position: 'absolute',
    width: (1140 / 1242) * width,
    height: (1714 / 1242) * width,
    top: (570 / 1242) * width,
    left: (51 / 1242) * width,
    borderRadius: (75 / 1242) * width,
    backgroundColor: '#FFFFFF',
    shadowColor: '#B4ADB1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.69,
    shadowRadius: (8.8 / 1242) * width,
    elevation: 8,
    zIndex: 5,
  },
  caloriesLabel: {
    position: 'absolute',
    width: (500 / 1242) * width,
    height: (60 / 1242) * width,
    top: (681 / 1242) * width,
    left: (100 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (60 / 1242) * width,
    lineHeight: (60 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textTransform: 'capitalize',
    color: '#303539',
    zIndex: 10,
  },
  caloriesValue: {
    position: 'absolute',
    width: (350 / 1242) * width,
    height: (60 / 1242) * width,
    top: (681 / 1242) * width,
    left: (790 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (50 / 1242) * width,
    lineHeight: (50 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textAlign: 'right',
    textTransform: 'capitalize',
    color: '#303539',
    zIndex: 10,
  },
  sugarLabel: {
    position: 'absolute',
    width: (500 / 1242) * width,
    height: (60 / 1242) * width,
    top: (825 / 1242) * width,
    left: (96 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (60 / 1242) * width,
    lineHeight: (60 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textTransform: 'capitalize',
    color: '#303539',
    zIndex: 10,
  },
  sugarValue: {
    position: 'absolute',
    width: (280 / 1242) * width,
    height: (60 / 1242) * width,
    top: (825 / 1242) * width,
    left: (860 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (50 / 1242) * width,
    lineHeight: (50 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textAlign: 'right',
    textTransform: 'capitalize',
    color: '#303539',
    zIndex: 10,
  },
  proteinLabel: {
    position: 'absolute',
    width: (500 / 1242) * width,
    height: (60 / 1242) * width,
    top: (955 / 1242) * width,
    left: (96 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (60 / 1242) * width,
    lineHeight: (60 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textTransform: 'capitalize',
    color: '#303539',
    zIndex: 10,
  },
  proteinValue: {
    position: 'absolute',
    width: (280 / 1242) * width,
    height: (60 / 1242) * width,
    top: (955 / 1242) * width,
    left: (860 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (50 / 1242) * width,
    lineHeight: (50 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textAlign: 'right',
    textTransform: 'capitalize',
    color: '#303539',
    zIndex: 10,
  },
  premiumOverlay: {
    position: 'absolute',
    width: (205 / 1242) * width,
    height: (82 / 1242) * width,
    top: (927 / 1242) * width,
    left: (931 / 1242) * width,
    borderRadius: (88 / 1242) * width,
    backgroundColor: '#21BA3C',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
  },
  carbohydratesOverlay: {
    position: 'absolute',
    width: (205 / 1242) * width,
    height: (82 / 1242) * width,
    top: (1057 / 1242) * width,
    left: (931 / 1242) * width,
    borderRadius: (88 / 1242) * width,
    backgroundColor: '#21BA3C',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
  },
  fatsOverlay: {
    position: 'absolute',
    width: (205 / 1242) * width,
    height: (82 / 1242) * width,
    top: (1187 / 1242) * width,
    left: (931 / 1242) * width,
    borderRadius: (88 / 1242) * width,
    backgroundColor: '#21BA3C',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
  },
  sodiumOverlay: {
    position: 'absolute',
    width: (205 / 1242) * width,
    height: (82 / 1242) * width,
    top: (1507 / 1242) * width,
    left: (931 / 1242) * width,
    borderRadius: (88 / 1242) * width,
    backgroundColor: '#21BA3C',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
  },
  cholesterolOverlay: {
    position: 'absolute',
    width: (205 / 1242) * width,
    height: (82 / 1242) * width,
    top: (1602 / 1242) * width,
    left: (931 / 1242) * width,
    borderRadius: (88 / 1242) * width,
    backgroundColor: '#21BA3C',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
  },
  potassiumOverlay: {
    position: 'absolute',
    width: (205 / 1242) * width,
    height: (82 / 1242) * width,
    top: (1697 / 1242) * width,
    left: (931 / 1242) * width,
    borderRadius: (88 / 1242) * width,
    backgroundColor: '#21BA3C',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
  },
  carbohydratesLabel: {
    position: 'absolute',
    width: (500 / 1242) * width,
    height: (60 / 1242) * width,
    top: (1085 / 1242) * width,
    left: (96 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (60 / 1242) * width,
    lineHeight: (60 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textTransform: 'capitalize',
    color: '#303539',
    zIndex: 10,
  },
  carbohydratesValue: {
    position: 'absolute',
    width: (280 / 1242) * width,
    height: (60 / 1242) * width,
    top: (1085 / 1242) * width,
    left: (860 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (50 / 1242) * width,
    lineHeight: (50 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textAlign: 'right',
    textTransform: 'capitalize',
    color: '#303539',
    zIndex: 10,
  },
  fatsLabel: {
    position: 'absolute',
    width: (500 / 1242) * width,
    height: (60 / 1242) * width,
    top: (1215 / 1242) * width,
    left: (96 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (60 / 1242) * width,
    lineHeight: (60 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textTransform: 'capitalize',
    color: '#303539',
    zIndex: 10,
  },
  fatsValue: {
    position: 'absolute',
    width: (280 / 1242) * width,
    height: (60 / 1242) * width,
    top: (1215 / 1242) * width,
    left: (860 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (50 / 1242) * width,
    lineHeight: (50 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textAlign: 'right',
    textTransform: 'capitalize',
    color: '#303539',
    zIndex: 10,
  },
  dividerLine: {
    position: 'absolute',
    width: (1140 / 1242) * width,
    height: 0,
    top: (1373 / 1242) * width,
    left: (51 / 1242) * width,
    borderWidth: (3 / 1242) * width,
    borderColor: '#DBD7DB',
    zIndex: 10,
  },
  otherText: {
    position: 'absolute',
    width: (500 / 1242) * width,
    height: (60 / 1242) * width,
    top: (1437 / 1242) * width,
    left: (100 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (60 / 1242) * width,
    lineHeight: (60 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textTransform: 'capitalize',
    color: '#303539',
    zIndex: 10,
  },
  sodiumLabel: {
    position: 'absolute',
    width: (500 / 1242) * width,
    height: (60 / 1242) * width,
    top: (1535 / 1242) * width,
    left: (100 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (40 / 1242) * width,
    lineHeight: (40 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textTransform: 'capitalize',
    color: '#303539',
    zIndex: 10,
  },
  sodiumValue: {
    position: 'absolute',
    width: (280 / 1242) * width,
    height: (60 / 1242) * width,
    top: (1535 / 1242) * width,
    left: (860 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (40 / 1242) * width,
    lineHeight: (40 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textAlign: 'right',
    textTransform: 'capitalize',
    color: '#303539',
    zIndex: 10,
  },
  cholesterolLabel: {
    position: 'absolute',
    width: (500 / 1242) * width,
    height: (60 / 1242) * width,
    top: (1630 / 1242) * width,
    left: (100 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (40 / 1242) * width,
    lineHeight: (40 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textTransform: 'capitalize',
    color: '#303539',
    zIndex: 10,
  },
  cholesterolValue: {
    position: 'absolute',
    width: (280 / 1242) * width,
    height: (60 / 1242) * width,
    top: (1630 / 1242) * width,
    left: (860 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (40 / 1242) * width,
    lineHeight: (40 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textAlign: 'right',
    textTransform: 'capitalize',
    color: '#303539',
    zIndex: 10,
  },
  potassiumLabel: {
    position: 'absolute',
    width: (500 / 1242) * width,
    height: (60 / 1242) * width,
    top: (1725 / 1242) * width,
    left: (100 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (40 / 1242) * width,
    lineHeight: (40 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textTransform: 'capitalize',
    color: '#303539',
    zIndex: 10,
  },
  potassiumValue: {
    position: 'absolute',
    width: (280 / 1242) * width,
    height: (60 / 1242) * width,
    top: (1725 / 1242) * width,
    left: (860 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (40 / 1242) * width,
    lineHeight: (40 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textAlign: 'right',
    textTransform: 'capitalize',
    color: '#303539',
    zIndex: 10,
  },
  saveButton: {
    position: 'absolute',
    width: (1111 / 1242) * width,
    height: (176 / 1242) * width,
    top: (2353 / 1242) * width,
    left: (65 / 1242) * width,
    borderRadius: (88 / 1242) * width,
    backgroundColor: '#FF77C0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  saveButtonText: {
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (60 / 1242) * width,
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  premiumText: {
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (40 / 1242) * width,
    lineHeight: (40 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textAlign: 'center',
    textTransform: 'capitalize',
    color: '#FFFFFF',
  },
});

export default ProductDetailScreen;