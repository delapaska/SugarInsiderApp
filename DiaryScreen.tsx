import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import ProfileScreen from './ProfileScreen';
import PersonalDataScreen from './PersonalDataScreen';
import SettingsScreen from './SettingsScreen';
import ProScreen from './ProScreen';
import ProductDetailScreen from './ProductDetailScreen';
import StatisticsScreen from './StatisticsScreen';
import PremiumWelcomeScreen from './PremiumWelcomeScreen';
import { UnitSystem } from './unitConversion';
import { t, Language } from './translations';
import NotificationService from './NotificationService';

const { width, height } = Dimensions.get('window');


interface DiaryScreenProps {
  onAccountDeleted?: () => void;
}

const DiaryScreen: React.FC<DiaryScreenProps> = ({ onAccountDeleted }) => {
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

  const getBottomNavHeight = () => {
    if (isTablet) {
      return isLandscape ? Math.min(85, height * 0.12) : Math.min(85, height * 0.13);
    }
    return (280 / 1242) * width;
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isPersonalDataVisible, setIsPersonalDataVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isProVisible, setIsProVisible] = useState(false);
  const [isProductDetailVisible, setIsProductDetailVisible] = useState(false);
  const [isStatisticsVisible, setIsStatisticsVisible] = useState(false);
  const [isPremiumWelcomeVisible, setIsPremiumWelcomeVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null);
  const [currentWeight, setCurrentWeight] = useState('60kg');

  
  const [currentHeight, setCurrentHeight] = useState('160cm');
  const [currentDate, setCurrentDate] = useState('2007/9/17');
  const [userName, setUserName] = useState('Name');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('european');
  const [language, setLanguage] = useState<Language>('English');

  useEffect(() => {
    NotificationService.updateSettings({
      language: language,
      unitSystem: unitSystem
    });
  }, [language, unitSystem]);
  const [isPremium, setIsPremium] = useState(false);
  const [dailyCalories, setDailyCalories] = useState(0);
  const [dailyCarbohydrates, setDailyCarbohydrates] = useState(0);
  const [dailyProteins, setDailyProteins] = useState(0);
  const [dailyFats, setDailyFats] = useState(0);
  const [savedNutritionData, setSavedNutritionData] = useState<any[]>([]);

  const sweetsData = {
    icecream: [
      { id: 1, name: 'Chocolate ice cream', calories: 300, sugar: 20, protein: 5, carbohydrates: 35, fats: 15, sodium: 80, cholesterol: 30, potassium: 150 },
      { id: 2, name: 'Vanilla ice cream', calories: 300, sugar: 18, protein: 4, carbohydrates: 32, fats: 16, sodium: 75, cholesterol: 35, potassium: 140 },
      { id: 3, name: 'Ice cream with nuts', calories: 300, sugar: 15, protein: 7, carbohydrates: 28, fats: 20, sodium: 70, cholesterol: 25, potassium: 180 },
      { id: 4, name: 'Yogurt ice cream', calories: 300, sugar: 22, protein: 6, carbohydrates: 30, fats: 12, sodium: 65, cholesterol: 20, potassium: 200 },
      { id: 5, name: 'Fruit ice', calories: 300, sugar: 25, protein: 2, carbohydrates: 40, fats: 8, sodium: 40, cholesterol: 10, potassium: 220 },
      { id: 6, name: 'Strawberry ice cream', calories: 280, sugar: 19, protein: 4, carbohydrates: 33, fats: 14, sodium: 70, cholesterol: 30, potassium: 160 },
      { id: 7, name: 'Cookies ice cream', calories: 320, sugar: 22, protein: 5, carbohydrates: 38, fats: 18, sodium: 120, cholesterol: 35, potassium: 140 },
      { id: 8, name: 'Caramel ice cream', calories: 310, sugar: 28, protein: 4, carbohydrates: 35, fats: 16, sodium: 85, cholesterol: 32, potassium: 130 },
      { id: 9, name: 'Mint ice cream', calories: 290, sugar: 17, protein: 4, carbohydrates: 30, fats: 15, sodium: 75, cholesterol: 28, potassium: 145 },
      { id: 10, name: 'Coffee ice cream', calories: 305, sugar: 20, protein: 5, carbohydrates: 32, fats: 16, sodium: 80, cholesterol: 30, potassium: 150 },
    ],
    chocolate: [
      { id: 11, name: 'Dark chocolate', calories: 250, sugar: 12, protein: 8, carbohydrates: 20, fats: 18, sodium: 20, cholesterol: 5, potassium: 300 },
      { id: 12, name: 'Milk chocolate', calories: 280, sugar: 25, protein: 6, carbohydrates: 30, fats: 16, sodium: 40, cholesterol: 15, potassium: 200 },
      { id: 13, name: 'White chocolate', calories: 290, sugar: 28, protein: 5, carbohydrates: 32, fats: 17, sodium: 50, cholesterol: 20, potassium: 150 },
      { id: 14, name: 'Chocolate with nuts', calories: 320, sugar: 18, protein: 10, carbohydrates: 25, fats: 22, sodium: 30, cholesterol: 8, potassium: 350 },
      { id: 15, name: 'Chocolate with raisins', calories: 310, sugar: 30, protein: 7, carbohydrates: 35, fats: 15, sodium: 25, cholesterol: 10, potassium: 280 },
      { id: 16, name: 'Bitter chocolate', calories: 240, sugar: 8, protein: 9, carbohydrates: 18, fats: 16, sodium: 15, cholesterol: 3, potassium: 320 },
      { id: 17, name: 'Chocolate truffles', calories: 350, sugar: 22, protein: 6, carbohydrates: 28, fats: 25, sodium: 35, cholesterol: 25, potassium: 180 },
      { id: 18, name: 'Chocolate bar', calories: 270, sugar: 20, protein: 6, carbohydrates: 26, fats: 15, sodium: 30, cholesterol: 12, potassium: 200 },
      { id: 19, name: 'Hot chocolate', calories: 200, sugar: 18, protein: 8, carbohydrates: 22, fats: 8, sodium: 100, cholesterol: 20, potassium: 250 },
      { id: 20, name: 'Chocolate cookies', calories: 180, sugar: 15, protein: 4, carbohydrates: 25, fats: 8, sodium: 120, cholesterol: 15, potassium: 80 },
    ],
    candies: [
      { id: 21, name: 'Gummy bears', calories: 150, sugar: 35, protein: 2, carbohydrates: 38, fats: 0, sodium: 15, cholesterol: 0, potassium: 5 },
      { id: 22, name: 'Hard candy', calories: 120, sugar: 30, protein: 0, carbohydrates: 30, fats: 0, sodium: 5, cholesterol: 0, potassium: 2 },
      { id: 23, name: 'Lollipop', calories: 100, sugar: 25, protein: 0, carbohydrates: 25, fats: 0, sodium: 8, cholesterol: 0, potassium: 1 },
      { id: 24, name: 'Jelly beans', calories: 140, sugar: 32, protein: 1, carbohydrates: 35, fats: 0, sodium: 12, cholesterol: 0, potassium: 3 },
      { id: 25, name: 'Caramel candy', calories: 160, sugar: 28, protein: 2, carbohydrates: 32, fats: 4, sodium: 40, cholesterol: 5, potassium: 15 },
      { id: 26, name: 'Mint candy', calories: 110, sugar: 26, protein: 0, carbohydrates: 27, fats: 1, sodium: 10, cholesterol: 0, potassium: 5 },
      { id: 27, name: 'Fruit gummies', calories: 130, sugar: 30, protein: 2, carbohydrates: 33, fats: 0, sodium: 20, cholesterol: 0, potassium: 8 },
      { id: 28, name: 'Sour candy', calories: 125, sugar: 28, protein: 0, carbohydrates: 31, fats: 0, sodium: 25, cholesterol: 0, potassium: 3 },
      { id: 29, name: 'Cotton candy', calories: 170, sugar: 42, protein: 0, carbohydrates: 43, fats: 0, sodium: 5, cholesterol: 0, potassium: 2 },
      { id: 30, name: 'Candy cane', calories: 90, sugar: 22, protein: 0, carbohydrates: 23, fats: 0, sodium: 3, cholesterol: 0, potassium: 1 },
    ],
    cake: [
      { id: 31, name: 'Chocolate cake', calories: 400, sugar: 35, protein: 8, carbohydrates: 55, fats: 18, sodium: 250, cholesterol: 80, potassium: 180 },
      { id: 32, name: 'Vanilla cake', calories: 380, sugar: 32, protein: 6, carbohydrates: 52, fats: 16, sodium: 220, cholesterol: 75, potassium: 150 },
      { id: 33, name: 'Cheesecake', calories: 450, sugar: 28, protein: 12, carbohydrates: 40, fats: 28, sodium: 300, cholesterol: 120, potassium: 200 },
      { id: 34, name: 'Red velvet cake', calories: 420, sugar: 38, protein: 7, carbohydrates: 58, fats: 20, sodium: 280, cholesterol: 85, potassium: 160 },
      { id: 35, name: 'Carrot cake', calories: 390, sugar: 30, protein: 8, carbohydrates: 50, fats: 18, sodium: 240, cholesterol: 70, potassium: 220 },
      { id: 36, name: 'Lemon cake', calories: 360, sugar: 35, protein: 6, carbohydrates: 48, fats: 15, sodium: 200, cholesterol: 65, potassium: 140 },
      { id: 37, name: 'Strawberry cake', calories: 370, sugar: 33, protein: 7, carbohydrates: 50, fats: 16, sodium: 210, cholesterol: 70, potassium: 180 },
      { id: 38, name: 'Tiramisu', calories: 480, sugar: 25, protein: 10, carbohydrates: 45, fats: 30, sodium: 180, cholesterol: 150, potassium: 250 },
      { id: 39, name: 'Black forest cake', calories: 460, sugar: 40, protein: 8, carbohydrates: 60, fats: 22, sodium: 220, cholesterol: 90, potassium: 200 },
      { id: 40, name: 'Banana cake', calories: 350, sugar: 28, protein: 6, carbohydrates: 48, fats: 14, sodium: 190, cholesterol: 60, potassium: 300 },
    ],
  };

  const getCurrentSweets = () => {
    if (!selectedCategory) return [];
    const categorySweets = sweetsData[selectedCategory as keyof typeof sweetsData] || [];

    if (!searchQuery.trim()) {
      return categorySweets;
    }

    return categorySweets.filter(sweet =>
      sweet.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric'
    };

    const isToday = date.toDateString() === today.toDateString();

    let locale = 'en-US';
    if (language === 'French') locale = 'fr-FR';
    if (language === 'Russian') locale = 'ru-RU';

    const formattedDate = date.toLocaleDateString(locale, options);

    return isToday ? `${t('today', language)}, ${formattedDate}` : formattedDate;
  };

  const handleSaveNutrition = (savedData: any) => {
    let updatedData: any[] = [];

    if (editingProductIndex !== null) {
      
      setSavedNutritionData(prevData => {
        const newData = [...prevData];
        newData[editingProductIndex] = {
          ...savedData,
          category: newData[editingProductIndex].category 
        };
        updatedData = newData;
        return newData;
      });
    } else {
      
      const dataWithCategory = {
        ...savedData,
        category: selectedCategory
      };
      setSavedNutritionData(prevData => {
        updatedData = [...prevData, dataWithCategory];
        return updatedData;
      });
    }

    
    setTimeout(() => {
      
      const currentDateStr = (selectedDate || new Date()).toISOString().split('T')[0];
      const todaysSugar = updatedData
        .filter((entry: any) => entry.date === currentDateStr)
        .reduce((total: number, entry: any) => total + (entry.calculatedNutrition?.sugar || 0), 0);

      
      NotificationService.checkSugarLimit(todaysSugar);
    }, 100);

    
  };

  
  const getCarbohydratesDisplay = () => {
    if (unitSystem === 'american') {
      
      const ozValue = (dailyCarbohydrates * 0.035274).toFixed(1);
      return `${ozValue}oz`;
    } else {
      
      return `${Math.round(dailyCarbohydrates)}g`;
    }
  };

  
  const getCarbohydratesProgress = () => {
    const percentage = (dailyCarbohydrates / 100) * 100;
    return Math.min(percentage, 100); 
  };

  
  const getProteinsDisplay = () => {
    if (unitSystem === 'american') {
      
      const ozValue = (dailyProteins * 0.035274).toFixed(1);
      return `${ozValue}oz`;
    } else {
      
      return `${Math.round(dailyProteins)}g`;
    }
  };

  
  const getProteinsProgress = () => {
    const percentage = (dailyProteins / 100) * 100;
    return Math.min(percentage, 100); 
  };

  
  const getFatsDisplay = () => {
    if (unitSystem === 'american') {
      
      const ozValue = (dailyFats * 0.035274).toFixed(1);
      return `${ozValue}oz`;
    } else {
      
      return `${Math.round(dailyFats)}g`;
    }
  };

  
  const getFatsProgress = () => {
    const percentage = (dailyFats / 100) * 100;
    return Math.min(percentage, 100); 
  };

  
  const getSugarDisplay = (sugarGrams: number) => {
    if (unitSystem === 'american') {
      
      const ozValue = (sugarGrams * 0.035274).toFixed(1);
      return `${ozValue}oz`;
    } else {
      
      return `${sugarGrams}g`;
    }
  };

  
  const getProductImage = (category: string) => {
    switch (category) {
      case 'icecream':
        return require('./assets/Diary/Parts/icecream.png');
      case 'chocolate':
        return require('./assets/Diary/Parts/chocolate.png');
      case 'candies':
        return require('./assets/Diary/Parts/candies.png');
      case 'cake':
        return require('./assets/Diary/Parts/cake.png');
      default:
        return require('./assets/Diary/Parts/cake.png');
    }
  };

  
  useEffect(() => {
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    const filteredData = savedNutritionData.filter(item => item.date === selectedDateString);

    const dayCalories = filteredData.reduce((total, item) => total + item.calculatedNutrition.calories, 0);
    const dayCarbohydrates = filteredData.reduce((total, item) => total + item.calculatedNutrition.carbohydrates, 0);
    const dayProteins = filteredData.reduce((total, item) => total + item.calculatedNutrition.protein, 0);
    const dayFats = filteredData.reduce((total, item) => total + item.calculatedNutrition.fats, 0);

    setDailyCalories(dayCalories);
    setDailyCarbohydrates(dayCarbohydrates);
    setDailyProteins(dayProteins);
    setDailyFats(dayFats);
  }, [selectedDate, savedNutritionData]);

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleAddPress = () => {
    setIsAddModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsAddModalVisible(false);
    setSelectedCategory(null);
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };


  const handleProfileBack = () => {
    setIsProfileVisible(false);
  };

  const handlePersonalDataPress = () => {
    setIsPersonalDataVisible(true);
    setIsProfileVisible(false);
  };

  const handleSettingsPress = () => {
    setIsSettingsVisible(true);
    setIsProfileVisible(false);
  };

  const handleSettingsBack = () => {
    setIsSettingsVisible(false);
    setIsProfileVisible(true);
  };

  const handleProPress = () => {
    if (isPremium) {
      // Show alert that user already has premium, then go to statistics
      Alert.alert(
        t('already_have_premium_title', language),
        t('already_have_premium_message', language),
        [
          {
            text: t('go_to_charts', language),
            onPress: () => {
              setIsStatisticsVisible(true);
              setIsProfileVisible(false);
              setIsPersonalDataVisible(false);
              setIsSettingsVisible(false);
              setIsProductDetailVisible(false);
            }
          },
          {
            text: t('ok', language),
            style: 'default'
          }
        ]
      );
    } else {
      // Free users see the paywall
      setIsProVisible(true);
      setIsProfileVisible(false);
      setIsPersonalDataVisible(false);
      setIsSettingsVisible(false);
      setIsProductDetailVisible(false);
      setIsStatisticsVisible(false);
    }
  };

  const handleProBack = () => {
    setIsProVisible(false);
  };

  const handleStatisticsPress = () => {
    setIsStatisticsVisible(true);
    setIsProfileVisible(false);
    setIsPersonalDataVisible(false);
    setIsSettingsVisible(false);
    setIsProVisible(false);
  };

  const handleStatisticsBack = () => {
    setIsStatisticsVisible(false);
  };

  const handlePurchaseSuccess = () => {
    setIsPremium(true);
    console.log('Premium activated successfully!');
  };

  const handleNavigateToStatistics = () => {
    setIsProVisible(false);
    setIsStatisticsVisible(true);
  };

  const showPurchaseSuccessAlert = (productId: string) => {
    console.log('🔍 DiaryScreen: showPurchaseSuccessAlert called with productId:', productId);
    console.log('🔍 DiaryScreen: Showing PremiumWelcomeScreen');
    setIsPremiumWelcomeVisible(true);
  };

  const handlePremiumWelcomeClose = () => {
    setIsPremiumWelcomeVisible(false);
  };

  const handlePremiumWelcomeGoToCharts = () => {
    setIsPremiumWelcomeVisible(false);
    handleNavigateToStatistics();
  };


  const handleProductPress = (product: any) => {
    setSelectedProduct(product);
    setIsProductDetailVisible(true);
  };

  const handleProductDetailBack = () => {
    setIsProductDetailVisible(false);
    setSelectedProduct(null);
    setEditingProductIndex(null);
  };

  const handleEditProduct = (index: number) => {
    const productToEdit = savedNutritionData[index];
    
    const allProducts = [
      ...sweetsData.icecream,
      ...sweetsData.chocolate,
      ...sweetsData.candies,
      ...sweetsData.cake
    ];
    const originalProduct = allProducts.find(p => p.name === productToEdit.productName);

    if (originalProduct) {
      setSelectedProduct(originalProduct);
      setEditingProductIndex(index);
      setIsProductDetailVisible(true);
    }
  };

  const handleDiaryPress = () => {
    setIsProfileVisible(false);
    setIsPersonalDataVisible(false);
    setIsSettingsVisible(false);
    setIsProVisible(false);
    setIsStatisticsVisible(false);
  };

  const handleProfilePress = () => {
    setIsProfileVisible(true);
    setIsPersonalDataVisible(false);
    setIsSettingsVisible(false);
    setIsProVisible(false);
    setIsStatisticsVisible(false);
  };

  const handleAccountDeleted = () => {
    
    setUserName('Name');
    setUnitSystem('european');
    setLanguage('English');

    
    setIsSettingsVisible(false);
    setIsProfileVisible(false);
    setIsPersonalDataVisible(false);
    setIsProVisible(false);

    
    if (onAccountDeleted) {
      onAccountDeleted();
    }
  };

  // Create adaptive styles function
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
        left: (110 / 1242) * width,
        top: isTablet ? 8 : (2453 - 2429) / (1242 / width),
        alignItems: 'center',
      },
      diaryIcon: {
        width: isTablet ? Math.min(45, width * 0.05) : (68 / 1242) * width,
        height: isTablet ? Math.min(45, width * 0.05) : (68 / 1242) * width,
        opacity: 1,
      },
      diaryText: {
        width: (140 / 1242) * width,
        marginTop: isTablet ? 5 : (2537 - 2453 - 68) / (1242 / width),
        fontFamily: 'System',
        fontWeight: '400',
        fontSize: isTablet ? Math.min(16, width * 0.02) : (32 / 1242) * width,
        textAlign: 'center',
        color: '#FF77C0',
        textTransform: 'capitalize',
        opacity: 1,
      },
      statisticsTab: {
        position: 'absolute',
        left: (426 / 1242) * width,
        top: isTablet ? 8 : (2453 - 2429) / (1242 / width),
        alignItems: 'center',
      },
      statisticsIcon: {
        width: isTablet ? Math.min(45, width * 0.05) : (68 / 1242) * width,
        height: isTablet ? Math.min(45, width * 0.05) : (68 / 1242) * width,
        opacity: 1,
      },
      statisticsText: {
        marginTop: isTablet ? 5 : (2536 - 2453 - 68) / (1242 / width),
        fontFamily: 'System',
        fontWeight: '400',
        fontSize: isTablet ? Math.min(15, width * 0.018) : (30 / 1242) * width,
        textAlign: 'center',
        color: '#A2A2A2',
        textTransform: 'capitalize',
        opacity: 1,
        minWidth: (180 / 1242) * width,
      },
      profileTab: {
        position: 'absolute',
        left: (742 / 1242) * width,
        top: isTablet ? 8 : (2453 - 2429) / (1242 / width),
        alignItems: 'center',
      },
      profileIcon: {
        width: isTablet ? Math.min(45, width * 0.05) : (68 / 1242) * width,
        height: isTablet ? Math.min(45, width * 0.05) : (68 / 1242) * width,
        opacity: 1,
      },
      profileText: {
        marginTop: isTablet ? 5 : (2537 - 2453 - 68) / (1242 / width),
        fontFamily: 'System',
        fontWeight: '400',
        fontSize: isTablet ? Math.min(16, width * 0.02) : (32 / 1242) * width,
        textAlign: 'center',
        color: '#A2A2A2',
        textTransform: 'capitalize',
        opacity: 1,
        minWidth: (140 / 1242) * width,
      },
      proTab: {
        position: 'absolute',
        left: (1018 / 1242) * width,
        top: isTablet ? 8 : (2453 - 2429) / (1242 / width),
        alignItems: 'center',
      },
      proIcon: {
        width: isTablet ? Math.min(45, width * 0.05) : (68 / 1242) * width,
        height: isTablet ? Math.min(45, width * 0.05) : (68 / 1242) * width,
        opacity: 1,
      },
      proText: {
        marginTop: isTablet ? 5 : (2536 - 2453 - 68) / (1242 / width),
        fontFamily: 'System',
        fontWeight: '400',
        fontSize: isTablet ? Math.min(16, width * 0.02) : (32 / 1242) * width,
        textAlign: 'center',
        color: '#A2A2A2',
        textTransform: 'capitalize',
        opacity: 1,
        minWidth: (120 / 1242) * width,
      },
      addedProductsScrollView: {
        position: 'absolute',
        top: isTablet ? (1220 / 1242) * width : (1623 / 1242) * width,
        left: 0,
        right: 0,
        height: isTablet ? height - (1220 / 1242) * width - getBottomNavHeight() - (220 / 1242) * width : (552 / 1242) * width, // Увеличил отступ для iPad чтобы не перекрывать кнопку
        zIndex: 10,
      },
      addButton: {
        position: 'absolute',
        left: (66 / 1242) * width,
        top: isTablet ? height - getBottomNavHeight() - (200 / 1242) * width : (2200 / 1242) * width,
        width: (1111 / 1242) * width,
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
        zIndex: 20, // Добавил высокий z-index чтобы кнопка была поверх всех элементов
      },
      addButtonText: {
        fontFamily: 'System',
        fontWeight: '400',
        fontSize: isTablet ? (60 / 1242) * width : (70 / 1242) * width,
        textAlign: 'center',
        color: '#FFFFFF',
        textTransform: 'capitalize',
        opacity: 1,
      },
      diaryTitle: {
        position: 'absolute',
        left: (268 / 1242) * width,
        top: isTablet ? (150 / 1242) * width : (227 / 1242) * width,
        width: (706 / 1242) * width,
        height: isTablet ? (70 / 1242) * width : (92 / 1242) * width,
        fontFamily: 'System',
        fontWeight: 'bold',
        fontSize: isTablet ? (70 / 1242) * width : (96 / 1242) * width,
        lineHeight: isTablet ? (70 * 0.99) / 1242 * width : (96 * 0.99) / 1242 * width,
        textAlign: 'center',
        textTransform: 'capitalize',
        color: '#303539',
        opacity: 1,
      },
      ellipse: {
        position: 'absolute',
        width: isTablet ? (400 / 1242) * width : (544 / 1242) * width,
        height: isTablet ? (400 / 1242) * width : (544 / 1242) * width,
        top: isTablet ? (280 / 1242) * width : (443 / 1242) * width,
        left: isTablet ? (421 / 1242) * width : (351 / 1242) * width,
        borderRadius: isTablet ? (400 / 2 / 1242) * width : (544 / 2 / 1242) * width,
        backgroundColor: '#FF84C5',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        opacity: 1,
      },
      caloriesText: {
        position: 'absolute',
        width: isTablet ? (350 / 1242) * width : (500 / 1242) * width,
        height: isTablet ? (100 / 1242) * width : (150 / 1242) * width,
        top: isTablet ? (430 / 1242) * width : (640 / 1242) * width,
        left: isTablet ? (446 / 1242) * width : (371 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (70 / 1242) * width : (100 / 1242) * width,
        lineHeight: isTablet ? (70 * 0.99 / 1242) * width : (100 * 0.99 / 1242) * width,
        letterSpacing: 0,
        textAlign: 'center',
        color: '#FFFFFF',
        opacity: 1,
      },
      summaryTitle: {
        position: 'absolute',
        left: (268 / 1242) * width,
        top: isTablet ? (750 / 1242) * width : (1073 / 1242) * width,
        width: (706 / 1242) * width,
        height: isTablet ? (50 / 1242) * width : (60 / 1242) * width,
        fontFamily: 'System',
        fontWeight: 'bold',
        fontSize: isTablet ? (50 / 1242) * width : (64 / 1242) * width,
        lineHeight: isTablet ? (50 * 0.99) / 1242 * width : (64 * 0.99) / 1242 * width,
        textAlign: 'center',
        textTransform: 'capitalize',
        color: '#303539',
        opacity: 1,
      },
      summaryRectangle: {
        position: 'absolute',
        left: (51 / 1242) * width,
        top: isTablet ? (820 / 1242) * width : (1192 / 1242) * width,
        width: (1140 / 1242) * width,
        height: isTablet ? (200 / 1242) * width : (256 / 1242) * width,
        borderRadius: (75 / 1242) * width,
        backgroundColor: '#FFFFFF',
        shadowColor: '#B4ADB1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.69,
        shadowRadius: (8.8 / 1242) * width,
        elevation: 8,
        opacity: 1,
      },
      dateText: {
        position: 'absolute',
        left: (256 / 1242) * width,
        top: isTablet ? (1150 / 1242) * width : (1497 / 1242) * width,
        width: (706 / 1242) * width,
        height: isTablet ? (50 / 1242) * width : (60 / 1242) * width,
        fontFamily: 'System',
        fontWeight: 'bold',
        fontSize: isTablet ? (40 / 1242) * width : (48 / 1242) * width,
        lineHeight: isTablet ? (40 * 0.99) / 1242 * width : (48 * 0.99) / 1242 * width,
        textAlign: 'center',
        textTransform: 'capitalize',
        color: '#303539',
        opacity: 1,
      },
      caloriesLabel: {
        position: 'absolute',
        width: isTablet ? (200 / 1242) * width : (250 / 1242) * width,
        height: isTablet ? (40 / 1242) * width : (40 / 1242) * width,
        top: isTablet ? (520 / 1242) * width : (760 / 1242) * width, // Опустили на iPhone чтобы не было близко к цифре
        left: isTablet ? (521 / 1242) * width : (496 / 1242) * width,
        fontFamily: 'System',
        fontWeight: '400',
        fontSize: isTablet ? (50 / 1242) * width : (45 / 1242) * width, // Увеличил размер kcal: iPad 50px, iPhone 45px
        lineHeight: isTablet ? (50 * 0.99) / 1242 * width : (45 * 0.99) / 1242 * width,
        textAlign: 'center',
        color: '#FFFFFF',
        opacity: 1,
      },
      leftArrow: {
        position: 'absolute',
        left: (64 / 1242) * width,
        top: isTablet ? (1165 / 1242) * width : (1513 / 1242) * width, // Подняли стрелку к дате
        width: (26 / 1242) * width,
        height: (42 / 1242) * width,
        transform: [{ rotate: '0deg' }],
        opacity: 1,
      },
      rightArrow: {
        position: 'absolute',
        left: (1152 / 1242) * width,
        top: isTablet ? (1165 / 1242) * width : (1513 / 1242) * width, // Подняли стрелку к дате
        width: (26 / 1242) * width,
        height: (42 / 1242) * width,
        transform: [{ rotate: '180deg' }],
        opacity: 1,
      },
      // БЖУ элементы для поднятого блока Summary
      carbohydratesText: {
        position: 'absolute',
        width: (400 / 1242) * width,
        height: isTablet ? (35 / 1242) * width : (47 / 1242) * width,
        top: isTablet ? (870 / 1242) * width : (1247 / 1242) * width, // Подняли в summary блок
        left: (55 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (35 / 1242) * width : (48 / 1242) * width, // Уменьшили размер для iPad
        lineHeight: isTablet ? (35 * 0.99) / 1242 * width : (48 * 0.99) / 1242 * width,
        letterSpacing: 0,
        textAlign: 'left',
        color: '#303539',
        opacity: 1,
      },
      carbohydratesValue: {
        position: 'absolute',
        width: (120 / 1242) * width,
        height: isTablet ? (30 / 1242) * width : (36 / 1242) * width,
        top: isTablet ? (950 / 1242) * width : (1356 / 1242) * width, // Подняли в summary блок
        left: (147 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (30 / 1242) * width : (36 / 1242) * width,
        lineHeight: isTablet ? (30 * 0.99) / 1242 * width : (36 * 0.99) / 1242 * width,
        letterSpacing: 0,
        textAlign: 'center',
        color: '#303539',
        opacity: 1,
      },
      carbohydratesRectangle: {
        position: 'absolute',
        width: (201 / 1242) * width,
        height: isTablet ? (15 / 1242) * width : (19 / 1242) * width,
        top: isTablet ? (920 / 1242) * width : (1315 / 1242) * width, // Подняли в summary блок
        left: (106 / 1242) * width,
        borderRadius: (100 / 1242) * width,
        backgroundColor: '#D9D9D9',
        opacity: 1,
      },
      carbohydratesProgress: {
        position: 'absolute',
        height: isTablet ? (15 / 1242) * width : (19 / 1242) * width,
        top: isTablet ? (920 / 1242) * width : (1315 / 1242) * width, // Подняли в summary блок
        left: (106 / 1242) * width,
        borderRadius: (100 / 1242) * width,
        backgroundColor: '#FF77C0',
        opacity: 1,
      },
      proteinsText: {
        position: 'absolute',
        width: (170 / 1242) * width,
        height: isTablet ? (35 / 1242) * width : (47 / 1242) * width,
        top: isTablet ? (870 / 1242) * width : (1247 / 1242) * width, // Подняли в summary блок
        left: (536 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (35 / 1242) * width : (48 / 1242) * width,
        lineHeight: isTablet ? (35 * 0.99) / 1242 * width : (48 * 0.99) / 1242 * width,
        letterSpacing: 0,
        textAlign: 'left',
        color: '#303539',
        opacity: 1,
      },
      proteinsValue: {
        position: 'absolute',
        width: (120 / 1242) * width,
        height: isTablet ? (30 / 1242) * width : (36 / 1242) * width,
        top: isTablet ? (950 / 1242) * width : (1356 / 1242) * width, // Подняли в summary блок
        left: (561 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (30 / 1242) * width : (36 / 1242) * width,
        lineHeight: isTablet ? (30 * 0.99) / 1242 * width : (36 * 0.99) / 1242 * width,
        letterSpacing: 0,
        textAlign: 'center',
        color: '#303539',
        opacity: 1,
      },
      proteinsRectangle: {
        position: 'absolute',
        width: (170 / 1242) * width,
        height: isTablet ? (15 / 1242) * width : (19 / 1242) * width,
        top: isTablet ? (920 / 1242) * width : (1315 / 1242) * width, // Подняли в summary блок
        left: (536 / 1242) * width,
        borderRadius: (100 / 1242) * width,
        backgroundColor: '#D9D9D9',
        opacity: 1,
      },
      proteinsProgress: {
        position: 'absolute',
        height: isTablet ? (15 / 1242) * width : (19 / 1242) * width,
        top: isTablet ? (920 / 1242) * width : (1315 / 1242) * width, // Подняли в summary блок
        left: (536 / 1242) * width,
        borderRadius: (100 / 1242) * width,
        backgroundColor: '#FF77C0',
        opacity: 1,
      },
      fatsText: {
        position: 'absolute',
        width: (170 / 1242) * width,
        height: isTablet ? (35 / 1242) * width : (47 / 1242) * width,
        top: isTablet ? (870 / 1242) * width : (1253 / 1242) * width, // Подняли в summary блок
        left: (948 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (35 / 1242) * width : (48 / 1242) * width,
        lineHeight: isTablet ? (35 * 0.99) / 1242 * width : (48 * 0.99) / 1242 * width,
        letterSpacing: 0,
        textAlign: 'left',
        color: '#303539',
        opacity: 1,
      },
      fatsValue: {
        position: 'absolute',
        width: (120 / 1242) * width,
        height: isTablet ? (30 / 1242) * width : (36 / 1242) * width,
        top: isTablet ? (950 / 1242) * width : (1356 / 1242) * width, // Подняли в summary блок
        left: (973 / 1242) * width,
        fontFamily: 'Alatsi',
        fontWeight: 'bold',
        fontSize: isTablet ? (30 / 1242) * width : (36 / 1242) * width,
        lineHeight: isTablet ? (30 * 0.99) / 1242 * width : (36 * 0.99) / 1242 * width,
        letterSpacing: 0,
        textAlign: 'center',
        color: '#303539',
        opacity: 1,
      },
      fatsRectangle: {
        position: 'absolute',
        width: (170 / 1242) * width,
        height: isTablet ? (15 / 1242) * width : (19 / 1242) * width,
        top: isTablet ? (920 / 1242) * width : (1315 / 1242) * width, // Подняли в summary блок
        left: (948 / 1242) * width,
        borderRadius: (100 / 1242) * width,
        backgroundColor: '#D9D9D9',
        opacity: 1,
      },
      fatsProgress: {
        position: 'absolute',
        height: isTablet ? (15 / 1242) * width : (19 / 1242) * width,
        top: isTablet ? (920 / 1242) * width : (1315 / 1242) * width, // Подняли в summary блок
        left: (948 / 1242) * width,
        borderRadius: (100 / 1242) * width,
        backgroundColor: '#FF77C0',
        opacity: 1,
      },
      // Модальное окно выбора категорий
      modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: (1242 / 1242) * width,
        height: (2688 / 1242) * width,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        opacity: 1,
      },
      closeButtonCircle: {
        position: 'absolute',
        left: (565 / 1242) * width,
        top: isTablet ? height - (300 / 1242) * width : (2449 / 1242) * width, // Подняли кнопку закрытия для iPad
        width: (113 / 1242) * width,
        height: (113 / 1242) * width,
        borderRadius: (113 / 2 / 1242) * width,
        backgroundColor: '#FE4460',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 1,
      },
      iceCreamImage: {
        position: 'absolute',
        left: isTablet ? (180 / 1242) * width : (187 / 1242) * width, // Сдвинули правее для лучшего центрирования
        top: isTablet ? (500 / 1242) * width : (1086 / 1242) * width, // Подняли для iPad
        width: (385 / 1242) * width, // Вернули оригинальный размер
        height: (385 / 1242) * width,
        opacity: 1,
      },
      iceCreamText: {
        position: 'absolute',
        left: (193 / 1242) * width,
        top: isTablet ? (900 / 1242) * width : (1455 / 1242) * width, // Подняли для iPad
        width: (375 / 1242) * width,
        height: isTablet ? (100 / 1242) * width : (145 / 1242) * width,
        fontFamily: 'System',
        fontWeight: 'bold',
        fontSize: isTablet ? (50 / 1242) * width : (64 / 1242) * width, // Уменьшили для iPad
        lineHeight: isTablet ? (50 * 0.99) / 1242 * width : (64 * 0.99) / 1242 * width,
        textAlign: 'center',
        textTransform: 'capitalize',
        color: '#FFFFFF',
        opacity: 1,
      },
      chocolateImage: {
        position: 'absolute',
        left: isTablet ? (655 / 1242) * width : (663 / 1242) * width, // Сдвинули правее для лучшего центрирования
        top: isTablet ? (500 / 1242) * width : (1086 / 1242) * width, // Подняли для iPad
        width: (385 / 1242) * width, // Вернули оригинальный размер
        height: (385 / 1242) * width,
        opacity: 1,
      },
      chocolateText: {
        position: 'absolute',
        left: (668 / 1242) * width,
        top: isTablet ? (900 / 1242) * width : (1455 / 1242) * width, // Подняли для iPad
        width: (375 / 1242) * width,
        height: isTablet ? (100 / 1242) * width : (145 / 1242) * width,
        fontFamily: 'System',
        fontWeight: 'bold',
        fontSize: isTablet ? (50 / 1242) * width : (64 / 1242) * width, // Уменьшили для iPad
        lineHeight: isTablet ? (50 * 0.99) / 1242 * width : (64 * 0.99) / 1242 * width,
        textAlign: 'center',
        textTransform: 'capitalize',
        color: '#FFFFFF',
        opacity: 1,
      },
      candiesImage: {
        position: 'absolute',
        left: isTablet ? (180 / 1242) * width : (187 / 1242) * width, // Сдвинули правее для лучшего центрирования
        top: isTablet ? (1020 / 1242) * width : (1556 / 1242) * width, // Подняли для iPad
        width: (385 / 1242) * width, // Вернули оригинальный размер (было 386, делаем 385 для единообразия)
        height: (385 / 1242) * width,
        opacity: 1,
      },
      candiesText: {
        position: 'absolute',
        left: (193 / 1242) * width,
        top: isTablet ? (1420 / 1242) * width : (1925 / 1242) * width, // Подняли для iPad
        width: (375 / 1242) * width,
        height: isTablet ? (100 / 1242) * width : (145 / 1242) * width,
        fontFamily: 'System',
        fontWeight: 'bold',
        fontSize: isTablet ? (50 / 1242) * width : (64 / 1242) * width, // Уменьшили для iPad
        lineHeight: isTablet ? (50 * 0.99) / 1242 * width : (64 * 0.99) / 1242 * width,
        textAlign: 'center',
        textTransform: 'capitalize',
        color: '#FFFFFF',
        opacity: 1,
      },
      cakeImage: {
        position: 'absolute',
        left: isTablet ? (655 / 1242) * width : (664 / 1242) * width, // Сдвинули правее для лучшего центрирования
        top: isTablet ? (1020 / 1242) * width : (1556 / 1242) * width, // Подняли для iPad
        width: (385 / 1242) * width, // Вернули оригинальный размер
        height: (385 / 1242) * width,
        opacity: 1,
      },
      cakeText: {
        position: 'absolute',
        left: (668 / 1242) * width,
        top: isTablet ? (1420 / 1242) * width : (1925 / 1242) * width, // Подняли для iPad
        width: (375 / 1242) * width,
        height: isTablet ? (100 / 1242) * width : (145 / 1242) * width,
        fontFamily: 'System',
        fontWeight: 'bold',
        fontSize: isTablet ? (50 / 1242) * width : (64 / 1242) * width, // Уменьшили для iPad
        lineHeight: isTablet ? (50 * 0.99) / 1242 * width : (64 * 0.99) / 1242 * width,
        textAlign: 'center',
        textTransform: 'capitalize',
        color: '#FFFFFF',
        opacity: 1,
      },
    });
  };

  const styles = getStyles();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#F5A8D4" />

      <Image
        source={require('./assets/Diary/Parts/Background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <Text style={styles.diaryTitle}>{t('diary', language)}</Text>

      <Text style={styles.summaryTitle}>{t('summary', language)}</Text>

      <View style={styles.summaryRectangle} />

      {!isAddModalVisible && !isProfileVisible && !isPersonalDataVisible && !isSettingsVisible && !isProVisible && !isProductDetailVisible && (
        <View style={styles.ellipse} />
      )}

      {!isAddModalVisible && !isProfileVisible && !isPersonalDataVisible && !isSettingsVisible && !isProVisible && !isProductDetailVisible && !isStatisticsVisible && (
        <Text style={styles.caloriesText}>{dailyCalories}</Text>
      )}

      {!isAddModalVisible && !isProfileVisible && !isPersonalDataVisible && !isSettingsVisible && !isProVisible && !isProductDetailVisible && !isStatisticsVisible && (
        <Text style={styles.caloriesLabel}>
          {unitSystem === 'american' ? 'Calories' : 'kcal'}
        </Text>
      )}

      <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>

      <TouchableOpacity onPress={handlePreviousDay}>
        <Image
          source={require('./assets/Diary/Parts/chevron.right.png')}
          style={styles.leftArrow}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleNextDay}>
        <Image
          source={require('./assets/Diary/Parts/chevron.right.png')}
          style={styles.rightArrow}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {!isAddModalVisible && !isProfileVisible && !isPersonalDataVisible && !isSettingsVisible && !isProVisible && !isProductDetailVisible && !isStatisticsVisible && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
          <Text style={styles.addButtonText}>{t('addSweet', language)}</Text>
        </TouchableOpacity>
      )}


      {!isAddModalVisible && !isProfileVisible && !isPersonalDataVisible && !isSettingsVisible && !isProVisible && !isProductDetailVisible && (
        <View style={styles.carbohydratesRectangle} />
      )}

      {!isAddModalVisible && !isProfileVisible && !isPersonalDataVisible && !isSettingsVisible && !isProVisible && !isProductDetailVisible && (
        <View
          style={[
            styles.carbohydratesProgress,
            { width: ((201 * getCarbohydratesProgress() / 100) / 1242) * width }
          ]}
        />
      )}

      {!isAddModalVisible && !isProfileVisible && !isPersonalDataVisible && !isSettingsVisible && !isProVisible && !isProductDetailVisible && (
        <Text style={[
          styles.carbohydratesText,
          language === 'Russian' && styles.carbohydratesTextRussian,
          language === 'French' && styles.carbohydratesTextFrench
        ]}>{t('carbohydrates', language)}</Text>
      )}

      {!isAddModalVisible && !isProfileVisible && !isPersonalDataVisible && !isSettingsVisible && !isProVisible && !isProductDetailVisible && (
        <Text style={styles.carbohydratesValue}>{getCarbohydratesDisplay()}</Text>
      )}

      {!isAddModalVisible && !isProfileVisible && !isPersonalDataVisible && !isSettingsVisible && !isProVisible && !isProductDetailVisible && (
        <View style={styles.proteinsRectangle} />
      )}

      {!isAddModalVisible && !isProfileVisible && !isPersonalDataVisible && !isSettingsVisible && !isProVisible && !isProductDetailVisible && (
        <View
          style={[
            styles.proteinsProgress,
            { width: ((170 * getProteinsProgress() / 100) / 1242) * width }
          ]}
        />
      )}

      {!isAddModalVisible && !isProfileVisible && !isPersonalDataVisible && !isSettingsVisible && !isProVisible && !isProductDetailVisible && (
        <Text style={[
          styles.proteinsText,
          language === 'Russian' && styles.proteinsTextRussian,
          language === 'French' && styles.proteinsTextFrench
        ]}>{t('protein', language)}</Text>
      )}

      {!isAddModalVisible && !isProfileVisible && !isPersonalDataVisible && !isSettingsVisible && !isProVisible && !isProductDetailVisible && (
        <Text style={styles.proteinsValue}>{getProteinsDisplay()}</Text>
      )}

      {!isAddModalVisible && !isProfileVisible && !isPersonalDataVisible && !isSettingsVisible && !isProVisible && !isProductDetailVisible && (
        <View style={styles.fatsRectangle} />
      )}

      {!isAddModalVisible && !isProfileVisible && !isPersonalDataVisible && !isSettingsVisible && !isProVisible && !isProductDetailVisible && (
        <View
          style={[
            styles.fatsProgress,
            { width: ((170 * getFatsProgress() / 100) / 1242) * width }
          ]}
        />
      )}

      {!isAddModalVisible && !isProfileVisible && !isPersonalDataVisible && !isSettingsVisible && !isProVisible && !isProductDetailVisible && (
        <Text style={[
          styles.fatsText,
          language === 'Russian' && styles.fatsTextRussian,
          language === 'French' && styles.fatsTextFrench
        ]}>{t('fats', language)}</Text>
      )}

      {!isAddModalVisible && !isProfileVisible && !isPersonalDataVisible && !isSettingsVisible && !isProVisible && !isProductDetailVisible && (
        <Text style={styles.fatsValue}>{getFatsDisplay()}</Text>
      )}

      {!isAddModalVisible && !isProfileVisible && !isPersonalDataVisible && !isSettingsVisible && !isProVisible && !isProductDetailVisible && !isStatisticsVisible && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.addedProductsScrollView}
          contentContainerStyle={styles.addedProductsContainer}
        >
          {savedNutritionData
            .filter(item => item.date === selectedDate.toISOString().split('T')[0])
            .map((item, index) => (
              <View key={`${item.savedAt}-${index}`} style={styles.addProductRectangle}>
                <Image
                  source={getProductImage(item.category)}
                  style={styles.addedProductImage}
                  resizeMode="contain"
                />
                <Text style={styles.addedProductName}>{t(item.productName, language)}</Text>
                <Text style={styles.addedProductNutrition}>
                  {item.calculatedNutrition.calories} {t('calories', language)} / {getSugarDisplay(item.calculatedNutrition.sugar)} {t('sugar', language)}
                </Text>
                <TouchableOpacity
                  style={styles.addedProductEllipse}
                  onPress={() => handleEditProduct(index)}
                >
                  <Image
                    source={require('./assets/Diary/Parts/Pencil.png')}
                    style={styles.pencilImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            ))}
        </ScrollView>
      )}


      {!isAddModalVisible && !isProfileVisible && !isPersonalDataVisible && !isSettingsVisible && !isProVisible && !isProductDetailVisible && !isStatisticsVisible && (
        <View style={styles.bottomNavContainer}>
        <View style={styles.topBorder} />

        <View style={styles.bottomNavContent}>
          <View style={styles.diaryTab}>
            <Image
              source={require('./assets/Diary/Parts/notepad1.png')}
              style={styles.diaryIcon}
              resizeMode="contain"
            />
            <Text style={styles.diaryText}>{t('diary', language)}</Text>
          </View>

          <TouchableOpacity style={styles.statisticsTab} onPress={handleStatisticsPress}>
            <Image
              source={require('./assets/Diary/Parts/Statistics.png')}
              style={styles.statisticsIcon}
              resizeMode="contain"
            />
            <Text style={styles.statisticsText}>{t('statistics', language)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.profileTab} onPress={handleProfilePress}>
            <Image
              source={require('./assets/Diary/Parts/prof.png')}
              style={styles.profileIcon}
              resizeMode="contain"
            />
            <Text style={styles.profileText}>{t('profile', language)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.proTab} onPress={handleProPress}>
            <Image
              source={require('./assets/Diary/Parts/pro-1.png')}
              style={styles.proIcon}
              resizeMode="contain"
            />
            <Text style={styles.proText}>{isPremium ? t('premium', language) : t('pro', language)}</Text>
          </TouchableOpacity>


        </View>
        </View>
      )}

      {isAddModalVisible && !selectedCategory && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity onPress={() => handleCategoryPress('icecream')}>
            <Image
              source={require('./assets/Diary/Parts/icecream.png')}
              style={styles.iceCreamImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleCategoryPress('icecream')}>
            <Text style={styles.iceCreamText}>{t('icecream', language)}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleCategoryPress('chocolate')}>
            <Image
              source={require('./assets/Diary/Parts/chocolate.png')}
              style={styles.chocolateImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleCategoryPress('chocolate')}>
            <Text style={styles.chocolateText}>{t('chocolate', language)}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleCategoryPress('candies')}>
            <Image
              source={require('./assets/Diary/Parts/candies.png')}
              style={styles.candiesImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleCategoryPress('candies')}>
            <Text style={styles.candiesText}>{t('candy', language)}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleCategoryPress('cake')}>
            <Image
              source={require('./assets/Diary/Parts/cake.png')}
              style={styles.cakeImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleCategoryPress('cake')}>
            <Text style={styles.cakeText}>{t('cake', language)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButtonCircle} onPress={handleCloseModal}>
            <View style={styles.crossLine1} />
            <View style={styles.crossLine2} />
          </TouchableOpacity>
        </View>
      )}

      {isAddModalVisible && selectedCategory && (
        <View style={styles.modalOverlay}>
          <Image
            source={require('./assets/Diary/Parts/Background.png')}
            style={styles.categoryBackgroundImage}
            resizeMode="cover"
          />

          <TouchableOpacity style={styles.topCloseButton} onPress={handleCloseModal}>
            <View style={styles.topCloseCrossLine1} />
            <View style={styles.topCloseCrossLine2} />
          </TouchableOpacity>

          <Text style={styles.categoryTitle}>
            {selectedCategory === 'icecream' && t('icecream', language)}
            {selectedCategory === 'chocolate' && t('chocolate', language)}
            {selectedCategory === 'candies' && t('candy', language)}
            {selectedCategory === 'cake' && t('cake', language)}
          </Text>

          <View style={styles.searchRectangle} />

          <TextInput
            style={styles.searchInput}
            placeholder={t('searchPlaceholder', language)}
            placeholderTextColor="#A2A2A2"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <Image
            source={require('./assets/Search/zoom.png')}
            style={styles.zoomIcon}
            resizeMode="contain"
          />

          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.cancelText}>{t('cancel', language)}</Text>
          </TouchableOpacity>

          <Text style={styles.searchResultsText}>{t('searchResults', language)}</Text>

          <ScrollView
            style={styles.sweetsScrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            {getCurrentSweets().map((sweet, index) => (
              <View key={sweet.id} style={[styles.sweetItemScrollable, { marginTop: index === 0 ? 0 : (20 / 1242) * width }]}>
                <Text style={styles.sweetName}>{t(sweet.name, language)}</Text>
                <Text style={styles.sweetCalories}>{sweet.calories} {t('calories', language)}</Text>
                <TouchableOpacity
                  style={styles.addSweetButtonScrollable}
                  onPress={() => handleProductPress(sweet)}
                >
                  <Text style={styles.addSweetButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {isProfileVisible && (
        <ProfileScreen
          onBack={handleProfileBack}
          onDiaryPress={handleDiaryPress}
          onStatisticsPress={handleStatisticsPress}
          onPersonalDataPress={handlePersonalDataPress}
          onSettingsPress={handleSettingsPress}
          onProPress={handleProPress}
          weight={currentWeight}
          height={currentHeight}
          userName={userName}
          birthDate={currentDate}
          unitSystem={unitSystem}
          language={language}
          isPremium={isPremium}
        />
      )}

      {isPersonalDataVisible && (
        <PersonalDataScreen
          onBack={() => {
            setIsPersonalDataVisible(false);
            setIsProfileVisible(true);
          }}
          onWeightSave={setCurrentWeight}
          currentWeight={currentWeight}
          onHeightSave={setCurrentHeight}
          currentHeight={currentHeight}
          onDateSave={setCurrentDate}
          currentDate={currentDate}
          unitSystem={unitSystem}
          language={language}
          onDiaryPress={handleDiaryPress}
          onProfilePress={handleProfilePress}
          onProPress={handleProPress}
        />
      )}

      {isSettingsVisible && (
        <SettingsScreen
          onBack={handleSettingsBack}
          userName={userName}
          onUserNameChange={setUserName}
          unitSystem={unitSystem}
          onUnitSystemChange={setUnitSystem}
          language={language}
          onLanguageChange={setLanguage}
          onAccountDeleted={handleAccountDeleted}
          onDiaryPress={handleDiaryPress}
          onProfilePress={handleProfilePress}
          onProPress={handleProPress}
          isPremium={isPremium}
        />
      )}

      {isStatisticsVisible && (
        <StatisticsScreen
          onBack={handleStatisticsBack}
          language={language}
          onDiaryPress={handleDiaryPress}
          onProfilePress={handleProfilePress}
          onProPress={handleProPress}
          dailyCalories={dailyCalories}
          dailyCarbohydrates={dailyCarbohydrates}
          dailyProteins={dailyProteins}
          dailyFats={dailyFats}
          unitSystem={unitSystem}
          savedNutritionData={savedNutritionData}
          selectedDate={selectedDate}
          isPremium={isPremium}
        />
      )}

      {isProVisible && (
        <ProScreen
          onBack={handleProBack}
          language={language}
          onPurchaseSuccess={handlePurchaseSuccess}
          onNavigateToStatistics={handleNavigateToStatistics}
          showSuccessAlert={showPurchaseSuccessAlert}
        />
      )}


      {isProductDetailVisible && selectedProduct && (
        <ProductDetailScreen
          onBack={handleProductDetailBack}
          product={selectedProduct}
          language={language}
          onProPress={handleProPress}
          isPremium={isPremium}
          onSave={handleSaveNutrition}
          unitSystem={unitSystem}
          selectedDate={selectedDate}
          isEditing={editingProductIndex !== null}
          currentAmount={editingProductIndex !== null ? savedNutritionData[editingProductIndex]?.selectedAmount : undefined}
        />
      )}

      {isPremiumWelcomeVisible && (
        <PremiumWelcomeScreen
          onClose={handlePremiumWelcomeClose}
          onGoToCharts={handlePremiumWelcomeGoToCharts}
          language={language}
        />
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
    width: width,
    height: height + 50,
    top: 0,
    left: 0,
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
  summaryRectangle: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (1192 / 1242) * width,
    width: (1140 / 1242) * width,
    height: (256 / 1242) * width,
    borderRadius: (75 / 1242) * width,
    backgroundColor: '#FFFFFF',
    shadowColor: '#B4ADB1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.69,
    shadowRadius: 8.8,
    elevation: 8,
    opacity: 1,
  },
  ellipse: {
    position: 'absolute',
    width: (544 / 1242) * width,
    height: (544 / 1242) * width,
    top: (443 / 1242) * width,
    left: (351 / 1242) * width,
    borderRadius: (544 / 2 / 1242) * width,
    backgroundColor: '#FF84C5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  caloriesText: {
    position: 'absolute',
    width: (500 / 1242) * width,
    height: (150 / 1242) * width,
    top: (640 / 1242) * width,
    left: (371 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (100 / 1242) * width,
    lineHeight: (100 * 0.99 / 1242) * width,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#FFFFFF',
    zIndex: 10,
  },
  dateText: {
    position: 'absolute',
    left: (256 / 1242) * width,
    top: (1497 / 1242) * width,
    width: (706 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 0.99) / 1242 * width,
    textAlign: 'center',
    color: '#303539',
    textTransform: 'capitalize',
    opacity: 1,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: (1242 / 1242) * width,
    height: (2688 / 1242) * width,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    opacity: 1,
  },
  closeButtonCircle: {
    position: 'absolute',
    left: (565 / 1242) * width,
    top: (2449 / 1242) * width,
    width: (113 / 1242) * width,
    height: (113 / 1242) * width,
    borderRadius: (113 / 2 / 1242) * width,
    backgroundColor: '#FE4460',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  crossLine1: {
    position: 'absolute',
    width: (67 / 1242) * width,
    height: (8 / 1242) * width,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    opacity: 1,
  },
  crossLine2: {
    position: 'absolute',
    width: (67 / 1242) * width,
    height: (8 / 1242) * width,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-45deg' }],
    opacity: 1,
  },
  iceCreamImage: {
    position: 'absolute',
    left: (187 / 1242) * width,
    top: (1086 / 1242) * width,
    width: (385 / 1242) * width,
    height: (385 / 1242) * width,
    opacity: 1,
  },
  iceCreamText: {
    position: 'absolute',
    left: (193 / 1242) * width,
    top: (1455 / 1242) * width,
    width: (375 / 1242) * width,
    height: (145 / 1242) * width,
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: (64 / 1242) * width,
    lineHeight: (64 * 0.99) / 1242 * width,
    textAlign: 'center',
    color: '#FFFFFF',
    textTransform: 'capitalize',
    opacity: 1,
  },
  chocolateImage: {
    position: 'absolute',
    left: (663 / 1242) * width,
    top: (1086 / 1242) * width,
    width: (385 / 1242) * width,
    height: (385 / 1242) * width,
    opacity: 1,
  },
  chocolateText: {
    position: 'absolute',
    left: (668 / 1242) * width,
    top: (1455 / 1242) * width,
    width: (375 / 1242) * width,
    height: (145 / 1242) * width,
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: (64 / 1242) * width,
    lineHeight: (64 * 0.99) / 1242 * width,
    textAlign: 'center',
    color: '#FFFFFF',
    textTransform: 'capitalize',
    opacity: 1,
  },
  candiesImage: {
    position: 'absolute',
    left: (187 / 1242) * width,
    top: (1556 / 1242) * width,
    width: (386 / 1242) * width,
    height: (386 / 1242) * width,
    opacity: 1,
  },
  candiesText: {
    position: 'absolute',
    left: (193 / 1242) * width,
    top: (1925 / 1242) * width,
    width: (375 / 1242) * width,
    height: (145 / 1242) * width,
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: (64 / 1242) * width,
    lineHeight: (64 * 0.99) / 1242 * width,
    textAlign: 'center',
    color: '#FFFFFF',
    textTransform: 'capitalize',
    opacity: 1,
  },
  cakeImage: {
    position: 'absolute',
    left: (664 / 1242) * width,
    top: (1556 / 1242) * width,
    width: (386 / 1242) * width,
    height: (385 / 1242) * width,
    opacity: 1,
  },
  cakeText: {
    position: 'absolute',
    left: (668 / 1242) * width,
    top: (1925 / 1242) * width,
    width: (375 / 1242) * width,
    height: (145 / 1242) * width,
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: (64 / 1242) * width,
    lineHeight: (64 * 0.99) / 1242 * width,
    textAlign: 'center',
    color: '#FFFFFF',
    textTransform: 'capitalize',
    opacity: 1,
  },
  topCloseButton: {
    position: 'absolute',
    left: (33 / 1242) * width,
    top: (193 / 1242) * width,
    width: (95 / 1242) * width,
    height: (95 / 1242) * width,
    borderRadius: (95 / 2 / 1242) * width,
    backgroundColor: '#FF77C0',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  topCloseCrossLine1: {
    position: 'absolute',
    width: (40 / 1242) * width,
    height: (4 / 1242) * width,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    opacity: 1,
  },
  topCloseCrossLine2: {
    position: 'absolute',
    width: (40 / 1242) * width,
    height: (4 / 1242) * width,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-45deg' }],
    opacity: 1,
  },
  categoryTitle: {
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
  categoryBackgroundImage: {
    position: 'absolute',
    width: 1248,
    height: 2700,
    top: 0,
    left: -3,
    transform: [{ rotate: '0deg' }],
    opacity: 1,
  },
  searchRectangle: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (343 / 1242) * width,
    width: (929 / 1242) * width,
    height: (114 / 1242) * width,
    borderRadius: (57 / 1242) * width,
    backgroundColor: '#FFFFFF',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    paddingLeft: (120 / 1242) * width,
    paddingRight: (20 / 1242) * width,
    justifyContent: 'center',
  },
  searchInput: {
    position: 'absolute',
    left: (179 / 1242) * width,
    top: (354 / 1242) * width,
    width: (450 / 1242) * width,
    height: (92 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: '400',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 0.99) / 1242 * width,
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  zoomIcon: {
    position: 'absolute',
    left: (88 / 1242) * width,
    top: (367 / 1242) * width,
    width: (65 / 1242) * width,
    height: (65 / 1242) * width,
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  cancelText: {
    position: 'absolute',
    left: (986 / 1242) * width,
    top: (374 / 1242) * width,
    width: (190 / 1242) * width,
    height: (92 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (40 / 1242) * width,
    lineHeight: (40 * 0.99) / 1242 * width,
    textAlign: 'center',
    color: '#303539',
    textTransform: 'capitalize',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  searchResultsText: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (552 / 1242) * width,
    width: (1140 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (52 / 1242) * width,
    lineHeight: (52 * 1.1) / 1242 * width,
    textAlign: 'center',
    color: '#303539',
    textTransform: 'capitalize',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  sweetsScrollView: {
    position: 'absolute',
    top: (650 / 1242) * width,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollViewContent: {
    paddingHorizontal: (51 / 1242) * width,
    paddingTop: (23 / 1242) * width,
    paddingBottom: (100 / 1242) * width,
  },
  sweetItemScrollable: {
    width: (1140 / 1242) * width,
    height: (256 / 1242) * width,
    borderRadius: (75 / 1242) * width,
    backgroundColor: '#FFFFFF',
    shadowColor: '#B4ADB1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.69,
    shadowRadius: 8.8,
    elevation: 8,
    opacity: 1,
    paddingHorizontal: (40 / 1242) * width,
    paddingVertical: (30 / 1242) * width,
    justifyContent: 'center',
  },
  sweetItem: {
    position: 'absolute',
    left: (51 / 1242) * width,
    width: (1140 / 1242) * width,
    height: (256 / 1242) * width,
    borderRadius: (75 / 1242) * width,
    backgroundColor: '#FFFFFF',
    shadowColor: '#B4ADB1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.69,
    shadowRadius: 8.8,
    elevation: 8,
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    paddingHorizontal: (40 / 1242) * width,
    paddingVertical: (30 / 1242) * width,
    justifyContent: 'center',
  },
  sweetName: {
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 0.99) / 1242 * width,
    color: '#303539',
    marginBottom: (10 / 1242) * width,
  },
  sweetCalories: {
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (36 / 1242) * width,
    lineHeight: (36 * 0.99) / 1242 * width,
    textTransform: 'capitalize',
    color: '#A2A2A2',
  },
  addSweetButtonScrollable: {
    position: 'absolute',
    right: (40 / 1242) * width,
    top: '50%',
    marginTop: -(113 / 2 / 1242) * width,
    width: (113 / 1242) * width,
    height: (113 / 1242) * width,
    borderRadius: (113 / 2 / 1242) * width,
    backgroundColor: '#FF77C0',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  addSweetButton: {
    position: 'absolute',
    left: (950 / 1242) * width,
    top: (71 / 1242) * width,
    width: (113 / 1242) * width,
    height: (113 / 1242) * width,
    borderRadius: (113 / 2 / 1242) * width,
    backgroundColor: '#FF77C0',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  addSweetButtonText: {
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: (80 / 1242) * width,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  carbohydratesText: {
    position: 'absolute',
    width: (400 / 1242) * width,
    height: (47 / 1242) * width,
    top: (1247 / 1242) * width,
    left: (55 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 0.99) / 1242 * width,
    letterSpacing: 0,
    textAlign: 'center',
    textTransform: 'capitalize',
    color: '#303539',
    opacity: 1,
  },
  carbohydratesValue: {
    position: 'absolute',
    width: (120 / 1242) * width,
    height: (36 / 1242) * width,
    top: (1356 / 1242) * width,
    left: (147 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (36 / 1242) * width,
    lineHeight: (36 * 0.99) / 1242 * width,
    letterSpacing: 0,
    textAlign: 'center',
    textTransform: 'capitalize',
    color: '#444343',
    opacity: 1,
  },
  carbohydratesRectangle: {
    position: 'absolute',
    width: (201 / 1242) * width,
    height: (19 / 1242) * width,
    top: (1315 / 1242) * width,
    left: (106 / 1242) * width,
    borderRadius: (100 / 1242) * width,
    backgroundColor: '#D9D9D9',
    opacity: 1,
  },
  carbohydratesProgress: {
    position: 'absolute',
    height: (19 / 1242) * width,
    top: (1315 / 1242) * width,
    left: (106 / 1242) * width,
    borderRadius: (100 / 1242) * width,
    backgroundColor: '#FF77C0',
    opacity: 1,
  },
  proteinsText: {
    position: 'absolute',
    width: (170 / 1242) * width,
    height: (47 / 1242) * width,
    top: (1247 / 1242) * width,
    left: (536 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 0.99) / 1242 * width,
    letterSpacing: 0,
    textAlign: 'center',
    textTransform: 'capitalize',
    color: '#303539',
    opacity: 1,
  },
  proteinsValue: {
    position: 'absolute',
    width: (120 / 1242) * width,
    height: (36 / 1242) * width,
    top: (1356 / 1242) * width,
    left: (561 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (36 / 1242) * width,
    lineHeight: (36 * 0.99) / 1242 * width,
    letterSpacing: 0,
    textAlign: 'center',
    textTransform: 'capitalize',
    color: '#444343',
    opacity: 1,
  },
  proteinsRectangle: {
    position: 'absolute',
    width: (170 / 1242) * width,
    height: (19 / 1242) * width,
    top: (1315 / 1242) * width,
    left: (536 / 1242) * width,
    borderRadius: (100 / 1242) * width,
    backgroundColor: '#D9D9D9',
    opacity: 1,
  },
  proteinsProgress: {
    position: 'absolute',
    height: (19 / 1242) * width,
    top: (1315 / 1242) * width,
    left: (536 / 1242) * width,
    borderRadius: (100 / 1242) * width,
    backgroundColor: '#FF77C0',
    opacity: 1,
  },
  fatsText: {
    position: 'absolute',
    width: (170 / 1242) * width,
    height: (47 / 1242) * width,
    top: (1253 / 1242) * width,
    left: (948 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 0.99) / 1242 * width,
    letterSpacing: 0,
    textAlign: 'center',
    textTransform: 'capitalize',
    color: '#303539',
    opacity: 1,
  },
  fatsValue: {
    position: 'absolute',
    width: (120 / 1242) * width,
    height: (36 / 1242) * width,
    top: (1362 / 1242) * width,
    left: (973 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (36 / 1242) * width,
    lineHeight: (36 * 0.99) / 1242 * width,
    letterSpacing: 0,
    textAlign: 'center',
    textTransform: 'capitalize',
    color: '#444343',
    opacity: 1,
  },
  fatsRectangle: {
    position: 'absolute',
    width: (170 / 1242) * width,
    height: (19 / 1242) * width,
    top: (1321 / 1242) * width,
    left: (948 / 1242) * width,
    borderRadius: (100 / 1242) * width,
    backgroundColor: '#D9D9D9',
    opacity: 1,
  },
  fatsProgress: {
    position: 'absolute',
    height: (19 / 1242) * width,
    top: (1321 / 1242) * width,
    left: (948 / 1242) * width,
    borderRadius: (100 / 1242) * width,
    backgroundColor: '#FF77C0',
    opacity: 1,
  },

  
  carbohydratesTextRussian: {
    width: (400 / 1242) * width,
    left: (55 / 1242) * width,
  },
  carbohydratesTextFrench: {
    width: (300 / 1242) * width,
    left: (56 / 1242) * width,
  },

  proteinsTextRussian: {
    width: (170 / 1242) * width,
    left: (536 / 1242) * width,
  },
  proteinsTextFrench: {
    width: (200 / 1242) * width,
    left: (521 / 1242) * width,
  },

  fatsTextRussian: {
    width: (170 / 1242) * width,
    left: (948 / 1242) * width,
  },
  fatsTextFrench: {
    width: (170 / 1242) * width,
    left: (948 / 1242) * width,
  },

  
  addProductRectangle: {
    width: (1140 / 1242) * width,
    height: (256 / 1242) * width,
    marginLeft: (51 / 1242) * width,
    borderRadius: (75 / 1242) * width,
    backgroundColor: '#FFFFFF',
    shadowColor: '#B4ADB1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.69,
    shadowRadius: (8.8 / 1242) * width,
    elevation: 8,
    opacity: 1,
    marginBottom: (20 / 1242) * width,
  },

  

  
  addedProductsContainer: {
    paddingBottom: (50 / 1242) * width,
  },

  
  addedProductImage: {
    position: 'absolute',
    width: (193 / 1242) * width,
    height: (193 / 1242) * width,
    left: (90 / 1242) * width,
    top: (31 / 1242) * width,
    opacity: 1,
  },

  
  addedProductName: {
    position: 'absolute',
    width: (706 / 1242) * width,
    height: (60 / 1242) * width,
    top: (63 / 1242) * width,
    left: (320 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 0.99) / 1242 * width,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#303539',
    opacity: 1,
  },

  
  addedProductNutrition: {
    position: 'absolute',
    width: (800 / 1242) * width, 
    height: (60 / 1242) * width,
    top: (132 / 1242) * width, 
    left: (320 / 1242) * width, 
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (36 / 1242) * width,
    lineHeight: (36 * 0.99) / 1242 * width,
    letterSpacing: 0,
    textAlign: 'left',
    textTransform: 'capitalize',
    color: '#444343',
    opacity: 1,
  },

  
  addedProductEllipse: {
    position: 'absolute',
    width: (113 / 1242) * width,
    height: (113 / 1242) * width,
    top: (70 / 1242) * width, 
    left: (972 / 1242) * width, 
    borderRadius: (113 / 2 / 1242) * width, 
    backgroundColor: '#FF77C0',
    opacity: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pencilImage: {
    width: (60 / 1242) * width,
    height: (60 / 1242) * width,
    opacity: 1,
  },
});

export default DiaryScreen;