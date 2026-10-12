import React, { useState } from 'react';
import { Plus, Edit2, Trash2, AlertTriangle, CheckCircle, PieChart } from 'lucide-react';
import { Budget, Category, Transaction, AppSettings } from '../../types/finance';
import { translations, Language } from '../../locales/translations';
import { formatPKR } from '../../utils/formatters';
import { getCategoryIcon } from '../../utils/categoryIcons';

interface Props {
  budgets: Budget[];
  categories: Category[];
  transactions: Transaction[];
  settings: AppSettings;
  onOpenAddBudget: () => void;
  onEditBudget: (budget: Budget) => void;
  onDeleteBudget: (budgetId: string) => Promise<void>;
}

export const BudgetsView: React.FC<Props> = ({
  budgets,
  categories,
  transactions,
  settings,
  onOpenAddBudget,
  onEditBudget,
  onDeleteBudget,
}) => {
  const t = translations[settings.language];
  const isUrdu = settings.language === 'ur';

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Calculate spent amounts for the current month
  const categorySpentMap: Record<string, number> = {};
  transactions
    .filter((tx) => tx.date && tx.date.startsWith(currentMonthStr) && tx.type === 'expense')
    .forEach((tx) => {
      categorySpentMap[tx.categoryId] = (categorySpentMap[tx.categoryId] || 0) + tx.amount;
    });

  const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.limitAmount, 0);
  const totalBudgetSpent = budgets.reduce(
    (sum, b) => sum + (categorySpentMap[b.categoryId] || 0),
    0
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {t.monthlyBudgets}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isUrdu ? 'اس ماہ کے تمام مقررہ بجٹس اور ان کا استعمال' : 'Category limits for the current month'}
          </p>
        </div>

        <button
          onClick={onOpenAddBudget}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addBudget}</span>
        </button>
      </div>

      {/* Aggregate Budget Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs text-slate-500">{t.monthlyBudgets} (Total)</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {formatPKR(totalBudgetSpent, 'standard', settings.language)} /{' '}
              <span className="text-slate-400 font-medium text-base">
                {formatPKR(totalBudgetLimit, 'standard', settings.language)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                totalBudgetSpent > totalBudgetLimit
                  ? 'bg-rose-500/10 text-rose-600'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {totalBudgetLimit > 0
                ? Math.round((totalBudgetSpent / totalBudgetLimit) * 100)
                : 0}
              % {t.budgetUsed}
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              totalBudgetSpent > totalBudgetLimit
                ? 'bg-rose-500'
                : totalBudgetSpent / totalBudgetLimit > 0.8
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{
              width: `${Math.min(
                100,
                totalBudgetLimit > 0 ? (totalBudgetSpent / totalBudgetLimit) * 100 : 0
              )}%`,
            }}
          />
        </div>
      </div>

      {/* Budgets Grid */}
      {budgets.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          {isUrdu
            ? 'کوئی ماہانہ بجٹ مقرر نہیں ہے۔ بجٹ سیٹ کرنے کے لئے بٹن پر کلک کریں۔'
            : 'No monthly budgets set yet. Click "+ Set Budget" to start planning.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((b) => {
            const cat = categories.find((c) => c.id === b.categoryId);
            const spent = categorySpentMap[b.categoryId] || 0;
            const remaining = b.limitAmount - spent;
            const percent = Math.round((spent / b.limitAmount) * 100);
            const isOver = spent > b.limitAmount;
            const isWarning = !isOver && percent >= (b.alertThreshold || 80);

            return (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: `${cat?.color || '#10b981'}20`,
                          color: cat?.color || '#10b981',
                        }}
                      >
                        {getCategoryIcon(cat?.icon || 'HelpCircle', 'w-5 h-5')}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {isUrdu ? cat?.nameUrdu : cat?.name}
                        </h3>
                        <div className="text-[11px] text-slate-400">
                          {t.budgetLimit}: {formatPKR(b.limitAmount, 'standard', settings.language)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditBudget(b)}
                        className="p-1.5 text-slate-400 hover:text-emerald-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(b.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5 mt-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">
                        {t.spentSoFar}:{' '}
                        <strong className="text-slate-900 dark:text-white">
                          {formatPKR(spent, 'standard', settings.language)}
                        </strong>
                      </span>
                      <span
                        className={`font-bold ${
                          isOver
                            ? 'text-rose-500'
                            : isWarning
                            ? 'text-amber-500'
                            : 'text-emerald-500'
                        }`}
                      >
                        {percent}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isOver
                            ? 'bg-rose-500'
                            : isWarning
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{t.remainingBudget}:</span>
                  <span
                    className={`font-black ${
                      remaining >= 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-500'
                    }`}
                  >
                    {remaining >= 0
                      ? formatPKR(remaining, 'standard', settings.language)
                      : `${formatPKR(Math.abs(remaining), 'standard', settings.language)} (${t.overBudget})`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl text-slate-900 dark:text-white">
            <h3 className="text-sm font-bold text-rose-600 mb-2">{t.delete}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
              {isUrdu
                ? 'کیا آپ واقعی اس بجٹ کو ختم کرنا چاہتے ہیں؟'
                : 'Are you sure you want to remove this budget?'}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                {t.cancel}
              </button>
              <button
                onClick={async () => {
                  await onDeleteBudget(deleteId);
                  setDeleteId(null);
                }}
                className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-xs"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
