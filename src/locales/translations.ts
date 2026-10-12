export type Language = 'en' | 'ur';

export interface Translations {
  // Brand
  appName: string;
  appTagline: string;
  offlineReady: string;

  // Nav
  navDashboard: string;
  navTransactions: string;
  navAccounts: string;
  navBudgets: string;
  navSavings: string;
  navUdhar: string;
  navBills: string;
  navReports: string;
  navSettings: string;

  // Common Actions
  addTransaction: string;
  addIncome: string;
  addExpense: string;
  transfer: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  confirm: string;
  filter: string;
  search: string;
  exportCsv: string;
  exportJson: string;
  importJson: string;
  resetData: string;
  installApp: string;
  installed: string;
  close: string;
  all: string;
  actions: string;
  details: string;

  // Dashboard Cards
  netWorth: string;
  totalIncome: string;
  totalExpenses: string;
  netSavings: string;
  savingsRate: string;
  monthlyOverview: string;
  recentTransactions: string;
  viewAll: string;
  categoryBreakdown: string;
  budgetHealth: string;
  urgentBills: string;
  pendingUdhar: string;
  noTransactionsYet: string;
  incomeVsExpense: string;

  // Transactions View
  searchPlaceholder: string;
  filterByType: string;
  filterByCategory: string;
  filterByAccount: string;
  filterByFamily: string;
  filterByDate: string;
  thisMonth: string;
  lastMonth: string;
  allTime: string;
  customDate: string;
  amount: string;
  date: string;
  account: string;
  fromAccount: string;
  toAccount: string;
  category: string;
  note: string;
  familyMember: string;
  optional: string;
  type: string;

  // Accounts
  totalAccounts: string;
  addNewAccount: string;
  accountName: string;
  accountType: string;
  bankName: string;
  accountNumber: string;
  currentBalance: string;
  transferFunds: string;
  cashInHand: string;
  bankAccount: string;
  mobileWallet: string;
  savingsAccount: string;

  // Budgets
  monthlyBudgets: string;
  addBudget: string;
  budgetLimit: string;
  spentSoFar: string;
  remainingBudget: string;
  budgetUsed: string;
  overBudget: string;
  safeBudget: string;
  warningBudget: string;

  // Savings Goals
  savingsGoals: string;
  addNewGoal: string;
  goalTitle: string;
  targetAmount: string;
  currentSaved: string;
  targetDate: string;
  depositFunds: string;
  withdrawFunds: string;
  goalCompleted: string;
  daysRemaining: string;

  // Udhar / Khata
  udharTitle: string;
  udharSubtitle: string;
  receivableTab: string; // Mujhe Lene Hain
  payableTab: string; // Mujhe Dene Hain
  totalReceivable: string;
  totalPayable: string;
  addKhataEntry: string;
  personName: string;
  phoneNumber: string;
  recordPayment: string;
  markSettled: string;
  remainingAmount: string;
  dueDate: string;
  statusPending: string;
  statusPartiallyPaid: string;
  statusSettled: string;

  // Bills
  billRemindersTitle: string;
  addBill: string;
  billName: string;
  provider: string;
  consumerNumber: string;
  markAsPaid: string;
  statusPaid: string;
  statusUnpaid: string;
  dueInDays: string;
  overdue: string;

  // Reports
  reportsTitle: string;
  cashFlowAnalysis: string;
  expenseDistribution: string;
  incomeSources: string;
  familySpending: string;
  accountsDistribution: string;

  // Settings
  settingsTitle: string;
  languageSelect: string;
  themeSelect: string;
  lightTheme: string;
  darkTheme: string;
  currencyFormat: string;
  standardFormat: string;
  lakhFormat: string;
  backupAndRestore: string;
  backupDescription: string;
  restoreDescription: string;
  restoreSuccess: string;
  resetConfirm: string;
  guideAndDeploy: string;
  guideDescription: string;

  // Family Tags
  tagSelf: string;
  tagSpouse: string;
  tagParents: string;
  tagKids: string;
  tagHousehold: string;
  tagOther: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'My Finance PK',
    appTagline: 'Smart, offline-first personal finance tailored for Pakistan',
    offlineReady: 'Offline Ready (IndexedDB)',

