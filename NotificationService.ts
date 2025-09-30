import { Alert } from 'react-native';
import { translations, Language } from './translations';
import { UnitSystem, getSugarUnit, getSugarDisplayValue } from './unitConversion';

interface NotificationSettings {
  enabled: boolean;
  time: string;
  sugarLimitEnabled: boolean;
  dailySugarLimit: number;
  language?: Language;
  unitSystem?: UnitSystem;
}

class NotificationService {
  private settings: NotificationSettings = {
    enabled: false,
    time: '12:00',
    sugarLimitEnabled: false,
    dailySugarLimit: 50, 
    language: 'English',
    unitSystem: 'european'
  };

  private timeoutId: NodeJS.Timeout | null = null;

  
  updateSettings(settings: Partial<NotificationSettings>) {
    this.settings = { ...this.settings, ...settings };
    this.scheduleNotifications();
  }

  
  private scheduleNotifications() {
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (!this.settings.enabled) {
      return;
    }

    
    const nextNotificationTime = this.getNextNotificationTime();
    const now = new Date().getTime();
    const delay = nextNotificationTime - now;

    if (delay > 0) {
      this.timeoutId = setTimeout(() => {
        this.showNotification();
        
        this.scheduleNotifications();
      }, delay);

      console.log(`Notification scheduled in ${Math.round(delay / (1000 * 60))} minutes at ${new Date(nextNotificationTime).toLocaleTimeString()}`);
    }
  }

  
  private getNextNotificationTime(): number {
    const [hours, minutes] = this.settings.time.split(':').map(Number);
    const now = new Date();
    const nextNotification = new Date();

    
    nextNotification.setHours(hours, minutes, 0, 0);

    
    if (nextNotification.getTime() <= now.getTime()) {
      nextNotification.setDate(nextNotification.getDate() + 1);
    }

    return nextNotification.getTime();
  }

  
  private showNotification() {
    const language = this.settings.language || 'English';

    const title = 'Sugar Insider';
    const message = translations[language].reminder_message || translations.English.reminder_message;
    const laterText = translations[language].later || translations.English.later;
    const recordText = translations[language].record || translations.English.record;

    Alert.alert(
      title,
      message,
      [
        {
          text: laterText,
          style: 'cancel'
        },
        {
          text: recordText,
          onPress: () => {
            
            console.log('User wants to add sweets');
          }
        }
      ]
    );
  }

  
  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  
  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  
  checkSugarLimit(dailySugarIntake: number) {
    if (this.settings.sugarLimitEnabled && dailySugarIntake > this.settings.dailySugarLimit) {
      this.showSugarLimitNotification();
    }
  }

  
  private showSugarLimitNotification() {
    const language = this.settings.language || 'English';
    const unitSystem = this.settings.unitSystem || 'european';

    
    const unit = getSugarUnit(unitSystem, language);
    const displayValue = getSugarDisplayValue(this.settings.dailySugarLimit, unitSystem);

    
    const baseMessage = translations[language].sugar_limit_reached || translations.English.sugar_limit_reached;
    const title = translations[language].sugar_limit_notification || translations.English.sugar_limit_notification;

    
    const limitText = language === 'Russian' ? 'Лимит' :
                     language === 'French' ? 'Limite' : 'Limit';
    const message = `${baseMessage}\n${limitText}: ${displayValue}${unit}`;

    Alert.alert(
      title,
      message,
      [
        {
          text: translations[language].OK || translations.English.OK,
          style: 'cancel'
        }
      ]
    );
  }

  
  testNotification() {
    this.showNotification();
  }

  
  testSugarLimitNotification() {
    this.showSugarLimitNotification();
  }

}

export default new NotificationService();