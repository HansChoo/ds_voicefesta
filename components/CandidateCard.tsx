import React from 'react';
import { Candidate } from '../types';
import { Mic2 } from 'lucide-react';

interface Props {
  candidate: Candidate;
  onSelect: (candidate: Candidate) => void;
  selected: boolean;
}

const CandidateCard: React.FC<Props> = ({ candidate, onSelect, selected }) => {
  return (
    <div 
      onClick={() => onSelect(candidate)}
      className={`
        relative w-full h-full rounded-xl overflow-hidden transition-all duration-200
        border-4 cursor-pointer no-select
        flex flex-col items-center justify-center text-center
        ${selected 
            ? 'border-emerald-500 bg-emerald-50 shadow-[0_0_15px_rgba(16,185,129,0.3)] z-10' 
            : 'border-white/10 bg-white/95 hover:bg-white shadow-sm'
        }
      `}
    >
      <div className="p-3 w-full flex flex-col items-center">
        {/* Top Badge */}
        <div className="flex items-center gap-1.5 mb-2">
            <span className={`
            text-xs font-bold px-2 py-0.5 rounded-full
            ${selected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}
            `}>
            기호 {candidate.id}
            </span>
            <span className="text-xs text-slate-400 font-bold">
            {candidate.graduationYear}기
            </span>
        </div>
        
        {/* Name */}
        <h3 className="text-2xl font-black text-slate-900 mb-2 leading-none">
          {candidate.name}
        </h3>
        
        {/* Song Info */}
        <div className={`
            w-full rounded-lg p-2 flex flex-col items-center justify-center
            ${selected ? 'bg-emerald-100/50' : 'bg-slate-50 border border-slate-100'}
        `}>
          <div className="flex items-center justify-center text-slate-800 w-full">
              <Mic2 size={14} className={`mr-1 flex-shrink-0 ${selected ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className={`text-base font-bold truncate max-w-full ${selected ? 'text-emerald-700' : ''}`}>
               {candidate.songTitle}
              </span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5 truncate max-w-full">
               원곡: {candidate.singer}
          </div>
        </div>

        {/* Selected Indicator - Checkmark Overlay */}
        {selected && (
            <div className="absolute top-2 right-2">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                    <div className="w-2 h-2 bg-white rounded-full" />
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CandidateCard;