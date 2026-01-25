import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, MoreVertical, BarChart2, Users, Clock, ShieldCheck, Filter, Activity, Lock, Unlock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface CandidateResult {
  id: string;
  name: string; // Paslon number/id
  pairName: string; // Full names
  role: string;
  votes: number;
  color: string;
  image: string;
}

import { CANDIDATES_DATA } from '../data';
import { VotingStep } from '../types';
import { getResults } from '../services/googleSheets';

interface CandidateResult {
  id: string;
  name: string; // Paslon number/id
  pairName: string; // Full names
  role: string;
  votes: number;
  color: string;
  image: string;
}

const CATEGORY_LABELS: Record<VotingStep, string> = {
  [VotingStep.OPPN_PUTRA]: "OPPN Putra",
  [VotingStep.OPPN_PUTRI]: "OPPN Putri",
  [VotingStep.GUDEP]: "GUDEP",
};

// Generate initial empty results from static data
const getInitialData = (): CandidateResult[] => {
  const results: CandidateResult[] = [];
  const colors = ['#2bee79', '#92c9a8', '#527d66']; // Cyclical colors

  Object.entries(CANDIDATES_DATA).forEach(([step, candidates]) => {
    const stepNum = Number(step) as VotingStep;
    const roleName = CATEGORY_LABELS[stepNum];

    candidates.forEach((c, index) => {
      results.push({
        id: c.id,
        name: `No. ${c.number}`,
        pairName: c.name, // Using single name for now as per data.ts
        role: roleName,
        votes: 0,
        color: colors[index % colors.length],
        image: c.image
      });
    });
  });
  return results;
};

const TOTAL_STUDENTS = 1350; // Total eligible voters

// Helper component for smooth number transitions
const CountUp = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const startValue = useRef(value);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1500; // Animation duration in ms
    const start = displayValue;
    const end = value;

    if (start === end) return;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (end - start) * ease);
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
    startValue.current = value;
  }, [value]);

  return <>{displayValue.toLocaleString()}</>;
};

