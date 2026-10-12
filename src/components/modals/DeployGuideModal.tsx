import React from 'react';
import { X, BookOpen, Terminal, Smartphone, Globe, Shield, CheckCircle2 } from 'lucide-react';
import { translations, Language } from '../../locales/translations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const DeployGuideModal: React.FC<Props> = ({ isOpen, onClose, language }) => {
  const isUrdu = language === 'ur';
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto animate-scale-up">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            <span>
              {isUrdu
                ? 'استعمال اور ڈپلائمنٹ گائیڈ — My Finance PK'
                : 'Run & Deploy Guide — My Finance PK'}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6 text-xs sm:text-sm">
          {/* Section 1: Google AI Studio Steps */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <h3 className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isUrdu ? 'گوگل اے آئی اسٹوڈیو میں چلانے کا طریقہ' : 'Google AI Studio Quick Steps'}
              </span>
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300">
              <li>{isUrdu ? 'Google AI Studio کھولیں اور لاگ ان کریں۔' : 'Open Google AI Studio and sign in.'}</li>
              <li>{isUrdu ? 'Build آپشن منتخب کریں۔' : 'Select Build mode.'}</li>
              <li>{isUrdu ? 'My Finance PK کا پرامپٹ رن کریں (مکمل ایپ تیار ہو چکی ہے)۔' : 'Prompt is already compiled and running live in your preview.'}</li>
              <li>{isUrdu ? 'ڈیش بورڈ پر جا کر آمدن یا اخراجات درج کر کے چیک کریں۔' : 'Test by adding income, expense, transfers, and bill payments.'}</li>
              <li>{isUrdu ? 'کوڈ ڈاؤن لوڈ کریں یا ون-کلک ڈپلائمنٹ استعمال کریں۔' : 'Download code bundle or deploy to live web URL.'}</li>
            </ol>
          </div>

          {/* Section 2: Local Run with Node/Vite */}
          <div className="space-y-2">
            <h3 className="font-bold flex items-center gap-1.5 text-sm">
              <Terminal className="w-4 h-4 text-sky-500" />
              <span>{isUrdu ? 'اپنے کمپیوٹر پر لوکل چلانا (Localhost)' : 'Run Locally on Your Machine'}</span>
            </h3>
            <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-xs overflow-x-auto">
              <p className="text-slate-400"># 1. Install dependencies</p>
              <p>npm install</p>
              <p className="text-slate-400 mt-2"># 2. Start dev server</p>
              <p>npm run dev</p>
              <p className="text-slate-400 mt-2"># 3. Open in browser: http://localhost:3000</p>
            </div>
          </div>

          {/* Section 3: Deploy to Vercel, Netlify or Cloud */}
          <div className="space-y-2">
            <h3 className="font-bold flex items-center gap-1.5 text-sm">
              <Globe className="w-4 h-4 text-purple-500" />
              <span>{isUrdu ? 'مفت ویب ہوسٹنگ پر ڈپلائے کرنا (Vercel / Netlify / GitHub)' : 'Deploy to Vercel, Netlify or GitHub Pages'}</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              {isUrdu
                ? 'چونکہ یہ ایپ مکمل طور پر کلائنٹ سائیڈ اور آف لائن فرسٹ (IndexedDB) پر مبنی ہے، اس لئے کسی مہنگے بیک اینڈ یا سرور ڈیٹا بیس کی ضرورت نہیں۔'
                : 'Since My Finance PK is 100% offline-first and uses browser IndexedDB, no server or paid database is required!'}
            </p>
            <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-xs overflow-x-auto">
              <p className="text-slate-400"># Build production static bundle</p>
              <p>npm run build</p>
              <p className="text-slate-400 mt-1"># Upload dist folder to Vercel, Netlify, or Cloud Run</p>
            </div>
          </div>

          {/* Section 4: Mobile PWA Install */}
          <div className="space-y-2">
            <h3 className="font-bold flex items-center gap-1.5 text-sm">
              <Smartphone className="w-4 h-4 text-emerald-500" />
              <span>{isUrdu ? 'اینڈرائیڈ اور آئی فون پر بطور اصلی ایپ انسٹال کرنا' : 'Install as Native App on Android / iPhone'}</span>
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
              <li>
                <strong>Android (Chrome):</strong>{' '}
                {isUrdu
                  ? 'اوپر والے "Install App" بٹن پر کلک کریں یا کروم کے مینو میں "Add to Home screen" پر کلک کریں۔'
                  : 'Click the "Install App" button in the header, or Chrome menu -> "Add to Home Screen".'}
              </li>
              <li>
                <strong>iPhone (Safari):</strong>{' '}
                {isUrdu
                  ? 'سفاری میں Share بٹن دبائیں اور "Add to Home Screen" منتخب کریں۔'
                  : 'Tap Safari Share icon -> "Add to Home Screen".'}
              </li>
            </ul>
          </div>

          {/* Section 5: Data Privacy & Security */}
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 dark:text-slate-300">
              <strong>{isUrdu ? 'ڈیٹا کی رازداری:' : 'Privacy First:'}</strong>{' '}
              {isUrdu
                ? 'آپ کا مالیاتی ڈیٹا کبھی کسی بیرونی سرور پر نہیں جاتا۔ یہ مکمل طور پر آپ کے فون یا کمپیوٹر کی IndexedDB اسٹوریج میں رہتا ہے۔ سیٹنگز میں جا کر کسی بھی وقت بیک اپ JSON ڈاؤن لوڈ کر سکتے ہیں۔'
                : 'Your financial data is stored 100% locally on your device in IndexedDB. No external servers or surveillance. You can export a JSON backup at any time from Settings.'}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
