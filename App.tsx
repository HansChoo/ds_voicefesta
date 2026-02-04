import React, { useState, useEffect } from 'react';
import { CANDIDATES, ADMIN_PASSWORD } from './constants';
import { Candidate, ViewState } from './types';
import { hasUserVoted, submitVote } from './services/voteService';
import CandidateCard from './components/CandidateCard';
import AdminDashboard from './components/AdminDashboard';
import { Trophy, CheckCircle2, LockKeyhole, ArrowRight, ArrowLeft, AlertTriangle, Home, Mic2, User, Music } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('VOTING');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [adminInput, setAdminInput] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Check if user already voted on mount
  useEffect(() => {
    if (hasUserVoted()) {
      setView('SUCCESS');
    }
  }, []);

  const handleVoteClick = () => {
    if (selectedCandidate && !hasUserVoted()) {
      setView('CONFIRM');
    }
  };

  const confirmVote = () => {
    if (selectedCandidate) {
      submitVote(selectedCandidate.id);
      setView('SUCCESS');
      window.scrollTo(0, 0);
    }
  };

  const handleAdminLogin = () => {
    if (adminInput === ADMIN_PASSWORD) {
      setView('ADMIN');
      setShowAdminLogin(false);
      setAdminInput('');
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const goHome = () => {
    setView('VOTING');
    window.scrollTo(0, 0);
  };

  // 1. ADMIN VIEW
  if (view === 'ADMIN') {
    return <AdminDashboard onLogout={() => setView('VOTING')} />;
  }

  // 2. SUCCESS VIEW (ALREADY VOTED)
  if (view === 'SUCCESS') {
    return (
      <div className="min-h-screen bg-[#052e25] flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="bg-emerald-500/20 p-8 rounded-full mb-6 backdrop-blur-sm ring-4 ring-emerald-500/30">
          <CheckCircle2 size={80} className="text-emerald-400" />
        </div>
        <h1 className="text-4xl font-black mb-4 tracking-tight italic">투표 완료!</h1>
        <p className="text-xl text-emerald-100 leading-relaxed mb-12">
          소중한 한 표가 반영되었습니다.<br/>
          참여해 주셔서 감사합니다.
        </p>
        
        <div className="bg-white/5 rounded-2xl p-6 w-full max-w-sm backdrop-blur-sm border border-emerald-500/30 mb-8">
          <p className="font-bold text-lg mb-2 text-emerald-300">📢 안내사항</p>
          <p className="text-sm text-emerald-100/80">
            결과는 잠시 후 무대에서 공개됩니다.<br/>
            끝까지 자리를 지켜주세요!
          </p>
        </div>

        <button 
            onClick={goHome}
            className="flex items-center px-6 py-3 rounded-xl bg-emerald-800/50 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/50 transition-all"
        >
            <Home size={20} className="mr-2" />
            <span className="font-bold">홈으로 돌아가기</span>
        </button>
      </div>
    );
  }

  // 3. CONFIRMATION VIEW
  if (view === 'CONFIRM' && selectedCandidate) {
    return (
      <div className="min-h-screen bg-[#052e25] flex flex-col p-4">
        {/* Back Button Header */}
        <div className="w-full max-w-lg mx-auto flex items-center justify-start mb-4">
            <button 
                onClick={() => setView('VOTING')}
                className="flex items-center text-emerald-100 bg-emerald-900/30 px-4 py-2 rounded-full hover:bg-emerald-900/50 transition-all border border-emerald-500/30"
            >
                <ArrowLeft size={24} className="mr-2" />
                <span className="font-bold text-lg">뒤로가기</span>
            </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
          <h2 className="text-2xl font-bold text-emerald-100 mb-6 text-center">이 참가자에게 투표하시겠습니까?</h2>
          
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full text-center border-4 border-emerald-500 mb-6 relative overflow-hidden">
            {/* Background Decoration */}
            <Music className="absolute -top-6 -right-6 text-slate-100 w-40 h-40 transform rotate-12" />

            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-6 py-1.5 rounded-full text-base font-bold shadow-sm z-10">
                선택한 참가자
            </div>
            
            <div className="relative z-10 mt-4">
                <div className="inline-block bg-slate-100 text-slate-700 px-4 py-1.5 rounded-full text-lg font-black mb-4 border border-slate-200">
                  기호 {selectedCandidate.id}번
                </div>
                
                <h1 className="text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                  {selectedCandidate.name}
                  <span className="block text-xl text-slate-400 font-bold mt-2 tracking-normal">
                    {selectedCandidate.graduationYear}기
                  </span>
                </h1>
                
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                    <div className="flex items-center justify-center text-emerald-800 mb-1">
                        <Mic2 size={24} className="mr-2 text-emerald-600" />
                        <span className="text-2xl font-bold">{selectedCandidate.songTitle}</span>
                    </div>
                    <div className="text-slate-500 text-sm font-medium">
                        원곡: {selectedCandidate.singer}
                    </div>
                </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="w-full bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
             <div className="bg-orange-500 text-white rounded-full p-1 mt-0.5 shrink-0">
               <AlertTriangle size={16} strokeWidth={3} />
             </div>
             <p className="text-orange-200 text-sm leading-relaxed text-left">
               <span className="font-bold text-orange-400">주의사항</span><br/>
               투표를 완료하면 <span className="text-white underline decoration-orange-500 underline-offset-2">수정할 수 없습니다.</span><br/>
               신중하게 결정해 주세요.
             </p>
          </div>

          <div className="w-full grid grid-cols-2 gap-4">
            <button 
              onClick={() => setView('VOTING')}
              className="py-5 rounded-2xl bg-white/10 text-white text-xl font-bold hover:bg-white/20 transition-colors border border-white/20"
            >
              다시 선택
            </button>
            <button 
              onClick={confirmVote}
              className="py-5 rounded-2xl bg-emerald-500 text-white text-xl font-bold hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-colors flex items-center justify-center border border-emerald-400"
            >
              <CheckCircle2 className="mr-2" />
              투표 확정
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. MAIN VOTING VIEW
  const isVoted = hasUserVoted();

  return (
    <div className="min-h-screen bg-[#032b26] pb-24">
      {/* Header - Hero Section */}
      <header className="relative pt-12 pb-10 px-4 text-center overflow-hidden shadow-2xl z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#064e3b] via-[#065f46] to-[#032b26] z-0"></div>
        {/* Decorative lighting effect */}
        <div className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/20 rounded-[100%] blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <span className="text-emerald-300 font-bold tracking-[0.3em] text-xs uppercase mb-2 drop-shadow-md">
            덕수고등학교 50주년 기념
          </span>
          <h1 className="text-5xl font-black text-white italic tracking-tighter mb-5 drop-shadow-2xl leading-tight">
             <span className="text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 to-emerald-500">덕수</span>
             <span className="relative inline-block ml-1">
                보이스페스타
                <Music className="absolute -top-5 -right-6 text-yellow-400 w-10 h-10 drop-shadow-lg transform rotate-12" />
             </span>
          </h1>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 flex items-center gap-2 shadow-lg">
             <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
             <span className="text-emerald-50 text-sm font-bold">아래 참가자를 터치하여 선택하세요</span>
          </div>
        </div>
      </header>

      {/* Main Content - Flex Layout for Equal Sizing */}
      <main className="max-w-2xl mx-auto px-3 relative z-20 -mt-2">
        <div className="flex flex-wrap justify-center gap-3">
          {CANDIDATES.map((candidate) => (
            /* 
               calc(50% - 0.375rem) accounts for half of the gap-3 (0.75rem).
               This ensures exactly 2 items per row with perfect spacing.
               The last item will naturally be centered by 'justify-center' but retain the same width.
            */
            <div key={candidate.id} className="w-[calc(50%-0.375rem)]">
                <CandidateCard
                  candidate={candidate}
                  selected={selectedCandidate?.id === candidate.id}
                  onSelect={setSelectedCandidate}
                />
            </div>
          ))}
        </div>
      </main>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-[#032b26]/95 backdrop-blur-md border-t border-emerald-900/50 z-50">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleVoteClick}
            disabled={!selectedCandidate || isVoted}
            className={`
              w-full py-3.5 rounded-xl text-xl font-black flex items-center justify-center transition-all duration-300 shadow-lg border-2
              ${isVoted
                ? 'bg-slate-600 border-slate-600 text-slate-300 cursor-not-allowed'
                : selectedCandidate 
                    ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-900/50' 
                    : 'bg-[#134e48] border-[#134e48] text-[#2d7a72] cursor-not-allowed'
              }
            `}
          >
            {isVoted ? (
                <span>투표 참여 완료</span>
            ) : selectedCandidate ? (
              <>
                투표하기 <span className="ml-2 text-sm bg-white/20 px-2 py-0.5 rounded text-white font-normal">터치</span>
              </>
            ) : (
              '참가자를 선택해주세요'
            )}
          </button>
        </div>
      </div>
      
      {/* Secret Admin Access */}
       <button 
          onClick={() => setShowAdminLogin(true)}
          className="fixed top-2 right-2 p-2 text-white/10 hover:text-white/50 z-50 transition-colors"
        >
          <LockKeyhole size={20} />
        </button>

        {/* Modal for Admin Login */}
        {showAdminLogin && (
           <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[100]">
             <div className="bg-white p-6 rounded-2xl w-full max-w-xs text-slate-900">
               <h3 className="font-bold text-lg mb-4">관리자 접속</h3>
               <input 
                 type="password" 
                 value={adminInput}
                 onChange={(e) => setAdminInput(e.target.value)}
                 placeholder="비밀번호 입력"
                 className="w-full p-3 border rounded-lg mb-4 text-lg"
                 autoFocus
               />
               <div className="flex gap-2">
                 <button onClick={() => setShowAdminLogin(false)} className="flex-1 py-3 bg-slate-200 rounded-lg font-bold">취소</button>
                 <button onClick={handleAdminLogin} className="flex-1 py-3 bg-[#00695c] text-white rounded-lg font-bold">확인</button>
               </div>
             </div>
           </div>
        )}
    </div>
  );
};

export default App;