import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getVoteStats, resetSystem } from '../services/voteService';
import { CANDIDATES } from '../constants';
import { VoteStats } from '../types';
import { RefreshCcw, LogOut, Trash2, Home, AlertTriangle } from 'lucide-react';

interface Props {
  onLogout: () => void;
}

const AdminDashboard: React.FC<Props> = ({ onLogout }) => {
  const [stats, setStats] = useState<VoteStats[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [showResetModal, setShowResetModal] = useState(false);

  const refreshData = () => {
    const data = getVoteStats();
    setStats(data);
    setTotalVotes(data.reduce((acc, curr) => acc + curr.count, 0));
  };

  useEffect(() => {
    refreshData();
    // Poll every 3 seconds to simulate real-time updates
    const interval = setInterval(refreshData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleResetConfirm = () => {
    // 1. Reset localStorage
    resetSystem();
    
    // 2. Update Local State immediately (Graph & Counts)
    refreshData();
    
    // 3. Close Modal & Feedback
    setShowResetModal(false);
    alert('시스템이 초기화되었습니다. 모든 투표 데이터가 삭제되었습니다.');
    
    // Note: We do NOT use window.location.reload() here 
    // to prevent ERR_FILE_NOT_FOUND in local file environments.
    // The App component will re-check voting status automatically when you navigate back.
  };

  const chartData = stats.map(stat => {
    const candidate = CANDIDATES.find(c => c.id === stat.candidateId);
    return {
      name: candidate?.name || `참가자 ${stat.candidateId}`,
      song: candidate?.songTitle,
      votes: stat.count,
      id: stat.candidateId
    };
  }).sort((a, b) => b.votes - a.votes); // Sort by votes desc

  // Teal/Emerald Palette
  const COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-[#064e3b]">관리자 대시보드</h1>
            <p className="text-slate-500">실시간 투표 집계 현황</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={refreshData} 
              className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
            >
              <RefreshCcw size={20} />
            </button>
            <button 
              onClick={onLogout} 
              className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-bold"
            >
              <Home size={18} className="mr-2" />
              홈으로
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-slate-500 text-sm font-medium uppercase mb-1">총 투표수</div>
                <div className="text-4xl font-black text-slate-900">{totalVotes.toLocaleString()}표</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-slate-500 text-sm font-medium uppercase mb-1">현재 1위</div>
                <div className="text-4xl font-black text-emerald-600">
                    {chartData[0]?.votes > 0 ? chartData[0].name : '-'}
                </div>
                <div className="text-sm text-slate-500 mt-1">
                    {chartData[0]?.votes > 0 ? `(${chartData[0].votes}표)` : ''}
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-[500px]">
          <h2 className="text-lg font-bold mb-4 text-slate-800">득표 현황 그래프</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 16, fontWeight: 'bold', fill: '#334155' }} 
                width={80}
              />
              <Tooltip 
                cursor={{fill: '#f0fdf4'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="votes" radius={[0, 10, 10, 0]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-12 p-4 bg-red-50 rounded-xl border border-red-100">
            <h3 className="text-red-800 font-bold mb-2 flex items-center">
                <Trash2 size={20} className="mr-2"/> 
                시스템 초기화
            </h3>
            <p className="text-sm text-red-600 mb-4">
                모든 투표 데이터를 삭제하고 투표 상태를 초기화합니다. 이 작업은 되돌릴 수 없습니다.
            </p>
            <button 
                type="button"
                onClick={() => setShowResetModal(true)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
            >
                데이터 전체 삭제
            </button>
        </div>

        {/* Custom Confirmation Modal for Reset */}
        {showResetModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
             <div className="bg-white p-6 rounded-2xl w-full max-w-sm text-center shadow-2xl animate-in fade-in zoom-in duration-200">
               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <AlertTriangle size={32} className="text-red-600" />
               </div>
               <h3 className="font-black text-xl text-slate-900 mb-2">정말 삭제하시겠습니까?</h3>
               <p className="text-slate-600 mb-6 leading-relaxed">
                 모든 투표 기록이 <b>영구적으로 삭제</b>되며<br/>
                 모든 참가자의 득표수가 <b>0</b>이 됩니다.<br/>
                 이 작업은 되돌릴 수 없습니다.
               </p>
               <div className="flex gap-3">
                 <button 
                   onClick={() => setShowResetModal(false)} 
                   className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-lg hover:bg-slate-200"
                 >
                   취소
                 </button>
                 <button 
                   onClick={handleResetConfirm} 
                   className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 shadow-lg shadow-red-500/30"
                 >
                   삭제 확인
                 </button>
               </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;