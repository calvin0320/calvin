import React, { useState, useRef } from 'react';
import { Upload, X, Zap, Loader2, RefreshCw } from 'lucide-react';
import { analyzeOutfit } from './services/geminiService';
import { AnalysisResult } from './types';
import SnapshotBox from './components/SnapshotBox';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("照片太大了！你的時尚災難不需要這麼高解析度 (Max 5MB)");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);

    try {
      const data = await analyzeOutfit(image);
      setResult(data);
    } catch (err) {
      setError("AI 總監拒絕評論這張照片，可能是因為伺服器忙碌，或是你的穿搭嚇壞了雲端。請再試一次。");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans selection:bg-acid-green selection:text-black">
      {/* Header */}
      <header className="border-b border-neutral-800 p-4 sticky top-0 bg-neutral-900/90 backdrop-blur-md z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="text-acid-green w-8 h-8 fill-current" />
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">
                KaoPei <span className="text-acid-green">Director</span>
              </h1>
              <p className="text-xs text-neutral-400 tracking-widest">靠北時尚總監</p>
            </div>
          </div>
          {result && (
            <button 
              onClick={reset}
              className="text-sm font-bold border border-neutral-600 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> 下一位受害者
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8">
        
        {/* Intro / Upload Section */}
        {!result && !loading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in-up">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black leading-tight">
                你的穿搭 <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-acid-green to-purple-500">值得被羞辱嗎？</span>
              </h2>
              <p className="text-neutral-400 text-lg md:text-xl">
                上傳照片，讓最毒舌的 AI 總監來評鑑。<br/>
                心臟不夠大顆請勿嘗試。
              </p>
            </div>

            <div className="w-full max-w-md">
              {!image ? (
                <div 
                  onClick={triggerUpload}
                  className="border-2 border-dashed border-neutral-700 rounded-2xl p-12 cursor-pointer hover:border-acid-green hover:bg-neutral-800/50 transition-all group"
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                  <Upload className="w-16 h-16 mx-auto mb-4 text-neutral-500 group-hover:text-acid-green transition-colors" />
                  <p className="text-neutral-300 font-bold">點擊上傳你的 OOTD</p>
                  <p className="text-neutral-500 text-sm mt-2">支援 JPG, PNG</p>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-neutral-700 shadow-2xl">
                  <img src={image} alt="Preview" className="w-full max-h-[500px] object-cover" />
                  <button 
                    onClick={reset}
                    className="absolute top-2 right-2 bg-black/50 p-2 rounded-full hover:bg-red-500 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                    <button 
                      onClick={handleAnalyze}
                      className="w-full bg-acid-green text-black font-black py-4 text-lg uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 rounded-xl"
                    >
                      <Zap className="w-5 h-5 fill-black" /> 開始被罵
                    </button>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500 text-red-200 px-6 py-4 rounded-lg max-w-md">
                <strong className="block mb-1">錯誤：</strong>
                {error}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-acid-green blur-xl opacity-20 animate-pulse"></div>
              <Loader2 className="w-20 h-20 text-acid-green animate-spin relative z-10" />
            </div>
            <h3 className="text-2xl font-bold animate-pulse">正在掃描你的時尚災難指數...</h3>
            <p className="text-neutral-500">AI 正在深呼吸準備開噴</p>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            
            {/* Left Column: Image & Roast */}
            <div className="lg:col-span-8 space-y-8">
              <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
                 <div className="relative">
                    <img src={image!} alt="Analyzed Outfit" className="w-full h-auto object-cover max-h-[600px]" />
                    <div className="absolute top-4 left-4">
                        <span className="bg-black text-white px-3 py-1 text-xs font-bold uppercase border border-acid-green">Original Image</span>
                    </div>
                 </div>
              </div>

              <div className="bg-neutral-800/50 p-6 md:p-8 rounded-2xl border border-neutral-700">
                <h2 className="text-2xl md:text-3xl font-black mb-6 text-acid-green uppercase flex items-center gap-3">
                  <span className="text-4xl">💀</span> 穿搭毒舌評測
                </h2>
                <ul className="space-y-4">
                  {result.roast.map((line, idx) => (
                    <li key={idx} className="flex gap-4 text-lg md:text-xl leading-relaxed text-neutral-200">
                      <span className="text-acid-green font-bold shrink-0">0{idx + 1}.</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-neutral-900 p-6 md:p-8 rounded-2xl border border-dashed border-neutral-600">
                <h2 className="text-2xl md:text-3xl font-black mb-6 text-white uppercase flex items-center gap-3">
                  <span className="text-4xl">✨</span> 總監的施捨 (改善建議)
                </h2>
                <ul className="space-y-4">
                  {result.advice.map((line, idx) => (
                    <li key={idx} className="flex gap-4 text-base md:text-lg leading-relaxed text-neutral-300">
                       <div className="w-1.5 h-1.5 bg-white rounded-full mt-2.5 shrink-0"></div>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Snapshot & Score (Sticky on Desktop) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-24 space-y-6">
                
                {/* 1. Snapshot Box */}
                <div className="order-1">
                   <p className="text-xs text-center text-neutral-500 mb-2 uppercase tracking-widest">Capture This 👇</p>
                   <SnapshotBox data={result.snapshot} />
                </div>

                {/* 2. Score Comment */}
                <div className="bg-white text-black p-6 rounded-xl shadow-lg transform rotate-1">
                  <div className="flex items-center gap-2 mb-2 border-b-2 border-black pb-2">
                     <span className="font-black uppercase text-sm tracking-wider">總監評語</span>
                  </div>
                  <p className="text-xl md:text-2xl font-bold leading-tight">
                    "{result.scoreComment}"
                  </p>
                </div>

                {/* 3. Action */}
                <button 
                  onClick={reset}
                  className="w-full py-4 border-2 border-neutral-700 hover:border-acid-green text-neutral-400 hover:text-acid-green font-bold rounded-xl transition-all uppercase tracking-widest"
                >
                  再試一次
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

       {/* Footer */}
       <footer className="border-t border-neutral-800 mt-12 py-8 text-center text-neutral-600 text-sm">
        <p>Powered by Gemini 2.5 Flash • Built for Fun • Don't Take It Personally</p>
      </footer>
    </div>
  );
};

export default App;
