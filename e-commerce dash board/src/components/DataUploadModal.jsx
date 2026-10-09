import React, { useState } from 'react';
import { X, UploadCloud, CheckCircle, AlertTriangle, FileSpreadsheet, ShieldCheck } from 'lucide-react';

export default function DataUploadModal({ onClose, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationReport, setValidationReport] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      // Simulate real-time data validation process
      setIsValidating(true);
      setTimeout(() => {
        setIsValidating(false);
        setValidationReport({
          fileName: selected.name,
          totalRows: 450,
          validRows: 442,
          invalidRows: 5,
          duplicateRows: 3,
          columnsDetected: ["order_id", "product_name", "category", "selling_price", "cost_price", "quantity", "payment_method"],
          status: "PASSED"
        });
      }, 1200);
    }
  };

  const handleConfirmImport = () => {
    if (onUploadSuccess) onUploadSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Import Transaction Dataset</h2>
              <p className="text-xs text-slate-400">Upload CSV or Excel data for validation & database update</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* File Dropzone */}
        <div className="my-6">
          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-800 hover:border-indigo-500 rounded-2xl cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition-all">
            <FileSpreadsheet className="h-8 w-8 text-indigo-400 mb-2" />
            <span className="text-xs font-semibold text-slate-300">Click to upload CSV or Excel transaction file</span>
            <span className="text-[10px] text-slate-500 mt-1">Supports schema: Order ID, Product, Category, Cost, Price, Qty</span>
            <input type="file" accept=".csv, .xlsx" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {/* Validation Progress */}
        {isValidating && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <div className="h-4 w-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
            <span className="text-xs text-slate-300 font-medium">Validating schema & duplicate transactions...</span>
          </div>
        )}

        {/* Validation Report Card */}
        {validationReport && !isValidating && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Data Quality Report ({validationReport.fileName})
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {validationReport.status}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-slate-900 p-2 rounded-xl">
                <span className="text-[10px] text-slate-500 block">Total</span>
                <span className="font-bold text-white">{validationReport.totalRows}</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl">
                <span className="text-[10px] text-slate-500 block">Valid</span>
                <span className="font-bold text-emerald-400">{validationReport.validRows}</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl">
                <span className="text-[10px] text-slate-500 block">Invalid</span>
                <span className="font-bold text-rose-400">{validationReport.invalidRows}</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-xl">
                <span className="text-[10px] text-slate-500 block">Duplicates</span>
                <span className="font-bold text-amber-400">{validationReport.duplicateRows}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              Schema verified: 7 mandatory columns mapped successfully. 5 invalid rows flagged with negative quantities will be excluded automatically.
            </p>
          </div>
        )}

        {/* Action Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs cursor-pointer">
            Cancel
          </button>
          <button
            disabled={!validationReport}
            onClick={handleConfirmImport}
            className={`px-5 py-2 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
              validationReport
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            Confirm & Update Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
