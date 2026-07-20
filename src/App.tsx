import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import HomeSection from './components/HomeSection';
import ReservationSection from './components/ReservationSection';
import AdminSection from './components/AdminSection';
import MenuSection from './components/MenuSection';
import GallerySection from './components/GallerySection';
import ContactSection from './components/ContactSection';
import { Booking, Court, MenuItem, Tournament, GalleryItem } from './types';
import { COURTS, MENU_ITEMS, TOURNAMENTS, INITIAL_GALLERY } from './data';
import { Instagram, Phone, MapPin, Sparkles, Trophy, Calendar, Utensils } from 'lucide-react';
import { initAuth, googleSignIn, logout, getAccessToken, checkFirebaseEnabled } from './lib/supabaseAuth.ts';
import { GoogleUser as User } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  // Google Auth State
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);

  // Cloud SQL API States
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [courts, setCourts] = useState<Court[]>(COURTS);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [tournaments, setTournaments] = useState<Tournament[]>(TOURNAMENTS);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [heroImage, setHeroImage] = useState<string>('/src/assets/images/arena_prime_hero_1784287633068.jpg');
  const [restaurantImage, setRestaurantImage] = useState<string>('/src/assets/images/arena_prime_restaurant_1784287646644.jpg');
  const [logoImage, setLogoImage] = useState<string | null>(null);

  // Load all data from our dynamic API routes
  const loadAllData = async () => {
    try {
      const [resCourts, resBookings, resMenu, resTournaments, resGallery, resSettings] = await Promise.all([
        fetch('/api/courts'),
        fetch('/api/bookings'),
        fetch('/api/menu'),
        fetch('/api/tournaments'),
        fetch('/api/gallery'),
        fetch('/api/settings')
      ]);

      if (resCourts.ok) setCourts(await resCourts.json());
      if (resBookings.ok) setBookings(await resBookings.json());
      if (resMenu.ok) setMenuItems(await resMenu.json());
      if (resTournaments.ok) setTournaments(await resTournaments.json());
      if (resGallery.ok) setGalleryItems(await resGallery.json());
      if (resSettings.ok) {
        const settings = await resSettings.json();
        if (settings.hero_image) setHeroImage(settings.hero_image);
        if (settings.restaurant_image) setRestaurantImage(settings.restaurant_image);
        if (settings.logo_image) setLogoImage(settings.logo_image);
      }
    } catch (err) {
      console.error('Failed to load full-stack database states:', err);
    }
  };

  // Listen to Auth changes and load data on start
  useEffect(() => {
    loadAllData();

    // Check if user has an active token in sessionStorage
    const savedToken = sessionStorage.getItem('ap_temp_at');
    if (savedToken) {
      setGoogleToken(savedToken);
    }

    const unsubscribe = initAuth(
      async (user, token) => {
        setGoogleUser(user);
        if (token) {
          setGoogleToken(token);
        } else {
          const fetchedToken = await getAccessToken();
          if (fetchedToken) setGoogleToken(fetchedToken);
        }
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setGoogleToken(result.accessToken);
        await loadAllData();
      }
    } catch (err) {
      console.error('Failed to sign in with Google OAuth:', err);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await logout();
      setGoogleUser(null);
      setGoogleToken(null);
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  };

  const addBooking = async (newBooking: Booking) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking),
      });
      if (res.ok) {
        await loadAllData();
      }
    } catch (err) {
      console.error('Error adding booking:', err);
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await loadAllData();
      }
    } catch (err) {
      console.error('Error deleting booking:', err);
    }
  };

  const updateCourts = async (newCourts: Court[]) => {
    try {
      setCourts(newCourts);
      for (const court of newCourts) {
        await fetch('/api/courts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(court),
        });
      }
      await loadAllData();
    } catch (err) {
      console.error('Error updating courts:', err);
    }
  };

  const updateMenuItems = async (newMenu: MenuItem[]) => {
    try {
      setMenuItems(newMenu);
      // Clean delete or full update
      for (const item of newMenu) {
        await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }
      await loadAllData();
    } catch (err) {
      console.error('Error updating menu:', err);
    }
  };

  const updateTournaments = async (newTour: Tournament[]) => {
    try {
      setTournaments(newTour);
      for (const t of newTour) {
        await fetch('/api/tournaments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(t),
        });
      }
      await loadAllData();
    } catch (err) {
      console.error('Error updating tournaments:', err);
    }
  };

  const updateGalleryItems = async (newGallery: GalleryItem[]) => {
    try {
      setGalleryItems(newGallery);
      for (const g of newGallery) {
        await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(g),
        });
      }
      await loadAllData();
    } catch (err) {
      console.error('Error updating gallery:', err);
    }
  };

  const updateHeroImage = async (src: string) => {
    try {
      setHeroImage(src);
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero_image: src }),
      });
      await loadAllData();
    } catch (err) {
      console.error('Error saving hero setting:', err);
    }
  };

  const updateRestaurantImage = async (src: string) => {
    try {
      setRestaurantImage(src);
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurant_image: src }),
      });
      await loadAllData();
    } catch (err) {
      console.error('Error saving restaurant setting:', err);
    }
  };

  const updateLogoImage = async (src: string) => {
    try {
      setLogoImage(src);
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logo_image: src }),
      });
      await loadAllData();
    } catch (err) {
      console.error('Error saving logo setting:', err);
    }
  };

  // Helper for scroll navigating to tournament section from Navbar
  const handleNavWithScroll = (tabId: string) => {
    if (tabId === 'tournaments') {
      setActiveTab('home');
      setIsAdminMode(false);
      setTimeout(() => {
        const element = document.getElementById('tournaments-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      setActiveTab(tabId);
      setIsAdminMode(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-orange-500 selection:text-black flex flex-col justify-between" id="app-wrapper-container">
      <div>
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={handleNavWithScroll}
          isAdmin={isAdminMode}
          setIsAdminMode={setIsAdminMode}
          googleUser={googleUser}
          handleLogin={handleGoogleLogin}
          handleLogout={handleGoogleLogout}
          logoImage={logoImage}
        />

        {/* Dynamic Section Contents with Fade-In Layout Animation */}
        <main className="grow">
          <AnimatePresence mode="wait">
            {isAdminMode ? (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <AdminSection
                  bookings={bookings}
                  addBooking={addBooking}
                  cancelBooking={cancelBooking}
                  courts={courts}
                  updateCourts={updateCourts}
                  menuItems={menuItems}
                  updateMenuItems={updateMenuItems}
                  tournaments={tournaments}
                  updateTournaments={updateTournaments}
                  galleryItems={galleryItems}
                  updateGalleryItems={updateGalleryItems}
                  heroImage={heroImage}
                  updateHeroImage={updateHeroImage}
                  restaurantImage={restaurantImage}
                  updateRestaurantImage={updateRestaurantImage}
                  logoImage={logoImage}
                  updateLogoImage={updateLogoImage}
                  googleUser={googleUser}
                  googleToken={googleToken}
                  handleGoogleLogin={handleGoogleLogin}
                  isFirebaseEnabled={checkFirebaseEnabled()}
                />
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'home' && (
                  <HomeSection
                    onNavigateToBooking={() => setActiveTab('booking')}
                    onNavigateToMenu={() => setActiveTab('menu')}
                    heroImage={heroImage}
                    tournaments={tournaments}
                  />
                )}
                {activeTab === 'booking' && (
                  <ReservationSection
                    bookings={bookings}
                    addBooking={addBooking}
                    courts={courts}
                    googleUser={googleUser}
                    googleToken={googleToken}
                    handleGoogleLogin={handleGoogleLogin}
                  />
                )}
                {activeTab === 'menu' && (
                  <MenuSection
                    restaurantImage={restaurantImage}
                    menuItems={menuItems}
                  />
                )}
                {activeTab === 'gallery' && (
                  <GallerySection
                    galleryItems={galleryItems}
                  />
                )}
                {activeTab === 'contact' && (
                  <ContactSection />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* GLOBAL FOOTER */}
      <footer className="bg-zinc-950 border-t border-zinc-900 pt-16 pb-8 px-4 sm:px-6 lg:px-8 mt-12" id="arena-footer">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-zinc-900 pb-12 mb-8 text-sm text-gray-400">
          
          {/* Col 1: Brand details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveTab('home'); setIsAdminMode(false); }}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 p-[2px] flex items-center justify-center font-bold text-black text-sm italic">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-orange-400 font-extrabold text-xs">
                  PRIME
                </div>
              </div>
              <span className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-300">
                ARENA PRIME
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs text-gray-400">
              O ponto de encontro ideal para amantes do Beach Tennis, Vôlei de Praia, Futvôlei e boa culinária em Glória de Dourados/MS. Nossa casa, sua praia!
            </p>
          </div>

          {/* Col 2: Navigation Shortcuts */}
          <div className="space-y-4">
            <h4 className="text-white font-black uppercase text-xs tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => { setActiveTab('home'); setIsAdminMode(false); }} className="hover:text-yellow-400 transition-colors">
                  Página Inicial
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('booking'); setIsAdminMode(false); }} className="hover:text-yellow-400 transition-colors">
                  Reservar Quadra
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('menu'); setIsAdminMode(false); }} className="hover:text-yellow-400 transition-colors">
                  Cardápio Digital
                </button>
              </li>
              <li>
                <button onClick={() => handleNavWithScroll('tournaments')} className="hover:text-yellow-400 transition-colors">
                  Torneios & Eventos
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services / Sports */}
          <div className="space-y-4">
            <h4 className="text-white font-black uppercase text-xs tracking-widest flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-orange-500" />
              Modalidades
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1">Beach Tennis</li>
              <li className="flex items-center gap-1">Vôlei de Praia</li>
              <li className="flex items-center gap-1">Futvôlei</li>
              <li className="flex items-center gap-1">Bar & Lanchonete de Areia</li>
            </ul>
          </div>

          {/* Col 4: Contacts & Socials */}
          <div className="space-y-4">
            <h4 className="text-white font-black uppercase text-xs tracking-widest flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              Contatos Rápidos
            </h4>
            <div className="space-y-3 text-xs">
              <a
                href="https://wa.me/5567998072596"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>(67) 99807-2596</span>
              </a>
              <a
                href="https://www.instagram.com/arena_prime2026/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                <span>@arena_prime2026</span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Av. Presidente Vargas, Glória de Dourados/MS</span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-600 font-medium">
          <p>© 2026 Arena Prime Club. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Desenvolvido com carinho para Glória de Dourados/MS</span>
          </p>
        </div>
      </footer>

    </div>
  );
}