const ResultsPage: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateResult[]>(getInitialData());
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isUpdating, setIsUpdating] = useState(false);
  const [isVotingClosed, setIsVotingClosed] = useState(false); // Simulate voting closed state

  // Derived state
  const totalVotes = candidates.reduce((acc, curr) => acc + curr.votes, 0);
  const participationRate = Math.min(Math.round((totalVotes / TOTAL_STUDENTS) * 100), 100);

  // Sort candidates by votes (descending)
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);

  // Chart data
  const chartData = candidates.map(c => ({
    name: c.name.replace('No. ', ''),
    value: c.votes,
    color: c.color
  }));

  // Polling Effect
  useEffect(() => {
    const fetchData = async () => {
      setIsUpdating(true);
      try {
        const data = await getResults();
        if (data.success) {
          // Normalize helper: "01" -> "1", "1" -> "1", " 03 " -> "3"
          const normalize = (val: string | number) => String(val).replace(/^0+/, '').trim();

          setCandidates(prev => prev.map(c => {
            const cIdNorm = normalize(c.id);

            // Find count by checking all keys in data.results
            const matchEntry = Object.entries(data.results).find(([key, _]) => normalize(key) === cIdNorm);
            const voteCount = matchEntry ? matchEntry[1] : 0;

            return {
              ...c,
              votes: voteCount
            };
          }));
        }
      } catch (error) {
        console.error("Failed to fetch results", error);
      } finally {
        setLastUpdated(new Date());
        setIsUpdating(false);
      }
    };

    // Initial fetch
    fetchData();

    if (isVotingClosed) return;

    const intervalId = setInterval(fetchData, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId);
  }, [isVotingClosed]);

  // Timer Logic
  const [timeLeft, setTimeLeft] = useState<string>("00:00:00");

  useEffect(() => {
    // Set deadline to 3 hours from now for demo purposes, or a fixed date
    // In a real app, this would come from a config
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + 3);

    const timerInterval = setInterval(() => {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("00:00:00");
        setIsVotingClosed(true); // Auto close when time up (optional)
      } else {
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Password salah!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-background-dark min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-surface-dark border border-[#234832] rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="size-16 rounded-full bg-[#234832] flex items-center justify-center text-primary mb-2">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white text-center">Akses Terbatas</h1>
            <p className="text-text-secondary text-center text-sm">
              Halaman ini hanya dapat diakses oleh Panitia Pemilihan (Admin). Silakan masukkan password untuk melanjutkan.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">Password Admin</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-[#234832] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-white/20"
                placeholder="Masukkan password..."
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-background-dark font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-2"
            >
              Masuk Dashboard
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-white/30">
            &copy; 2025 Sistem E-Voting OPPN & GUDEP Periode 2026/2027
          </p>
        </div>
      </div>
    );
  }

  const getPercentage = (votes: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  // Group candidates by role/category
  const groupedCandidates = {
    [CATEGORY_LABELS[VotingStep.OPPN_PUTRA]]: candidates.filter(c => c.role === CATEGORY_LABELS[VotingStep.OPPN_PUTRA]),
    [CATEGORY_LABELS[VotingStep.OPPN_PUTRI]]: candidates.filter(c => c.role === CATEGORY_LABELS[VotingStep.OPPN_PUTRI]),
    [CATEGORY_LABELS[VotingStep.GUDEP]]: candidates.filter(c => c.role === CATEGORY_LABELS[VotingStep.GUDEP]),
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col font-display text-white overflow-x-hidden">
      {/* Top Navigation */}
      <header className="w-full border-b border-[#234832] bg-background-dark/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
              <img src="https://res.cloudinary.com/dnnuqxs7g/image/upload/v1765542749/LOGONH_jj5r9f.png" alt="Logo" className="w-full h-full object-cover p-0.5" />
            </div>
            <h1 className="text-white text-lg font-bold tracking-tight">E-Voting Pondok Pesantren Nurul Huda</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className={`hidden md:flex text-sm font-medium mr-2 items-center gap-2 ${isVotingClosed ? 'text-red-400' : 'text-[#92c9a8]'}`}>
              {isVotingClosed ? (
                <Lock size={14} />
              ) : (
                <Activity size={14} className={isUpdating ? "animate-pulse text-primary" : "text-white/20"} />
              )}
              {isVotingClosed ? 'Data Finalized' : 'Last updated:'}
              <span className="font-mono">{formatTime(lastUpdated)}</span>
            </span>

            {/* Demo Toggle for Voting Closed State */}
            <button
              onClick={() => setIsVotingClosed(!isVotingClosed)}
              className={`flex items-center justify-center size-10 rounded-full transition-all border ${isVotingClosed ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-[#234832] border-transparent text-white/50 hover:text-white'}`}
              title={isVotingClosed ? "Re-open Voting (Demo)" : "Close Voting (Demo)"}
            >
              {isVotingClosed ? <Lock size={18} /> : <Unlock size={18} />}
            </button>

            <button
              onClick={() => {
                if (!isVotingClosed) {
                  setIsUpdating(true);
                  setTimeout(() => { setIsUpdating(false); setLastUpdated(new Date()); }, 500);
                }
              }}
              disabled={isVotingClosed}
              className={`flex items-center justify-center size-10 rounded-full bg-[#234832] hover:bg-[#234832]/80 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isUpdating ? 'animate-spin text-primary ring-2 ring-primary/20' : ''}`}
              title="Refresh Data"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col gap-8">

        {/* Voting Closed Banner */}
        {isVotingClosed && (
          <div className="w-full bg-red-500/10 border border-red-500/30 rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 animate-in slide-in-from-top-4 duration-500">
            <div className="size-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
              <ShieldCheck size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg md:text-xl">Pemungutan Suara Telah Ditutup</h3>
              <p className="text-red-200/70 text-sm md:text-base mt-1">
                Sesi pemilihan telah berakhir secara resmi. Data yang ditampilkan di bawah ini adalah <strong>hasil final</strong> dan telah diverifikasi oleh panitia pemilihan.
              </p>
            </div>
            <div className="px-4 py-2 rounded-lg bg-red-500/20 text-red-500 font-mono font-bold text-sm border border-red-500/30 whitespace-nowrap">
              STATUS: FINAL
            </div>
          </div>
        )}

        {/* Page Heading & Status */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              {isVotingClosed ? (
                <>
                  <span className="flex h-3 w-3 relative items-center justify-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                  </span>
                  <span className="text-red-500 text-xs font-bold uppercase tracking-wider">Hasil Resmi & Final</span>
                </>
              ) : (
                <>
                  <span className="flex h-3 w-3 relative">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                  <span className="text-primary text-xs font-bold uppercase tracking-wider">Live Counting</span>
                </>
              )}
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
              {isVotingClosed ? 'Hasil Akhir Pemilihan' : 'Hasil Perhitungan Suara'}
            </h2>
            <p className="text-[#92c9a8] text-lg mt-1 max-w-2xl">
              Pemilihan Ketua Organisasi Pelajar Pondok Pesantren Nurul Huda & Gugus Depan Periode 2026/2027
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-xs text-[#92c9a8] uppercase font-bold tracking-wider">Session ID</span>
              <span className="text-white font-mono text-sm">#VOTE-2025-NHM-001</span>
            </div>
          </div>
        </section>

        {/* Key Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-dark border border-[#234832] rounded-xl p-6 flex flex-col justify-between h-36 relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="absolute right-[-20px] top-[-20px] text-[#234832] opacity-50 group-hover:scale-110 transition-transform duration-500">
              <BarChart2 size={120} />
            </div>
            <p className="text-[#92c9a8] font-medium z-10">Total Suara Masuk</p>
            <div className="flex items-end gap-2 z-10">
              <p className="text-white text-4xl font-bold tracking-tight">
                <CountUp value={totalVotes} />
              </p>
              <p className="text-sm text-[#92c9a8] mb-2">suara</p>
            </div>
          </div>

          <div className="bg-surface-dark border border-[#234832] rounded-xl p-6 flex flex-col justify-between h-36 relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="absolute right-[-20px] top-[-20px] text-[#234832] opacity-50 group-hover:scale-110 transition-transform duration-500">
              <Users size={120} />
            </div>
            <p className="text-[#92c9a8] font-medium z-10">Partisipasi Santri</p>
            <div className="flex items-end gap-2 z-10">
              <p className="text-white text-4xl font-bold tracking-tight">{participationRate}%</p>
              {isVotingClosed ? (
                <div className="flex items-center text-slate-400 text-sm mb-2 gap-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                  <CheckCircle2 size={12} />
                  <span className="text-xs font-bold">Final</span>
                </div>
              ) : (
                <div className="flex items-center text-primary text-sm mb-2 gap-1 bg-primary/10 px-2 py-0.5 rounded-full animate-pulse">
                  <span className="text-xs font-bold">Live</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface-dark border border-[#234832] rounded-xl p-6 flex flex-col justify-between h-36 relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="absolute right-[-20px] top-[-20px] text-[#234832] opacity-50 group-hover:scale-110 transition-transform duration-500">
              <Clock size={120} />
            </div>
            <p className="text-[#92c9a8] font-medium z-10">{isVotingClosed ? 'Waktu Selesai' : 'Sisa Waktu Voting'}</p>
            <div className="flex items-end gap-2 z-10">
              {isVotingClosed ? (
                <p className="text-red-400 text-4xl font-bold tracking-tight">Selesai</p>
              ) : (
                <p className="text-white text-4xl font-bold tracking-tight font-mono">{timeLeft}</p>
              )}
            </div>
          </div>
        </section>

        {/* Main Content Split: Categories */}
        <div className="grid grid-cols-1 gap-12">
          {Object.entries(groupedCandidates).map(([categoryName, categoryCandidates]) => {
            // Calculate total votes for this category
            const categoryTotalVotes = categoryCandidates.reduce((acc, curr) => acc + curr.votes, 0);

            // Sort by votes
            const sortedCategoryCandidates = [...categoryCandidates].sort((a, b) => b.votes - a.votes);

            return (
              <div key={categoryName} className="flex flex-col gap-6">
                <div className="flex items-center justify-between pb-2 border-b border-[#234832]">
                  <h3 className="text-2xl font-black text-primary uppercase tracking-wider flex items-center gap-3">
                    <span className="size-3 rounded-full bg-primary inline-block"></span>
                    {categoryName}
                  </h3>
                  <div className="text-sm font-mono text-[#92c9a8]">
                    Total Suara: <span className="text-white font-bold">{categoryTotalVotes}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Candidate Lists */}
                  <div className="lg:col-span-8 flex flex-col gap-4">
                    {sortedCategoryCandidates.map((candidate, index) => {
                      const isLeader = index === 0 && categoryTotalVotes > 0;
                      const percentage = getPercentage(candidate.votes, categoryTotalVotes);

                      if (isLeader) {
                        return (
                          <div key={candidate.id} className={`bg-surface-dark border rounded-2xl p-4 md:p-6 relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(43,238,121,0.1)] ${isVotingClosed ? 'border-primary shadow-[0_0_20px_rgba(43,238,121,0.15)]' : 'border-primary/30'}`}>
                            {isVotingClosed ? (
                              <div className="absolute top-0 right-0 bg-primary text-black text-xs font-bold px-6 py-2 rounded-bl-xl z-20 shadow-lg flex items-center gap-2">
                                <CheckCircle2 size={14} />
                                WINNER
                              </div>
                            ) : (
                              <div className="absolute top-0 right-0 bg-primary text-black text-xs font-bold px-4 py-1 rounded-bl-xl z-20 shadow-lg">
                                LEADING
                              </div>
                            )}

                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/10 to-transparent z-0"></div>

                            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                              <div className="relative shrink-0">
                                <div className="size-24 md:size-28 rounded-full border-4 border-primary p-1 shadow-[0_0_20px_rgba(43,238,121,0.2)]">
                                  <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${candidate.image}')` }}></div>
                                </div>
                                <div className="absolute -bottom-2 -right-0 bg-primary text-black size-8 rounded-full flex items-center justify-center font-bold text-lg border-2 border-surface-dark z-20">
                                  {index + 1}
                                </div>
                              </div>

                              <div className="flex-1 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="text-2xl font-bold text-white leading-tight">{candidate.pairName}</h4>
                                    <p className="text-[#92c9a8] text-sm">No. Urut {candidate.name.replace('No. ', '')}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className="block text-4xl font-black text-primary transition-all duration-300">
                                      {percentage}%
                                    </span>
                                    <span className="text-sm text-white/60 font-mono">
                                      <CountUp value={candidate.votes} /> Suara
                                    </span>
                                  </div>
                                </div>
                                {/* Animated Progress Bar */}
                                <div className="w-full h-4 bg-[#234832] rounded-full overflow-hidden">
                                  <div
                                    className={`h-full bg-primary rounded-full relative transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(43,238,121,0.5)]`}
                                    style={{ width: `${percentage}%` }}
                                  >
                                    {!isVotingClosed && (
                                      <>
                                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 animate-pulse"></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={candidate.id} className={`bg-surface-dark border rounded-2xl p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-5 transition-all duration-500 hover:bg-[#1a3526] ${isVotingClosed ? 'border-[#234832] opacity-80' : 'border-[#234832] hover:border-[#234832]/80'}`}>
                          <div className="relative shrink-0">
                            <div className="size-20 rounded-full border-2 border-[#234832] p-0.5">
                              <div className="w-full h-full rounded-full bg-cover bg-center grayscale opacity-80" style={{ backgroundImage: `url('${candidate.image}')` }}></div>
                            </div>
                            <div className="absolute -bottom-1 -right-0 bg-[#234832] text-white size-7 rounded-full flex items-center justify-center font-bold text-sm border-2 border-surface-dark">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-lg font-bold text-white leading-tight">{candidate.pairName}</h4>
                                <p className="text-[#92c9a8] text-sm">No. Urut {candidate.name.replace('No. ', '')}</p>
                              </div>
                              <div className="text-right">
                                <span className="block text-2xl font-bold text-white transition-all duration-300">
                                  {percentage}%
                                </span>
                                <span className="text-xs text-white/50 font-mono">
                                  <CountUp value={candidate.votes} /> Suara
                                </span>
                              </div>
                            </div>
                            <div className="w-full h-3 bg-[#234832] rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${percentage}%`, backgroundColor: candidate.color }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mini Charts per Category */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-surface-dark border border-[#234832] rounded-2xl p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
                      <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Distribusi {categoryName}</h4>
                      <div className="w-full h-48 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={sortedCategoryCandidates}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="votes"
                              nameKey="pairName"
                              animationDuration={1000}
                            >
                              {sortedCategoryCandidates.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-[10px] text-[#92c9a8] font-medium uppercase">Total</span>
                          <span className="text-2xl font-black text-white">{categoryTotalVotes}</span>
                        </div>
                      </div>
                      <div className="w-full grid grid-cols-1 gap-2 mt-4">
                        {sortedCategoryCandidates.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-xs group cursor-default">
                            <div className="flex items-center gap-2 truncate">
                              <div className="size-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                              <span className="text-white/80 truncate max-w-[120px]">{item.pairName}</span>
                            </div>
                            <span className="font-bold text-white">{getPercentage(item.votes, categoryTotalVotes)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <footer className="mt-auto border-t border-[#234832] pt-8 pb-4 flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-2 opacity-50">
            <div className="size-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
              <img src="https://res.cloudinary.com/dnnuqxs7g/image/upload/v1765542749/LOGONH_jj5r9f.png" alt="Logo" className="w-full h-full object-cover p-0.5" />
            </div>
            <span className="text-white font-bold text-sm">Pondok Pesantren Nurul Huda</span>
          </div>
          <p className="text-white/40 text-xs">
            © 2025 Tim IT Pondok Pesantren Nurul Huda <br />
            Sistem E-Voting Ver. 2.4.1 (Stable)
          </p>
        </footer>
      </main>
    </div>
  );
};

export default ResultsPage;