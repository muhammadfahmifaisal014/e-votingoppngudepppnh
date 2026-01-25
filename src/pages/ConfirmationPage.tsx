import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Vote, Lock, Edit, Send, AlertTriangle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CANDIDATES_DATA } from '../data';
import { VotingStep, Candidate } from '../types';
import { submitVote } from '../services/googleSheets';

interface CandidateCardProps {
    candidate: Candidate;
    roleLabel: string;
    isSubmitting: boolean;
    onEdit: () => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
    candidate,
    roleLabel,
    isSubmitting,
    onEdit
}) => (
    <div className="group relative flex flex-col gap-4 rounded-xl p-5 bg-surface-dark shadow-sm border border-[#234832] hover:border-primary/50 transition-all duration-300">
        <div
            className="w-full aspect-[4/3] rounded-lg bg-surface-dark-accent bg-cover bg-center overflow-hidden relative"
            style={{ backgroundImage: `url("${candidate.image}")` }}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <span className="absolute bottom-3 left-3 bg-primary text-background-dark text-xs font-bold px-2 py-1 rounded-md">
                No. {candidate.number}
            </span>
        </div>
        <div className="flex flex-col gap-1">
            <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider">{roleLabel}</p>
            <h3 className="text-xl font-bold text-white leading-tight">{candidate.name}</h3>
            <p className="text-text-secondary text-sm">{candidate.class}</p>
        </div>
        <button
            onClick={onEdit}
            disabled={isSubmitting}
            className="mt-auto w-full py-2 px-4 rounded-full border border-[#234832] text-text-secondary text-sm font-medium hover:bg-surface-dark-accent hover:text-white transition-colors flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <span>Ubah Pilihan</span>
            <Edit size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
    </div>
);

const ConfirmationPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Derived State
    const selections = location.state?.selections as Record<string, string> | undefined;

    // Redirect if no selections found (e.g., direct access)
    useEffect(() => {
        if (!selections) {
            navigate('/vote');
        }
    }, [selections, navigate]);

    if (!selections) return null;

    // Helper to find candidate
    const getSelectedCandidate = (step: VotingStep) => {
        const candidateId = selections[step];
        const stepCandidates = CANDIDATES_DATA[step];
        return stepCandidates.find(c => c.id === candidateId);
    };

    const selectedCandidates = [
        {
            step: VotingStep.OPPN_PUTRA,
            label: 'Ketua OPPN Putra',
            data: getSelectedCandidate(VotingStep.OPPN_PUTRA)
        },
        {
            step: VotingStep.OPPN_PUTRI,
            label: 'Ketua OPPN Putri',
            data: getSelectedCandidate(VotingStep.OPPN_PUTRI)
        },
        {
            step: VotingStep.GUDEP,
            label: 'Ketua Gudep',
            data: getSelectedCandidate(VotingStep.GUDEP)
        }
    ].filter(item => item.data); // Filter out potentially undefined if step skipped (though logic prevents skipping)

    const token = location.state?.token;

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // Get raw selections (IDs)
            const rawSelections = selections;

            // Call API
            const result = await submitVote(token || 'UNKNOWN_TOKEN', rawSelections);

            if (!result.success && !result.message.includes('Demo')) {
                alert('Gagal menyimpan suara: ' + result.message);
                setIsSubmitting(false);
                return;
            }

            // Success Animation
            const duration = 2000;
            const end = Date.now() + duration;

            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#2bee79', '#ffffff', '#92c9a8'],
                    zIndex: 100
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#2bee79', '#ffffff', '#92c9a8'],
                    zIndex: 100
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            })();

            setTimeout(() => {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#2bee79', '#ffffff'],
                    zIndex: 100
                });
            }, 200);

            setTimeout(() => {
                navigate('/');
            }, 2500);

        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan jaringan.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-background-dark min-h-screen flex flex-col relative overflow-x-hidden">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 bg-islamic-pattern"></div>

            <div className="flex h-full grow flex-col relative z-10">
                {/* Navbar */}
                <header className="w-full border-b border-[#234832] bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                <Vote size={20} />
                            </div>
                            <h2 className="text-base sm:text-lg font-bold leading-tight tracking-tight text-white">
                                E-Voting OPPN & GUDEP
                            </h2>
                        </div>
                        <div className="hidden sm:flex bg-surface-dark-accent rounded-full px-3 py-1 items-center gap-2">
                            <Lock size={14} className="text-primary" />
                            <span className="text-xs font-bold text-white">Secure</span>
                        </div>
                    </div>
                </header>

                <div className="px-4 sm:px-6 lg:px-8 flex flex-1 justify-center py-6 sm:py-8">
                    <div className="flex flex-col max-w-2xl w-full flex-1 gap-8">
                        {/* Progress Bar */}
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-6 justify-between items-end">
                                <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">Langkah 3 dari 3</p>
                                <p className="text-primary font-bold text-sm">Konfirmasi</p>
                            </div>
                            <div className="rounded-full bg-surface-dark-accent h-2 overflow-hidden">
                                <div className="h-full rounded-full bg-primary shadow-[0_0_15px_rgba(43,238,121,0.3)] transition-all duration-500 ease-out" style={{ width: '100%' }}></div>
                            </div>
                        </div>

                        {/* Page Heading */}
                        <div className="flex flex-col gap-2 text-center sm:text-left">
                            <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-white">
                                Konfirmasi Pilihan Anda
                            </h1>
                            <p className="text-text-secondary text-base sm:text-lg font-normal leading-relaxed">
                                Silakan periksa kembali pilihan Anda. Pastikan kandidat yang dipilih untuk OPPN dan GUDEP sudah sesuai dengan hati nurani Anda.
                            </p>
                        </div>

                        {/* Candidates Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {selectedCandidates.map((item) => (
                                <CandidateCard
                                    key={item.data!.id}
                                    candidate={item.data!}
                                    roleLabel={item.label}
                                    isSubmitting={isSubmitting}
                                    onEdit={() => !isSubmitting && navigate('/vote')}
                                />
                            ))}
                        </div>

                        {/* Warning Banner */}
                        <div className="rounded-xl bg-[#332415] border border-orange-900/50 p-4 flex items-start gap-4 shadow-sm">
                            <div className="bg-orange-900/30 p-2 rounded-full shrink-0 text-orange-400">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h4 className="text-orange-200 font-bold text-base mb-1">Suara tidak dapat diubah</h4>
                                <p className="text-orange-400/80 text-sm leading-snug">
                                    Setelah Anda menekan tombol kirim, data suara akan terkunci secara permanen di sistem blockchain dan tidak dapat disunting kembali.
                                </p>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="flex flex-col gap-4 mt-4 pb-10">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`relative group w-full bg-primary hover:bg-primary-dark text-background-dark text-lg font-bold py-4 px-6 rounded-full shadow-[0_0_20px_rgba(43,238,121,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden
                                ${isSubmitting ? 'cursor-not-allowed opacity-90' : ''}
                            `}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={24} className="animate-spin text-background-dark" />
                                        <span className="relative z-10">Sedang Mengirim...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="relative z-10">Kirim Suara Sekarang</span>
                                        <Send size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                        {/* Glossy effect overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    </>
                                )}
                            </button>
                            <button onClick={() => !isSubmitting && navigate('/vote')} disabled={isSubmitting} className="w-full py-3 text-text-secondary font-medium text-sm hover:text-white transition-colors disabled:opacity-50">
                                Kembali ke Halaman Sebelumnya
                            </button>
                        </div>

                        {/* Footer */}
                        <footer className="text-center py-6 border-t border-[#234832]/50">
                            <p className="text-slate-600 text-xs">
                                © 2025 Pondok Pesantren Nurul Huda Malati. <br className="sm:hidden" /> All rights reserved.
                            </p>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPage;