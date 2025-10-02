import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { getSugarDisplayValue, getSugarUnit } from './unitConversion';
import { t, Language } from './translations';

export interface PDFReportData {
  selectedPeriod: 'day' | 'week' | 'month';
  chartData: any[];
  language: Language;
  unitSystem: 'european' | 'american';
  selectedDate: Date;
}

interface NutritionItem {
  calculatedNutrition?: {
    calories?: number;
    carbohydrates?: number;
    fats?: number;
    protein?: number;
    sugar?: number;
  };
}

interface ChartDataItem {
  date: string;
  calories: number;
  dayData: NutritionItem[];
}

export const generateStatisticsPDF = async (data: PDFReportData): Promise<string> => {
  const { selectedPeriod, chartData, language, unitSystem, selectedDate } = data;

  const totalCalories = chartData.reduce((sum: number, item: any) => sum + item.calories, 0);
  const averageCalories = chartData.length > 0 ? Math.round(totalCalories / chartData.length) : 0;

  const sugarData = chartData.map((d: any) => {
    const dayData = d.dayData || [];
    return dayData.reduce((sum: number, item: any) => sum + (item.calculatedNutrition?.sugar || 0), 0);
  });
  const totalSugar = sugarData.reduce((sum: number, sugar: number) => sum + sugar, 0);
  const averageSugar = sugarData.length > 0 ? totalSugar / sugarData.length : 0;

  const nutritionData = chartData.map((d: any) => {
    const dayData = d.dayData || [];
    return {
      date: d.date,
      calories: d.calories,
      carbs: dayData.reduce((sum: number, item: any) => sum + (item.calculatedNutrition?.carbohydrates || 0), 0),
      fats: dayData.reduce((sum: number, item: any) => sum + (item.calculatedNutrition?.fats || 0), 0),
      proteins: dayData.reduce((sum: number, item: any) => sum + (item.calculatedNutrition?.protein || 0), 0),
      sugar: dayData.reduce((sum: number, item: any) => sum + (item.calculatedNutrition?.sugar || 0), 0)
    };
  });

  const periodText = selectedPeriod === 'day' ? t('day', language) :
                   selectedPeriod === 'week' ? t('week', language) :
                   t('month', language);

  const reportDate = selectedDate.toLocaleDateString(
    language === 'English' ? 'en-US' :
    language === 'French' ? 'fr-FR' : 'ru-RU'
  );

  const sugarUnit = getSugarUnit(unitSystem, language);
  const calorieUnit = unitSystem === 'american' ? 'Cal' : 'kcal';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sugar Insider - ${t('statistics', language)}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #FF77C0, #F5A8D4);
            color: white;
            border-radius: 15px;
        }
        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: bold;
        }
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .summary-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .summary-value {
            font-size: 24px;
            font-weight: bold;
            color: #FF77C0;
            margin-bottom: 5px;
        }
        .summary-label {
            color: #666;
            font-size: 14px;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #333;
            border-bottom: 2px solid #FF77C0;
            padding-bottom: 10px;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        .data-table th {
            background: #FF77C0;
            color: white;
            padding: 12px 8px;
            text-align: center;
            font-weight: bold;
            font-size: 13px;
        }
        .data-table td {
            padding: 12px 8px;
            text-align: center;
            border-bottom: 1px solid #eee;
            font-size: 12px;
        }
        .data-table tbody tr:nth-child(even) {
            background: #f8f9fa;
        }
        .data-table tbody tr:hover {
            background: #e8f4f8;
        }
        .nutrition-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
        }
        .nutrition-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .nutrition-card.carbs { border-top: 4px solid #4CAF50; }
        .nutrition-card.fats { border-top: 4px solid #FF77C0; }
        .nutrition-card.proteins { border-top: 4px solid #6B73FF; }
        .nutrition-card.sugar { border-top: 4px solid #FF9800; }
        .nutrition-value {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #333;
        }
        .nutrition-label {
            color: #666;
            font-size: 12px;
            text-transform: uppercase;
            font-weight: 600;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            color: #666;
            font-size: 12px;
        }
        @media print {
            body { margin: 0; padding: 15px; }
            .header { background: #FF77C0 !important; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🍬 Sugar Insider - ${t('statistics', language)}</h1>
        <p>${periodText} • ${reportDate}</p>
    </div>

    <div class="summary">
        <div class="summary-card">
            <div class="summary-value">${averageCalories}</div>
            <div class="summary-label">${t('averageCalorieIntake', language)} (${calorieUnit})</div>
        </div>
        <div class="summary-card">
            <div class="summary-value">${getSugarDisplayValue(averageSugar, unitSystem)}${sugarUnit}</div>
            <div class="summary-label">${t('averageSugarIntake', language) || 'Average Sugar Intake'}</div>
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">📊 ${t('dailyBreakdown', language) || 'Daily Breakdown'}</h2>
        <table class="data-table">
            <thead>
                <tr>
                    <th>${t('date', language) || 'Date'}</th>
                    <th>${t('calories', language) || 'Calories'}<br>(${calorieUnit})</th>
                    <th>${t('carbohydrates', language)}<br>(${sugarUnit})</th>
                    <th>${t('fats', language)}<br>(${sugarUnit})</th>
                    <th>${t('proteins', language)}<br>(${sugarUnit})</th>
                    <th>${t('sugar', language) || 'Sugar'}<br>(${sugarUnit})</th>
                </tr>
            </thead>
            <tbody>
                ${nutritionData.map(item => `
                    <tr>
                        <td><strong>${new Date(item.date).toLocaleDateString(language === 'English' ? 'en-US' : language === 'French' ? 'fr-FR' : 'ru-RU')}</strong></td>
                        <td>${Math.round(item.calories)}</td>
                        <td>${getSugarDisplayValue(item.carbs, unitSystem)}</td>
                        <td>${getSugarDisplayValue(item.fats, unitSystem)}</td>
                        <td>${getSugarDisplayValue(item.proteins, unitSystem)}</td>
                        <td><strong>${getSugarDisplayValue(item.sugar, unitSystem)}</strong></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2 class="section-title">🥗 ${t('nutritionTotals', language) || 'Nutrition Totals'}</h2>
        <div class="nutrition-grid">
            <div class="nutrition-card carbs">
                <div class="nutrition-value">${getSugarDisplayValue(nutritionData.reduce((sum, item) => sum + item.carbs, 0), unitSystem)}${sugarUnit}</div>
                <div class="nutrition-label">${t('carbohydrates', language)}</div>
            </div>
            <div class="nutrition-card fats">
                <div class="nutrition-value">${getSugarDisplayValue(nutritionData.reduce((sum, item) => sum + item.fats, 0), unitSystem)}${sugarUnit}</div>
                <div class="nutrition-label">${t('fats', language)}</div>
            </div>
            <div class="nutrition-card proteins">
                <div class="nutrition-value">${getSugarDisplayValue(nutritionData.reduce((sum, item) => sum + item.proteins, 0), unitSystem)}${sugarUnit}</div>
                <div class="nutrition-label">${t('proteins', language)}</div>
            </div>
            <div class="nutrition-card sugar">
                <div class="nutrition-value">${getSugarDisplayValue(nutritionData.reduce((sum, item) => sum + item.sugar, 0), unitSystem)}${sugarUnit}</div>
                <div class="nutrition-label">${t('sugar', language) || 'Sugar'}</div>
            </div>
        </div>
    </div>

    <div class="footer">
        <p><strong>📱 ${t('generatedBy', language) || 'Generated by'} Sugar Insider App</strong></p>
        <p>⭐ ${t('premiumFeature', language) || 'Premium Feature'} • ${new Date().toLocaleString()}</p>
    </div>
</body>
</html>`;

  const fileName = `SugarInsider_Statistics_${selectedPeriod}_${selectedDate.toISOString().split('T')[0]}`;

  try {
    if (!RNHTMLtoPDF || typeof RNHTMLtoPDF.convert !== 'function') {
      return await generateFallbackReport(htmlContent, fileName, language);
    }

    const options = {
      html: htmlContent,
      fileName: fileName + '.pdf',
      directory: 'Documents',
      width: 595,
      height: 842,
      padding: 24,
    };

    console.log('Generating PDF with options:', options);

    const pdf = await RNHTMLtoPDF.convert(options);

    console.log('PDF result:', pdf);

    if (!pdf || !pdf.filePath) {
      throw new Error('PDF генерация завершилась неудачно - файл не был создан');
    }

    return `PDF успешно создан!\nФайл: ${fileName}\nПуть: ${pdf.filePath}`;

  } catch (error: any) {
    console.error('PDF generation error:', error);

    if (error.message?.includes('TurboModuleRegistry') ||
        error.message?.includes('could not be found') ||
        error.message?.includes('RNHTMLtoPDF')) {

      const fileName = `SugarInsider_Statistics_${selectedPeriod}_${selectedDate.toISOString().split('T')[0]}`;
      return await generateFallbackReport(htmlContent, fileName, language);
    }

    throw new Error(`Ошибка генерации PDF: ${error.message || error}`);
  }
};

const generateFallbackReport = async (htmlContent: string, fileName: string, language: Language): Promise<string> => {
  try {
    const Clipboard = require('@react-native-clipboard/clipboard');

    const textReport = htmlToText(htmlContent);

    await Clipboard.default.setString(textReport);

    return `${t('pdfNotAvailable', language) || 'PDF generation not available'}\n\n${t('reportCopiedToClipboard', language) || 'Report copied to clipboard! You can paste it into any app to save.'}\n\n${t('fileName', language) || 'Filename'}: ${fileName}.txt`;

  } catch (clipboardError) {
    const textReport = htmlToText(htmlContent);
    return `${t('reportGenerated', language) || 'Report generated'}:\n\n${textReport}`;
  }
};

const htmlToText = (html: string): string => {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
};