import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { Language } from '../../locales/translations';

interface Props {
  language: Language;
}

export const OfflineIndicator: React.FC<Props> = ({ language }) => {
  const isOnline = useOnlineStatus();
  const isUrdu = language === 'ur';

  if (isOnline) return null;

  return (
    <div className="fixed bottom-18 md:bottom-6 right-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600/95 text-white px-3.5 py-2 text-xs font-semibold shadow-xl border border-amber-500/50 backdrop-blur-md animate-fade-in">
      <WifiOff className="w-4 h-4 animate-pulse" />
      <span>
        {isUrdu
          ? 'آف لائن موڈ — تمام ڈیٹا فون میں محفوظ ہو رہا ہے'
          : 'Offline Mode — Changes saved locally in IndexedDB'}
      </span>
    </div>
  );
};