    navDashboard: 'Dashboard',
    navTransactions: 'Transactions',
    navAccounts: 'Accounts & Wallets',
    navBudgets: 'Budgets',
    navSavings: 'Savings Goals',
    navUdhar: 'Udhar / Khata',
    navBills: 'Bill Reminders',
    navReports: 'Reports & Analytics',
    navSettings: 'Settings & Backup',

    addTransaction: 'Add Transaction',
    addIncome: 'Add Income',
    addExpense: 'Add Expense',
    transfer: 'Transfer',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    confirm: 'Confirm',
    filter: 'Filter',
    search: 'Search',
    exportCsv: 'Export CSV',
    exportJson: 'Download Backup (JSON)',
    importJson: 'Restore Backup (JSON)',
    resetData: 'Reset Demo Data',
    installApp: 'Install App (PWA)',
    installed: 'App Installed',
    close: 'Close',
    all: 'All',
    actions: 'Actions',
    details: 'Details',

    netWorth: 'Total Net Worth',
    totalIncome: 'This Month Income',
    totalExpenses: 'This Month Expenses',
    netSavings: 'Net Savings',
    savingsRate: 'Savings Rate',
    monthlyOverview: 'Monthly Cash Flow',
    recentTransactions: 'Recent Transactions',
    viewAll: 'View All',
    categoryBreakdown: 'Expense by Category',
    budgetHealth: 'Monthly Budget Health',
    urgentBills: 'Upcoming Utility Bills',
    pendingUdhar: 'Khata / Loans Due',
    noTransactionsYet: 'No transactions found. Click "+ Add Transaction" to start recording.',
    incomeVsExpense: 'Income vs Expense Trend',

    searchPlaceholder: 'Search by note, category, or account...',
    filterByType: 'Transaction Type',
    filterByCategory: 'Category',
    filterByAccount: 'Account',
    filterByFamily: 'Family Member',
    filterByDate: 'Date Range',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    allTime: 'All Time',
    customDate: 'Custom Date',
    amount: 'Amount (PKR)',
    date: 'Date',
    account: 'Account',
    fromAccount: 'From Account',
    toAccount: 'To Account',
    category: 'Category',
    note: 'Note / Description',
    familyMember: 'Family Tag',
    optional: 'Optional',
    type: 'Type',

    totalAccounts: 'Total Accounts Balance',
    addNewAccount: 'Add Account / Wallet',
    accountName: 'Account Title',
    accountType: 'Account Type',
    bankName: 'Bank / Service Provider',
    accountNumber: 'Account / Mobile Number (Last 4)',
    currentBalance: 'Current Balance',
    transferFunds: 'Transfer Funds Between Accounts',
    cashInHand: 'Cash in Hand',
    bankAccount: 'Bank Account (Meezan, HBL, etc.)',
    mobileWallet: 'Mobile Wallet (EasyPaisa, JazzCash, SadaPay)',
    savingsAccount: 'Savings Account',

    monthlyBudgets: 'Monthly Category Budgets',
    addBudget: 'Set Budget',
    budgetLimit: 'Budget Limit',
    spentSoFar: 'Spent So Far',
    remainingBudget: 'Remaining',
    budgetUsed: 'Budget Used',
    overBudget: 'Over Budget!',
    safeBudget: 'Within Budget',
    warningBudget: 'Near Limit (>80%)',

    savingsGoals: 'Savings Goals & Kameti',
    addNewGoal: 'Create Savings Goal',
    goalTitle: 'Goal Name (e.g. Umrah, Emergency Fund)',
    targetAmount: 'Target Amount',
    currentSaved: 'Current Saved',
    targetDate: 'Target Date',
    depositFunds: 'Deposit Funds',
    withdrawFunds: 'Withdraw Funds',
    goalCompleted: 'Goal Completed! 🎉',
    daysRemaining: 'Days Left',

