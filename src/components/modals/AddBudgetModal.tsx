import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Budget, Category } from '../../types/finance';
import { translations, Language } from '../../locales/translations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budget: Budget) => Promise<void>;
  editBudget?: Budget | null;
  categories: Category[];
  language: Language;
}

export const AddBudgetModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  editBudget,
  categories,
  language,
}) => {
  const t = translations[language];
  const isUrdu = language === 'ur';

  const [categoryId, setCategoryId] = useState('');
  const [limitAmount, setLimitAmount] = useState('');
  const [alertThreshold, setAlertThreshold] = useState(80);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  useEffect(() => {
    if (isOpen) {
      if (editBudget) {
        setCategoryId(editBudget.categoryId);
        setLimitAmount(editBudget.limitAmount.toString());
        setAlertThreshold(editBudget.alertThreshold || 80);
      } else {
        setCategoryId(expenseCategories[0]?.id || '');
        setLimitAmount('');
        setAlertThreshold(80);
      }
    }
  }, [isOpen, editBudget, categories]);

  if (!isOpen) return null;

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(limitAmount);
    if (!categoryId || !amount || amount <= 0) return;

    setIsSubmitting(true);
    try {
      const budgetData: Budget = {
        id: editBudget ? editBudget.id : `bud-${Date.now()}`,
        categoryId,
        month: editBudget ? editBudget.month : currentMonth,
        limitAmount: amount,
        alertThreshold: alertThreshold || 80,
      };
      await onSave(budgetData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 animate-scale-up">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {editBudget ? t.edit : t.addBudget}
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
              {t.category} *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            >
              {expenseCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {isUrdu ? cat.nameUrdu : cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t.budgetLimit} (PKR) *
            </label>
            <input
              type="number"
              step="any"
              required
              placeholder="e.g. 25000"
              value={limitAmount}
              onChange={(e) => setLimitAmount(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              <span>{isUrdu ? 'انتباہ کی حد (فیصد)' : 'Warning Alert Threshold'}</span>
              <span className="font-bold text-amber-500">{alertThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500"
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
