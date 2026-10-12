import React, { useState, useEffect } from 'react';
import { X, Handshake, Phone, Calendar } from 'lucide-react';
import { UdharRecord, UdharType } from '../../types/finance';
import { translations, Language } from '../../locales/translations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: UdharRecord) => Promise<void>;
  editRecord?: UdharRecord | null;
  defaultType?: UdharType;
  language: Language;
}

export const AddUdharModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  editRecord,
  defaultType = 'receivable',
  language,
}) => {
  const t = translations[language];
  const isUrdu = language === 'ur';

  const [type, setType] = useState<UdharType>(defaultType);
  const [personName, setPersonName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editRecord) {
        setType(editRecord.type);
        setPersonName(editRecord.personName);
        setPhoneNumber(editRecord.phoneNumber || '');
        setInitialAmount(editRecord.initialAmount.toString());
        setDueDate(editRecord.dueDate || '');
        setNote(editRecord.note || '');
      } else {
        setType(defaultType);
        setPersonName('');
        setPhoneNumber('');
        setInitialAmount('');
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        setDueDate(nextMonth.toISOString().split('T')[0]);
        setNote('');
      }
    }
  }, [isOpen, editRecord, defaultType]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(initialAmount);
    if (!personName.trim() || !amount || amount <= 0) return;

    setIsSubmitting(true);
    try {
      const record: UdharRecord = {
        id: editRecord ? editRecord.id : `udh-${Date.now()}`,
        type,
        personName: personName.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        initialAmount: amount,
        paidAmount: editRecord ? editRecord.paidAmount : 0,
        dueDate: dueDate || undefined,
        note: note.trim(),
        status: editRecord ? editRecord.status : 'pending',
        payments: editRecord ? editRecord.payments : [],
        createdAt: editRecord ? editRecord.createdAt : new Date().toISOString(),
      };

      await onSave(record);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 animate-scale-up">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Handshake className="w-5 h-5 text-emerald-500" />
            <span>{editRecord ? t.edit : t.addKhataEntry}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Type Selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setType('receivable')}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                type === 'receivable'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {isUrdu ? 'مجھے لینے ہیں (وصول طلب)' : 'To Receive (Receivable)'}
            </button>
            <button
              type="button"
              onClick={() => setType('payable')}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                type === 'payable'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {isUrdu ? 'مجھے دینے ہیں (واجب الادا)' : 'To Pay (Payable)'}
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.personName} *
            </label>
            <input
              type="text"
              required
              placeholder={isUrdu ? 'مثلاً: طارق محمود (دوست / دکاندار)' : 'e.g. Tariq Mehmood, Asif Bhai'}
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.amount} (PKR) *
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="25000"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>{t.phoneNumber}</span>
              </label>
              <input
                type="text"
                placeholder="0300-1234567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>{t.dueDate}</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.note} ({t.optional})
            </label>
            <input
              type="text"
              placeholder={isUrdu ? 'مثلاً: گاڑی مرمت کے لیے دیئے، اگلی تنخواہ پر واپسی کا وعدہ' : 'Details or reason'}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition"
            >
              {isSubmitting ? 'Saving...' : t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