    udharTitle: 'Udhar & Khata Tracker',
    udharSubtitle: 'Track loans given and taken with full payment history',
    receivableTab: 'Mujhe Lene Hain (Receivable)',
    payableTab: 'Mujhe Dene Hain (Payable)',
    totalReceivable: 'Total to Receive',
    totalPayable: 'Total to Pay',
    addKhataEntry: 'Add Khata Entry',
    personName: 'Person / Contact Name',
    phoneNumber: 'Phone Number',
    recordPayment: 'Record Payment',
    markSettled: 'Mark Settled',
    remainingAmount: 'Remaining Amount',
    dueDate: 'Promise / Due Date',
    statusPending: 'Pending',
    statusPartiallyPaid: 'Partially Paid',
    statusSettled: 'Fully Settled',

    billRemindersTitle: 'Bills & Utilities Tracker',
    addBill: 'Add Bill Reminder',
    billName: 'Bill Name (e.g. LESCO, Nayatel)',
    provider: 'Provider / Company',
    consumerNumber: 'Consumer / Reference No.',
    markAsPaid: 'Pay Bill Now',
    statusPaid: 'Paid',
    statusUnpaid: 'Unpaid',
    dueInDays: 'Due in',
    overdue: 'Overdue!',

    reportsTitle: 'Reports & Analytics',
    cashFlowAnalysis: 'Cash Flow Comparison',
    expenseDistribution: 'Category Breakdown',
    incomeSources: 'Income Sources',
    familySpending: 'Family Spending Breakdown',
    accountsDistribution: 'Account Balance Distribution',

    settingsTitle: 'Settings, Backup & Deployment',
    languageSelect: 'Interface Language',
    themeSelect: 'Color Theme',
    lightTheme: 'Light Mode',
    darkTheme: 'Dark Mode',
    currencyFormat: 'Number Notation',
    standardFormat: 'Standard (Rs. 150,000)',
    lakhFormat: 'Pakistani Lakhs (1.5 Lakh / لاکھ)',
    backupAndRestore: 'Data Backup & Restore',
    backupDescription: 'Export your entire local finance database to a JSON file on your device.',
    restoreDescription: 'Restore your finance records from a previously exported JSON backup.',
    restoreSuccess: 'Database restored successfully!',
    resetConfirm: 'Are you sure you want to reset all data back to Pakistani demo records?',
    guideAndDeploy: 'Deployment & Usage Guide',
    guideDescription: 'Step-by-step instructions to run, install on phone, and deploy to Google AI Studio or Cloud.',

