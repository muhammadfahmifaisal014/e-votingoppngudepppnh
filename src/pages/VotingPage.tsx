import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Vote, User, Info, CheckCircle, ArrowRight, ArrowLeft, X, Quote, Clock, AlertCircle } from 'lucide-react';
import { Candidate, VotingStep, UserRole } from '../types';

// Mock Data
import { CANDIDATES_DATA } from '../data';

const ALL_STEPS = [
    { id: VotingStep.OPPN_PUTRA, label: "OPPN Putra" },
    { id: VotingStep.OPPN_PUTRI, label: "OPPN Putri" },
    { id: VotingStep.GUDEP, label: "GUDEP" },
];

const TIME_LIMIT_PER_STEP = 120; // 2 minutes in seconds

const VotingPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = location.state?.token;
    const role = location.state?.role as UserRole | undefined;

    // Redirect if no token (security)
    useEffect(() => {
        if (!token) navigate('/verify');
    }, [token, navigate]);

    // Filter Steps based on Role
    const filteredSteps = useMemo(() => {
        if (!role) return ALL_STEPS; // Default if undefined

        switch (role) {
            case 'PUTRA':
                return ALL_STEPS.filter(step => step.id === VotingStep.OPPN_PUTRA || step.id === VotingStep.GUDEP);
            case 'PUTRI':
                return ALL_STEPS.filter(step => step.id === VotingStep.OPPN_PUTRI || step.id === VotingStep.GUDEP);
            case 'GURU':
                return ALL_STEPS;
            default:
                return ALL_STEPS;
        }
    }, [role]);

    const [currentStep, setCurrentStep] = useState<number>(0);
    const [selections, setSelections] = useState<Record<string, string>>({});
    const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null);
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_PER_STEP);

    // Safety check
    const stepData = filteredSteps[currentStep];

    // If stepData is somehow undefined (e.g. index out of bounds), handle gracefully
    if (!stepData) {
        return <div className="min-h-screen bg-background-dark flex items-center justify-center text-white">Loading...</div>;
    }

    const candidates = CANDIDATES_DATA[stepData.id as VotingStep];

    // Timer Logic
    useEffect(() => {
        setTimeLeft(TIME_LIMIT_PER_STEP); // Reset on step change

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentStep]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const isTimeCritical = timeLeft < 30;
    const isTimeUp = timeLeft === 0;

    const handleSelect = (candidateId: string) => {
        if (isTimeUp) return;
        setSelections(prev => ({ ...prev, [stepData.id]: candidateId }));
    };

    const handleNext = () => {
        if (currentStep < filteredSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
        } else {
            navigate('/confirm', { state: { selections, token, role } });
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="bg-background-dark min-h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-[#234832] bg-background-dark/95 backdrop-blur-md">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary">
                                <Vote size={24} />
                            </div>
                            <div className="hidden xs:block">
                                <h1 className="text-base sm:text-lg font-bold leading-tight tracking-tight text-white">
                                    E-Voting <span className="text-primary">OPPN & GUDEP</span>
                                </h1>
                                <p className="text-[10px] sm:text-xs font-medium text-text-secondary uppercase tracking-wider">Pondok Pesantren Nurul Huda</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4">
                            {/* Timer Badge */}
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${isTimeCritical ? 'bg-red-500/10 border-red-500/50 text-red-500 animate-pulse' : 'bg-surface-dark border-slate-700 text-primary'}`}>
                                <Clock size={16} className={isTimeCritical ? 'animate-bounce' : ''} />
                                <span className="font-mono font-bold text-sm tracking-widest">{formatTime(timeLeft)}</span>
                            </div>

                            <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>

                            <div className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-[#234832] border border-white/5">
                                <span className="text-xs sm:text-sm font-semibold hidden sm:block text-white">Fulan bin Fulan</span>
                                <div className="size-8 rounded-full bg-surface-dark flex items-center justify-center text-primary">
                                    <User size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 gap-8">

                {/* Progress Section */}
                <section className="flex flex-col gap-4">
                    {/* Linear Progress Bar */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-end px-1">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider">
                                Langkah {currentStep + 1} dari {filteredSteps.length}
                            </span>
                            <span className="text-xs font-medium text-text-secondary">
                                {Math.round(((currentStep + 1) / filteredSteps.length) * 100)}% Selesai
                            </span>
                        </div>
                        <div className="h-2 w-full bg-surface-dark rounded-full overflow-hidden border border-slate-800/50">
                            <div
                                className="h-full bg-primary shadow-[0_0_12px_rgba(43,238,121,0.5)] transition-all duration-500 ease-out"
                                style={{ width: `${((currentStep + 1) / filteredSteps.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Visual Stepper */}
                    <nav aria-label="Progress">
                        <div className="bg-surface-dark rounded-2xl p-2 shadow-sm border border-slate-800">
                            <ol className="flex items-center w-full justify-between sm:justify-start">
                                {filteredSteps.map((step, index) => {
                                    const isActive = index === currentStep;
                                    const isCompleted = index < currentStep;

                                    return (
                                        <React.Fragment key={step.id}>
                                            <li className={`relative ${isActive ? 'flex-1' : ''}`}>
                                                <div className={`flex items-center justify-center gap-2 py-2 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap
                                    ${isActive ? 'bg-primary text-background-dark shadow-lg shadow-primary/20' :
                                                        isCompleted ? 'text-primary' : 'text-slate-600'}`}>

                                                    <span className={`flex items-center justify-center size-6 rounded-full text-[10px] sm:text-xs shrink-0 transition-colors
                                    ${isActive ? 'bg-background-dark text-primary' :
                                                            isCompleted ? 'bg-primary/20 text-primary ring-1 ring-primary/30' : 'bg-slate-800 text-slate-500 ring-1 ring-slate-700'}`}>
                                                        {isCompleted ? <CheckCircle size={12} strokeWidth={3} /> : index + 1}
                                                    </span>

                                                    <span className={`${!isActive ? 'hidden sm:block' : 'block'}`}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                            </li>
                                            {index < filteredSteps.length - 1 && (
                                                <li className={`flex-1 border-t-2 mx-2 border-dashed transition-colors duration-300 ${isCompleted ? 'border-primary/50' : 'border-slate-800'}`}></li>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </ol>
                        </div>
                    </nav>
                </section>

                {/* Heading & Time Warning */}
                <section className="space-y-2 text-center sm:text-left">
                    {isTimeUp && (
                        <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 animate-in slide-in-from-top-2">
                            <AlertCircle className="text-red-500 shrink-0" />
                            <div>
                                <h4 className="text-red-500 font-bold text-sm">Waktu Habis!</h4>
                                <p className="text-red-400 text-xs">Waktu pemilihan untuk sesi ini telah berakhir. Silakan hubungi panitia atau refresh halaman.</p>
                            </div>
                        </div>
                    )}
                    <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-white">
                        Pemilihan Ketua <span className="text-primary block sm:inline">{stepData.label}</span>
                    </h2>
                    <p className="text-text-secondary text-base sm:text-lg font-normal max-w-2xl">
                        Assalamu’alaikum, Santri. Silahkan pelajari visi misi dan pilih kandidat ketua terbaik untuk masa bakti 2024/2025.
                    </p>
                </section>

                {/* Candidate Grid */}
                <section className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isTimeUp ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                    {candidates.map((candidate) => {
                        const isSelected = selections[stepData.id] === candidate.id;

                        return (
                            <div key={candidate.id}
                                className={`group relative flex flex-col rounded-[2rem] p-6 transition-all duration-300 
                         ${isSelected
                                        ? 'bg-surface-dark border-2 border-primary shadow-2xl shadow-primary/10 scale-[1.02]'
                                        : 'bg-surface-dark border border-slate-700 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1'
                                    }`}>

                                {isSelected && (
                                    <div className="absolute top-0 right-0 z-10 bg-primary text-surface-dark font-bold text-xs px-4 py-2 rounded-bl-2xl rounded-tr-2xl">
                                        <div className="flex items-center gap-1">
                                            <CheckCircle size={14} />
                                            <span>Pilihanmu</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col items-center gap-4 pb-4">
                                    <div className="relative">
                                        <div className={`size-32 rounded-full p-1 ${isSelected ? 'bg-gradient-to-tr from-primary to-green-300' : 'bg-gradient-to-tr from-slate-700 to-slate-800'}`}>
                                            <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${candidate.image}')` }}></div>
                                        </div>
                                        <div className={`absolute -bottom-2 -right-2 font-black text-xl size-10 flex items-center justify-center rounded-full border-4 border-surface-dark shadow-lg ${isSelected ? 'bg-primary text-background-dark' : 'bg-white text-background-dark'}`}>
                                            {candidate.number}
                                        </div>
                                    </div>
                                    <div className="text-center space-y-1 mt-2">
                                        <h3 className="text-xl font-bold text-white">{candidate.name}</h3>
                                        <p className="text-sm font-medium text-text-secondary">{candidate.class}</p>
                                    </div>
                                </div>

                                {/* Short Visi Preview */}
                                <div className="bg-black/20 rounded-2xl p-4 mb-4 relative min-h-[5rem] flex items-center justify-center">
                                    <Quote size={16} className="text-primary/40 absolute top-3 left-3" />
                                    <p className="text-text-secondary text-sm italic text-center px-2 line-clamp-3">
                                        "{candidate.vision || "Berkhidmah untuk pondok dengan sepenuh hati."}"
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-auto flex flex-col gap-3">
                                    <button
                                        onClick={() => setViewingCandidate(candidate)}
                                        className="w-full py-2 rounded-xl border border-[#326747] text-[#92c9a8] text-xs font-bold uppercase tracking-wider hover:bg-[#326747]/20 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Info size={16} />
                                        Lihat Detail Visi Misi
                                    </button>

                                    <button
                                        onClick={() => handleSelect(candidate.id)}
                                        disabled={isTimeUp}
                                        className={`w-full py-3 rounded-xl font-bold text-center border-2 border-transparent transition-all flex items-center justify-center gap-2
                                    ${isSelected
                                                ? 'bg-primary text-background-dark shadow-lg shadow-primary/25'
                                                : 'bg-background-dark text-slate-400 hover:bg-slate-800'}
                                    ${isTimeUp ? 'cursor-not-allowed opacity-50' : ''}
                                    `}
                                    >
                                        {isSelected ? (
                                            <>
                                                <CheckCircle size={20} />
                                                <span>Dipilih</span>
                                            </>
                                        ) : (
                                            <span>Pilih Kandidat</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </section>
            </main>

            {/* Detail Modal */}
            {viewingCandidate && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 px-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setViewingCandidate(null)}></div>
                    <div className="relative w-full max-w-lg bg-[#162e21] border border-[#234832] rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-[fadeIn_0.2s_ease-out] ring-1 ring-white/10">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#162e21] shrink-0">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <User className="text-primary" size={20} />
                                Profil Kandidat
                            </h3>
                            <button onClick={() => setViewingCandidate(null)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                            {/* Candidate Identity */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                                <div className="size-24 shrink-0 rounded-full border-4 border-primary/20 p-1 bg-surface-dark">
                                    <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${viewingCandidate.image}')` }}></div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                                        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/20">
                                            No. Urut {viewingCandidate.number}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white leading-tight mb-1">{viewingCandidate.name}</h2>
                                    <p className="text-text-secondary text-sm font-medium">{viewingCandidate.class}</p>
                                </div>
                            </div>

                            {/* Vision */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                                    <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Visi Utama</h4>
                                </div>
                                <div className="bg-black/20 p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                                    <Quote className="absolute top-2 right-4 text-white/5 rotate-180" size={48} />
                                    <p className="text-gray-200 text-lg italic leading-relaxed relative z-10">
                                        "{viewingCandidate.vision || "Berkhidmah untuk pondok dengan sepenuh hati."}"
                                    </p>
                                </div>
                            </div>

                            {/* Missions */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                                    <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Misi Program</h4>
                                </div>
                                <ul className="grid gap-3">
                                    {viewingCandidate.missions?.map((mission, idx) => (
                                        <li key={idx} className="flex gap-4 text-gray-300 text-sm leading-relaxed bg-surface-dark p-4 rounded-xl border border-white/5 hover:border-primary/20 transition-colors">
                                            <div className="size-6 shrink-0 rounded-full bg-primary text-background-dark flex items-center justify-center text-xs font-bold mt-0.5 shadow-lg shadow-primary/20">
                                                {idx + 1}
                                            </div>
                                            <span className="font-medium">{mission}</span>
                                        </li>
                                    )) || <li className="text-gray-500 italic">Tidak ada data misi.</li>}
                                </ul>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-white/5 bg-[#112218] flex gap-3 shrink-0">
                            <button
                                onClick={() => setViewingCandidate(null)}
                                className="flex-1 py-3.5 rounded-xl font-bold text-gray-400 bg-transparent border border-white/10 hover:bg-white/5 transition-colors"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => {
                                    if (!isTimeUp) {
                                        handleSelect(viewingCandidate.id);
                                        setViewingCandidate(null);
                                    }
                                }}
                                disabled={isTimeUp}
                                className={`flex-[2] py-3.5 rounded-xl font-bold text-background-dark shadow-[0_0_20px_rgba(43,238,121,0.2)] transition-all flex items-center justify-center gap-2 active:scale-[0.98]
                            ${isTimeUp ? 'bg-gray-600 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover'}
                        `}
                            >
                                <CheckCircle size={20} />
                                Pilih Kandidat
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Action Bar */}
            <footer className="sticky bottom-0 z-40 bg-background-dark/80 backdrop-blur-lg border-t border-[#234832] py-4 px-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                    <button
                        onClick={handleBack}
                        className="flex items-center justify-center h-12 px-6 rounded-full bg-[#234832] text-text-secondary font-bold text-sm sm:text-base hover:bg-[#2f5c42] transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        <span>Kembali</span>
                    </button>
                    <div className="text-xs text-text-secondary font-medium hidden xs:block sm:hidden">
                        {currentStep + 1} dari {filteredSteps.length} Selesai
                    </div>
                    <button
                        onClick={handleNext}
                        disabled={!selections[stepData.id]}
                        className={`flex-1 sm:flex-none sm:min-w-[160px] flex items-center justify-center h-12 px-8 rounded-full font-bold text-sm sm:text-base shadow-lg transition-all
                    ${selections[stepData.id]
                                ? 'bg-primary text-background-dark shadow-primary/20 hover:bg-primary-dark hover:shadow-primary/40 hover:-translate-y-0.5'
                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
                `}
                    >
                        <span>Lanjut</span>
                        <ArrowRight size={20} className="ml-2" />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default VotingPage;