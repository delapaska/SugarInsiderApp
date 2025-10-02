import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { t, Language } from './translations';
import { formatSugar, getSugarDisplayValue, getSugarUnit } from './unitConversion';
import { generateStatisticsPDF } from './pdfGenerator';

const { width } = Dimensions.get('window');

interface StatisticsScreenProps {
  onBack: () => void;
  language?: Language;
  onDiaryPress: () => void;
  onProfilePress: () => void;
  onProPress: () => void;
  dailyCalories?: number;
  dailyCarbohydrates?: number;
  dailyProteins?: number;
  dailyFats?: number;
  unitSystem?: 'european' | 'american';
  savedNutritionData?: any[];
  selectedDate?: Date;
  isPremium?: boolean;
}

const StatisticsScreen: React.FC<StatisticsScreenProps> = ({
  onBack,
  language = 'English',
  onDiaryPress,
  onProfilePress,
  onProPress,
  dailyCalories = 0,
  dailyCarbohydrates = 0,
  dailyProteins = 0,
  dailyFats = 0,
  unitSystem = 'european',
  savedNutritionData = [],
  selectedDate = new Date(),
  isPremium = false
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [hoveredData, setHoveredData] = useState<{data: any; index: number} | null>(null); 
  const [selectedDayData, setSelectedDayData] = useState<any>(null); 
  const [fadeTimeout, setFadeTimeout] = useState<any>(null);
  const [isFullscreenChart, setIsFullscreenChart] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false); 

  
  const handleSugarChartPress = () => {
    if (isPremium) {
      setIsFullscreenChart(true);
    }
  };


  const closeFullscreenChart = () => {
    setIsFullscreenChart(false);
  };


  const handleExportPDF = async () => {
    if (!isPremium) {
      onProPress();
      return;
    }

    setIsGeneratingPDF(true);

    try {
      const chartData = getChartData();
      const pdfPath = await generateStatisticsPDF({
        selectedPeriod,
        chartData,
        language,
        unitSystem,
        selectedDate
      });

      Alert.alert(
        t('success', language) || 'Success',
        pdfPath,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        t('error', language) || 'Error',
        t('pdfGenerationFailed', language) || 'Failed to generate PDF report',
        [{ text: 'OK' }]
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };


  
  const getChartData = () => {
    const currentDate = new Date(selectedDate);
    const data = [];

    if (selectedPeriod === 'day') {
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];

        const dayData = savedNutritionData.filter(item => item.date === dateString);
        const totalCalories = dayData.reduce((total, item) => total + (item.calculatedNutrition?.calories || 0), 0);

        data.push({
          date: dateString,
          calories: totalCalories,
          label: date.getDate().toString(),
          fullDate: date,
          dayData: dayData
        });
      }
    } else if (selectedPeriod === 'week') {
      
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(currentDate);
        weekStart.setDate(weekStart.getDate() - (i * 7) - 6);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const weekData = savedNutritionData.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= weekStart && itemDate <= weekEnd;
        });

        const totalCalories = weekData.reduce((total, item) => total + (item.calculatedNutrition?.calories || 0), 0);

        data.push({
          date: weekStart.toISOString().split('T')[0],
          calories: totalCalories,
          label: `W${4-i}`,
          fullDate: weekStart,
          dayData: weekData
        });
      }
    } else if (selectedPeriod === 'month') {
      
      for (let i = 30; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];

        const dayData = savedNutritionData.filter(item => item.date === dateString);
        const totalCalories = dayData.reduce((total, item) => total + (item.calculatedNutrition?.calories || 0), 0);

        data.push({
          date: dateString,
          calories: totalCalories,
          label: date.getDate().toString(),
          fullDate: date,
          dayData: dayData
        });
      }
    }

    return data;
  };

  
  const getBarColor = (calories: number) => {
    if (!isPremium) {
      return calories > 0 ? '#FF77C0' : '#E0E0E0';
    }

    
    if (calories === 0) return '#E0E0E0';
    const intensity = Math.min(calories / 2000, 1.5); 

    if (intensity <= 0.5) return '#FF77C0'; 
    if (intensity <= 0.8) return '#FF6B9D'; 
    if (intensity <= 1.0) return '#FF5E8A'; 
    if (intensity <= 1.2) return '#FF4E7A'; 
    return '#FF3D6A'; 
  };

  
  const getStatusText = (calories: number) => {
    if (!isPremium || calories === 0) return '';
    const target = 2000;
    if (calories < target * 0.7) return language === 'Russian' ? 'Недобор' : language === 'French' ? 'Insuffisant' : 'Under';
    if (calories <= target * 1.1) return language === 'Russian' ? 'Норма' : language === 'French' ? 'Normal' : 'Normal';
    if (calories <= target * 1.3) return language === 'Russian' ? 'Превышение' : language === 'French' ? 'Excès' : 'Over';
    return language === 'Russian' ? 'Сильное превышение' : language === 'French' ? 'Très élevé' : 'High';
  };

  
  const handleBarPress = (dataPoint: any) => {
    if (isPremium) {
      
      if (fadeTimeout) {
        clearTimeout(fadeTimeout);
      }

      setSelectedDayData(dataPoint);

      
      const newTimeout = setTimeout(() => {
        setSelectedDayData(null);
      }, 3000);

      setFadeTimeout(newTimeout);
    }
    
  };

  const handleBarPressIn = (dataPoint: any, index: number) => {
    
    setHoveredData({ data: dataPoint, index });
  };

  const handleBarPressOut = () => {
    
    setHoveredData(null);
  };

  
  useEffect(() => {
    return () => {
      if (fadeTimeout) {
        clearTimeout(fadeTimeout);
      }
    };
  }, [fadeTimeout]);

  
  const getNutritionData = (dayData: any[]) => {
    const totalCarbs = dayData.reduce((sum, item) => sum + (item.calculatedNutrition?.carbohydrates || 0), 0);
    const totalFats = dayData.reduce((sum, item) => sum + (item.calculatedNutrition?.fats || 0), 0);
    const totalProteins = dayData.reduce((sum, item) => sum + (item.calculatedNutrition?.protein || 0), 0);

    const total = totalCarbs + totalFats + totalProteins;
    if (total === 0) return null;

    return {
      carbs: { value: totalCarbs, percentage: (totalCarbs / total) * 100, color: '#4CAF50' },
      fats: { value: totalFats, percentage: (totalFats / total) * 100, color: '#FF77C0' },
      proteins: { value: totalProteins, percentage: (totalProteins / total) * 100, color: '#6B73FF' }
    };
  };

  
  const createPieSegments = (nutritionData: any) => {
    if (!nutritionData) return null;

    const radius = (80 / 1242) * width;
    const segments = [];

    let currentAngle = 0;

    
    const carbsAngle = (nutritionData.carbs.percentage / 100) * 360;
    segments.push({
      startAngle: currentAngle,
      endAngle: currentAngle + carbsAngle,
      color: nutritionData.carbs.color,
      percentage: nutritionData.carbs.percentage,
    });
    currentAngle += carbsAngle;

    
    const fatsAngle = (nutritionData.fats.percentage / 100) * 360;
    segments.push({
      startAngle: currentAngle,
      endAngle: currentAngle + fatsAngle,
      color: nutritionData.fats.color,
      percentage: nutritionData.fats.percentage,
    });
    currentAngle += fatsAngle;

    
    const proteinsAngle = (nutritionData.proteins.percentage / 100) * 360;
    segments.push({
      startAngle: currentAngle,
      endAngle: currentAngle + proteinsAngle,
      color: nutritionData.proteins.color,
      percentage: nutritionData.proteins.percentage,
    });

    return segments;
  };

  
  const renderPieChart = (nutritionData: any, radius: number) => {
    const totalValue = nutritionData.carbs.value + nutritionData.fats.value + nutritionData.proteins.value;

    
    const carbsPercent = totalValue > 0 ? (nutritionData.carbs.value / totalValue) * 100 : 33.33;
    const fatsPercent = totalValue > 0 ? (nutritionData.fats.value / totalValue) * 100 : 33.33;
    const proteinsPercent = 100 - carbsPercent - fatsPercent;

    const donutThickness = radius * 0.35;
    const segments = [];

    
    segments.push(
      <View
        key="base"
        style={{
          position: 'absolute',
          width: radius * 2,
          height: radius * 2,
          borderRadius: radius,
          backgroundColor: '#F0F0F0',
          top: 0,
          left: 0,
        }}
      />
    );

    
    const circumference = 2 * Math.PI * radius;
    const carbsLength = (carbsPercent / 100) * circumference;
    const fatsLength = (fatsPercent / 100) * circumference;
    const proteinsLength = (proteinsPercent / 100) * circumference;

    
    let currentAngle = 0; 

    
    const createSegment = (color: string, angle: number, startAngle: number) => {
      const segmentElements = [];

      
      let remainingAngle = angle;
      let currentRotation = startAngle;

      while (remainingAngle > 0) {
        const segmentAngle = Math.min(remainingAngle, 90);

        
        let borderStyle = {};
        const normalizedRotation = ((currentRotation % 360) + 360) % 360;

        if (normalizedRotation >= 0 && normalizedRotation < 90) {
          borderStyle = { borderTopColor: color };
        } else if (normalizedRotation >= 90 && normalizedRotation < 180) {
          borderStyle = { borderRightColor: color };
        } else if (normalizedRotation >= 180 && normalizedRotation < 270) {
          borderStyle = { borderBottomColor: color };
        } else {
          borderStyle = { borderLeftColor: color };
        }

        segmentElements.push(
          <View
            key={`${color}-${currentRotation}`}
            style={{
              position: 'absolute',
              width: radius * 2,
              height: radius * 2,
              borderRadius: radius,
              borderWidth: donutThickness,
              borderColor: 'transparent',
              ...borderStyle,
              transform: [{ rotate: `${currentRotation}deg` }],
              top: 0,
              left: 0,
            }}
          />
        );

        remainingAngle -= segmentAngle;
        currentRotation += segmentAngle;
      }

      return segmentElements;
    };

    
    const carbsAngle = (carbsPercent / 100) * 360;
    segments.push(...createSegment(nutritionData.carbs.color, carbsAngle, currentAngle));
    currentAngle += carbsAngle;

    
    const fatsAngle = (fatsPercent / 100) * 360;
    segments.push(...createSegment(nutritionData.fats.color, fatsAngle, currentAngle));
    currentAngle += fatsAngle;

    
    const proteinsAngle = (proteinsPercent / 100) * 360;
    segments.push(...createSegment(nutritionData.proteins.color, proteinsAngle, currentAngle));

    return segments;
  };

  const chartData = getChartData();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5A8D4" />

      <Image
        source={require('./Settings/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Image
          source={require('./Profile/arrow.png')}
          style={styles.backArrowImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Text style={styles.statisticsTitle}>{t('statistics', language)}</Text>

      <View style={styles.rectangle} />

      <View style={styles.innerRectangle} />

      <TouchableOpacity
        style={[styles.dayButton, selectedPeriod === 'day' && styles.activeButton]}
        onPress={() => setSelectedPeriod('day')}
      >
        <Text style={[styles.dayText, selectedPeriod === 'day' && styles.activeText]}>
          {t('day', language)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.weekButton, selectedPeriod === 'week' && styles.activeButton]}
        onPress={() => setSelectedPeriod('week')}
      >
        <Text style={[styles.weekText, selectedPeriod === 'week' && styles.activeText]}>
          {t('week', language)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.monthButton, selectedPeriod === 'month' && styles.activeButton]}
        onPress={() => setSelectedPeriod('month')}
      >
        <Text style={[styles.monthText, selectedPeriod === 'month' && styles.activeText]}>
          {t('month', language)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.pdfExportButton,
          isGeneratingPDF && styles.pdfExportButtonDisabled,
          !isPremium && styles.pdfExportButtonFree
        ]}
        onPress={handleExportPDF}
        disabled={isGeneratingPDF}
      >
        <Text style={[styles.copyIcon, !isPremium && styles.copyIconFree]}>📄</Text>
        <Text style={[styles.pdfExportText, !isPremium && styles.pdfExportTextFree]}>
          {isGeneratingPDF ?
            (t('generating', language) || 'Generating...') :
            (t('exportPDF', language) || 'PDF')
          }
        </Text>
      </TouchableOpacity>

      <Text style={styles.calorieIntakeTitle}>{t('calorieIntake', language)}</Text>

      <View style={styles.statisticsDataRectangle}>
        <Text style={styles.chartTitle}>
          {selectedPeriod === 'day' ? t('calorieIntake', language) :
           selectedPeriod === 'week' ? `${t('calorieIntake', language)} - ${t('week', language)}` :
           `${t('calorieIntake', language)} - ${t('month', language)}`}
        </Text>

        <View style={styles.chartContainer}>

          <View style={styles.chartBars}>
            {chartData.map((dataPoint, index) => {
              const maxCalories = Math.max(...chartData.map(d => d.calories), 2000);
              const barHeight = dataPoint.calories > 0 ? Math.max((dataPoint.calories / maxCalories) * 280, 15) : 8;

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.barContainer}
                  onPress={() => handleBarPress(dataPoint)}
                  onPressIn={() => handleBarPressIn(dataPoint, index)}
                  onPressOut={handleBarPressOut}
                  activeOpacity={isPremium ? 0.7 : 1}
                  delayPressIn={0}
                  delayPressOut={0}
                >
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.chartBar,
                        isPremium && styles.premiumBar,
                        {
                          height: (barHeight / 1242) * width,
                          backgroundColor: getBarColor(dataPoint.calories),
                        }
                      ]}
                    />
                    {isPremium && dataPoint.calories > 0 && (
                      <View style={styles.nutritionIndicators}>
                        <View style={[styles.miniIndicator, { backgroundColor: '#4CAF50' }]} />
                        <View style={[styles.miniIndicator, { backgroundColor: '#FF77C0' }]} />
                        <View style={[styles.miniIndicator, { backgroundColor: '#6B73FF' }]} />
                      </View>
                    )}
                  </View>
                  <Text style={styles.barLabel}>{dataPoint.label}</Text>

                  {hoveredData && hoveredData.index === index && (
                    <View style={styles.hoverInfo}>
                      <Text style={[
                        styles.hoverCalories,
                        {
                          fontSize: hoveredData.data.calories >= 1000
                            ? (20 / 1242) * width
                            : hoveredData.data.calories >= 10000
                            ? (18 / 1242) * width
                            : (24 / 1242) * width
                        }
                      ]}>
                        {Math.round(hoveredData.data.calories)}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>


        </View>

      </View>

      <View style={styles.newRectangle}>
        <Text style={styles.averageCalorieIntakeTitle}>
          {t('averageCalorieIntake', language)}
        </Text>
        <Text
          style={[
            styles.averageCaloriesValue,
            {
              fontSize: (60 / 1242) * width  
            }
          ]}
          numberOfLines={1}
          allowFontScaling={false}
          ellipsizeMode="clip"
        >
          {(() => {
            const data = getChartData();

            
            let validData;
            if (selectedPeriod === 'month') {
              validData = data.filter(item => item.calories > 0);
            } else {
              validData = data;
            }

            const totalCalories = validData.reduce((sum, item) => sum + item.calories, 0);
            const average = validData.length > 0 ? Math.round(totalCalories / validData.length) : 0;
            return average;
          })()}
        </Text>
      </View>

      <View style={styles.additionalRectangle}>
        <Text style={styles.sugarChartTitle}>
          {t('sugarConsumption', language)}
        </Text>

        <TouchableOpacity
          style={styles.sugarChartContainer}
          onPress={handleSugarChartPress}
          activeOpacity={isPremium ? 0.8 : 1}
        >
          <View style={styles.sugarChart}>
            {(() => {
              const chartContainerHeight = (420 / 1242) * width;
              const chartAreaHeight = chartContainerHeight - (80 / 1242) * width;
              const baseLineY = chartAreaHeight;

              return [0, 1, 2, 3, 4].map(i => (
                <View key={i} style={[styles.gridLine, {
                  top: baseLineY - (i * (chartAreaHeight - (20 / 1242) * width) / 4),
                }]} />
              ));
            })()}

            {(() => {
              const chartContainerHeight = (420 / 1242) * width;
              const chartAreaHeight = chartContainerHeight - (80 / 1242) * width;
              return (
                <View style={[styles.gridLine, {
                  top: chartAreaHeight,
                  backgroundColor: '#999',
                  height: 2,
                }]} />
              );
            })()}

            {(() => {
              const data = getChartData();
              return data.map((dataPoint, index) => {
                
                if (selectedPeriod === 'month' && index % 3 !== 0) return null;

                return (
                  <View key={`vertical-${index}`} style={[styles.verticalGridLine, {
                    left: (index * (940 / data.length) / 1242) * width,
                    top: (20 / 1242) * width,
                    height: (300 / 1242) * width,
                  }]} />
                );
              });
            })()}

            {(() => {
              const data = getChartData();
              const sugarData = data.map(d => {
                const dayData = d.dayData || [];
                return dayData.reduce((sum, item) => sum + (item.calculatedNutrition?.sugar || 0), 0);
              });
              const maxSugar = Math.max(...sugarData, 25); 

              
              const actualMax = Math.max(...sugarData);
              const chartMax = actualMax > maxSugar ? Math.ceil(actualMax / 10) * 10 : maxSugar;

              return data.map((dataPoint, index) => {
                const sugarValue = dataPoint.dayData ?
                  dataPoint.dayData.reduce((sum, item) => sum + (item.calculatedNutrition?.sugar || 0), 0) : 0;

                
                const normalizedValue = Math.min(sugarValue / chartMax, 1); 
                
                const chartContainerHeight = (420 / 1242) * width;
                const chartAreaHeight = chartContainerHeight - (80 / 1242) * width; 
                const pointHeight = chartAreaHeight - normalizedValue * (chartAreaHeight - (20 / 1242) * width);
                const nextPoint = data[index + 1];

                return (
                  <View key={index} style={styles.chartPointContainer}>
                    {nextPoint && (() => {
                      const nextSugarValue = nextPoint.dayData ?
                        nextPoint.dayData.reduce((sum, item) => sum + (item.calculatedNutrition?.sugar || 0), 0) : 0;
                      const nextNormalizedValue = Math.min(nextSugarValue / chartMax, 1);
                      const nextPointHeight = chartAreaHeight - nextNormalizedValue * (chartAreaHeight - (20 / 1242) * width);

                      const lineHeight = Math.abs(nextPointHeight - pointHeight);
                      const lineWidth = (940 / data.length / 1242) * width; 
                      const lineAngle = Math.atan2(nextPointHeight - pointHeight, lineWidth) * (180 / Math.PI);

                      return (
                        <View style={[styles.chartLine, {
                          width: Math.sqrt(Math.pow(lineWidth, 2) + Math.pow(nextPointHeight - pointHeight, 2)),
                          height: 2,
                          left: (index * (940 / data.length) / 1242) * width,
                          top: pointHeight,
                          transform: [{ rotate: `${lineAngle}deg` }],
                          transformOrigin: 'left center',
                        }]} />
                      );
                    })()}


                    {(selectedPeriod !== 'month' || index % 3 === 0) && (
                      <Text style={[styles.chartXLabel, {
                        left: (index * (940 / data.length) / 1242) * width,
                        top: chartAreaHeight + (20 / 1242) * width,
                      }]}>
                        {dataPoint.label}
                      </Text>
                    )}
                  </View>
                );
              });
            })()}

            {[0, 1, 2, 3, 4].map(i => {
              const data = getChartData();
              const sugarData = data.map(d => {
                const dayData = d.dayData || [];
                return dayData.reduce((sum, item) => sum + (item.calculatedNutrition?.sugar || 0), 0);
              });
              const maxSugar = Math.max(...sugarData, 25);
              const actualMax = Math.max(...sugarData);
              const chartMax = actualMax > maxSugar ? Math.ceil(actualMax / 10) * 10 : maxSugar;

              const gramValue = Math.round((chartMax / 4) * i);
              const displayValue = getSugarDisplayValue(gramValue, unitSystem);
              const unit = getSugarUnit(unitSystem, language);

              const chartContainerHeight = (420 / 1242) * width;
              const chartAreaHeight = chartContainerHeight - (80 / 1242) * width;
              const baseLineY = chartAreaHeight;

              return (
                <Text key={i} style={[styles.chartYLabel, {
                  top: baseLineY - (i * (chartAreaHeight - (20 / 1242) * width) / 4),
                  left: -(40 / 1242) * width,
                }]}>
                  {displayValue}{unit}
                </Text>
              );
            })}
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNavContainer}>
        <View style={styles.topBorder} />

        <View style={styles.bottomNavContent}>
          <TouchableOpacity style={styles.diaryTab} onPress={onDiaryPress}>
            <Image
              source={require('./Diary/Parts/notepad1.png')}
              style={styles.diaryIcon}
              resizeMode="contain"
            />
            <Text style={styles.diaryText}>{t('diary', language)}</Text>
          </TouchableOpacity>

          <View style={styles.statisticsTab}>
            <Image
              source={require('./Diary/Parts/Statistics.png')}
              style={styles.statisticsIcon}
              resizeMode="contain"
            />
            <Text style={styles.statisticsText}>{t('statistics', language)}</Text>
          </View>

          <TouchableOpacity style={styles.profileTab} onPress={onProfilePress}>
            <Image
              source={require('./Diary/Parts/prof.png')}
              style={styles.profileIcon}
              resizeMode="contain"
            />
            <Text style={styles.profileText}>{t('profile', language)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.proTab} onPress={onProPress}>
            <Image
              source={require('./Diary/Parts/pro-1.png')}
              style={styles.proIcon}
              resizeMode="contain"
            />
            <Text style={styles.proText}>{t('pro', language)}</Text>
          </TouchableOpacity>

        </View>
      </View>

      {isPremium && selectedDayData && (() => {
        const nutritionData = getNutritionData(selectedDayData.dayData);
        if (!nutritionData) return null;

        const radius = (160 / 1242) * width;

        return (
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalBackground}
              onPress={() => setSelectedDayData(null)}
              activeOpacity={1}
            />
            <View style={styles.modalContainer}>
              <View style={styles.modalPieChart}>
                <View style={[styles.pieBackground, {
                  width: radius * 2,
                  height: radius * 2,
                  borderRadius: radius,
                }]} />

                {renderPieChart(nutritionData, radius)}

                <View style={[styles.pieCenter, {
                  width: radius * 1.3,
                  height: radius * 1.3,
                  borderRadius: radius * 0.65,
                  zIndex: 10,
                }]}>
                  <Text style={styles.pieCenterDate}>
                    {new Date(selectedDayData.date).toLocaleDateString(
                      language === 'English' ? 'en-US' :
                      language === 'French' ? 'fr-FR' : 'ru-RU',
                      { day: 'numeric' }
                    )}
                  </Text>
                  <Text style={[
                    styles.pieCenterCalories,
                    {
                      fontSize: selectedDayData.calories >= 1000
                        ? (20 / 1242) * width
                        : (24 / 1242) * width
                    }
                  ]}>
                    {Math.round(selectedDayData.calories)}
                  </Text>
                  <Text style={[styles.pieCenterDate, { fontSize: (16 / 1242) * width }]}>
                    {unitSystem === 'american' ? 'Cal' : 'kcal'}
                  </Text>
                </View>
              </View>

              <View style={styles.modalNutritionLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: nutritionData.carbs.color }]} />
                  <Text style={styles.legendText}>
                    {t('carbohydrates', language)} {formatSugar(nutritionData.carbs.value, unitSystem)}
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: nutritionData.fats.color }]} />
                  <Text style={styles.legendText}>
                    {t('fats', language)} {formatSugar(nutritionData.fats.value, unitSystem)}
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: nutritionData.proteins.color }]} />
                  <Text style={styles.legendText}>
                    {t('proteins', language)} {formatSugar(nutritionData.proteins.value, unitSystem)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setSelectedDayData(null)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })()}

      {isPremium && isFullscreenChart && (
        <View style={styles.fullscreenModalOverlay}>
          <TouchableOpacity
            style={styles.fullscreenModalBackground}
            onPress={closeFullscreenChart}
          />

          <View style={styles.fullscreenChartContainer}>
            <Text style={styles.fullscreenChartTitle}>
              {t('sugarConsumption', language)}
            </Text>

            <TouchableOpacity
              style={styles.fullscreenCloseButton}
              onPress={closeFullscreenChart}
            >
              <Text style={styles.fullscreenCloseText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.fullscreenChart}>
              {(() => {
                const chartContainerHeight = (1800 / 1242) * width; 
                const chartAreaHeight = chartContainerHeight - (200 / 1242) * width;
                const baseLineY = chartAreaHeight;

                return [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => ( 
                  <View key={i} style={[styles.gridLine, {
                    top: baseLineY - (i * (chartAreaHeight - (20 / 1242) * width) / 8),
                    left: (120 / 1242) * width, 
                    right: (60 / 1242) * width,
                  }]} />
                ));
              })()}

              {(() => {
                const chartContainerHeight = (1800 / 1242) * width;
                const chartAreaHeight = chartContainerHeight - (200 / 1242) * width;
                return (
                  <View style={[styles.gridLine, {
                    top: chartAreaHeight,
                    backgroundColor: '#999',
                    height: 3,
                    left: (120 / 1242) * width, 
                    right: (60 / 1242) * width,
                  }]} />
                );
              })()}

              {(() => {
                const data = getChartData();
                const sugarData = data.map(d => {
                  const dayData = d.dayData || [];
                  return dayData.reduce((sum, item) => sum + (item.calculatedNutrition?.sugar || 0), 0);
                });
                const maxSugar = Math.max(...sugarData, 25);
                const actualMax = Math.max(...sugarData);
                const chartMax = actualMax > maxSugar ? Math.ceil(actualMax / 10) * 10 : maxSugar;

                const chartContainerHeight = (1800 / 1242) * width;
                const chartAreaHeight = chartContainerHeight - (200 / 1242) * width;

                return data.map((dataPoint, index) => {
                  const sugarValue = dataPoint.dayData ?
                    dataPoint.dayData.reduce((sum, item) => sum + (item.calculatedNutrition?.sugar || 0), 0) : 0;

                  const normalizedValue = Math.min(sugarValue / chartMax, 1);
                  const pointHeight = chartAreaHeight - normalizedValue * (chartAreaHeight - (20 / 1242) * width);
                  const nextPoint = data[index + 1];

                  return (
                    <View key={index} style={styles.chartPointContainer}>
                      {nextPoint && (() => {
                        const nextSugarValue = nextPoint.dayData ?
                          nextPoint.dayData.reduce((sum, item) => sum + (item.calculatedNutrition?.sugar || 0), 0) : 0;
                        const nextNormalizedValue = Math.min(nextSugarValue / chartMax, 1);
                        const nextPointHeight = chartAreaHeight - nextNormalizedValue * (chartAreaHeight - (20 / 1242) * width);

                        const lineWidth = (740 / data.length / 1242) * width; 
                        const lineAngle = Math.atan2(nextPointHeight - pointHeight, lineWidth) * (180 / Math.PI);

                        return (
                          <View style={[styles.chartLine, {
                            width: Math.sqrt(Math.pow(lineWidth, 2) + Math.pow(nextPointHeight - pointHeight, 2)),
                            height: 3, 
                            left: (index * (740 / data.length) / 1242) * width + (80 / 1242) * width, 
                            top: pointHeight,
                            transform: [{ rotate: `${lineAngle}deg` }],
                            transformOrigin: 'left center',
                          }]} />
                        );
                      })()}


                      <Text style={[styles.fullscreenChartXLabel, {
                        left: (index * (740 / data.length) / 1242) * width + (80 / 1242) * width, 
                        top: chartAreaHeight + (40 / 1242) * width,
                      }]}>
                        {dataPoint.label}
                      </Text>
                    </View>
                  );
                });
              })()}

              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => {
                const data = getChartData();
                const sugarData = data.map(d => {
                  const dayData = d.dayData || [];
                  return dayData.reduce((sum, item) => sum + (item.calculatedNutrition?.sugar || 0), 0);
                });
                const maxSugar = Math.max(...sugarData, 25);
                const actualMax = Math.max(...sugarData);
                const chartMax = actualMax > maxSugar ? Math.ceil(actualMax / 10) * 10 : maxSugar;

                const gramValue = Math.round((chartMax / 8) * i);
                const displayValue = getSugarDisplayValue(gramValue, unitSystem);
                const unit = getSugarUnit(unitSystem, language);

                const chartContainerHeight = (1800 / 1242) * width;
                const chartAreaHeight = chartContainerHeight - (200 / 1242) * width;
                const baseLineY = chartAreaHeight;

                return (
                  <Text key={i} style={[styles.fullscreenChartYLabel, {
                    top: baseLineY - (i * (chartAreaHeight - (20 / 1242) * width) / 8) - (16 / 1242) * width, 
                    left: (10 / 1242) * width, 
                  }]}>
                    {displayValue}{unit}
                  </Text>
                );
              })}
            </View>
          </View>
        </View>
      )}

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
  statisticsTitle: {
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
  calorieIntakeTitle: {
    position: 'absolute',
    left: (268 / 1242) * width,
    top: (627 / 1242) * width,
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
  rectangle: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (343 / 1242) * width,
    width: (1140 / 1242) * width,
    height: (168 / 1242) * width,
    borderRadius: (26 / 1242) * width,
    backgroundColor: '#FFFFFF',
    shadowColor: '#B4ADB1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.69,
    shadowRadius: (8.8 / 1242) * width,
    elevation: 8,
    opacity: 1,
  },
  innerRectangle: {
    position: 'absolute',
    left: (85 / 1242) * width,
    top: (369 / 1242) * width,
    width: (1072 / 1242) * width,
    height: (116 / 1242) * width,
    borderRadius: (26 / 1242) * width,
    backgroundColor: '#D9D9D9',
    opacity: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  dayButton: {
    position: 'absolute',
    left: (95 / 1242) * width,
    top: (375 / 1242) * width,
    width: (330 / 1242) * width,
    height: (104 / 1242) * width,
    borderRadius: (20 / 1242) * width,
    borderWidth: (3 / 1242) * width,
    borderColor: '#D9D9D9',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  dayText: {
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    textAlign: 'center',
    textTransform: 'capitalize',
    color: '#303539',
  },
  weekButton: {
    position: 'absolute',
    left: (456 / 1242) * width,
    top: (375 / 1242) * width,
    width: (330 / 1242) * width,
    height: (104 / 1242) * width,
    borderRadius: (20 / 1242) * width,
    borderWidth: (3 / 1242) * width,
    borderColor: '#D9D9D9',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  weekText: {
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    textAlign: 'center',
    textTransform: 'capitalize',
    color: '#303539',
  },
  monthButton: {
    position: 'absolute',
    left: (817 / 1242) * width,
    top: (375 / 1242) * width,
    width: (330 / 1242) * width,
    height: (104 / 1242) * width,
    borderRadius: (20 / 1242) * width,
    borderWidth: (3 / 1242) * width,
    borderColor: '#D9D9D9',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  monthText: {
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    textAlign: 'center',
    textTransform: 'capitalize',
    color: '#303539',
  },
  activeButton: {
    borderColor: '#FF77C0',
    backgroundColor: '#FF77C0',
  },
  activeText: {
    color: '#FFFFFF',
  },
  calorieValue: {
    position: 'absolute',
    left: (268 / 1242) * width,
    top: (750 / 1242) * width,
    width: (706 / 1242) * width,
    fontFamily: 'System',
    fontWeight: 'bold',
    fontSize: (80 / 1242) * width,
    textAlign: 'center',
    color: '#FF77C0',
    opacity: 1,
  },
  calorieUnit: {
    position: 'absolute',
    left: (268 / 1242) * width,
    top: (850 / 1242) * width,
    width: (706 / 1242) * width,
    fontFamily: 'System',
    fontWeight: '400',
    fontSize: (36 / 1242) * width,
    textAlign: 'center',
    color: '#303539',
    opacity: 1,
  },
  statisticsDataRectangle: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (778 / 1242) * width,
    width: (1140 / 1242) * width,
    height: (573 / 1242) * width,
    borderRadius: (75 / 1242) * width,
    backgroundColor: '#FFFFFF',
    shadowColor: '#B4ADB1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.69,
    shadowRadius: (8.8 / 1242) * width,
    elevation: 8,
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  newRectangle: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (1399 / 1242) * width,
    width: (1140 / 1242) * width,
    height: (335 / 1242) * width,
    borderRadius: (75 / 1242) * width,
    backgroundColor: '#FFFFFF',
    shadowColor: '#B4ADB1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.69,
    shadowRadius: (8.8 / 1242) * width,
    elevation: 8,
    opacity: 1,
    transform: [{ rotate: '0deg' }],
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  averageCalorieIntakeTitle: {
    position: 'absolute',
    left: (100 / 1242) * width,  
    top: (74 / 1242) * width,
    width: (940 / 1242) * width,  
    height: (80 / 1242) * width,  
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,  
    lineHeight: (48 * 1.1) / 1242 * width,
    textAlign: 'center',
    color: '#303539',
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  averageCaloriesValue: {
    position: 'absolute',
    left: (200 / 1242) * width,
    top: (166 / 1242) * width,
    width: (740 / 1242) * width,
    height: (95 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: '400',
    fontSize: (60 / 1242) * width,  
    lineHeight: (60 * 1.1) / 1242 * width,
    textAlign: 'center',
    color: '#303539',
    opacity: 1,
    textTransform: 'none',
    flexShrink: 0,
    flexWrap: 'nowrap',
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: width,
    height: (280 / 1242) * width,
    backgroundColor: '#FFFFFF',
    opacity: 1,
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
  diaryTab: {
    position: 'absolute',
    left: (110 / 1242) * width,
    top: (2453 - 2429) / (1242 / width),
    alignItems: 'center',
  },
  diaryIcon: {
    width: (68 / 1242) * width,
    height: (68 / 1242) * width,
    opacity: 1,
  },
  diaryText: {
    width: (140 / 1242) * width,
    marginTop: (2537 - 2453 - 68) / (1242 / width),
    fontFamily: 'System',
    fontWeight: '400',
    fontSize: (32 / 1242) * width,
    textAlign: 'center',
    color: '#A2A2A2',
    textTransform: 'capitalize',
    opacity: 1,
  },
  statisticsTab: {
    position: 'absolute',
    left: (426 / 1242) * width,
    top: (2453 - 2429) / (1242 / width),
    alignItems: 'center',
  },
  statisticsIcon: {
    width: (68 / 1242) * width,
    height: (68 / 1242) * width,
    opacity: 1,
  },
  statisticsText: {
    marginTop: (2536 - 2453 - 68) / (1242 / width),
    fontFamily: 'System',
    fontWeight: '400',
    fontSize: (30 / 1242) * width,
    textAlign: 'center',
    color: '#FF77C0',
    textTransform: 'capitalize',
    opacity: 1,
    minWidth: (180 / 1242) * width,
  },
  profileTab: {
    position: 'absolute',
    left: (742 / 1242) * width,
    top: (2453 - 2429) / (1242 / width),
    alignItems: 'center',
  },
  profileIcon: {
    width: (68 / 1242) * width,
    height: (68 / 1242) * width,
    opacity: 1,
  },
  profileText: {
    marginTop: (2537 - 2453 - 68) / (1242 / width),
    fontFamily: 'System',
    fontWeight: '400',
    fontSize: (32 / 1242) * width,
    textAlign: 'center',
    color: '#A2A2A2',
    textTransform: 'capitalize',
    opacity: 1,
    minWidth: (140 / 1242) * width,
  },
  proTab: {
    position: 'absolute',
    left: (1018 / 1242) * width,
    top: (2453 - 2429) / (1242 / width),
    alignItems: 'center',
  },
  proIcon: {
    width: (68 / 1242) * width,
    height: (68 / 1242) * width,
    opacity: 1,
  },
  proText: {
    marginTop: (2536 - 2453 - 68) / (1242 / width),
    fontFamily: 'System',
    fontWeight: '400',
    fontSize: (32 / 1242) * width,
    textAlign: 'center',
    color: '#A2A2A2',
    textTransform: 'capitalize',
    opacity: 1,
    minWidth: (120 / 1242) * width,
  },
  chartTitle: {
    marginTop: (30 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    textAlign: 'center',
    color: '#303539',
    opacity: 1,
  },
  chartContainer: {
    flex: 1,
    marginTop: (40 / 1242) * width,
    paddingHorizontal: (40 / 1242) * width,
    paddingBottom: (30 / 1242) * width,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: (300 / 1242) * width,
    marginTop: (80 / 1242) * width,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
    maxWidth: (80 / 1242) * width,
  },
  barWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  chartBar: {
    width: (35 / 1242) * width,
    borderRadius: (6 / 1242) * width,
    marginBottom: (12 / 1242) * width,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  premiumBar: {
    shadowColor: '#FF77C0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 119, 192, 0.3)',
  },
  nutritionIndicators: {
    flexDirection: 'row',
    gap: (2 / 1242) * width,
    marginBottom: (8 / 1242) * width,
  },
  miniIndicator: {
    width: (6 / 1242) * width,
    height: (6 / 1242) * width,
    borderRadius: (3 / 1242) * width,
    opacity: 0.8,
  },
  barLabel: {
    fontSize: (20 / 1242) * width,
    color: '#303539',
    textAlign: 'center',
    fontWeight: '600',
  },
  hoverInfo: {
    position: 'absolute',
    top: -(50 / 1242) * width,
    alignSelf: 'center',
    zIndex: 10,
    paddingHorizontal: (12 / 1242) * width,
    paddingVertical: (6 / 1242) * width,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: (8 / 1242) * width,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    minWidth: (80 / 1242) * width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hoverCalories: {
    fontSize: (24 / 1242) * width,
    color: '#FF77C0',
    fontWeight: 'bold',
    textAlign: 'center',
    flexShrink: 0,
    flexWrap: 'nowrap',
  },
  additionalRectangle: {
    position: 'absolute',
    left: (51 / 1242) * width,
    top: (1782 / 1242) * width,
    width: (1140 / 1242) * width,
    height: (579 / 1242) * width,
    borderRadius: (75 / 1242) * width,
    backgroundColor: '#FFFFFF',
    shadowColor: '#B4ADB1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.69,
    shadowRadius: (8.8 / 1242) * width,
    elevation: 8,
    opacity: 1,
    transform: [{ rotate: '0deg' }],
  },
  sugarChartTitle: {
    position: 'absolute',
    left: (100 / 1242) * width,
    top: (30 / 1242) * width,
    width: (940 / 1242) * width,
    height: (60 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    fontSize: (48 / 1242) * width,
    lineHeight: (48 * 1.1) / 1242 * width,
    textAlign: 'center',
    color: '#303539',
    opacity: 1,
  },
  sugarChartContainer: {
    position: 'absolute',
    left: (60 / 1242) * width,
    top: (100 / 1242) * width,
    width: (1020 / 1242) * width,
    height: (420 / 1242) * width,
  },
  sugarChart: {
    flex: 1,
    position: 'relative',
    paddingLeft: (40 / 1242) * width,
    paddingRight: (40 / 1242) * width,
    paddingBottom: (40 / 1242) * width,
    paddingTop: (10 / 1242) * width,
  },
  gridLine: {
    position: 'absolute',
    left: (40 / 1242) * width,
    right: (40 / 1242) * width,
    height: 1,
    backgroundColor: '#E0E0E0',
    opacity: 0.5,
  },
  verticalGridLine: {
    position: 'absolute',
    width: 1,
    backgroundColor: '#E0E0E0',
    opacity: 0.3,
  },
  chartPointContainer: {
    position: 'absolute',
  },
  chartPoint: {
    position: 'absolute',
    width: (8 / 1242) * width,
    height: (8 / 1242) * width,
    borderRadius: (4 / 1242) * width,
    backgroundColor: '#FF77C0',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#FF77C0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  chartLine: {
    position: 'absolute',
    backgroundColor: '#FF77C0',
    opacity: 0.8,
  },
  chartXLabel: {
    position: 'absolute',
    fontSize: (12 / 1242) * width,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
    minWidth: (20 / 1242) * width,
  },
  chartYLabel: {
    position: 'absolute',
    fontSize: (14 / 1242) * width,
    color: '#666',
    textAlign: 'right',
    fontWeight: '500',
    minWidth: (35 / 1242) * width,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: (20 / 1242) * width,
    padding: (30 / 1242) * width,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    maxWidth: (800 / 1242) * width,
    position: 'relative',
  },
  modalPieChart: {
    width: (320 / 1242) * width,
    height: (320 / 1242) * width,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: (20 / 1242) * width,
  },
  modalNutritionLegend: {
    gap: (16 / 1242) * width,
    alignItems: 'flex-start',
  },
  modalCloseButton: {
    position: 'absolute',
    top: (10 / 1242) * width,
    right: (15 / 1242) * width,
    width: (40 / 1242) * width,
    height: (40 / 1242) * width,
    borderRadius: (20 / 1242) * width,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: (24 / 1242) * width,
    color: '#666',
    fontWeight: 'bold',
  },
  pieChartContainer: {
    marginTop: (30 / 1242) * width,
    alignItems: 'center',
    padding: (20 / 1242) * width,
    backgroundColor: 'rgba(255, 119, 192, 0.05)',
    borderRadius: (20 / 1242) * width,
    marginHorizontal: (20 / 1242) * width,
  },
  pieChart: {
    width: (320 / 1242) * width,
    height: (320 / 1242) * width,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieBackground: {
    position: 'absolute',
    backgroundColor: '#F5F5F5',
  },
  pieSlice: {
    position: 'absolute',
    overflow: 'hidden',
  },
  pieSliceInner: {
    position: 'absolute',
  },
  pieCenter: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pieCenterDate: {
    fontSize: (20 / 1242) * width,
    color: '#666',
    fontWeight: '500',
    marginBottom: (4 / 1242) * width,
  },
  pieCenterCalories: {
    fontSize: (24 / 1242) * width,
    color: '#333',
    fontWeight: 'bold',
  },
  nutritionLegend: {
    marginTop: (25 / 1242) * width,
    gap: (16 / 1242) * width,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: (8 / 1242) * width,
  },
  legendColor: {
    width: (16 / 1242) * width,
    height: (16 / 1242) * width,
    borderRadius: (8 / 1242) * width,
  },
  legendText: {
    fontSize: (22 / 1242) * width,
    color: '#333',
    fontWeight: '600',
  },

  
  fullscreenModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  fullscreenModalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fullscreenChartContainer: {
    width: (1100 / 1242) * width,
    height: (2000 / 1242) * width,
    backgroundColor: '#FFFFFF',
    borderRadius: (30 / 1242) * width,
    padding: (40 / 1242) * width,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: (15 / 1242) * width,
    elevation: 10,
    overflow: 'visible', 
  },
  fullscreenChartTitle: {
    fontSize: (80 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#303539',
    marginBottom: (40 / 1242) * width,
  },
  fullscreenCloseButton: {
    position: 'absolute',
    top: (20 / 1242) * width,
    right: (20 / 1242) * width,
    width: (60 / 1242) * width,
    height: (60 / 1242) * width,
    backgroundColor: '#F5A8D4',
    borderRadius: (30 / 1242) * width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenCloseText: {
    fontSize: (40 / 1242) * width,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  fullscreenChart: {
    flex: 1,
    position: 'relative',
    paddingLeft: (220 / 1242) * width, 
    paddingRight: (60 / 1242) * width, 
    paddingBottom: (80 / 1242) * width,
    paddingTop: (20 / 1242) * width,
    overflow: 'visible', 
  },
  fullscreenChartPoint: {
    position: 'absolute',
    width: (16 / 1242) * width,
    height: (16 / 1242) * width,
    backgroundColor: '#F5A8D4',
    borderRadius: (8 / 1242) * width,
    borderWidth: (2 / 1242) * width,
    borderColor: '#FFFFFF',
    shadowColor: '#F5A8D4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: (4 / 1242) * width,
    elevation: 3,
  },
  fullscreenChartXLabel: {
    position: 'absolute',
    fontSize: (32 / 1242) * width,
    fontFamily: 'Alatsi',
    color: '#303539',
    textAlign: 'center',
    width: (80 / 1242) * width,
    marginLeft: -(40 / 1242) * width,
  },
  fullscreenChartYLabel: {
    position: 'absolute',
    fontSize: (32 / 1242) * width,
    fontFamily: 'Alatsi',
    color: '#303539',
    textAlign: 'left',
    width: (160 / 1242) * width,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  pdfExportButton: {
    position: 'absolute',
    right: (51 / 1242) * width,
    top: (545 / 1242) * width,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: (20 / 1242) * width,
    paddingVertical: (12 / 1242) * width,
    backgroundColor: '#FF77C0',
    borderRadius: (20 / 1242) * width,
    shadowColor: '#B4ADB1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  pdfExportButtonDisabled: {
    backgroundColor: '#D3D3D3',
    opacity: 0.7,
  },
  copyIcon: {
    fontSize: (24 / 1242) * width,
    color: '#FFFFFF',
    marginRight: (8 / 1242) * width,
  },
  pdfExportText: {
    color: '#FFFFFF',
    fontSize: (28 / 1242) * width,
    fontFamily: 'Alatsi',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  pdfExportButtonFree: {
    backgroundColor: '#B0B0B0',
    borderWidth: 2,
    borderColor: '#FF77C0',
    borderStyle: 'dashed',
  },
  copyIconFree: {
    color: '#666',
  },
  pdfExportTextFree: {
    color: '#666',
  },
  proIndicator: {
    fontSize: (20 / 1242) * width,
    color: '#FFD700',
    marginLeft: (8 / 1242) * width,
  },

});

export default StatisticsScreen;