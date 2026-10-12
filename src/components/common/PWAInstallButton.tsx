import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Language } from '../../locales/translations';

interface Props {
  language: Language;
}

export const PWAInstallButton: React.FC<Props> = ({ language }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const isUrdu = language === 'ur';

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all duration-200 active:scale-95"
        title={isUrdu ? 'موبائل یا کمپیوٹر پر انسٹال کریں' : 'Install PWA to Home Screen'}
      >
        <Download className="w-3.5 h-3.5" />
        <span>{isUrdu ? 'ایپ انسٹال کریں' : 'Install App'}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700/30 text-emerald-300 border border-emerald-600/40 hover:bg-emerald-600/20 transition-all duration-200"
          title={isUrdu ? 'آئی فون پر انسٹال کرنے کا طریقہ' : 'Install on iPhone / iPad'}
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isUrdu ? 'آئی او ایس انسٹال' : 'Install (iOS)'}</span>
        </button>

        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative text-slate-900 dark:text-white">
              <button
                onClick={() => setShowIOSModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold mb-2">
                {isUrdu ? 'آئی فون پر ایپ محفوظ کریں' : 'Install on iPhone / iPad'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                {isUrdu
                  ? 'سفاری براؤزر میں درج ذیل 2 آسان اقدامات پر عمل کریں:'
                  : 'Follow these quick steps in Safari:'}
              </p>
              <div className="space-y-3 text-xs bg-slate-100 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white font-bold">
                    1
                  </span>
                  <span>
                    {isUrdu ? 'سفاری کے نچلے بار میں ' : 'Tap the '}
                    <strong className="inline-flex items-center gap-1 text-emerald-500">
                      <Share2 className="w-3.5 h-3.5 inline" /> Share
                    </strong>{' '}
                    {isUrdu ? 'بٹن دبائیں' : 'button'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white font-bold">
                    2
                  </span>
                  <span>
                    {isUrdu ? 'نیچے اسکرول کر کے ' : 'Scroll and select '}
                    <strong className="inline-flex items-center gap-1 text-emerald-500">
                      <PlusSquare className="w-3.5 h-3.5 inline" /> Add to Home Screen
                    </strong>{' '}
                    {isUrdu ? 'پر ٹیپ کریں' : ''}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
              >
                {isUrdu ? 'سمجھ آگیا' : 'Got it'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
