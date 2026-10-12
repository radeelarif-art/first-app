import React, { useState, useEffect } from 'react';
import { X, Target, MoonStar, ShieldCheck, PiggyBank, Car, Heart } from 'lucide-react';
import { SavingsGoal } from '../../types/finance';
import { translations, Language } from '../../locales/translations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: SavingsGoal) => Promise<void>;
  editGoal?: SavingsGoal | null;
  language: Language;
}

const GOAL_ICONS = [
  { name: 'MoonStar', label: 'Umrah / Hajj', icon: MoonStar },
  { name: 'ShieldCheck', label: 'Emergency Fund', icon: ShieldCheck },
  { name: 'PiggyBank', label: 'Kameti / Savings', icon: PiggyBank },
  { name: 'Car', label: 'Car / Bike', icon: Car },
  { name: 'Heart', label: 'Wedding / Eid', icon: Heart },
];

export const AddSavingsGoalModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  editGoal,
  language,
}) => {
  const t = translations[language];
  const isUrdu = language === 'ur';

  const [title, setTitle] = useState('');
  const [titleUrdu, setTitleUrdu] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [deadline, setDeadline] = useState('');
  const [icon, setIcon] = useState('MoonStar');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editGoal) {
        setTitle(editGoal.title);
        setTitleUrdu(editGoal.titleUrdu || editGoal.title);
        setTargetAmount(editGoal.targetAmount.toString());
        setCurrentAmount(editGoal.currentAmount.toString());
        setDeadline(editGoal.deadline);
        setIcon(editGoal.icon || 'MoonStar');
        setNotes(editGoal.notes || '');
      } else {
        setTitle('');
        setTitleUrdu('');
        setTargetAmount('');
        setCurrentAmount('0');
        const nextYear = new Date();
        nextYear.setMonth(nextYear.getMonth() + 6);
        setDeadline(nextYear.toISOString().split('T')[0]);
        setIcon('MoonStar');
        setNotes('');
      }
    }
  }, [isOpen, editGoal]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    if (!title.trim() || !target || target <= 0) return;

    setIsSubmitting(true);
    try {
      const goalData: SavingsGoal = {
        id: editGoal ? editGoal.id : `goal-${Date.now()}`,
        title: title.trim(),
        titleUrdu: titleUrdu.trim() || title.trim(),
        targetAmount: target,
        currentAmount: parseFloat(currentAmount) || 0,
        deadline,
        category: 'General',
        icon,
        color: '#059669',
        notes: notes.trim(),
        isCompleted: (parseFloat(currentAmount) || 0) >= target,
        createdAt: editGoal ? editGoal.createdAt : new Date().toISOString(),
      };
      await onSave(goalData);
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
            <Target className="w-5 h-5 text-emerald-500" />
            <span>{editGoal ? t.edit : t.addNewGoal}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.goalTitle} (English) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Umrah Fund 2027 / Kameti"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {isUrdu ? 'ہدف کا اردو نام' : 'Goal Name (Urdu)'}
            </label>
            <input
              type="text"
              placeholder="مثلاً: عمرہ فنڈ ۲۰۲۷ / کمیٹی بچت"
              value={titleUrdu}
              onChange={(e) => setTitleUrdu(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.targetAmount} (PKR) *
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="500000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.currentSaved} (PKR)
              </label>
              <input
                type="number"
                step="any"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.targetDate}
            </label>
            <input
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Goal Icon Choice */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              {isUrdu ? 'نشان (آئیکون) منتخب کریں' : 'Goal Category Icon'}
            </label>
            <div className="flex gap-2">
              {GOAL_ICONS.map((item) => {
                const IconCmp = item.icon;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setIcon(item.name)}
                    className={`p-2.5 rounded-xl border flex items-center justify-center transition ${
                      icon === item.name
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-400'
                    }`}
                    title={item.label}
                  >
                    <IconCmp className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
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
