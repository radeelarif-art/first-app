import React, { useState } from 'react';
import { Plus, Zap, CheckCircle2, Clock, Calendar, Edit2, Trash2, FileText, CheckCircle } from 'lucide-react';
import { BillReminder, AppSettings } from '../../types/finance';
import { translations, Language } from '../../locales/translations';
import { formatPKR, formatDate } from '../../utils/formatters';

interface Props {
  bills: BillReminder[];
  settings: AppSettings;
  onOpenAddBill: () => void;
  onEditBill: (bill: BillReminder) => void;
  onDeleteBill: (billId: string) => Promise<void>;
  onOpenPayBill: (bill: BillReminder) => void;
}

export const BillsView: React.FC<Props> = ({
  bills,
  settings,
  onOpenAddBill,
  onEditBill,
  onDeleteBill,
  onOpenPayBill,
}) => {
  const t = translations[settings.language];
  const isUrdu = settings.language === 'ur';

  const [filter, setFilter] = useState<'all' | 'unpaid' | 'paid'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const unpaidBills = bills.filter((b) => b.status === 'unpaid');
  const totalUnpaidAmount = unpaidBills.reduce((sum, b) => sum + b.amount, 0);

  const filteredBills = bills.filter((b) => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {t.billRemindersTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isUrdu
              ? 'لیسکو، کے الیکٹرک، سوئی گیس، نیا ٹیل اور گھریلو بلوں کی یاد دہانیاں'
              : 'Keep track of electricity, gas, water, internet, and rent bills'}
          </p>
        </div>

        <button
          onClick={onOpenAddBill}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addBill}</span>
        </button>
      </div>

      {/* Aggregate Overview Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">
              {isUrdu ? 'کل واجب الادا بلز' : 'Total Unpaid Bills'}
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {formatPKR(totalUnpaidAmount, 'standard', settings.language)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {unpaidBills.length} {isUrdu ? 'بلز باقی ہیں' : 'bills remaining'}
            </div>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">
              {isUrdu ? 'تمام رجسٹرڈ بلز' : 'Total Bills Registered'}
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {bills.length}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>
                {bills.filter((b) => b.status === 'paid').length} {t.statusPaid}
              </span>
            </div>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
            filter === 'all'
              ? 'bg-slate-900 dark:bg-slate-700 text-white'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t.all} ({bills.length})
        </button>
        <button
          onClick={() => setFilter('unpaid')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
            filter === 'unpaid'
              ? 'bg-amber-600 text-white'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t.statusUnpaid} ({unpaidBills.length})
        </button>
        <button
          onClick={() => setFilter('paid')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
            filter === 'paid'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t.statusPaid} ({bills.filter((b) => b.status === 'paid').length})
        </button>
      </div>

      {/* Bills Grid */}
      {filteredBills.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          {isUrdu
            ? 'اس کیٹیگری میں کوئی بل موجود نہیں ہے۔'
            : 'No bills found in this filter.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBills.map((bill) => {
            const isPaid = bill.status === 'paid';

            return (
              <div
                key={bill.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition hover:shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isPaid
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-amber-500/10 text-amber-600'
                        }`}
                      >
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {isUrdu ? bill.billNameUrdu : bill.billName}
                        </h3>
                        <div className="text-[11px] text-slate-400">
                          {bill.provider}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
                      <button
                        onClick={() => onEditBill(bill)}
                        className="p-1.5 text-slate-400 hover:text-emerald-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(bill.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {bill.consumerNumber && (
                    <div className="text-[11px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-2 py-1 rounded-md mb-3 inline-block">
                      Ref: {bill.consumerNumber}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {t.dueDate}: {formatDate(bill.dueDate, settings.language)}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-base font-black text-slate-900 dark:text-white">
                    {formatPKR(bill.amount, 'standard', settings.language)}
                  </div>

                  {isPaid ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.statusPaid}</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onOpenPayBill(bill)}
                      className="px-3.5 py-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1"
                    >
                      <span>{t.markAsPaid}</span>
                    </button>
                  )}
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
                ? 'کیا آپ واقعی اس بل کو حذف کرنا چاہتے ہیں؟'
                : 'Are you sure you want to delete this bill reminder?'}
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
                  await onDeleteBill(deleteId);
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
