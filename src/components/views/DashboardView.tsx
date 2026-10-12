import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  ArrowDownRight,
  ArrowUpRight,
  ArrowRightLeft,
  Calendar,
  AlertTriangle,
  Zap,
  Handshake,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
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
} from 'recharts';
import {
  Account,
  Category,
  Transaction,
  Budget,
  BillReminder,
  UdharRecord,
  AppSettings,
} from '../../types/finance';
import { translations, Language } from '../../locales/translations';
import { formatPKR, formatDate } from '../../utils/formatters';
import { getCategoryIcon } from '../../utils/categoryIcons';

interface Props {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  bills: BillReminder[];
  udhars: UdharRecord[];
  settings: AppSettings;
  onOpenAddTx: (type?: 'income' | 'expense' | 'transfer') => void;
  onOpenPayBill: (bill: BillReminder) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<Props> = ({
  accounts,
  categories,
  transactions,
  budgets,
  bills,
  udhars,
  settings,
  onOpenAddTx,
  onOpenPayBill,
  onNavigateTab,
}) => {
  const t = translations[settings.language];
  const isUrdu = settings.language === 'ur';

  // Total Net Worth (sum of all account balances)
  const totalNetWorth = accounts.reduce((acc, a) => acc + (a.balance || 0), 0);

  // Current month's income and expense
  const now = new Date();
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const currentMonthTransactions = transactions.filter(
    (tx) => tx.date && tx.date.startsWith(currentMonthPrefix)
  );

  const monthIncome = currentMonthTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const monthExpense = currentMonthTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const monthSavings = monthIncome - monthExpense;
  const savingsRate = monthIncome > 0 ? Math.round((monthSavings / monthIncome) * 100) : 0;

  // Recharts: Monthly Trend Data (last 6 months)
  const monthlyData: Array<{ month: string; monthUrdu: string; income: number; expense: number }> = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mPrefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const mName = d.toLocaleString('en-US', { month: 'short' });
    const urduMonths = ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'];
    const mUrdu = urduMonths[d.getMonth()];

    const inc = transactions
      .filter((tx) => tx.date?.startsWith(mPrefix) && tx.type === 'income')
      .reduce((s, tx) => s + tx.amount, 0);
    const exp = transactions
      .filter((tx) => tx.date?.startsWith(mPrefix) && tx.type === 'expense')
      .reduce((s, tx) => s + tx.amount, 0);

    monthlyData.push({
      month: mName,
      monthUrdu: mUrdu,
      income: inc,
      expense: exp,
    });
  }

