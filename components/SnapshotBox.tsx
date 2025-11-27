import React from 'react';
import { SnapshotData } from '../types';
import { Camera, Scissors } from 'lucide-react';

interface Props {
  data: SnapshotData;
}

const SnapshotBox: React.FC<Props> = ({ data }) => {
  return (
    <div className="relative group perspective">
      <div className="absolute -inset-1 bg-gradient-to-r from-acid-green to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-fashion-black border-2 border-white p-6 rounded-lg font-mono shadow-2xl transform transition-transform hover:scale-[1.02]">
        
        <div className="flex justify-between items-start border-b border-gray-700 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-acid-green" />
            <h3 className="text-xl font-bold tracking-tighter uppercase text-white">Look Review Snapshot</h3>
          </div>
          <div className="text-xs text-gray-400">#KaoPeiFashion</div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm uppercase tracking-widest">Score</span>
            <span className="text-4xl font-black text-acid-green italic">{data.score.toFixed(1)}<span className="text-lg text-white not-italic"> / 10</span></span>
          </div>

          <div className="flex justify-between items-center">
             <span className="text-gray-400 text-sm uppercase tracking-widest">Style</span>
             <span className="text-white font-bold text-right">{data.style}</span>
          </div>

          <div className="pt-2">
            <span className="text-gray-400 text-sm uppercase tracking-widest block mb-2">Keywords</span>
            <div className="flex flex-wrap gap-2 justify-end">
              {data.keywords.map((kw, idx) => (
                <span key={idx} className="bg-white text-black px-2 py-1 text-xs font-bold uppercase transform -skew-x-12 border border-black shadow-[2px_2px_0px_0px_rgba(204,255,0,1)]">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-dashed border-gray-600 flex justify-between items-end">
            <div className="text-[10px] text-gray-500">
                VERIFIED BY <br/> AI DIRECTOR FROM HELL
            </div>
            <Scissors className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default SnapshotBox;
