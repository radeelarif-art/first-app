import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, Users, Wallet, Calendar } from 'lucide-react';
import { Account, Category, Transaction, AppSettings } from '../../types/finance';
import { translations, Language } from '../../locales/translations';
import { formatPKR } from '../../utils/formatters';

interface Props {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  settings: AppSettings;
}

export const ReportsView: React.FC<Props> = ({
  transactions,
  categories,
  accounts,
  settings,
}) => {
  const t = translations[settings.language];
  const isUrdu = settings.language === 'ur';

  const [period, setPeriod] = useState<'thisMonth' | 'last3Months' | 'thisYear'>('thisMonth');

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentYearStr = `${now.getFullYear()}`;

  // Filtered transactions for report
  const filteredTxs = useMemo(() => {
    return transactions.filter((tx) => {
      if (!tx.date) return false;
      if (period === 'thisMonth') {
        return tx.date.startsWith(currentMonthStr);
      }
      if (period === 'thisYear') {
        return tx.date.startsWith(currentYearStr);
      }
      if (period === 'last3Months') {
        const txDate = new Date(tx.date);
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        return txDate >= threeMonthsAgo;
      }
      return true;
    });
  }, [transactions, period, currentMonthStr, currentYearStr]);

  // Total income & expense
  const totalIncome = filteredTxs
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = filteredTxs
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Category Expense Breakdown
  const catExpenseMap: Record<string, number> = {};
  filteredTxs
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      catExpenseMap[tx.categoryId] = (catExpenseMap[tx.categoryId] || 0) + tx.amount;
    });

  const catExpenseData = Object.entries(catExpenseMap)
    .map(([catId, amount]) => {
      const cat = categories.find((c) => c.id === catId);
      return {
        name: isUrdu ? cat?.nameUrdu || cat?.name || 'متفرق' : cat?.name || 'Other',
        amount,
        color: cat?.color || '#94a3b8',
      };
    })
    .sort((a, b) => b.amount - a.amount);

  // Income Sources Breakdown
  const catIncomeMap: Record<string, number> = {};
  filteredTxs
    .filter((tx) => tx.type === 'income')
    .forEach((tx) => {
      catIncomeMap[tx.categoryId] = (catIncomeMap[tx.categoryId] || 0) + tx.amount;
    });

  const catIncomeData = Object.entries(catIncomeMap).map(([catId, amount]) => {
    const cat = categories.find((c) => c.id === catId);
    return {
      name: isUrdu ? cat?.nameUrdu || cat?.name || 'دیگر' : cat?.name || 'Other',
      amount,
      color: cat?.color || '#10b981',
    };
  });

  // Family Member Distribution
  const familyMap: Record<string, number> = {};
  filteredTxs
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      const member = tx.familyMember || 'household';
      familyMap[member] = (familyMap[member] || 0) + tx.amount;
    });

  const familyData = Object.entries(familyMap).map(([member, amount]) => {
    const labelKey = `tag${member.charAt(0).toUpperCase() + member.slice(1)}` as keyof typeof t;
    return {
      name: t[labelKey] || member,
      amount,
    };
  });

  // Account Distribution Data
  const accountData = accounts.map((acc) => ({
    name: isUrdu ? acc.nameUrdu : acc.name,
    balance: Math.max(0, acc.balance),
    color: acc.color,
  }));

  const COLORS = ['#10b981', '#0284c7', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#ea580c'];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {t.reportsTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isUrdu ? 'مالیاتی تجزیہ اور اخراجات کے تفصیلی گراف' : 'Visual spending patterns and cashflow analysis'}
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setPeriod('thisMonth')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
              period === 'thisMonth'
                ? 'bg-slate-900 dark:bg-slate-700 text-white'
                : 'text-slate-500'
            }`}
          >
            {t.thisMonth}
          </button>
          <button
            onClick={() => setPeriod('last3Months')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
              period === 'last3Months'
                ? 'bg-slate-900 dark:bg-slate-700 text-white'
                : 'text-slate-500'
            }`}
          >
            {isUrdu ? 'گزشتہ ۳ ماہ' : 'Last 3 Months'}
          </button>
          <button
            onClick={() => setPeriod('thisYear')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
              period === 'thisYear'
                ? 'bg-slate-900 dark:bg-slate-700 text-white'
                : 'text-slate-500'
            }`}
          >
            {isUrdu ? 'موجودہ سال' : 'This Year'}
          </button>
        </div>
      </div>

      {/* Aggregate Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-400 font-medium">{t.totalIncome}</div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {formatPKR(totalIncome, 'standard', settings.language)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-400 font-medium">{t.totalExpenses}</div>
          <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {formatPKR(totalExpense, 'standard', settings.language)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-400 font-medium">{t.netSavings}</div>
          <div
            className={`text-xl font-black mt-1 ${
              totalIncome - totalExpense >= 0
                ? 'text-sky-600 dark:text-sky-400'
                : 'text-amber-500'
            }`}
          >
            {formatPKR(totalIncome - totalExpense, 'standard', settings.language)}
          </div>
        </div>
      </div>

      {/* Two Column Charts: Categories and Income Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Category Expenses Bar Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-500" />
              <span>{t.expenseDistribution}</span>
            </h2>
            <span className="text-[11px] text-slate-400">
              {catExpenseData.length} {isUrdu ? 'مدات' : 'categories'}
            </span>
          </div>

          {catExpenseData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-xs text-slate-400">
              {isUrdu ? 'اس مدت میں کوئی خرچ درج نہیں ہے' : 'No expenses in this period'}
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={catExpenseData.slice(0, 6)} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <XAxis type="number" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `${val / 1000}k`} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={110} />
                  <Tooltip
                    formatter={(val: any) => [formatPKR(Number(val) || 0, 'standard', settings.language), '']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="amount" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Income Sources Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>{t.incomeSources}</span>
            </h2>
          </div>

          {catIncomeData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-xs text-slate-400">
              {isUrdu ? 'اس مدت میں کوئی آمدن درج نہیں ہے' : 'No income in this period'}
            </div>
          ) : (
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={catIncomeData}
                    dataKey="amount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {catIncomeData.map((entry, index) => (
                      <Cell key={`inc-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatPKR(Number(val) || 0, 'standard', settings.language), '']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Two Column: Family Member Spending & Account Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Family Member Expense Breakdown */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span>{t.familySpending}</span>
            </h2>
          </div>

          {familyData.length === 0 ? (
            <div className="h-44 flex items-center justify-center text-xs text-slate-400">
              {isUrdu ? 'کوئی ڈیٹا موجود نہیں' : 'No data available'}
            </div>
          ) : (
            <div className="space-y-3">
              {familyData.map((f, i) => {
                const percent = totalExpense > 0 ? Math.round((f.amount / totalExpense) * 100) : 0;
                return (
                  <div key={f.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">{f.name}</span>
                      <span className="text-slate-900 dark:text-white">
                        {formatPKR(f.amount, 'standard', settings.language)} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Account Balance Distribution */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-500" />
              <span>{t.accountsDistribution}</span>
            </h2>
          </div>

          <div className="space-y-3">
            {accountData.map((acc) => {
              const totalBalances = accounts.reduce((s, a) => s + Math.max(0, a.balance), 0);
              const percent = totalBalances > 0 ? Math.round((acc.balance / totalBalances) * 100) : 0;
              return (
                <div key={acc.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: acc.color }} />
                      <span className="text-slate-700 dark:text-slate-300">{acc.name}</span>
                    </div>
                    <span className="text-slate-900 dark:text-white">
                      {formatPKR(acc.balance, 'standard', settings.language)} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: acc.color || '#10b981',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
