import { Language } from '../locales/translations';

export function formatPKR(
  amount: number,
  formatStyle: 'standard' | 'lakh' = 'standard',
  language: Language = 'en',
  currencySymbol = 'Rs.'
): string {
  const isUrdu = language === 'ur';
  const prefix = isUrdu ? 'روپے ' : `${currencySymbol} `;

  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${prefix}0`;
  }

  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);

  if (formatStyle === 'lakh') {
    if (abs >= 10000000) {
      // 1 Crore = 10,000,000
      const croreVal = (abs / 10000000).toFixed(2).replace(/\.00$/, '');
      const unit = isUrdu ? 'کروڑ' : 'Cr';
      return `${sign}${prefix}${croreVal} ${unit}`;
    }
    if (abs >= 100000) {
      // 1 Lakh = 100,000
      const lakhVal = (abs / 100000).toFixed(2).replace(/\.00$/, '');
      const unit = isUrdu ? 'لاکھ' : 'Lakh';
      return `${sign}${prefix}${lakhVal} ${unit}`;
    }
  }

  // Format with South Asian comma separator system (e.g. 1,50,000)
  const formatted = new Intl.NumberFormat('en-PK', {
    maximumFractionDigits: 0,
  }).format(abs);

  return `${sign}${prefix}${formatted}`;
}

export function formatDate(dateStr: string, language: Language = 'en'): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);

      const urduMonths = [
        'جنوری',
        'فروری',
        'مارچ',
        'اپریل',
        'مئی',
        'جون',
        'جولائی',
        'اگست',
        'ستمبر',
        'اکتوبر',
        'نومبر',
        'دسمبر',
      ];

      if (language === 'ur') {
        return `${day} ${urduMonths[month]} ${year}`;
      }

      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export function downloadCSV(data: string, filename: string): void {
  const blob = new Blob(['\uFEFF' + data], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
