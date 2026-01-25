import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Key, ArrowRight, Lock, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { verifyToken } from '../services/googleSheets';

const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (token.trim().length === 0) {
      setError('Token tidak boleh kosong');
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyToken(token);

      if (result.valid) {
        // Navigate to vote page with token and user info
        navigate('/vote', {
          state: {
            token: token,
            studentName: result.studentName,
            studentClass: result.studentClass,
            role: result.role
          }
        });
      } else {
        setError(result.message || 'Token tidak valid atau sudah digunakan.');
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background-dark font-display min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300">
      {/* Background Pattern & Glow Effects */}
      <div className="absolute inset-0 z-0 opacity-[0.07] bg-islamic-pattern pointer-events-none animate-pulse-slow"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none animate-float"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-float-delayed"></div>

      <main className="w-full max-w-md px-6 z-10 flex flex-col items-center gap-8 py-10 animate-in fade-in zoom-in duration-500">
        {/* Verification Card */}
        <div className="w-full bg-surface-dark/40 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl p-8 sm:p-10 flex flex-col items-center relative overflow-hidden group hover:border-primary/30 transition-colors duration-500">

          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

          {/* Header */}
          <div className="flex flex-col items-center text-center gap-6 mb-8 group-hover:-translate-y-1 transition-transform duration-300">
            <div className="relative">
              <div className="absolute inset-0 bg-primary blur-xl opacity-20"></div>
              <div className="relative size-20 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center border border-primary/20 shadow-inner ring-1 ring-white/5">
                <ShieldCheck className="text-primary drop-shadow-[0_0_10px_rgba(43,238,121,0.5)]" size={36} />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-primary text-xs font-bold tracking-[0.2em] uppercase">E-Voting Portal</h2>
              <h1 className="text-white text-3xl font-black tracking-tight">Verifikasi Token</h1>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
            <div className="relative group/input">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur opacity-0 group-hover/input:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center bg-[#0f1f15] rounded-2xl border border-white/5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-14 flex items-center justify-center border-r border-white/5 bg-white/5 text-gray-400">
                  <Key size={20} />
                </div>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value.toUpperCase())}
                  className="w-full bg-transparent text-white text-lg font-bold tracking-[0.15em] placeholder:text-gray-600 placeholder:tracking-normal placeholder:font-normal h-16 pl-16 pr-6 focus:outline-none uppercase"
                  placeholder="KODE-TOKEN"
                  disabled={isLoading}
                  spellCheck={false}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs font-semibold bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-in slide-in-from-top-1">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full overflow-hidden bg-primary hover:bg-primary-hover text-background-dark font-black text-base h-14 rounded-2xl shadow-[0_0_20px_rgba(43,238,121,0.3)] hover:shadow-[0_0_30px_rgba(43,238,121,0.5)] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group/btn disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk & Pilih</span>
                  <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" size={20} />
                </>
              )}
              <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 ease-in-out"></div>
            </button>
          </form>

          {/* Security Badge */}
          <div className="mt-8 flex items-center justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
            <div className="p-1.5 rounded-full bg-white/5">
              <Lock size={12} className="text-primary" />
            </div>
            <span className="text-[10px] text-gray-400 font-mono tracking-wider">SECURE CONNECTION ENCRYPTED</span>
          </div>
        </div>

        <footer className="text-center space-y-2 opacity-50 hover:opacity-100 transition-opacity">
          <p className="text-[10px] text-slate-500 font-mono">
            ID SYSTEM: EVT-2024-NH-SECURE
          </p>
        </footer>
      </main>

      <style>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(-20px, -20px); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(20px, 20px); }
                }
                .animate-float { animation: float 10s ease-in-out infinite; }
                .animate-float-delayed { animation: float-delayed 12s ease-in-out infinite; }
            `}</style>
    </div>
  );
};

export default VerificationPage;