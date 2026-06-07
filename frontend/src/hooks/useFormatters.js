import { useAuth } from '../contexts/AuthContext';
import { translations } from '../utils/translations';

export const useFormatters = () => {
  const { currency, language } = useAuth();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const t = (key) => {
    const lang = language === 'fr' ? 'fr' : 'en';
    return translations[lang][key] || key;
  };

  return { formatCurrency, t, currentLang: language };
};
