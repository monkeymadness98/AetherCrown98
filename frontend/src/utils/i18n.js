import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to AetherCrown98",
      "dashboard": "Dashboard",
      "products": "Products",
      "analytics": "Analytics",
      "marketing": "Marketing",
      "revenue": "Revenue",
      "settings": "Settings"
    }
  },
  es: {
    translation: {
      "welcome": "Bienvenido a AetherCrown98",
      "dashboard": "Panel de control",
      "products": "Productos",
      "analytics": "Analítica",
      "marketing": "Marketing",
      "revenue": "Ingresos",
      "settings": "Configuración"
    }
  },
  fr: {
    translation: {
      "welcome": "Bienvenue à AetherCrown98",
      "dashboard": "Tableau de bord",
      "products": "Produits",
      "analytics": "Analytique",
      "marketing": "Marketing",
      "revenue": "Revenus",
      "settings": "Paramètres"
    }
  },
  de: {
    translation: {
      "welcome": "Willkommen bei AetherCrown98",
      "dashboard": "Dashboard",
      "products": "Produkte",
      "analytics": "Analytik",
      "marketing": "Marketing",
      "revenue": "Umsatz",
      "settings": "Einstellungen"
    }
  },
  zh: {
    translation: {
      "welcome": "欢迎来到AetherCrown98",
      "dashboard": "仪表板",
      "products": "产品",
      "analytics": "分析",
      "marketing": "营销",
      "revenue": "收入",
      "settings": "设置"
    }
  },
  ja: {
    translation: {
      "welcome": "AetherCrown98へようこそ",
      "dashboard": "ダッシュボード",
      "products": "製品",
      "analytics": "分析",
      "marketing": "マーケティング",
      "revenue": "収益",
      "settings": "設定"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
