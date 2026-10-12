import React, { useState } from 'react';
import { Plus, Target, CheckCircle2, Calendar, Edit2, Trash2, ArrowUpRight, ArrowDownRight, MoonStar, ShieldCheck, PiggyBank } from 'lucide-react';
import { SavingsGoal, Account, AppSettings } from '../../types/finance';
import { translations, Language } from '../../locales/translations';
import { formatPKR, formatDate } from '../../utils/formatters';

interface Props {
  goals: SavingsGoal[];
  accounts: Account[];
  settings: AppSettings;
  onOpenAddGoal: () => void;
  onEditGoal: (goal: SavingsGoal) => void;
  onDeleteGoal: (goalId: string) => Promise<void>;
  onOpenDeposit: (goal: SavingsGoal) => void;
}

export const SavingsView: React.FC<Props> = ({
  goals,
  accounts,
  settings,
  onOpenAddGoal,
  onEditGoal,
  onDeleteGoal,
  onOpenDeposit,
}) => {
  const t = translations[settings.language];
  const isUrdu = settings.language === 'ur';

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallPercent = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const getGoalIcon = (iconName: string) => {
    switch (iconName) {
      case 'MoonStar':
        return <MoonStar className="w-5 h-5 text-emerald-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-sky-500" />;
      default:
        return <PiggyBank className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {t.savingsGoals}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isUrdu ? 'عمرہ، ایمرجنسی فنڈ، کمیٹی اور خاندانی بچت کے اہداف' : 'Track Umrah, Emergency Funds, Kameti, and long-term targets'}
          </p>
        </div>

        <button
          onClick={onOpenAddGoal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addNewGoal}</span>
        </button>
      </div>

      {/* Overview Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-800 to-emerald-950 text-white border border-teal-700/60 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs text-teal-200/90 font-medium uppercase tracking-wider">
              {isUrdu ? 'کل بچت اہداف کی پیشرفت' : 'Total Goals Progress'}
            </div>
            <div className="text-2xl sm:text-3xl font-black mt-1">
              {formatPKR(totalSaved, settings.numberFormat, settings.language, settings.currencySymbol)}{' '}
              <span className="text-base font-medium text-teal-300">
                / {formatPKR(totalTarget, settings.numberFormat, settings.language, settings.currencySymbol)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold px-3 py-1 bg-white/10 rounded-full backdrop-blur-xs">
              {overallPercent}% {isUrdu ? 'مکمل' : 'Achieved'}
            </span>
          </div>
        </div>

        <div className="w-full h-3 bg-teal-900/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, overallPercent)}%` }}
          />
        </div>
      </div>

      {/* Goals Cards */}
      {goals.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          {isUrdu
            ? 'کوئی ہدف موجود نہیں ہے۔ نیا بچت ہدف بنانے کے لئے بٹن پر کلک کریں۔'
            : 'No savings goals created yet. Click "+ Create Savings Goal" to begin.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const percent = Math.min(
              100,
              goal.targetAmount > 0
                ? Math.round((goal.currentAmount / goal.targetAmount) * 100)
                : 0
            );
            const isFinished = goal.currentAmount >= goal.targetAmount;

            // Days remaining
            const targetD = new Date(goal.deadline);
            const diffTime = targetD.getTime() - new Date().getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return (
              <div
                key={goal.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition hover:shadow-md relative overflow-hidden group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        {getGoalIcon(goal.icon)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {isUrdu ? goal.titleUrdu : goal.title}
                        </h3>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(goal.deadline, settings.language)}</span>
                          {diffDays > 0 ? (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              ({diffDays} {t.daysRemaining})
                            </span>
                          ) : (
                            <span className="text-rose-500">(Due)</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
                      <button
                        onClick={() => onEditGoal(goal)}
                        className="p-1.5 text-slate-400 hover:text-emerald-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(goal.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {goal.notes && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                      {goal.notes}
                    </p>
                  )}

                  {/* Progress bar */}
                  <div className="space-y-1.5 mt-3">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">
                        {formatPKR(goal.currentAmount, 'standard', settings.language)}
                      </span>
                      <span className="text-slate-500">
                        {formatPKR(goal.targetAmount, 'standard', settings.language)}
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFinished ? 'bg-emerald-500' : 'bg-teal-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                      <span>{percent}% {isUrdu ? 'مکمل' : 'Saved'}</span>
                      {isFinished && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {t.goalCompleted}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {t.remainingBudget}:{' '}
                    <strong className="text-slate-900 dark:text-white">
                      {formatPKR(
                        Math.max(0, goal.targetAmount - goal.currentAmount),
                        'standard',
                        settings.language
                      )}
                    </strong>
                  </span>

                  <button
                    onClick={() => onOpenDeposit(goal)}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition active:scale-95 flex items-center gap-1"
                  >
                    <span>{isUrdu ? 'رقم جمع / نکالیں' : 'Deposit / Withdraw'}</span>
                  </button>
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
                ? 'کیا آپ واقعی اس بچت ہدف کو حذف کرنا چاہتے ہیں؟'
                : 'Are you sure you want to delete this savings goal?'}
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
                  await onDeleteGoal(deleteId);
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
