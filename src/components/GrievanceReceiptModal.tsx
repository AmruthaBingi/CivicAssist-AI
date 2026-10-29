import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Printer, 
  ArrowRight, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Building2, 
  MapPin, 
  X 
} from 'lucide-react';
import { Grievance } from '../types/civic';
import { useLanguage } from '../context/LanguageContext';

interface GrievanceReceiptModalProps {
  grievance: Grievance;
  onClose: () => void;
  onTrack: (refId: string) => void;
  onGoToDashboard: () => void;
}

export const GrievanceReceiptModal: React.FC<GrievanceReceiptModalProps> = ({
  grievance,
  onClose,
  onTrack,
  onGoToDashboard
}) => {
  const { t, translateCategory, translatePriority } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(grievance.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-teal-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-teal-300 shadow-inner">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold bg-teal-500/30 text-teal-200 px-2 py-0.5 rounded border border-teal-400/30">
                {t('receipt.badge')}
              </span>
              <h3 className="text-xl font-bold mt-1">{t('receipt.title')}</h3>
            </div>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-5">
          {/* Reference ID Box */}
          <div className="bg-slate-50 border-2 border-dashed border-teal-400/60 rounded-xl p-4 text-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {t('receipt.refLabel')}
            </span>
            <div className="flex items-center justify-center gap-3 mt-1.5">
              <span className="text-2xl sm:text-3xl font-mono font-black text-slate-900 tracking-wider">
                {grievance.id}
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer active:scale-95"
                title={t('common.copy')}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t('common.copied') : t('common.copy')}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {t('receipt.copyHint')}
            </p>
          </div>

          {/* Details Table */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{t('receipt.citizenName')}</span>
              <span className="font-semibold text-slate-800">{grievance.citizenName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{t('receipt.contact')}</span>
              <span className="font-medium text-slate-700">{grievance.citizenPhone} • {grievance.citizenEmail}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{t('receipt.subject')}</span>
              <span className="font-semibold text-slate-800 text-right max-w-[240px] truncate">{grievance.subject}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{t('receipt.department')}</span>
              <span className="font-medium text-slate-700 text-right max-w-[240px] truncate">{grievance.department}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{t('receipt.location')}</span>
              <span className="font-medium text-slate-700">{grievance.area}, {grievance.city} - {grievance.pincode}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">{t('receipt.categoryPriority')}</span>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                  {translateCategory(grievance.category)}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-100 font-bold text-amber-800">
                  {translatePriority(grievance.priority)}
                </span>
              </div>
            </div>
            <div className="flex justify-between py-2 bg-teal-50 px-3 rounded-lg border border-teal-200">
              <div className="flex items-center gap-1.5 text-teal-800 font-bold">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>{t('receipt.sla')}</span>
              </div>
              <span className="font-bold text-teal-900">
                {new Date(grievance.estimatedResolutionDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <button
              onClick={() => onTrack(grievance.id)}
              className="w-full sm:flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer active:scale-98"
            >
              <span>{t('receipt.trackBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t('receipt.printBtn')}</span>
            </button>
            <button
              onClick={onGoToDashboard}
              className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              {t('receipt.dashboardBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
