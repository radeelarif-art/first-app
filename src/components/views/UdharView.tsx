import React, { useState } from 'react';
import { Plus, Handshake, Phone, Calendar, CheckCircle2, Clock, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import { UdharRecord, UdharType, AppSettings } from '../../types/finance';
import { translations, Language } from '../../locales/translations';
import { formatPKR, formatDate } from '../../utils/formatters';

interface Props {
  udhars: UdharRecord[];
  settings: AppSettings;
  onOpenAddUdhar: (type?: UdharType) => void;
  onEditUdhar: (record: UdharRecord) => void;
  onDeleteUdhar: (recordId: string) => Promise<void>;
  onOpenRecordPayment: (record: UdharRecord) => void;
  onMarkSettled: (recordId: string) => Promise<void>;
}

export const UdharView: React.FC<Props> = ({
  udhars,
  settings,
  onOpenAddUdhar,
  onEditUdhar,
  onDeleteUdhar,
  onOpenRecordPayment,
  onMarkSettled,
}) => {
  const t = translations[settings.language];
  const isUrdu = settings.language === 'ur';

  const [activeTab, setActiveTab] = useState<UdharType>('receivable');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'partially_paid' | 'settled'>('all');
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalReceivable = udhars
    .filter((u) => u.type === 'receivable' && u.status !== 'settled')
    .reduce((sum, u) => sum + Math.max(0, u.initialAmount - u.paidAmount), 0);

  const totalPayable = udhars
    .filter((u) => u.type === 'payable' && u.status !== 'settled')
    .reduce((sum, u) => sum + Math.max(0, u.initialAmount - u.paidAmount), 0);

  const filteredUdhars = udhars.filter((u) => {
    if (u.type !== activeTab) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {t.udharTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.udharSubtitle}
          </p>
        </div>

        <button
          onClick={() => onOpenAddUdhar(activeTab)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addKhataEntry}</span>
        </button>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => setActiveTab('receivable')}
          className={`p-5 rounded-2xl border cursor-pointer transition ${
            activeTab === 'receivable'
              ? 'bg-emerald-500/10 border-emerald-500/50 ring-2 ring-emerald-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {t.receivableTab}
            </span>
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Handshake className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {formatPKR(totalReceivable, settings.numberFormat, settings.language)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {isUrdu ? 'لوگوں کو دیا گیا ادھار (وصول کرنا ہے)' : 'Money lent to friends/contacts to collect'}
          </div>
        </div>

        <div
          onClick={() => setActiveTab('payable')}
          className={`p-5 rounded-2xl border cursor-pointer transition ${
            activeTab === 'payable'
              ? 'bg-amber-500/10 border-amber-500/50 ring-2 ring-amber-500/20'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {t.payableTab}
            </span>
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Handshake className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">
            {formatPKR(totalPayable, settings.numberFormat, settings.language)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {isUrdu ? 'کسی سے لیا گیا ادھار (واپس لوٹانا ہے)' : 'Money borrowed to return'}
          </div>
        </div>
      </div>

      {/* Tabs & Status Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('receivable')}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'receivable'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.receivableTab}
          </button>
          <button
            onClick={() => setActiveTab('payable')}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'payable'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.payableTab}
          </button>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'pending', 'partially_paid', 'settled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-slate-900 dark:bg-slate-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {st === 'all'
                ? t.all
                : st === 'pending'
                ? t.statusPending
                : st === 'partially_paid'
                ? t.statusPartiallyPaid
                : t.statusSettled}
            </button>
          ))}
        </div>
      </div>

      {/* Khata List */}
      {filteredUdhars.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          {isUrdu
            ? 'اس کیٹیگری میں کوئی ادھار ریکارڈ درج نہیں ہے۔'
            : 'No khata records found in this category.'}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUdhars.map((item) => {
            const remaining = Math.max(0, item.initialAmount - item.paidAmount);
            const isSettled = item.status === 'settled' || remaining === 0;
            const isExpanded = expandedRecordId === item.id;

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs transition hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        item.type === 'receivable'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}
                    >
                      <Handshake className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.personName}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isSettled
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              : item.status === 'partially_paid'
                              ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400'
                              : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {isSettled
                            ? t.statusSettled
                            : item.status === 'partially_paid'
                            ? t.statusPartiallyPaid
                            : t.statusPending}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3 flex-wrap mt-1">
                        {item.phoneNumber && (
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3" />
                            {item.phoneNumber}
                          </span>
                        )}
                        {item.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {t.dueDate}: {formatDate(item.dueDate, settings.language)}
                          </span>
                        )}
                      </div>

                      {item.note && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
                          {item.note}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Amounts & Actions */}
                  <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">{t.remainingAmount}</div>
                      <div
                        className={`text-lg font-black ${
                          isSettled
                            ? 'text-slate-400 line-through'
                            : item.type === 'receivable'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {formatPKR(remaining, 'standard', settings.language)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {isUrdu ? 'کل رقم:' : 'Total:'}{' '}
                        {formatPKR(item.initialAmount, 'standard', settings.language)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2">
                      {!isSettled && (
                        <>
                          <button
                            onClick={() => onOpenRecordPayment(item)}
                            className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-xs transition"
                          >
                            {t.recordPayment}
                          </button>
                          <button
                            onClick={() => onMarkSettled(item.id)}
                            className="px-2.5 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition"
                            title={t.markSettled}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => onEditUdhar(item)}
                        className="p-1.5 text-slate-400 hover:text-emerald-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Payments History Toggle */}
                {item.payments && item.payments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <button
                      onClick={() =>
                        setExpandedRecordId(isExpanded ? null : item.id)
                      }
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
                    >
                      <span>
                        {isUrdu ? 'ادائیگیوں کی تاریخ دیکھیں' : 'View payment history'} (
                        {item.payments.length})
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 space-y-1.5 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl text-xs">
                        {item.payments.map((p) => (
                          <div
                            key={p.id}
                            className="flex justify-between items-center text-slate-700 dark:text-slate-300"
                          >
                            <div>
                              <span className="font-semibold">
                                {formatPKR(p.amount, 'standard', settings.language)}
                              </span>{' '}
                              <span className="text-slate-400">
                                ({formatDate(p.date, settings.language)})
                              </span>
                              {p.note && (
                                <span className="text-slate-500 ml-1.5">
                                  — {p.note}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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
                ? 'کیا آپ واقعی اس کھاتہ کو حذف کرنا چاہتے ہیں؟'
                : 'Are you sure you want to delete this khata record?'}
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
                  await onDeleteUdhar(deleteId);
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
