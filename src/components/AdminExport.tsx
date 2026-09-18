import React, { useState } from 'react';
import { Download, Database, Settings, ChevronDown, Check, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCentralHub } from '../hooks/useCentralHub';

const COLLECTION_MAP: Record<string, string> = {
  "yt": "YouTube Videos",
  "ys": "YouTube Shorts",
  "ypl": "YouTube Playlists",
  "lp": "LinkedIn Posts",
  "tw": "Twitter Posts",
  "li": "LinkedIn Profiles",
  "blog": "Blogs",
  "email": "Emails",
  
  "git": "GitHub Repos"
};

export default function AdminExport() {
  const { db, isInitialLoading } = useCentralHub();
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [isExportingSingle, setIsExportingSingle] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);
  const navigate = useNavigate();

  const handleExportSingle = async () => {
    if (!selectedCollection || !db) return;
    setIsExportingSingle(true);
    
    // Small delay to allow UI to show loading state
    await new Promise(resolve => setTimeout(resolve, 300));

    const data = db[selectedCollection as keyof typeof db] || [];
    if (data.length === 0) {
      alert("This collection is empty.");
      setIsExportingSingle(false);
      return;
    }

    const XLSX = await import("xlsx");
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    const sheetName = (COLLECTION_MAP[selectedCollection] || selectedCollection).substring(0, 31);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    XLSX.writeFile(workbook, `${sheetName.replace(/ /g, '_')}_Export.xlsx`);
    setIsExportingSingle(false);
  };

  const handleExportAll = async () => {
    if (!db) return;
    setIsExportingAll(true);
    
    // Small delay to allow UI to show loading state
    await new Promise(resolve => setTimeout(resolve, 500));

    const XLSX = await import("xlsx");
    const workbook = XLSX.utils.book_new();
    let hasData = false;
    
    for (const [key, name] of Object.entries(COLLECTION_MAP)) {
      const data = db[key as keyof typeof db] || [];
      if (data.length > 0) {
        hasData = true;
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, name.substring(0, 31));
      }
    }
    
    if (!hasData) {
       alert("No data available to export.");
       setIsExportingAll(false);
       return;
    }

    XLSX.writeFile(workbook, `Complete_Admin_Export.xlsx`);
    setIsExportingAll(false);
  };

  if (isInitialLoading || !db) return <div className="min-h-screen bg-white/[0.03] flex items-center justify-center text-white"><Loader2 className="w-8 h-8 animate-spin text-fuchsia-400" /></div>;

  const availableCollections = Object.keys(COLLECTION_MAP);
  const inIframe = window.self !== window.top;

  return (
    <div className="min-h-screen bg-white/[0.03] text-white p-6 sm:p-12 font-sans selection:bg-gradient-to-r from-violet-600 to-fuchsia-600/30">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {inIframe && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">
              <strong>Preview Restriction:</strong> Your browser restricts file downloads from inside this preview window.<br/>
              To export data, please click the <strong>"Open app in new tab"</strong> button at the top right of the preview pane.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-white/[0.03] rounded-lg transition text-slate-400 hover:text-white"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Settings className="text-fuchsia-400" />
                Admin Console
              </h1>
              <p className="text-slate-400 text-sm mt-1">Secure Data Export Portal</p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Admin Authenticated
          </div>
        </div>

        {/* Export Card */}
        <div className="bg-[#11152c] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-r from-violet-600 to-fuchsia-600/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row gap-12">
            
            {/* Left side: Single Export */}
            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
                  <Database size={20} className="text-blue-400" />
                  Targeted Export
                </h2>
                <p className="text-sm text-slate-400">Select a specific dataset collection to export as a formatted Excel spreadsheet.</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Available Collections</label>
                  <div className="relative">
                    <select 
                      value={selectedCollection}
                      onChange={(e) => setSelectedCollection(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:border-violet-500/50 transition pr-10"
                    >
                      <option value="" disabled>Select a collection...</option>
                      {availableCollections.map(key => (
                        <option key={key} value={key}>{COLLECTION_MAP[key]} ({db[key]?.length || 0} records)</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <button
                  onClick={handleExportSingle}
                  disabled={!selectedCollection || isExportingSingle || isExportingAll || (db[selectedCollection]?.length === 0)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl font-medium transition shadow-lg shadow-blue-900/20"
                >
                  {isExportingSingle ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                  Export Selected Data
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px bg-white/[0.05]" />
            <div className="sm:hidden h-px bg-white/[0.05] w-full" />

            {/* Right side: Global Export */}
            <div className="flex-1 space-y-6">
               <div>
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
                  <Database size={20} className="text-emerald-400" />
                  Global Export
                </h2>
                <p className="text-sm text-slate-400">Generate a comprehensive Excel workbook containing all available collections separated by sheets.</p>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                 <h3 className="text-sm font-medium text-emerald-400 mb-2">Includes:</h3>
                 <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                   {availableCollections.map(key => (
                     <div key={key} className="text-xs text-slate-300 flex items-center justify-between gap-2">
                       <span className="flex items-center gap-2">
                         <Check size={14} className={db[key]?.length > 0 ? "text-emerald-500" : "text-slate-300"} />
                         <span className={db[key]?.length === 0 ? "opacity-50" : ""}>{COLLECTION_MAP[key]}</span>
                       </span>
                     </div>
                   ))}
                 </div>
              </div>

              <button
                  onClick={handleExportAll}
                  disabled={isExportingSingle || isExportingAll}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl font-medium transition shadow-lg shadow-emerald-900/20"
                >
                  {isExportingAll ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                  Export All Data
                </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
