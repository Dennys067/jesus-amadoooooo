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
        fetch('/api/courts').catch(err => ({ ok: false, json: () => Promise.resolve([]) } as any)),
        fetch('/api/bookings').catch(err => ({ ok: false, json: () => Promise.resolve([]) } as any)),
        fetch('/api/menu').catch(err => ({ ok: false, json: () => Promise.resolve([]) } as any)),
        fetch('/api/tournaments').catch(err => ({ ok: false, json: () => Promise.resolve([]) } as any)),
        fetch('/api/gallery').catch(err => ({ ok: false, json: () => Promise.resolve([]) } as any)),
        fetch('/api/settings').catch(err => ({ ok: false, json: () => Promise.resolve({}) } as any))
      ]);

      if (resCourts.ok) {
        try {
          const data = await resCourts.json();
          if (Array.isArray(data)) setCourts(data);
        } catch (e) {
          console.error('Error parsing courts JSON:', e);
        }
      }
      if (resBookings.ok) {
        try {
          const data = await resBookings.json();
          if (Array.isArray(data)) setBookings(data);
        } catch (e) {
          console.error('Error parsing bookings JSON:', e);
        }
      }
      if (resMenu.ok) {
        try {
          const data = await resMenu.json();
          if (Array.isArray(data)) setMenuItems(data);
        } catch (e) {
          console.error('Error parsing menu JSON:', e);
        }
      }
      if (resTournaments.ok) {
        try {
          const data = await resTournaments.json();
          if (Array.isArray(data)) setTournaments(data);
        } catch (e) {
          console.error('Error parsing tournaments JSON:', e);
        }
      }
      if (resGallery.ok) {
        try {
          const data = await resGallery.json();
          if (Array.isArray(data)) setGalleryItems(data);
        } catch (e) {
          console.error('Error parsing gallery JSON:', e);
        }
      }
      if (resSettings.ok) {
        try {
          const settings = await resSettings.json();
          if (settings) {
            if (settings.hero_image) setHeroImage(settings.hero_image);
            if (settings.restaurant_image) setRestaurantImage(settings.restaurant_image);
            if (settings.logo_image) setLogoImage(settings.logo_image);
          }
        } catch (e) {
          console.error('Error parsing settings JSON:', e);
        }
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
    await googleSignIn();
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
      // Find modified/added courts
      const changed = newCourts.filter(nc => {
        const oc = courts.find(c => c.id === nc.id);
        if (!oc) return true;
        return oc.name !== nc.name ||
               oc.type !== nc.type ||
               JSON.stringify(oc.sports) !== JSON.stringify(nc.sports) ||
               oc.description !== nc.description ||
               oc.priceHourly !== nc.priceHourly ||
               oc.image !== nc.image;
      });

      for (const court of changed) {
        await fetch('/api/courts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(court),
        });
      }

      setCourts(newCourts);
      await loadAllData();
    } catch (err) {
      console.error('Error updating courts:', err);
    }
  };

  const updateMenuItems = async (newMenu: MenuItem[]) => {
    try {
      // 1. Find deleted items on the backend
      const deletedItems = menuItems.filter(item => !newMenu.some(newItem => newItem.id === item.id));
      for (const item of deletedItems) {
        await fetch(`/api/menu/${item.id}`, {
          method: 'DELETE',
        });
      }

      // 2. Find changed/added items
      const changedItems = newMenu.filter(newItem => {
        const oldItem = menuItems.find(item => item.id === newItem.id);
        if (!oldItem) return true;
        return oldItem.name !== newItem.name ||
               oldItem.description !== newItem.description ||
               oldItem.price !== newItem.price ||
               oldItem.category !== newItem.category ||
               oldItem.image !== newItem.image ||
               oldItem.tag !== newItem.tag;
      });

      for (const item of changedItems) {
        await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }

      setMenuItems(newMenu);
      await loadAllData();
    } catch (err) {
      console.error('Error updating menu:', err);
    }
  };

  const updateTournaments = async (newTour: Tournament[]) => {
    try {
      // 1. Find deleted tournaments on the backend
      const deleted = tournaments.filter(t => !newTour.some(nt => nt.id === t.id));
      for (const t of deleted) {
        await fetch(`/api/tournaments/${t.id}`, {
          method: 'DELETE',
        });
      }

      // 2. Find changed/added tournaments
      const changed = newTour.filter(nt => {
        const ot = tournaments.find(t => t.id === nt.id);
        if (!ot) return true;
        return ot.title !== nt.title ||
               ot.date !== nt.date ||
               JSON.stringify(ot.categories) !== JSON.stringify(nt.categories) ||
               ot.description !== nt.description ||
               ot.price !== nt.price ||
               ot.status !== nt.status ||
               ot.image !== nt.image;
      });

      for (const t of changed) {
        await fetch('/api/tournaments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(t),
        });
      }

      setTournaments(newTour);
      await loadAllData();
    } catch (err) {
      console.error('Error updating tournaments:', err);
    }
  };

  const updateGalleryItems = async (newGallery: GalleryItem[]) => {
    try {
      // 1. Find deleted items on the backend
      const deleted = galleryItems.filter(g => !newGallery.some(ng => ng.id === g.id));
      for (const g of deleted) {
        await fetch(`/api/gallery/${g.id}`, {
          method: 'DELETE',
        });
      }

      // 2. Find changed/added items
      const changed = newGallery.filter(ng => {
        const og = galleryItems.find(g => g.id === ng.id);
        if (!og) return true;
        return og.title !== ng.title ||
               og.src !== ng.src ||
               og.alt !== ng.alt ||
               og.category !== ng.category;
      });

      for (const g of changed) {
        await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(g),
        });
      }

      setGalleryItems(newGallery);
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
