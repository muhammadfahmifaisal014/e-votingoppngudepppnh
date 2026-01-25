import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Vote, Lock, Activity, Smartphone, ArrowRight, ShieldCheck, UserCheck, Calendar, Clock, ChevronDown, Moon, Sun, BarChart2 } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const LandingPage: React.FC = () => {
  const [offsetY, setOffsetY] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax Effect
  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Countdown Logic (Dummy Date)
  const calculateTimeLeft = () => {
    const difference = +new Date("2025-12-31") - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<any>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });



  return (
    <div className={`relative min-h-screen flex flex-col w-full overflow-x-hidden font-display transition-colors duration-500
            ${isDarkMode ? 'bg-background-dark text-white selection:bg-primary selection:text-background-dark' : 'bg-slate-50 text-slate-900 selection:bg-primary selection:text-white'}
        `}>
      {/* Background Layers */}
      <div
        className={`absolute inset-0 z-0 bg-islamic-pattern pointer-events-none transition-opacity duration-500
                    ${isDarkMode ? 'opacity-5' : 'opacity-[0.03] invert'}
                `}
        style={{ transform: `translateY(${offsetY * 0.5}px)` }}
      ></div>
      <div className={`fixed top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] pointer-events-none animate-pulse-slow transition-colors duration-500
                 ${isDarkMode ? 'bg-primary/10' : 'bg-green-400/20'}
             `}></div>
      <div className={`fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] pointer-events-none animate-pulse-slow delay-700 transition-colors duration-500
                 ${isDarkMode ? 'bg-[#234832]/20' : 'bg-blue-400/10'}
             `}></div>

      {/* Navigation Bar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md border-b
                ${isDarkMode ? 'bg-background-dark/80 border-white/5' : 'bg-white/80 border-slate-200'}
            `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Identity */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="flex items-center gap-2">
                <div className={`relative size-10 rounded-full border flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-105 transition-all duration-300
                                    ${isDarkMode ? 'bg-surface-dark border-primary/20 shadow-[0_0_15px_rgba(43,238,121,0.1)]' : 'bg-white border-primary/30 shadow-primary/10'}
                                `}>
                  <img src="https://res.cloudinary.com/dnnuqxs7g/image/upload/v1765542749/LOGONH_jj5r9f.png" alt="Logo NH" className="w-full h-full object-cover p-0.5" />
                </div>
                <div className={`relative size-10 rounded-full border hidden sm:flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-105 transition-all duration-300
                                    ${isDarkMode ? 'bg-surface-dark border-primary/20 shadow-[0_0_15px_rgba(43,238,121,0.1)]' : 'bg-white border-primary/30 shadow-primary/10'}
                                `}>
                  <img src="https://res.cloudinary.com/dnnuqxs7g/image/upload/v1765971820/logo_pergarus_vahk2u.png" alt="Logo Pergarus" className="w-full h-full object-cover p-0.5" />
                </div>
              </div>
              <div className="flex flex-col">
                <h2 className={`text-base sm:text-lg font-bold tracking-tight leading-none group-hover:text-primary transition-colors duration-300
                                    ${isDarkMode ? 'text-white' : 'text-slate-900'}
                                `}>
                  PP Nurul Huda
                </h2>
                <span className={`text-[10px] sm:text-xs font-medium tracking-wide mt-0.5
                                    ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}
                                `}>E-VOTE PORTAL</span>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Status Server</span>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-mono opacity-80">ONLINE</span>
                </div>
              </div>
              <Link to="/verify" className="relative group overflow-hidden px-4 sm:px-6 py-2.5 rounded-full bg-primary text-background-dark font-bold text-sm shadow-[0_0_20px_rgba(43,238,121,0.3)] hover:shadow-[0_0_30px_rgba(43,238,121,0.5)] transition-all active:scale-95">
                <span className="relative z-10 flex items-center gap-2">
                  <span>Masuk <span className="hidden sm:inline">Sekarang</span></span> <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col relative z-10">

        {/* Hero Section */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

            {/* Text Content - Animations removed to ensure visibility */}
            <div className="flex flex-col gap-8 text-center lg:text-left">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md self-center lg:self-start transition-colors cursor-default
                                ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'}
                            `}>
                <Activity size={16} className="text-primary animate-pulse" />
                <span className="text-xs font-bold text-primary tracking-wider uppercase">Live Election 2025</span>
              </div>

              <h1 className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1]
                                ${isDarkMode ? 'text-white' : 'text-slate-900'}
                            `}>
                SUARA <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-green-300 to-primary bg-[length:200%_auto] animate-gradient">SANTRI</span> <br />
                MASA DEPAN
              </h1>

              <p className={`text-lg md:text-xl max-w-2xl leading-relaxed mx-auto lg:mx-0
                                ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}
                            `}>
                Gunakan hak pilih Anda dalam pemilihan Ketua OPPN & Gugus Depan Periode 2026/2027.
                Satu suara Anda menentukan arah kepemimpinan Santri Pondok Pesantren Nurul Huda Malati.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 self-center lg:self-start w-full sm:w-auto">
                <Link to="/verify" className="w-full sm:w-auto h-16 px-10 flex items-center justify-center gap-3 rounded-2xl bg-primary hover:bg-primary-hover text-background-dark text-lg font-bold transition-all shadow-[0_0_40px_rgba(43,238,121,0.2)] hover:shadow-[0_0_60px_rgba(43,238,121,0.4)] hover:-translate-y-1 group">
                  Mulai Voting
                  <div className="size-8 bg-black/10 rounded-full flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <ArrowRight className="group-hover:translate-x-0.5 transition-transform" size={18} />
                  </div>
                </Link>
                <Link to="/results" className={`w-full sm:w-auto h-16 px-10 flex items-center justify-center gap-2 rounded-2xl border font-bold transition-colors group
                                    ${isDarkMode ? 'bg-surface-dark border-white/10 text-white hover:bg-white/5' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}
                                `}>
                  <span>Lihat Hasil</span>
                  <BarChart2 size={20} className="group-hover:scale-110 transition-transform text-primary" />
                </Link>
              </div>

              <div className="flex items-center gap-4 justify-center lg:justify-start pt-4 opacity-70">
                <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                  <strong className={`${isDarkMode ? 'text-white' : 'text-slate-900'} block`}>250+ Suara Masuk</strong>
                  Dari Santri, Guru, dan Asatidz
                </div>
              </div>
            </div>

            {/* Interactive Visual/Card */}
            <div className="relative hidden lg:block perspective-1000 delay-200">
              <div className="relative w-full aspect-square max-w-[500px] mx-auto transform-style-3d rotate-y-12 rotate-x-6 hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out">
                {/* Decor Elements */}
                <div className="absolute -top-10 -right-10 size-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 size-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

                {/* Main Card */}
                <div className={`absolute inset-0 backdrop-blur-xl border rounded-[2.5rem] shadow-2xl p-8 flex flex-col justify-between
                                    ${isDarkMode ? 'bg-surface-dark/40 border-white/10' : 'bg-white/60 border-white/50'}
                                `}>
                  <div className="flex justify-between items-start">
                    <div className="size-14 rounded-2xl bg-[#234832] flex items-center justify-center text-primary">
                      <ShieldCheck size={32} />
                    </div>
                    <div className={`px-4 py-1.5 rounded-full border text-xs font-mono
                                            ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-white/80 border-slate-200 text-slate-500'}
                                        `}>
                      SECURE_VOTE_V2
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className={`flex justify-between text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                        <span>Partisipasi</span>
                        <span>86%</span>
                      </div>
                      <div className={`h-3 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-black/20' : 'bg-slate-200'}`}>
                        <div className="h-full bg-primary w-[86%] shadow-[0_0_15px_rgba(43,238,121,0.5)] animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                    <div className={`p-4 rounded-xl border flex items-center gap-4
                                            ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-white border-slate-200 shadow-sm'}
                                        `}>
                      <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                        <Smartphone size={20} />
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Mobile Friendly</h4>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>Akses mudah dari device apapun</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-1/4 -right-8 p-4 rounded-2xl bg-[#1a2c23] border border-primary/30 shadow-xl flex items-center gap-3 transform translate-z-20 animate-float">
                  <div className="size-3 bg-green-500 rounded-full animate-ping"></div>
                  <span className="font-bold text-white text-sm">Live Count Active</span>
                </div>

                <div className={`absolute bottom-1/4 -left-8 p-5 rounded-2xl border shadow-xl transform translate-z-30 animate-float-delayed backdrop-blur-md
                                    ${isDarkMode ? 'bg-surface-dark border-white/10' : 'bg-white border-slate-200'}
                                `}>
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar size={18} className="text-primary" />
                    <span className={`text-xs font-bold uppercase ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Sisa Waktu</span>
                  </div>
                  <div className={`text-2xl font-mono font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {String(timeLeft.days || 0).padStart(2, '0')}:{String(timeLeft.hours || 0).padStart(2, '0')}:{String(timeLeft.minutes || 0).padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50">
            <span className={`text-[10px] uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>Scroll Down</span>
            <ChevronDown size={20} className={`${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`} />
          </div>
        </section>

        {/* Marquee Section */}
        <div className="w-full bg-primary py-3 overflow-hidden rotate-[-1deg] scale-105 shadow-lg relative z-20 my-10">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 mx-4">
                <span className="text-background-dark font-black text-xl md:text-2xl uppercase italic tracking-tighter">PILIH PEMIMPIN TERBAIK</span>
                <span className="size-3 bg-background-dark rounded-full"></span>
                <span className="text-background-dark font-black text-xl md:text-2xl uppercase italic tracking-tighter opacity-50">SALURKAN ASPIRASI</span>
                <span className="size-3 bg-background-dark rounded-full opacity-50"></span>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className={`py-24 px-4 sm:px-6 lg:px-8 backdrop-blur-sm relative scroll-mt-20
                    ${isDarkMode ? 'bg-surface-dark/30' : 'bg-white'}
                `}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <span className="text-primary text-sm font-bold uppercase tracking-widest">Kenapa E-Voting?</span>
              <h2 className={`text-3xl md:text-5xl font-black leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Sistem Demokrasi <span className="text-primary">Modern</span></h2>
              <p className={`max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Platform pemilihan digital yang dirancang khusus untuk integritas, kecepatan, dan kemudahan penggunaan bagi seluruh santri.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Lock,
                  title: "Enkripsi End-to-End",
                  desc: "Data suara Anda dienkripsi secara penuh. Identitas pemilih terpisah dari data suara untuk menjamin kerahasiaan mutlak.",
                  color: "hover:shadow-blue-500/20 hover:border-blue-500/50"
                },
                {
                  icon: Clock,
                  title: "Hasil Real-Time",
                  desc: "Tidak perlu menunggu perhitungan manual berjam-jam. Hasil pemilihan dapat dilihat seketika setelah periode voting ditutup.",
                  color: "hover:shadow-primary/20 hover:border-primary/50"
                },
                {
                  icon: UserCheck,
                  title: "Validasi Unik",
                  desc: "Setiap santri memiliki token unik sekali pakai. Sistem mencegah pemilihan ganda secara otomatis.",
                  color: "hover:shadow-purple-500/20 hover:border-purple-500/50"
                }
              ].map((feature, idx) => (
                <div key={idx} className={`group relative p-8 rounded-3xl border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${feature.color}
                                    ${isDarkMode ? 'bg-surface-dark border-white/5' : 'bg-slate-50 border-slate-200'}
                                `}>
                  <div className={`size-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-background-dark transition-all duration-300
                                        ${isDarkMode ? 'bg-white/5 text-white' : 'bg-white text-slate-900 shadow-sm'}
                                    `}>
                    <feature.icon size={32} />
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h3>
                  <p className={`leading-relaxed font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>{feature.desc}</p>

                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-10 transition-opacity">
                    <feature.icon size={100} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Modern Premium Footer */}
      <footer className={`border-t relative z-10
                ${isDarkMode ? 'bg-[#050b08] border-white/5' : 'bg-slate-50 border-slate-200'}
            `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-start">

            {/* Brand/About */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className={`size-10 rounded-xl flex items-center justify-center overflow-hidden shadow-lg
                                      ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm'}
                                  `}>
                    <img src="https://res.cloudinary.com/dnnuqxs7g/image/upload/v1765542749/LOGONH_jj5r9f.png" alt="Logo NH" className="w-full h-full object-cover p-1" />
                  </div>
                  <div className={`size-10 rounded-xl flex items-center justify-center overflow-hidden shadow-lg
                                      ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm'}
                                  `}>
                    <img src="https://res.cloudinary.com/dnnuqxs7g/image/upload/v1765971820/logo_pergarus_vahk2u.png" alt="Logo Pergarus" className="w-full h-full object-cover p-1" />
                  </div>
                </div>
                <div>
                  <h3 className={`font-bold text-lg leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>PP Nurul Huda</h3>
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>E-VOTING SYSTEM</span>
                </div>
              </div>
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                Platform pemilihan digital terpercaya untuk lingkungan pesantren. Mengutamakan kejujuran, transparansi, dan kemudahan akses.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className={`font-bold text-sm uppercase tracking-wider mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Menu Utama</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/" className={`transition-colors ${isDarkMode ? 'text-gray-400 hover:text-primary' : 'text-slate-600 hover:text-primary'}`}>Beranda</Link></li>
                <li><Link to="/verify" className={`transition-colors ${isDarkMode ? 'text-gray-400 hover:text-primary' : 'text-slate-600 hover:text-primary'}`}>Mulai Voting</Link></li>
                <li><a href="#features" className={`transition-colors ${isDarkMode ? 'text-gray-400 hover:text-primary' : 'text-slate-600 hover:text-primary'}`}>Fitur Sistem</a></li>
                <li><Link to="/results" className={`transition-colors ${isDarkMode ? 'text-gray-400 hover:text-primary' : 'text-slate-600 hover:text-primary'}`}>Lihat Hasil</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className={`font-bold text-sm uppercase tracking-wider mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Bantuan</h4>
              <ul className="space-y-4 text-sm">
                <li><span className={`cursor-pointer transition-colors ${isDarkMode ? 'text-gray-400 hover:text-primary' : 'text-slate-600 hover:text-primary'}`}>Panduan Pemilih</span></li>
                <li><span className={`cursor-pointer transition-colors ${isDarkMode ? 'text-gray-400 hover:text-primary' : 'text-slate-600 hover:text-primary'}`}>Laporkan Masalah</span></li>
                <li><span className={`cursor-pointer transition-colors ${isDarkMode ? 'text-gray-400 hover:text-primary' : 'text-slate-600 hover:text-primary'}`}>Kontak Panitia</span></li>
              </ul>
            </div>

            {/* Theme & Legal */}
            <div className="space-y-6">
              <h4 className={`font-bold text-sm uppercase tracking-wider mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Preferensi</h4>
              <button
                onClick={toggleTheme}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 group
                                ${isDarkMode
                    ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900'}
                            `}
              >
                <span className="text-sm font-medium">Tampilan</span>
                {isDarkMode ? (
                  <div className="flex items-center gap-2 text-primary">
                    <Moon size={16} />
                    <span className="text-xs font-bold">GELAP</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-orange-500">
                    <Sun size={16} />
                    <span className="text-xs font-bold">TERANG</span>
                  </div>
                )}
              </button>
              <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                Versi 2.4.0 (Stable)<br />
                Server Status: <span className="text-green-500">Online</span>
              </div>
            </div>
          </div>

          <div className={`mt-16 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4
                ${isDarkMode ? 'border-white/5' : 'border-slate-200'}
          `}>
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>
              © 2025 Pondok Pesantren Nurul Huda Malati. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className={`text-xs cursor-pointer hover:text-primary transition-colors ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>Privacy Policy</span>
              <span className={`text-xs cursor-pointer hover:text-primary transition-colors ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Style for Animations */}
      <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) translateZ(20px); }
                    50% { transform: translateY(-20px) translateZ(20px); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px) translateZ(30px); }
                    50% { transform: translateY(-15px) translateZ(30px); }
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
                .animate-marquee { animation: marquee 20s linear infinite; }
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .translate-z-20 { transform: translateZ(20px); }
                .translate-z-30 { transform: translateZ(30px); }
            `}</style>
    </div>
  );
};

export default LandingPage;