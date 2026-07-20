import { useState } from 'react';
import { Menu, X, Calendar, Utensils, Trophy, Image as ImageIcon, Phone, Shield, Sparkles, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';
import { GoogleUser as User } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  setIsAdminMode: (mode: boolean) => void;
  googleUser: User | null;
  handleLogin: () => void;
  handleLogout: () => void;
  logoImage?: string | null;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  isAdmin,
  setIsAdminMode,
  googleUser,
  handleLogin,
  handleLogout,
  logoImage = null,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Início', icon: Sparkles },
    { id: 'booking', label: 'Agendar Quadra', icon: Calendar },
    { id: 'menu', label: 'Cardápio Digital', icon: Utensils },
    { id: 'tournaments', label: 'Torneios', icon: Trophy },
    { id: 'gallery', label: 'Galeria', icon: ImageIcon },
    { id: 'contact', label: 'Contato', icon: Phone },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsAdminMode(false);
    setIsOpen(false);
  };

  return (
    <nav className="bg-black text-white sticky top-0 z-50 border-b border-orange-500/20 backdrop-blur-md bg-opacity-95" id="arena-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="relative flex items-center gap-3">
              {/* Logo Badge */}
              <Logo className="w-14 h-14" src={logoImage} />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 font-sans">
                  ARENA PRIME
                </span>
                <span className="text-[10px] text-yellow-400 tracking-widest uppercase -mt-1 font-bold">
                  www.arenaprime2026.com
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id && !isAdmin;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-yellow-400 font-bold bg-white/5'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                  id={`nav-item-${item.id}`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-500' : 'text-gray-400'}`} />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-orange-500 to-yellow-400 rounded"
                    />
                  )}
                </button>
              );
            })}

            {/* Admin Toggle Button */}
            <button
              onClick={() => {
                setIsAdminMode(true);
                setIsOpen(false);
              }}
              className={`flex items-center gap-2 ml-4 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 border ${
                isAdmin
                  ? 'bg-gradient-to-r from-orange-600 to-yellow-500 text-black border-transparent shadow-lg shadow-orange-500/20'
                  : 'text-orange-400 border-orange-500/30 hover:bg-orange-500/10'
              }`}
              id="nav-item-admin"
            >
              <Shield className="w-4 h-4" />
              Painel Admin
            </button>

            {/* Google OAuth Profile or Sign In Button */}
            {googleUser ? (
              <div className="flex items-center gap-3 ml-4 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1">
                {googleUser.photoURL ? (
                  <img src={googleUser.photoURL} alt={googleUser.displayName || 'User'} className="w-6 h-6 rounded-full border border-orange-500/30" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-black text-xs font-black flex items-center justify-center">
                    {googleUser.displayName ? googleUser.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <span className="text-xs font-bold text-gray-200 hidden lg:inline max-w-[100px] truncate">
                  {googleUser.displayName?.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  title="Sair da Conta Google"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 ml-4 bg-white hover:bg-gray-100 text-black font-semibold text-xs py-1.5 px-3.5 rounded-lg border border-gray-300 transition-all duration-300"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Conectar Google</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsAdminMode(!isAdmin)}
              className={`p-2 rounded-lg border ${
                isAdmin
                  ? 'bg-orange-500 text-black border-transparent'
                  : 'text-orange-400 border-orange-500/30'
              }`}
              title="Acesso Admin"
            >
              <Shield className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none border border-gray-800"
              aria-expanded="false"
              id="mobile-menu-toggle"
            >
              <span className="sr-only">Abrir menu</span>
              {isOpen ? <X className="block h-6 h-6" /> : <Menu className="block h-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-zinc-950 border-t border-orange-500/10 overflow-hidden"
            id="mobile-menu-drawer"
          >
            <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id && !isAdmin;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium transition-all ${
                      isActive
                        ? 'text-yellow-400 bg-orange-500/10 border-l-4 border-orange-500 pl-3 font-semibold'
                        : 'text-gray-300 hover:text-white hover:bg-white/5 pl-4'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-orange-500" />
                    {item.label}
                  </button>
                );
              })}

              <div className="pt-4 mt-4 border-t border-zinc-800 px-4 space-y-3">
                {googleUser ? (
                  <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      {googleUser.photoURL ? (
                        <img src={googleUser.photoURL} alt={googleUser.displayName || 'User'} className="w-8 h-8 rounded-full border border-orange-500/30" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-orange-500 text-black text-sm font-black flex items-center justify-center">
                          {googleUser.displayName ? googleUser.displayName.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-200">{googleUser.displayName}</span>
                        <span className="text-[10px] text-gray-400">Google Conectado</span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-bold bg-white text-black transition-all"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Conectar Conta Google</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsAdminMode(true);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                    isAdmin
                      ? 'bg-gradient-to-r from-orange-600 to-yellow-500 text-black'
                      : 'bg-zinc-900 text-orange-400 border border-orange-500/30'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  Painel do Proprietário
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