    tagSelf: 'Self (خود)',
    tagSpouse: 'Spouse (اہلیہ/شوہر)',
    tagParents: 'Parents (والدین)',
    tagKids: 'Kids (بچے)',
    tagHousehold: 'Household (گھر)',
    tagOther: 'Other (دیگر)',
  },

  ur: {
    appName: 'میرا فنانس پی کے',
    appTagline: 'پاکستان کا جدید، مکمل آف لائن اور محفوظ ذاتی بجٹ مینیجر',
    offlineReady: 'آف لائن تیار (انڈیکسڈ ڈی بی)',

    navDashboard: 'ڈیش بورڈ',
    navTransactions: 'آمدن و اخراجات',
    navAccounts: 'بینک اکاؤنٹس و بٹوے',
    navBudgets: 'ماہانہ بجٹ',
    navSavings: 'بچت کے اہداف و کمیٹی',
    navUdhar: 'ادھار و کھاتہ',
    navBills: 'یوٹیلیٹی بلز',
    navReports: 'رپورٹس و تجزیات',
    navSettings: 'سیٹنگز و بیک اپ',

    addTransaction: 'نیا اندراج',
    addIncome: 'آمدن درج کریں',
    addExpense: 'خرچ درج کریں',
    transfer: 'رقم ٹرانسفر',
    save: 'محفوظ کریں',
    cancel: 'منسوخ',
    delete: 'حذف کریں',
    edit: 'ترمیم کریں',
    confirm: 'تصدیق کریں',
    filter: 'فلٹر',
    search: 'تلاش کریں',
    exportCsv: 'سی ایس وی ایکسپورٹ',
    exportJson: 'مکمل بیک اپ ڈاؤن لوڈ (JSON)',
    importJson: 'بیک اپ بحال کریں (JSON)',
    resetData: 'ڈیمو ڈیٹا ری سیٹ کریں',
    installApp: 'ایپ انسٹال کریں (PWA)',
    installed: 'ایپ انسٹال شدہ ہے',
    close: 'بند کریں',
    all: 'سبھی',
    actions: 'اقدامات',
    details: 'تفصیلات',

    netWorth: 'کل مالیاتی اثاثہ (بیلنس)',
    totalIncome: 'اس ماہ کی کل آمدن',
    totalExpenses: 'اس ماہ کے کل اخراجات',
    netSavings: 'ماہانہ خالص بچت',
    savingsRate: 'بچت کا تناسب',
    monthlyOverview: 'ماہانہ آمدن و خرچ کا موازنہ',
    recentTransactions: 'حالیہ لین دین',
    viewAll: 'تمام دیکھیں',
    categoryBreakdown: 'مدات کے لحاظ سے اخراجات',
    budgetHealth: 'ماہانہ بجٹ کی صورتحال',
    urgentBills: 'آنے والے یوٹیلیٹی بلز',
    pendingUdhar: 'واجب الادا ادھار کھاتہ',
    noTransactionsYet: 'کوئی لین دین درج نہیں ہے۔ نیا اندراج کرنے کے لئے بٹن پر کلک کریں۔',
    incomeVsExpense: 'آمدن بمقابلہ اخراجات رجحان',

    searchPlaceholder: 'تفصیل، کیٹیگری، اکاؤنٹ سے تلاش کریں...',
    filterByType: 'قسم',
    filterByCategory: 'کیٹیگری',
    filterByAccount: 'اکاؤنٹ',
    filterByFamily: 'افرادِ خانہ',
    filterByDate: 'تاریخ کی مدت',
    thisMonth: 'موجودہ ماہ',
    lastMonth: 'پچھلا ماہ',
    allTime: 'تمام ریکارڈز',
    customDate: 'مخصوص تاریخ',
    amount: 'رقم (روپے)',
    date: 'تاریخ',
    account: 'اکاؤنٹ',
    fromAccount: 'کس اکاؤنٹ سے',
    toAccount: 'کس اکاؤنٹ میں',
    category: 'کیٹیگری / مد',
    note: 'تفصیل / نوٹ',
    familyMember: 'خاندانی ٹیگ',
    optional: 'اختیاری',
    type: 'نوعیت',

    totalAccounts: 'تمام کھاتوں کا کل بیلنس',
    addNewAccount: 'نیا اکاؤنٹ یا والٹ شامل کریں',
    accountName: 'اکاؤنٹ کا نام',
    accountType: 'اکاؤنٹ کی قسم',
    bankName: 'بینک یا سروس (میزان، ایزی پیسہ)',
    accountNumber: 'اکاؤنٹ یا موبائل نمبر کے آخری 4 ہندسے',
    currentBalance: 'موجودہ بیلنس',
    transferFunds: 'ایک اکاؤنٹ سے دوسرے میں رقم منتقل کریں',
    cashInHand: 'نقد رقم (کیش)',
    bankAccount: 'بینک اکاؤنٹ (میزان، ایچ بی ایل وغیرہ)',
    mobileWallet: 'موبائل والٹ (ایزی پیسہ، جاز کیش، سادہ پے)',
    savingsAccount: 'بچت کا اکاؤنٹ',

    monthlyBudgets: 'ماہانہ اخراجات کا بجٹ',
    addBudget: 'بجٹ طے کریں',
    budgetLimit: 'مقررہ حد',
    spentSoFar: 'اب تک کا خرچ',
    remainingBudget: 'باقی رقم',
    budgetUsed: 'استعمال شدہ بجٹ',
    overBudget: 'بجٹ سے تجاوز کر گیا!',
    safeBudget: 'بجٹ کے اندر',
    warningBudget: 'حد کے قریب (80% سے زائد)',

    savingsGoals: 'بچت کے اہداف اور کمیٹی',
    addNewGoal: 'نیا ہدف بنائیں',
    goalTitle: 'ہدف کا نام (جیسے عمرہ فنڈ، ایمرجنسی فنڈ)',
    targetAmount: 'مطلوبہ رقم',
    currentSaved: 'جمع شدہ رقم',
    targetDate: 'آخری تاریخ',
    depositFunds: 'رقم جمع کریں',
    withdrawFunds: 'رقم نکالیں',
    goalCompleted: 'ہدف مکمل ہوگیا! مبارک ہو 🎉',
    daysRemaining: 'باقی دن',

    udharTitle: 'قرض و ادھار کھاتہ',
    udharSubtitle: 'دیئے گئے اور لئے گئے قرضوں کی مکمل تاریخ اور قسطوں کا ریکارڈ',
    receivableTab: 'مجھے لینے ہیں (دیئے گئے قرض)',
    payableTab: 'مجھے دینے ہیں (لئے گئے قرض)',
    totalReceivable: 'کل وصول طلب رقم',
    totalPayable: 'کل ادا طلب رقم',
    addKhataEntry: 'نیا کھاتہ درج کریں',
    personName: 'شخص کا نام',
    phoneNumber: 'فون نمبر',
    recordPayment: 'وصولی / ادائیگی درج کریں',
    markSettled: 'کھاتہ مکمل بے باق کریں',
    remainingAmount: 'باقی رقم',
    dueDate: 'وعدہ / مقررہ تاریخ',
    statusPending: 'غیر ادا شدہ',
    statusPartiallyPaid: 'جزوی ادا شدہ',
    statusSettled: 'مکمل بے باق',

    billRemindersTitle: 'یوٹیلیٹی بلز اور یاد دہانیاں',
    addBill: 'نیا بل شامل کریں',
    billName: 'بل کا نام (بجلی، گیس، انٹرنیٹ)',
    provider: 'کمپنی (لیسکو، کے الیکٹرک، پی ٹی سی ایل)',
    consumerNumber: 'کنزیومر / ریفرنس نمبر',
    markAsPaid: 'بل ادا کریں',
    statusPaid: 'ادا شدہ',
    statusUnpaid: 'غیر ادا شدہ',
    dueInDays: 'آخری تاریخ میں باقی',
    overdue: 'تاریخ گزر چکی ہے!',

    reportsTitle: 'رپورٹس اور تفصیلی جائزے',
    cashFlowAnalysis: 'ماہانہ آمدن و اخراجات کا بہاؤ',
    expenseDistribution: 'کیٹیگری کے لحاظ سے تقسیم',
    incomeSources: 'آمدن کے ذرائع',
    familySpending: 'افرادِ خانہ پر اخراجات',
    accountsDistribution: 'اکاؤنٹس میں رقم کی تقسیم',

    settingsTitle: 'سیٹنگز، ڈیٹا بیک اپ اور معلومات',
    languageSelect: 'ایپ کی زبان (Language)',
    themeSelect: 'ڈیزائن اور رنگ',
    lightTheme: 'لائٹ موڈ (دن)',
    darkTheme: 'ڈارک موڈ (رات)',
    currencyFormat: 'ہندسوں کا فارمیٹ',
    standardFormat: 'معیاری (Rs. 150,000)',
    lakhFormat: 'پاکستانی لاکھ و کروڑ (1.5 لاکھ)',
    backupAndRestore: 'ڈیٹا بیک اپ اور بحالی',
    backupDescription: 'اپنے تمام مالیاتی ریکارڈز کی محفوظ JSON فائل اپنے موبائل یا کمپیوٹر پر ڈاؤن لوڈ کریں۔',
    restoreDescription: 'سابقہ JSON فائل سے تمام ڈیٹا ایک کلک میں بحال کریں۔',
    restoreSuccess: 'ڈیٹا کامیابی سے بحال ہو گیا!',
    resetConfirm: 'کیا آپ واقعی تمام ڈیٹا اصلی ڈیمو ریکارڈز پر ری سیٹ کرنا چاہتے ہیں؟',
    guideAndDeploy: 'استعمال اور انسٹالیشن کی گائیڈ',
    guideDescription: 'گوگل اے آئی اسٹوڈیو میں چلانے، موبائل پر ایپ بنانے اور ڈپلائے کرنے کے طریقے',

    tagSelf: 'خود',
    tagSpouse: 'اہلیہ / شوہر',
    tagParents: 'والدین',
    tagKids: 'بچے',
    tagHousehold: 'گھر کے اخراجات',
    tagOther: 'دیگر',
  },
};