  // Recharts: Category Breakdown (Donut chart)
  const categoryMap: Record<string, number> = {};
  currentMonthTransactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      categoryMap[tx.categoryId] = (categoryMap[tx.categoryId] || 0) + tx.amount;
    });

  const pieData = Object.entries(categoryMap).map(([catId, amount]) => {
    const cat = categories.find((c) => c.id === catId);
    return {
      name: isUrdu ? cat?.nameUrdu || cat?.name || 'متفرق' : cat?.name || 'Other',
      value: amount,
      color: cat?.color || '#94a3b8',
    };
  });

  // Recent 5 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => (b.date + (b.time || '')).localeCompare(a.date + (a.time || '')))
    .slice(0, 5);

  // Unpaid bills
  const unpaidBills = bills.filter((b) => b.status === 'unpaid');

  // Pending Udhars
  const totalReceivable = udhars
    .filter((u) => u.type === 'receivable' && u.status !== 'settled')
    .reduce((sum, u) => sum + Math.max(0, u.initialAmount - u.paidAmount), 0);
  const totalPayable = udhars
    .filter((u) => u.type === 'payable' && u.status !== 'settled')
    .reduce((sum, u) => sum + Math.max(0, u.initialAmount - u.paidAmount), 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Welcome / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.navDashboard}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.appTagline}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenAddTx('expense')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition active:scale-95"
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>{t.addExpense}</span>
          </button>
          <button
            onClick={() => onOpenAddTx('income')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition active:scale-95"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>{t.addIncome}</span>
          </button>
          <button
            onClick={() => onOpenAddTx('transfer')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition active:scale-95"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>{t.transfer}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Worth */}
        <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-lg border border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
              {t.netWorth}
            </span>
            <span className="p-2 bg-white/10 rounded-xl backdrop-blur-xs">
              <Wallet className="w-5 h-5 text-emerald-200" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black tracking-tight">
            {formatPKR(totalNetWorth, settings.numberFormat, settings.language, settings.currencySymbol)}
          </div>
          <div className="mt-2 text-[11px] text-emerald-200/90 flex items-center gap-1">
            <span>{accounts.length} {t.totalAccounts}</span>
          </div>
        </div>

        {/* This Month Income */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.totalIncome}
            </span>
            <span className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatPKR(monthIncome, settings.numberFormat, settings.language, settings.currencySymbol)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {isUrdu ? 'اس ماہ کا کل حصول' : 'Earned this month'}
          </div>
        </div>

        {/* This Month Expenses */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.totalExpenses}
            </span>
            <span className="p-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl">
              <TrendingDown className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-black text-rose-600 dark:text-rose-400">
            {formatPKR(monthExpense, settings.numberFormat, settings.language, settings.currencySymbol)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {isUrdu ? 'اس ماہ کا کل خرچ' : 'Spent this month'}
          </div>
        </div>

        {/* Net Savings & Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.netSavings}
            </span>
            <span className="p-2 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl">
              <PiggyBank className="w-5 h-5" />
            </span>
          </div>
          <div
            className={`mt-3 text-2xl font-black ${
              monthSavings >= 0 ? 'text-sky-600 dark:text-sky-400' : 'text-amber-500'
            }`}
          >
            {formatPKR(monthSavings, settings.numberFormat, settings.language, settings.currencySymbol)}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{t.savingsRate}:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {savingsRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Recharts Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Monthly Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>{t.incomeVsExpense}</span>
            </h2>
            <span className="text-[11px] text-slate-400">
              {isUrdu ? 'گزشتہ ۶ ماہ کا موازنہ' : 'Last 6 Months'}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey={isUrdu ? 'monthUrdu' : 'month'}
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(val) => (val >= 1000 ? `${val / 1000}k` : val)}
                />
                <Tooltip
                  formatter={(value: any) => [
                    formatPKR(Number(value) || 0, 'standard', settings.language),
                    '',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="income" name={isUrdu ? 'آمدن' : 'Income'} fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name={isUrdu ? 'خرچ' : 'Expense'} fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Expense Donut Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.categoryBreakdown}
            </h2>
            <span className="text-[11px] text-slate-400">
              {isUrdu ? 'اس ماہ' : 'This Month'}
            </span>
          </div>

          {pieData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400 py-10">
              {isUrdu ? 'اس ماہ کوئی خرچ درج نہیں ہے' : 'No expenses recorded this month'}
            </div>
          ) : (
            <>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={3}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [
                        formatPKR(Number(value) || 0, 'standard', settings.language),
                        '',
                      ]}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Top 3 categories legend */}
              <div className="space-y-1.5 mt-2">
                {pieData.slice(0, 3).map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="truncate text-slate-700 dark:text-slate-300">{item.name}</span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white shrink-0">
                      {formatPKR(item.value, 'standard', settings.language)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Alerts Row: Bills & Khata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Urgent Utility Bills */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{t.urgentBills}</span>
              {unpaidBills.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-500 font-bold">
                  {unpaidBills.length}
                </span>
              )}
            </h3>
            <button
              onClick={() => onNavigateTab('bills')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              <span>{t.viewAll}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3 space-y-2.5">
            {unpaidBills.length === 0 ? (
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 py-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isUrdu ? 'تمام بلز ادا شدہ ہیں! زبردست' : 'All utility bills are settled!'}</span>
              </div>
            ) : (
              unpaidBills.slice(0, 3).map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {isUrdu ? bill.billNameUrdu : bill.billName}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {t.dueDate}: {formatDate(bill.dueDate, settings.language)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {formatPKR(bill.amount, 'standard', settings.language)}
                    </span>
                    <button
                      onClick={() => onOpenPayBill(bill)}
                      className="px-2.5 py-1 text-[11px] font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition"
                    >
                      {t.markAsPaid}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Khata / Udhar Summary */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Handshake className="w-4 h-4 text-emerald-500" />
              <span>{t.pendingUdhar}</span>
            </h3>
            <button
              onClick={() => onNavigateTab('udhar')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              <span>{t.viewAll}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                {t.totalReceivable}
              </div>
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {formatPKR(totalReceivable, settings.numberFormat, settings.language)}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {isUrdu ? 'لوگوں سے وصول کرنی ہے' : 'To collect from others'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                {t.totalPayable}
              </div>
              <div className="text-base font-black text-amber-600 dark:text-amber-400 mt-1">
                {formatPKR(totalPayable, settings.numberFormat, settings.language)}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {isUrdu ? 'لوگوں کو ادا کرنی ہے' : 'To return/pay to others'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span>{t.recentTransactions}</span>
          </h2>
          <button
            onClick={() => onNavigateTab('transactions')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
          >
            <span>{t.viewAll}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800/80">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              {t.noTransactionsYet}
            </div>
          ) : (
            recentTransactions.map((tx) => {
              const cat = categories.find((c) => c.id === tx.categoryId);
              const acc = accounts.find((a) => a.id === tx.accountId);
              const targetAcc = accounts.find((a) => a.id === tx.targetAccountId);

              return (
                <div key={tx.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${cat?.color || '#10b981'}20`,
                        color: cat?.color || '#10b981',
                      }}
                    >
                      {getCategoryIcon(cat?.icon || 'HelpCircle', 'w-4 h-4')}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {tx.note}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                        <span>{isUrdu ? cat?.nameUrdu : cat?.name}</span>
                        <span>•</span>
                        <span>{isUrdu ? acc?.nameUrdu : acc?.name}</span>
                        {tx.type === 'transfer' && targetAcc && (
                          <span>→ {isUrdu ? targetAcc.nameUrdu : targetAcc.name}</span>
                        )}
                        <span>•</span>
                        <span>{formatDate(tx.date, settings.language)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`text-xs font-black ${
                        tx.type === 'income'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : tx.type === 'expense'
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-sky-600 dark:text-sky-400'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}
                      {formatPKR(tx.amount, 'standard', settings.language)}
                    </div>
                    {tx.familyMember && (
                      <span className="inline-block mt-0.5 text-[9px] px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {t[`tag${tx.familyMember.charAt(0).toUpperCase() + tx.familyMember.slice(1)}` as keyof typeof t] || tx.familyMember}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
