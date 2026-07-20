import React, { useState, useMemo } from 'react';
import { Shield, Lock, Trash2, ShieldAlert, PlusCircle, CheckCircle2, UserCheck, Calendar, Phone, Search, Ban, DollarSign, BarChart2, Flame, ShieldCheck, Clock, Trophy, Edit, ArrowRight, Star, Camera } from 'lucide-react';
import { Court, Booking, MenuItem, Tournament, GalleryItem } from '../types';
import { TIME_SLOTS, getRelativeDateString } from '../data';
import Logo from './Logo';
import ImageUploadField from './ImageUploadField';

import { GoogleUser as FirebaseUser } from '../types';
import { FileText, FolderOpen, RefreshCw, Plus, Download, ExternalLink, HelpCircle, AlertCircle } from 'lucide-react';

interface AdminSectionProps {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
  courts: Court[];
  updateCourts: (courts: Court[]) => void;
  menuItems: MenuItem[];
  updateMenuItems: (menu: MenuItem[]) => void;
  tournaments: Tournament[];
  updateTournaments: (tours: Tournament[]) => void;
  galleryItems: GalleryItem[];
  updateGalleryItems: (gallery: GalleryItem[]) => void;
  heroImage: string;
  updateHeroImage: (src: string) => void;
  restaurantImage: string;
  updateRestaurantImage: (src: string) => void;
  logoImage: string | null;
  updateLogoImage: (src: string) => void;
  googleUser: FirebaseUser | null;
  googleToken: string | null;
  handleGoogleLogin: () => void;
  isFirebaseEnabled?: boolean;
}

export default function AdminSection({
  bookings,
  addBooking,
  cancelBooking,
  courts,
  updateCourts,
  menuItems,
  updateMenuItems,
  tournaments,
  updateTournaments,
  galleryItems = [],
  updateGalleryItems,
  heroImage,
  updateHeroImage,
  restaurantImage,
  updateRestaurantImage,
  logoImage,
  updateLogoImage,
  googleUser,
  googleToken,
  handleGoogleLogin,
  isFirebaseEnabled = false,
}: AdminSectionProps) {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Admin section sub-tab (including Google Workspace features!)
  const [adminSubTab, setAdminSubTab] = useState<'bookings' | 'courts' | 'menu' | 'tournaments' | 'gallery' | 'forms' | 'drive'>('bookings');

  // Selected date & court for daily schedule management
  const [adminDate, setAdminDate] = useState(getRelativeDateString(0)); // Start with today
  const [adminCourtId, setAdminCourtId] = useState(courts[0]?.id || '');
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');

  const next7Days = useMemo(() => {
    const list = [];
    const baseDate = new Date(adminDate + 'T00:00:00');
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' });
      const dayLabel = `${d.getDate()}/${d.getMonth() + 1}`;
      list.push({ dateString, dayName, dayLabel });
    }
    return list;
  }, [adminDate]);

  // Ensure selection remains valid if courts are cleared/loaded
  React.useEffect(() => {
    if (courts && courts.length > 0 && !adminCourtId) {
      setAdminCourtId(courts[0].id);
    }
  }, [courts, adminCourtId]);

  // Form states for manual booking / blocking
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalSlot, setModalSlot] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'booking' | 'block'>('booking');
  
  // Custom Booking Fields
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [customSport, setCustomSport] = useState<'Beach Tennis' | 'Vôlei de Praia' | 'Futvôlei'>('Beach Tennis');
  
  // Block Fields
  const [blockReason, setBlockReason] = useState('');

  // Global Search
  const [searchQuery, setSearchQuery] = useState('');

  // COURT EDIT STATES
  const [editingCourtId, setEditingCourtId] = useState<string | null>(null);
  const [editingCourtPrice, setEditingCourtPrice] = useState(80);
  const [editingCourtDesc, setEditingCourtDesc] = useState('');
  const [editingCourtImage, setEditingCourtImage] = useState('');

  // MENU CRUD STATES
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [menuName, setMenuName] = useState('');
  const [menuDesc, setMenuDesc] = useState('');
  const [menuPrice, setMenuPrice] = useState(0);
  const [menuCategory, setMenuCategory] = useState<'portions' | 'drinks' | 'meals' | 'snacks'>('portions');
  const [menuTag, setMenuTag] = useState('');
  const [menuImage, setMenuImage] = useState('');

  // TOURNAMENTS CRUD STATES
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [tourTitle, setTourTitle] = useState('');
  const [tourDate, setTourDate] = useState('');
  const [tourCategories, setTourCategories] = useState('');
  const [tourDesc, setTourDesc] = useState('');
  const [tourPrice, setTourPrice] = useState(0);
  const [tourStatus, setTourStatus] = useState<'Inscrições Abertas' | 'Encerrado' | 'Em Breve'>('Inscrições Abertas');
  const [tourImage, setTourImage] = useState('');

  // GALLERY CRUD STATES
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [gallerySrc, setGallerySrc] = useState('');
  const [galleryAlt, setGalleryAlt] = useState('');
  const [galleryCategory, setGalleryCategory] = useState<'arena' | 'sports' | 'food'>('arena');

  // VISUAL IDENTITY / CORE SETTINGS STATE
  const [tempLogoImage, setTempLogoImage] = useState(logoImage || '');
  const [tempHeroImage, setTempHeroImage] = useState(heroImage || '');
  const [tempRestaurantImage, setTempRestaurantImage] = useState(restaurantImage || '');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Sync temp states with props when settings load
  React.useEffect(() => {
    setTempLogoImage(logoImage || '');
  }, [logoImage]);

  React.useEffect(() => {
    setTempHeroImage(heroImage || '');
  }, [heroImage]);

  React.useEffect(() => {
    setTempRestaurantImage(restaurantImage || '');
  }, [restaurantImage]);

  const handleSaveSettings = async () => {
    try {
      setIsSavingSettings(true);
      setSettingsSuccess(false);
      setSettingsError(null);

      // Save all at once to /api/settings
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logo_image: tempLogoImage,
          hero_image: tempHeroImage,
          restaurant_image: tempRestaurantImage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Falha ao salvar as configurações.');
      }

      // Update parent states
      updateLogoImage(tempLogoImage);
      updateHeroImage(tempHeroImage);
      updateRestaurantImage(tempRestaurantImage);

      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 4000);
    } catch (err: any) {
      console.error('Error saving site settings:', err);
      setSettingsError(err.message || 'Erro ao salvar. Tente compactar ou escolher imagens menores.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleSaveGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gallerySrc || !galleryTitle) return;

    if (editingGalleryItem) {
      // Edit
      const updated = galleryItems.map(item => 
        item.id === editingGalleryItem.id 
          ? { 
              ...item, 
              title: galleryTitle, 
              src: gallerySrc, 
              alt: galleryAlt || galleryTitle, 
              category: galleryCategory 
            }
          : item
      );
      updateGalleryItems(updated);
    } else {
      // Create
      const newItem: GalleryItem = {
        id: `g-${Date.now()}`,
        title: galleryTitle,
        src: gallerySrc,
        alt: galleryAlt || galleryTitle,
        category: galleryCategory
      };
      updateGalleryItems([...galleryItems, newItem]);
    }

    // Reset
    setShowGalleryModal(false);
    setEditingGalleryItem(null);
    setGalleryTitle('');
    setGallerySrc('');
    setGalleryAlt('');
    setGalleryCategory('arena');
  };

  const handleEditGalleryItem = (item: GalleryItem) => {
    setEditingGalleryItem(item);
    setGalleryTitle(item.title);
    setGallerySrc(item.src);
    setGalleryAlt(item.alt);
    setGalleryCategory(item.category);
    setShowGalleryModal(true);
  };

  // ==========================================
  // GOOGLE FORMS INTEGRATION
  // ==========================================
  const [formId, setFormId] = useState(() => localStorage.getItem('ap_form_id') || '');
  const [formDetails, setFormDetails] = useState<any>(null);
  const [formResponses, setFormResponses] = useState<any[]>([]);
  const [isLoadingForms, setIsLoadingForms] = useState(false);
  const [formErrorMsg, setFormErrorMsg] = useState('');

  const loadFormAndResponses = async (targetFormId: string) => {
    if (!targetFormId || !googleToken) return;
    try {
      setIsLoadingForms(true);
      setFormErrorMsg('');
      setFormDetails(null);
      setFormResponses([]);

      localStorage.setItem('ap_form_id', targetFormId);

      // Fetch Form Details
      const resDetails = await fetch(`/api/google/forms/${targetFormId}`, {
        headers: { 'Authorization': `Bearer ${googleToken}` }
      });

      // Fetch Form Responses
      const resResponses = await fetch(`/api/google/forms/${targetFormId}/responses`, {
        headers: { 'Authorization': `Bearer ${googleToken}` }
      });

      if (resDetails.ok) {
        setFormDetails(await resDetails.json());
      } else {
        const detailsErr = await resDetails.json();
        throw new Error(detailsErr.details || 'ID de Formulário inválido ou não encontrado.');
      }

      if (resResponses.ok) {
        const responsesData = await resResponses.json();
        if (responsesData.responses) {
          setFormResponses(responsesData.responses);
        }
      }
    } catch (err: any) {
      console.error('Error loading Google Form:', err);
      setFormErrorMsg(err.message || 'Erro ao conectar com a API de Formulários do Google.');
    } finally {
      setIsLoadingForms(false);
    }
  };

  // ==========================================
  // GOOGLE DRIVE INTEGRATION
  // ==========================================
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [isLoadingDrive, setIsLoadingDrive] = useState(false);
  const [driveErrorMsg, setDriveErrorMsg] = useState('');
  const [isUploadingDemo, setIsUploadingDemo] = useState(false);

  const fetchDriveFiles = async () => {
    if (!googleToken) return;
    try {
      setIsLoadingDrive(true);
      setDriveErrorMsg('');
      const res = await fetch('/api/google/drive/files', {
        headers: { 'Authorization': `Bearer ${googleToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.files) {
          setDriveFiles(data.files);
        }
      } else {
        const errData = await res.json();
        throw new Error(errData.details || 'Erro ao carregar arquivos do Drive.');
      }
    } catch (err: any) {
      console.error('Error fetching Drive files:', err);
      setDriveErrorMsg(err.message || 'Não foi possível listar arquivos do Google Drive.');
    } finally {
      setIsLoadingDrive(false);
    }
  };

  const handleCreateDemoFile = async () => {
    if (!googleToken) return;
    try {
      setIsUploadingDemo(true);
      // Create a document file in Google Drive
      const body = {
        name: `Regulamento_Arena_Prime_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.txt`,
        mimeType: 'text/plain',
      };

      const res = await fetch('/api/google/drive/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${googleToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        await fetchDriveFiles();
        alert('Regulamento criado e salvo no seu Google Drive com sucesso!');
      } else {
        alert('Erro ao enviar arquivo para o Google Drive.');
      }
    } catch (err) {
      console.error('Error creating demo file:', err);
    } finally {
      setIsUploadingDemo(false);
    }
  };

  // Run initial loading
  React.useEffect(() => {
    if (isAuthorized && googleToken) {
      if (adminSubTab === 'drive') {
        fetchDriveFiles();
      } else if (adminSubTab === 'forms' && formId) {
        loadFormAndResponses(formId);
      }
    }
  }, [adminSubTab, isAuthorized, googleToken]);

  const handleDeleteGalleryItem = (id: string) => {
    if (confirm('Tem certeza de que deseja excluir esta imagem da galeria?')) {
      const filtered = galleryItems.filter(item => item.id !== id);
      updateGalleryItems(filtered);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthorized(true);
      setLoginError('');
    } else {
      setLoginError('Senha incorreta! Use a senha: admin123');
    }
  };

  // Courts map for easy reference
  const courtsMap = useMemo(() => {
    const map: Record<string, Court> = {};
    courts.forEach(c => { map[c.id] = c; });
    return map;
  }, [courts]);

  // Stats calculation
  const stats = useMemo(() => {
    if (!Array.isArray(bookings)) {
      return { activeCount: 0, blockedCount: 0, earnings: 0 };
    }
    const active = bookings.filter(b => b && b.status !== 'cancelled' && !b.isBlockedSlot);
    const blocked = bookings.filter(b => b && b.status !== 'cancelled' && b.isBlockedSlot);
    const totalEarnings = active.reduce((acc, curr) => {
      const court = courtsMap[curr.courtId];
      return acc + (court ? court.priceHourly : 0);
    }, 0);

    return {
      activeCount: active.length,
      blockedCount: blocked.length,
      earnings: totalEarnings,
    };
  }, [bookings, courtsMap]);

  // Specific grid status for selected court & date
  const selectedDaySlots = useMemo(() => {
    const slots: Record<string, Booking | null> = {};
    TIME_SLOTS.forEach(slot => {
      const match = Array.isArray(bookings) ? bookings.find(
        b => b && b.date === adminDate && 
             b.courtId === adminCourtId && 
             b.timeSlot === slot && 
             b.status !== 'cancelled'
      ) : null;
      slots[slot] = match || null;
    });
    return slots;
  }, [bookings, adminDate, adminCourtId]);

  // Filtered overall booking lists for bottom table
  const filteredBookingsList = useMemo(() => {
    if (!Array.isArray(bookings)) return [];
    return bookings.filter(b => {
      if (!b) return false;
      const nameMatch = (b.customerName || '').toLowerCase().includes(searchQuery.toLowerCase());
      const phoneMatch = (b.customerPhone || '').includes(searchQuery);
      const sportMatch = (b.sport || '').toLowerCase().includes(searchQuery.toLowerCase());
      const reasonMatch = (b.blockReason || '').toLowerCase().includes(searchQuery.toLowerCase());
      const courtMatch = (b.courtName || '').toLowerCase().includes(searchQuery.toLowerCase());
      const dateMatch = (b.date || '').includes(searchQuery);

      return (nameMatch || phoneMatch || sportMatch || reasonMatch || courtMatch || dateMatch);
    }).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }, [bookings, searchQuery]);

  const openActionModal = (slot: string, type: 'booking' | 'block') => {
    setModalSlot(slot);
    setModalType(type);
    setCustomName('');
    setCustomPhone('');
    setBlockReason('');
    
    // Set default sport based on court capabilities
    const activeCourt = courtsMap[adminCourtId];
    if (activeCourt) {
      setCustomSport(activeCourt.sports[0]);
    }

    setShowAddModal(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalSlot) return;

    const activeCourt = courtsMap[adminCourtId];
    if (!activeCourt) return;

    let newBooking: Booking;

    if (modalType === 'block') {
      if (!blockReason.trim()) return;
      newBooking = {
        id: `block-${Date.now()}`,
        courtId: adminCourtId,
        courtName: activeCourt.name,
        customerName: 'Horário Bloqueado pela Arena',
        customerPhone: '(67) 99807-2596',
        sport: activeCourt.sports[0], // default
        date: adminDate,
        timeSlot: modalSlot,
        status: 'confirmed',
        isBlockedSlot: true,
        blockReason: blockReason.trim(),
        createdAt: new Date().toISOString()
      };
    } else {
      if (!customName.trim() || !customPhone.trim()) return;
      newBooking = {
        id: `b-admin-${Date.now()}`,
        courtId: adminCourtId,
        courtName: activeCourt.name,
        customerName: customName.trim(),
        customerPhone: customPhone.trim(),
        sport: customSport,
        date: adminDate,
        timeSlot: modalSlot,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
    }

    addBooking(newBooking);
    setShowAddModal(false);
  };

  const handleWhatsAppContact = (phone: string, customerName: string) => {
    const cleaned = phone.replace(/\D/g, '');
    const text = encodeURIComponent(`Olá ${customerName}! Aqui é da equipe Arena Prime.`);
    window.open(`https://wa.me/55${cleaned}?text=${text}`, '_blank');
  };

  if (!isAuthorized) {
    return (
      <div className="bg-black text-white min-h-[90vh] flex items-center justify-center px-4" id="admin-login-screen">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden flex flex-col items-center">
          {/* Top colored strip */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-yellow-400" />
          
          <div className="text-center mb-6">
            {/* Real responsive SVB Logo representation */}
            <Logo className="w-24 h-24 mx-auto mb-4" src={logoImage} />
            <h2 className="text-2xl font-black uppercase tracking-wide text-white font-display">Acesso Administrativo</h2>
            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
              Painel de gerenciamento exclusivo para o proprietário da Arena Prime de Glória de Dourados/MS.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 w-full">
            <div>
              <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">
                Senha de Acesso
              </label>
              <input
                type="password"
                required
                placeholder="Insira a senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-orange-500 transition-all placeholder-gray-600 text-center font-bold tracking-widest"
                id="admin-password-input"
              />
            </div>

            {loginError && (
              <p className="text-center text-xs text-orange-400 font-semibold bg-orange-500/10 py-2.5 rounded-lg border border-orange-500/20">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-yellow-500 text-black font-extrabold rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-orange-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              Entrar no Painel
            </button>
          </form>

          {/* Prompt reminder to helper user */}
          <div className="mt-8 pt-6 border-t border-zinc-800 text-center w-full">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
              Dica para teste:
            </p>
            <p className="text-sm font-black text-yellow-400 mt-1 select-all">
              admin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8" id="admin-panel-root">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
          <div className="flex items-center gap-4">
            <Logo className="w-16 h-16 hidden sm:block" src={logoImage} />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-orange-500" />
                <span className="text-xs uppercase font-extrabold tracking-widest text-yellow-400">Painel Geral</span>
              </div>
              <h1 className="text-3xl font-black uppercase text-white leading-none font-display">
                Arena Proprietário
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Controle de horários, valores de locação, cardápio digital, torneios ativos e relatórios em tempo real.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthorized(false)}
            className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-orange-500 hover:text-orange-400 font-bold text-xs uppercase tracking-widest rounded-xl border border-zinc-800 transition-all cursor-pointer"
          >
            Bloquear Painel
          </button>
        </div>

        {/* OVERVIEW STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" id="admin-stats-row">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-500">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block">Reservas Ativas</span>
              <span className="text-2xl font-black text-white">{stats.activeCount}</span>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 flex items-center justify-center border border-yellow-400/20 text-yellow-400">
              <Ban className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block">Horários Bloqueados</span>
              <span className="text-2xl font-black text-white">{stats.blockedCount}</span>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block">Faturamento de Arena</span>
              <span className="text-2xl font-black text-emerald-400">R$ {stats.earnings.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* SUB-TAB NAVIGATOR */}
        <div className="flex border-b border-zinc-800 gap-1 overflow-x-auto scrollbar-thin pb-px">
          <button
            onClick={() => setAdminSubTab('bookings')}
            className={`px-5 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              adminSubTab === 'bookings'
                ? 'text-orange-500 border-orange-500 bg-orange-500/5'
                : 'text-gray-400 border-transparent hover:text-white hover:bg-zinc-900/40'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Reservas & Bloqueios
          </button>
          <button
            onClick={() => setAdminSubTab('courts')}
            className={`px-5 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              adminSubTab === 'courts'
                ? 'text-orange-500 border-orange-500 bg-orange-500/5'
                : 'text-gray-400 border-transparent hover:text-white hover:bg-zinc-900/40'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Preço das Quadras
          </button>
          <button
            onClick={() => setAdminSubTab('menu')}
            className={`px-5 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              adminSubTab === 'menu'
                ? 'text-orange-500 border-orange-500 bg-orange-500/5'
                : 'text-gray-400 border-transparent hover:text-white hover:bg-zinc-900/40'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Cardápio Digital
          </button>
          <button
            onClick={() => setAdminSubTab('tournaments')}
            className={`px-5 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              adminSubTab === 'tournaments'
                ? 'text-orange-500 border-orange-500 bg-orange-500/5'
                : 'text-gray-400 border-transparent hover:text-white hover:bg-zinc-900/40'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Gerenciar Torneios
          </button>
          <button
            onClick={() => setAdminSubTab('gallery')}
            className={`px-5 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              adminSubTab === 'gallery'
                ? 'text-orange-500 border-orange-500 bg-orange-500/5'
                : 'text-gray-400 border-transparent hover:text-white hover:bg-zinc-900/40'
            }`}
          >
            <Camera className="w-4 h-4" />
            Gerenciar Galeria
          </button>
          <button
            onClick={() => setAdminSubTab('forms')}
            className={`px-5 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              adminSubTab === 'forms'
                ? 'text-purple-500 border-purple-500 bg-purple-500/5'
                : 'text-gray-400 border-transparent hover:text-white hover:bg-zinc-900/40'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-400" />
            Google Forms
          </button>
          <button
            onClick={() => setAdminSubTab('drive')}
            className={`px-5 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              adminSubTab === 'drive'
                ? 'text-blue-500 border-blue-500 bg-blue-500/5'
                : 'text-gray-400 border-transparent hover:text-white hover:bg-zinc-900/40'
            }`}
          >
            <FolderOpen className="w-4 h-4 text-blue-400" />
            Google Drive
          </button>
        </div>

        {/* RENDER ACTIVE SUBTAB CONTENT */}
        {adminSubTab === 'bookings' && (
          <div className="space-y-8 animate-fade-in">
            {/* CENTRAL SPLIT: DAY SCHEDULE CONTROLLER */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 animate-pulse" />
                  <h2 className="text-lg font-black uppercase text-white tracking-wide">
                    Grade de Agendamentos
                  </h2>
                </div>

                {/* Select Court & Date */}
                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                  {/* View Mode Toggle */}
                  <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 shrink-0">
                    <button
                      type="button"
                      onClick={() => setViewMode('daily')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        viewMode === 'daily'
                          ? 'bg-orange-500 text-black'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Diário
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('weekly')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        viewMode === 'weekly'
                          ? 'bg-orange-500 text-black'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Semanal
                    </button>
                  </div>

                  <div className="grow md:grow-0">
                    <label className="block text-[8px] uppercase font-bold text-gray-500 mb-0.5">Filtrar Quadra</label>
                    <select
                      value={adminCourtId}
                      onChange={(e) => setAdminCourtId(e.target.value)}
                      className="bg-zinc-950 text-white text-xs font-bold rounded-xl px-3 py-2 border border-zinc-800 focus:outline-none focus:border-orange-500"
                    >
                      {courts.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[8px] uppercase font-bold text-gray-500 mb-0.5">
                      {viewMode === 'weekly' ? 'Semana a partir de' : 'Selecione o Dia'}
                    </label>
                    <input
                      type="date"
                      value={adminDate}
                      onChange={(e) => setAdminDate(e.target.value)}
                      className="bg-zinc-950 text-white text-xs font-bold rounded-xl px-3 py-2 border border-zinc-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {viewMode === 'weekly' ? (
                /* WEEKLY SLOTS CONTAINER */
                <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-800" id="admin-weekly-slots-container">
                  <div className="flex gap-4 min-w-[950px]">
                    {next7Days.map((day) => {
                      const dayBookings = bookings.filter(
                        b => b.date === day.dateString && b.courtId === adminCourtId && b.status !== 'cancelled'
                      );

                      return (
                        <div key={day.dateString} className="flex-1 bg-zinc-950/40 border border-zinc-850 p-4 rounded-2xl min-w-[150px] space-y-3">
                          <div className="text-center border-b border-zinc-800 pb-2 bg-zinc-900/50 p-2 rounded-xl">
                            <span className="text-[10px] text-orange-400 font-extrabold uppercase tracking-wider block notranslate">
                              {day.dayName}
                            </span>
                            <span className="text-xs font-black text-white">
                              {day.dayLabel}
                            </span>
                          </div>

                          <div className="space-y-2.5">
                            {TIME_SLOTS.map((slot) => {
                              const match = dayBookings.find(b => b.timeSlot === slot);
                              const isOccupied = !!match;
                              const isBlocked = isOccupied && !!match?.isBlockedSlot;

                              return (
                                <div
                                  key={slot}
                                  className={`p-2.5 rounded-xl border text-[10px] transition-all flex flex-col justify-between min-h-[96px] ${
                                    isBlocked
                                      ? 'bg-zinc-900/40 border-transparent text-gray-500'
                                      : isOccupied
                                      ? match.status === 'pending'
                                        ? 'bg-yellow-400/5 border-yellow-400/20 text-yellow-200'
                                        : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-300'
                                      : 'bg-zinc-950 border-zinc-850 hover:border-zinc-700 text-gray-400'
                                  }`}
                                >
                                  <div className="flex items-center justify-between font-bold mb-1 border-b border-zinc-800/40 pb-1">
                                    <span>{slot}</span>
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                      isBlocked
                                        ? 'bg-red-500'
                                        : isOccupied
                                        ? match.status === 'pending'
                                          ? 'bg-yellow-400 animate-pulse'
                                          : 'bg-emerald-500'
                                        : 'bg-zinc-700'
                                    }`} />
                                  </div>

                                  <div className="grow flex items-center justify-center text-center italic text-[9px] mb-1">
                                    {isBlocked ? (
                                      <span className="text-gray-500 line-clamp-2 leading-tight">Bloqueado: {match.blockReason}</span>
                                    ) : isOccupied && match ? (
                                      <div className="text-left w-full space-y-0.5">
                                        <div className="font-extrabold text-white truncate">{match.customerName}</div>
                                        <div className="text-orange-400 font-bold uppercase tracking-wider text-[8px]">{match.sport}</div>
                                      </div>
                                    ) : (
                                      <span className="text-zinc-700 font-semibold uppercase tracking-widest text-[8px]">Livre</span>
                                    )}
                                  </div>

                                  <div className="flex gap-1 justify-end pt-1 border-t border-zinc-800/40 flex-wrap">
                                    {isOccupied && match ? (
                                      <>
                                        {match.status === 'pending' && !match.isBlockedSlot && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updated = { ...match, status: 'confirmed' as const };
                                              addBooking(updated);
                                            }}
                                            className="px-1.5 py-0.5 bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-[8px] font-black uppercase rounded cursor-pointer transition-all"
                                            title="Confirmar Reserva"
                                          >
                                            Ok
                                          </button>
                                        )}
                                        <button
                                          type="button"
                                          onClick={() => cancelBooking(match.id)}
                                          className="p-1 bg-red-500/10 hover:bg-red-500 hover:text-white rounded text-red-400 cursor-pointer transition-all"
                                          title="Excluir / Cancelar"
                                        >
                                          <Trash2 className="w-2.5 h-2.5" />
                                        </button>
                                      </>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setAdminDate(day.dateString);
                                          openActionModal(slot, 'booking');
                                        }}
                                        className="px-1.5 py-0.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[8px] font-bold text-gray-300 uppercase cursor-pointer transition-all"
                                      >
                                        Agendar
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* DAILY SLOTS LIST */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="admin-daily-slots-grid">
                  {TIME_SLOTS.map((slot) => {
                    const currentBooking = selectedDaySlots[slot];
                    const isOccupied = !!currentBooking;
                    const isBlocked = isOccupied && !!currentBooking?.isBlockedSlot;

                    return (
                      <div
                        key={slot}
                        className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                          isBlocked
                            ? 'bg-zinc-800/40 border-zinc-700/60 text-gray-400'
                            : isOccupied
                            ? currentBooking.status === 'pending'
                              ? 'bg-yellow-400/5 border-yellow-400/20 text-white'
                              : 'bg-emerald-500/5 border-emerald-500/20 text-white'
                            : 'bg-zinc-950 border-zinc-800 text-gray-300'
                        }`}
                        id={`admin-slot-${slot.replace(/\s/g, '')}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-black tracking-wide text-white flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-orange-500" />
                            {slot}
                          </span>
                          <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded ${
                            isBlocked
                              ? 'bg-zinc-750 text-gray-400'
                              : isOccupied
                              ? currentBooking.status === 'pending'
                                ? 'bg-yellow-400 text-black animate-pulse'
                                : 'bg-emerald-500 text-black'
                              : 'bg-zinc-800 text-gray-400'
                          }`}>
                            {isBlocked ? 'Bloqueado' : isOccupied ? currentBooking.status === 'pending' ? 'Aguardando Pagamento' : 'Confirmada' : 'Livre'}
                          </span>
                        </div>

                        {/* Slot Details Body */}
                        <div className="my-2 min-h-[50px] flex items-center">
                          {isBlocked ? (
                            <div className="text-xs">
                              <span className="text-[10px] text-gray-500 block uppercase font-bold">Motivo do Bloqueio:</span>
                              <p className="text-gray-300 font-medium italic mt-0.5">{currentBooking?.blockReason}</p>
                            </div>
                          ) : isOccupied && currentBooking ? (
                            <div className="text-xs space-y-1 w-full">
                              <div className="flex justify-between">
                                <span className="text-gray-500 font-bold font-sans uppercase text-[9px]">Cliente:</span>
                                <span className="text-white font-black">{currentBooking.customerName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500 font-bold font-sans uppercase text-[9px]">Fone:</span>
                                <span className="text-gray-300 font-mono">{currentBooking.customerPhone}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500 font-bold font-sans uppercase text-[9px]">Esporte:</span>
                                <span className="text-yellow-400 font-extrabold">{currentBooking.sport}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-bold font-sans uppercase text-[9px]">Status:</span>
                                <span className={`text-[9px] font-black uppercase ${
                                  currentBooking.status === 'pending'
                                    ? 'text-yellow-400'
                                    : 'text-emerald-400'
                                }`}>
                                  {currentBooking.status === 'pending' ? '🟡 Aguardando Pgto' : '🟢 Confirmada'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 italic">Disponível para receber clientes ou bloqueios da Arena.</p>
                          )}
                        </div>

                        {/* Actions Footer */}
                        <div className="pt-3 mt-3 border-t border-zinc-800/80 flex gap-2 justify-end items-center flex-wrap">
                          {isOccupied && currentBooking ? (
                            <>
                              {!isBlocked && (
                                <>
                                  {currentBooking.status === 'pending' && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = { ...currentBooking, status: 'confirmed' as const };
                                        addBooking(updated);
                                      }}
                                      className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500 hover:text-black text-emerald-400 rounded text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                                      title="Confirmar Reserva"
                                    >
                                      Confirmar
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleWhatsAppContact(currentBooking.customerPhone, currentBooking.customerName)}
                                    className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black text-emerald-400 rounded-lg transition-all cursor-pointer"
                                    title="Conversar no WhatsApp"
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                onClick={() => cancelBooking(currentBooking.id)}
                                className="px-3 py-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
                                title="Cancelar reserva/remover bloqueio"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Remover
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => openActionModal(slot, 'block')}
                                className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-gray-400 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border border-zinc-800 cursor-pointer flex items-center gap-1"
                              >
                                <Ban className="w-3 h-3 text-orange-500" />
                                Bloquear
                              </button>
                              <button
                                type="button"
                                onClick={() => openActionModal(slot, 'booking')}
                                className="px-2.5 py-1.5 bg-orange-500 text-black font-black rounded-lg text-[10px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
                              >
                                <PlusCircle className="w-3 h-3" />
                                Reservar
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* BOTTOM SECTION: GENERAL ARCHIVES / CLIENT REGISTER SEARCH */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-black uppercase text-white tracking-wide">
                    Histórico & Cadastro Geral
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Banco de dados com todas as reservas solicitadas. Filtre por nome do cliente, esporte ou data.
                  </p>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Pesquisar cliente, esporte, data..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-orange-500 transition-all placeholder-gray-600"
                  />
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-zinc-800">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-zinc-950 border-b border-zinc-800 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <th className="p-4">Cliente / Motivo</th>
                      <th className="p-4">Contato</th>
                      <th className="p-4">Quadra</th>
                      <th className="p-4">Esporte</th>
                      <th className="p-4">Data & Horário</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Criado em</th>
                      <th className="p-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 bg-zinc-900/50">
                    {filteredBookingsList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-gray-500 italic">
                          Nenhuma reserva ou bloqueio encontrado para a busca.
                        </td>
                      </tr>
                    ) : (
                      filteredBookingsList.map((b) => (
                        <tr key={b.id} className="hover:bg-zinc-800/30 transition-all">
                          <td className="p-4 font-bold text-white">
                            {b.isBlockedSlot ? (
                              <span className="flex items-center gap-1.5 text-gray-400 font-medium italic">
                                <Ban className="w-3.5 h-3.5 text-red-500" />
                                {b.blockReason}
                              </span>
                            ) : (
                              b.customerName
                            )}
                          </td>
                          <td className="p-4 text-gray-300 font-mono text-nowrap">
                            {b.isBlockedSlot ? '—' : b.customerPhone}
                          </td>
                          <td className="p-4 text-orange-400 font-bold text-nowrap">{b.courtName}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-zinc-800 rounded-md text-[10px] font-bold text-yellow-400 uppercase text-nowrap">
                              {b.sport}
                            </span>
                          </td>
                          <td className="p-4 font-medium text-nowrap">
                            <div>
                              {new Date(b.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                            </div>
                            <div className="text-[10px] text-gray-500 font-bold">{b.timeSlot}</div>
                          </td>
                          <td className="p-4">
                            {b.isBlockedSlot ? (
                              <span className="text-gray-500 italic font-medium text-[10px] uppercase">Bloqueado</span>
                            ) : b.status === 'pending' ? (
                              <span className="px-2.5 py-1 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded-md text-[10px] font-black uppercase text-nowrap animate-pulse">
                                🟡 Aguardando pagamento
                              </span>
                            ) : b.status === 'confirmed' ? (
                              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-black uppercase text-nowrap">
                                🟢 Confirmada
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md text-[10px] font-black uppercase text-nowrap">
                                🔴 Cancelada
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-gray-500 font-mono text-[10px] text-nowrap">
                            {new Date(b.createdAt).toLocaleDateString('pt-BR')} {new Date(b.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex gap-2 justify-end items-center flex-wrap">
                              {!b.isBlockedSlot && (
                                <>
                                  {b.status !== 'confirmed' && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = { ...b, status: 'confirmed' as const };
                                        addBooking(updated);
                                      }}
                                      className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500 hover:text-black rounded text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer"
                                      title="Confirmar Reserva"
                                    >
                                      Confirmar
                                    </button>
                                  )}
                                  {b.status !== 'cancelled' && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = { ...b, status: 'cancelled' as const };
                                        addBooking(updated);
                                      }}
                                      className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500 hover:text-white rounded text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer"
                                      title="Cancelar Reserva"
                                    >
                                      Cancelar
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleWhatsAppContact(b.customerPhone, b.customerName)}
                                    className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded hover:bg-emerald-500 hover:text-black transition-all cursor-pointer"
                                    title="WhatsApp"
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm('Deseja excluir permanentemente este registro?')) {
                                    cancelBooking(b.id);
                                  }
                                }}
                                className="p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                                title="Remover / Cancelar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PRICE / COURT DETAILS TAB */}
        {adminSubTab === 'courts' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 animate-fade-in">
            <div>
              <h3 className="text-xl font-black uppercase text-white tracking-wide font-display">Preços e Descrição das Quadras</h3>
              <p className="text-xs text-gray-400 mt-1">Configure o valor cobrado por hora/período, descrição e fotos de cada quadra de areia.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              {courts.map(court => (
                <div key={court.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between min-h-[250px] space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-black text-white uppercase">{court.name}</span>
                      <span className="text-[10px] bg-orange-500/10 text-yellow-400 px-2.5 py-0.5 rounded font-bold uppercase">Areia</span>
                    </div>

                    {editingCourtId === court.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Preço por Hora (R$)</label>
                          <input
                            type="number"
                            value={editingCourtPrice}
                            onChange={(e) => setEditingCourtPrice(Number(e.target.value))}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] uppercase font-bold text-gray-500 mb-1">Descrição</label>
                          <textarea
                            value={editingCourtDesc}
                            onChange={(e) => setEditingCourtDesc(e.target.value)}
                            rows={3}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <ImageUploadField
                            label="Imagem da Quadra"
                            value={editingCourtImage}
                            onChange={(url) => setEditingCourtImage(url)}
                            folder="courts"
                            placeholder="Cole a URL ou faça upload da foto da quadra"
                          />
                          <p className="text-[9px] text-gray-500 mt-1">Deixe em branco ou limpe para remover a imagem da quadra.</p>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => setEditingCourtId(null)}
                            className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-800 text-gray-400 text-xs font-bold rounded-lg cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => {
                              const updated = courts.map(c => c.id === court.id ? { 
                                ...c, 
                                priceHourly: editingCourtPrice, 
                                description: editingCourtDesc,
                                image: editingCourtImage.trim() || undefined
                              } : c);
                              updateCourts(updated);
                              setEditingCourtId(null);
                            }}
                            className="flex-1 py-2 bg-emerald-500 text-black text-xs font-extrabold rounded-lg hover:scale-102 transition-all cursor-pointer"
                          >
                            Salvar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {court.image && (
                          <div className="w-full h-28 rounded-lg overflow-hidden border border-zinc-850 relative">
                            <img src={court.image} alt={court.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                        <p className="text-gray-400 text-xs leading-relaxed min-h-[40px] line-clamp-3">{court.description}</p>
                        
                        <div className="flex flex-wrap gap-1">
                          {court.sports.map((sp, sIdx) => (
                            <span key={sIdx} className="text-[9px] font-bold bg-orange-500/10 text-yellow-400 px-2 py-0.5 rounded">
                              {sp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {editingCourtId !== court.id && (
                    <div className="border-t border-zinc-800/80 pt-3 flex justify-between items-center">
                      <div>
                        <span className="text-[9px] text-gray-500 block uppercase font-bold">Valor por período</span>
                        <span className="text-base font-black text-emerald-400">R$ {court.priceHourly.toFixed(2)}</span>
                      </div>
                      
                      <button
                        onClick={() => {
                          setEditingCourtId(court.id);
                          setEditingCourtPrice(court.priceHourly);
                          setEditingCourtDesc(court.description);
                          setEditingCourtImage(court.image || '');
                        }}
                        className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-orange-400 border border-zinc-800 hover:border-orange-500/20 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                      >
                        Editar Valores
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CARDAPIO DIGITAL TAB */}
        {adminSubTab === 'menu' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-black uppercase text-white tracking-wide font-display">Gerenciar Cardápio Digital</h3>
                <p className="text-xs text-gray-400 mt-1">Adicione, edite preços ou remova refeições, porções, lanches e bebidas do bar da areia.</p>
              </div>
              
              <button
                onClick={() => {
                  setEditingMenuItem(null);
                  setMenuName('');
                  setMenuDesc('');
                  setMenuPrice(0);
                  setMenuCategory('portions');
                  setMenuTag('');
                  setMenuImage('');
                  setShowMenuModal(true);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:scale-102 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Adicionar Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map(item => (
                <div key={item.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between min-h-[190px] space-y-4">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-orange-500 tracking-wider">
                          {item.category === 'portions' ? 'Porções' : item.category === 'drinks' ? 'Bebidas' : item.category === 'meals' ? 'Refeições' : 'Lanches'}
                        </span>
                        <h4 className="text-sm font-black text-white uppercase mt-0.5">{item.name}</h4>
                      </div>
                      {item.tag && (
                        <span className="text-[8px] bg-yellow-400 text-black px-2 py-0.5 rounded-full font-black uppercase shrink-0">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-400 text-xs mt-2 leading-relaxed line-clamp-3 min-h-[48px]">
                      {item.description}
                    </p>
                  </div>

                  <div className="border-t border-zinc-800/80 pt-3 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] text-gray-500 uppercase block font-bold">Preço</span>
                      <span className="text-sm font-black text-emerald-400">R$ {item.price.toFixed(2)}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingMenuItem(item);
                          setMenuName(item.name);
                          setMenuDesc(item.description);
                          setMenuPrice(item.price);
                          setMenuCategory(item.category);
                          setMenuTag(item.tag || '');
                          setMenuImage(item.image || '');
                          setShowMenuModal(true);
                        }}
                        className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-orange-500/20 text-orange-400 rounded-lg hover:bg-zinc-800 transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Deseja mesmo excluir o item "${item.name}" do cardápio?`)) {
                            const updated = menuItems.filter(i => i.id !== item.id);
                            updateMenuItems(updated);
                          }
                        }}
                        className="px-2.5 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TOURNAMENTS MANAGER TAB */}
        {adminSubTab === 'tournaments' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-black uppercase text-white tracking-wide font-display">Gerenciar Torneios & Eventos</h3>
                <p className="text-xs text-gray-400 mt-1">Publique competições regionais de Beach Tennis, Vôlei ou Futvôlei, mude preços e status.</p>
              </div>
              
              <button
                onClick={() => {
                  setEditingTournament(null);
                  setTourTitle('');
                  setTourDate('');
                  setTourCategories('');
                  setTourDesc('');
                  setTourPrice(0);
                  setTourStatus('Inscrições Abertas');
                  setTourImage('');
                  setShowTournamentModal(true);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:scale-102 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Novo Torneio
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map(tour => (
                <div key={tour.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between min-h-[250px] space-y-4">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-orange-500 tracking-wider">
                          {tour.date}
                        </span>
                        <h4 className="text-sm font-black text-white uppercase mt-0.5 leading-tight">{tour.title}</h4>
                      </div>
                      
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded shrink-0 ${
                        tour.status === 'Inscrições Abertas'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : tour.status === 'Em Breve'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {tour.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 text-xs mt-3 leading-relaxed line-clamp-3 min-h-[48px]">
                      {tour.description}
                    </p>

                    <div className="mt-3">
                      <span className="text-[8px] uppercase text-gray-500 font-bold block mb-1">Categorias:</span>
                      <div className="flex flex-wrap gap-1">
                        {tour.categories.map((c, idx) => (
                          <span key={idx} className="bg-zinc-900 text-gray-300 text-[9px] font-bold px-2 py-0.5 rounded text-nowrap">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-800/80 pt-3 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] text-gray-500 uppercase block font-bold">Inscrição</span>
                      <span className="text-sm font-black text-emerald-400">R$ {tour.price.toFixed(2)}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingTournament(tour);
                          setTourTitle(tour.title);
                          setTourDate(tour.date);
                          setTourCategories(tour.categories.join(', '));
                          setTourDesc(tour.description);
                          setTourPrice(tour.price);
                          setTourStatus(tour.status);
                          setTourImage(tour.image || '');
                          setShowTournamentModal(true);
                        }}
                        className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-orange-500/20 text-orange-400 rounded-lg hover:bg-zinc-800 transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Deseja mesmo excluir o torneio "${tour.title}"?`)) {
                            const updated = tournaments.filter(t => t.id !== tour.id);
                            updateTournaments(updated);
                          }
                        }}
                        className="px-2.5 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GALLERY MANAGER TAB */}
        {adminSubTab === 'gallery' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 animate-fade-in" id="admin-gallery-manager">
            {/* BACKGROUND IMAGES MANAGEMENT SECTION */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h4 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2 font-display">
                    <Camera className="w-4 h-4 text-orange-500" />
                    Identidade Visual & Imagens Principais do Site
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Gerencie a logomarca do clube, a imagem de topo da página inicial e a foto de destaque da seção do restaurante.
                  </p>
                </div>
                
                <div className="flex flex-col items-start sm:items-end gap-2">
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSavingSettings}
                    className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:scale-102 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer disabled:from-zinc-800 disabled:to-zinc-700 disabled:text-gray-500"
                  >
                    {isSavingSettings ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Salvar Identidade Visual
                      </>
                    )}
                  </button>
                  
                  {settingsSuccess && (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Alterações salvas com sucesso!
                    </span>
                  )}
                  
                  {settingsError && (
                    <span className="text-[10px] text-red-400 font-bold max-w-xs text-right">
                      {settingsError}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Logo da Arena */}
                <div className="space-y-3 bg-zinc-900/40 p-4 rounded-xl border border-zinc-850">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-orange-400 uppercase">Logo do Clube</span>
                    <span className="text-[10px] text-gray-500">Logomarca</span>
                  </div>
                  <ImageUploadField
                    label="Logomarca do Clube"
                    value={tempLogoImage}
                    onChange={(src) => setTempLogoImage(src)}
                    folder="logos"
                    placeholder="Cole a URL da logomarca ou faça upload"
                  />
                </div>

                {/* Hero BG */}
                <div className="space-y-3 bg-zinc-900/40 p-4 rounded-xl border border-zinc-850">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-orange-400 uppercase">Banner Principal</span>
                    <span className="text-[10px] text-gray-500">Fundo da Home</span>
                  </div>
                  <ImageUploadField
                    label="Imagem de Fundo Principal"
                    value={tempHeroImage}
                    onChange={(src) => setTempHeroImage(src)}
                    folder="hero"
                    placeholder="Cole a URL ou faça upload do banner principal"
                  />
                </div>

                {/* Restaurant BG */}
                <div className="space-y-3 bg-zinc-900/40 p-4 rounded-xl border border-zinc-850">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-orange-400 uppercase">Fundo do Restaurante / Bar</span>
                    <span className="text-[10px] text-gray-500">Seção Restaurante</span>
                  </div>
                  <ImageUploadField
                    label="Imagem do Restaurante"
                    value={tempRestaurantImage}
                    onChange={(src) => setTempRestaurantImage(src)}
                    folder="restaurant"
                    placeholder="Cole a URL ou faça upload da foto do restaurante"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-black uppercase text-white tracking-wide font-display">Gerenciar Fotos da Galeria</h3>
                <p className="text-xs text-gray-400 mt-1">Insira fotos reais de suas quadras, eventos e do restaurante. Mude títulos e categorias instantaneamente.</p>
              </div>
              
              <button
                onClick={() => {
                  setEditingGalleryItem(null);
                  setGalleryTitle('');
                  setGallerySrc('');
                  setGalleryAlt('');
                  setGalleryCategory('arena');
                  setShowGalleryModal(true);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:scale-102 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
                id="add-new-gallery-btn"
              >
                <PlusCircle className="w-4 h-4" />
                Nova Foto
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="admin-gallery-grid">
              {galleryItems.map(item => (
                <div key={item.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between" id={`admin-gallery-item-${item.id}`}>
                  <div className="h-40 relative">
                    <img
                      src={item.src}
                      alt={item.alt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-[9px] font-black uppercase bg-orange-500 text-black px-2 py-0.5 rounded-full font-sans">
                        {item.category === 'arena' ? 'Arena' : item.category === 'sports' ? 'Esporte' : 'Restaurante'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <h4 className="text-xs font-black uppercase text-white tracking-wide line-clamp-1">{item.title}</h4>
                    <p className="text-[10px] text-gray-500 truncate" title={item.src}>
                      {item.src}
                    </p>
                    
                    <div className="border-t border-zinc-900 pt-3 flex gap-2">
                      <button
                        onClick={() => handleEditGalleryItem(item)}
                        className="flex-1 px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-orange-500/20 text-orange-400 rounded-lg hover:bg-zinc-800 transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer text-center"
                        id={`edit-gallery-item-${item.id}`}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteGalleryItem(item.id)}
                        className="flex-1 px-2.5 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer text-center"
                        id={`delete-gallery-item-${item.id}`}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GOOGLE FORMS TAB CONTENT */}
        {adminSubTab === 'forms' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 animate-fade-in" id="admin-forms-manager">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase text-white tracking-wide">Integração Google Forms</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Visualize e analise as respostas de satisfação e inscrições enviadas pelos seus clientes.</p>
                </div>
              </div>

              {!googleUser && isFirebaseEnabled && (
                <button
                  onClick={handleGoogleLogin}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-purple-600/10 flex items-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M21.35 11.1H12v2.7h5.35c-.22 1.15-.87 2.13-1.84 2.78v2.3h3c1.76-1.62 2.77-4 2.77-6.88 0-.6-.05-1.2-.13-1.9zM12 21.3c2.5 0 4.6-.83 6.14-2.26l-3-2.3c-.83.56-1.9.9-3.14.9-2.42 0-4.47-1.63-5.2-3.83H1.1v2.4c1.5 3 4.63 5.09 8.22 5.09zM6.8 13.82c-.18-.56-.29-1.15-.29-1.77s.11-1.2.29-1.76V7.9H1.1c-.67 1.34-1.05 2.85-1.05 4.45s.38 3.1 1.05 4.45l4.7-3.98zM12 6.6c1.36 0 2.58.47 3.54 1.38l2.65-2.65C16.58 3.84 14.43 3 12 3c-3.6 0-6.72 2.08-8.23 5.09l4.7 3.98c.73-2.2 2.78-3.83 5.2-3.83z"/>
                  </svg>
                  Conectar Conta Google
                </button>
              )}
            </div>

            {!isFirebaseEnabled ? (
              <div className="text-center py-12 bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6">
                <AlertCircle className="w-12 h-12 text-amber-500/40 mx-auto mb-4 animate-pulse" />
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider text-amber-400">Integração Opcional Desativada (Modo Local)</h4>
                <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
                  A integração com o <strong>Google Forms</strong> requer uma configuração ativa do Firebase para autenticar o login do Google. 
                  Para testar esse recurso de forma autônoma, adicione suas chaves do Firebase no arquivo <code>.env</code>.
                </p>
                <div className="mt-4 bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl text-left inline-block max-w-xs text-[10px] font-mono text-gray-500">
                  VITE_FIREBASE_API_KEY="..."<br/>
                  VITE_FIREBASE_PROJECT_ID="..."
                </div>
              </div>
            ) : !googleUser ? (
              <div className="text-center py-12 bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6">
                <FileText className="w-12 h-12 text-purple-400/40 mx-auto mb-4" />
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Acesso Protegido</h4>
                <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
                  Para carregar formulários ativos da sua conta e sincronizar as respostas recebidas, conecte seu login de proprietário da Arena ao Google Services.
                </p>
                <button
                  onClick={handleGoogleLogin}
                  className="mt-6 px-6 py-3 bg-white hover:bg-gray-100 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
                >
                  Autorizar Acesso ao Forms
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Search and configuration block */}
                <div className="bg-zinc-950/60 p-5 rounded-2xl border border-zinc-800 flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-grow space-y-1">
                    <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400">
                      ID do Formulário do Google (Form ID)
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-purple-400" />
                      <input
                        type="text"
                        value={formId}
                        onChange={(e) => setFormId(e.target.value)}
                        placeholder="Insira o ID do seu formulário (ex: 1FAIpQLSeQyO78vW_mGv...)"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-purple-500 transition-all placeholder-gray-600"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => loadFormAndResponses(formId)}
                    disabled={isLoadingForms || !formId.trim()}
                    className="w-full md:w-auto px-6 py-3.5 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-800 disabled:text-gray-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    {isLoadingForms ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Carregando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Sincronizar Formulário
                      </>
                    )}
                  </button>
                </div>

                {formErrorMsg && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium flex gap-2.5">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{formErrorMsg}</span>
                  </div>
                )}

                {isLoadingForms ? (
                  <div className="py-20 text-center space-y-3">
                    <div className="w-10 h-10 border-2 border-t-purple-500 border-zinc-800 rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-gray-500 font-medium">Conectando aos servidores do Google Forms...</p>
                  </div>
                ) : formDetails ? (
                  <div className="space-y-6">
                    {/* Form Summary Card */}
                    <div className="bg-zinc-950/40 p-6 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <span className="text-[9px] uppercase font-black bg-purple-500/10 border border-purple-500/25 text-purple-400 px-2 py-0.5 rounded-md">Ativo</span>
                        <h4 className="text-base font-black text-white mt-1.5">{formDetails.info?.title || 'Formulário do Google'}</h4>
                        {formDetails.info?.description && (
                          <p className="text-xs text-gray-400 mt-1">{formDetails.info.description}</p>
                        )}
                      </div>

                      <div className="text-left sm:text-right space-y-1 shrink-0">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Respostas Recebidas</span>
                        <p className="text-3xl font-black text-purple-400">{formResponses.length}</p>
                      </div>
                    </div>

                    {/* Responses Listing Table */}
                    <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl overflow-hidden">
                      <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/20">
                        <span className="text-xs font-black uppercase tracking-wider text-white">Respostas de Clientes</span>
                        <span className="text-[10px] font-mono text-gray-500">Form ID: {formDetails.formId}</span>
                      </div>

                      {formResponses.length === 0 ? (
                        <div className="py-12 text-center text-gray-500 text-xs font-medium">
                          Nenhuma resposta cadastrada ou enviada para este formulário ainda.
                        </div>
                      ) : (
                        <div className="overflow-x-auto max-h-[450px] scrollbar-thin">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-zinc-800 text-[10px] uppercase font-black tracking-widest text-gray-400 bg-zinc-950/60">
                                <th className="p-4">Data de Envio</th>
                                <th className="p-4">ID de Resposta</th>
                                <th className="p-4">Visualizar Respostas</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900 text-xs">
                              {formResponses.map((resp: any, rIdx) => {
                                const submittedDate = resp.lastSubmittedTime ? new Date(resp.lastSubmittedTime).toLocaleDateString('pt-BR', {
                                  day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                                }) : 'Data Indisponível';

                                return (
                                  <tr key={resp.responseId || rIdx} className="hover:bg-zinc-900/40 transition-colors">
                                    <td className="p-4 font-mono font-bold text-white">{submittedDate}</td>
                                    <td className="p-4 text-gray-400 font-mono text-[10px]">{resp.responseId || `resp-${rIdx}`}</td>
                                    <td className="p-4">
                                      <div className="space-y-1 text-[11px] bg-zinc-950/80 p-3 rounded-lg border border-zinc-800 max-w-lg">
                                        {resp.answers && Object.entries(resp.answers).map(([qId, ans]: any) => {
                                          const questionText = formDetails.items?.find((it: any) => it.questionItem?.question?.questionId === qId)?.title || `Pergunta ${qId}`;
                                          const answerVal = ans.textAnswers?.answers?.map((v: any) => v.value).join(', ') || '-';
                                          return (
                                            <div key={qId} className="flex flex-col gap-0.5 border-b border-zinc-900/60 pb-1.5 last:border-0 last:pb-0">
                                              <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wide">{questionText}</span>
                                              <span className="text-gray-200 font-medium">{answerVal}</span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-zinc-950/20 border border-zinc-850/60 rounded-2xl flex flex-col items-center justify-center p-6">
                    <FileText className="w-10 h-10 text-purple-500/30 mb-3" />
                    <h4 className="text-xs font-bold text-gray-300">Nenhum Formulário Carregado</h4>
                    <p className="text-[10px] text-gray-500 mt-1 max-w-sm leading-relaxed">
                      Insira o ID do seu Formulário do Google no campo de busca acima e clique em "Sincronizar" para ler as perguntas e respostas ativas da sua conta.
                    </p>
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => {
                          const demoId = '1FAIpQLSeQyO78vW_mGv-P_0NqS8I8q8B-g-5f8C3lE7z5P5Qv3_9A9w'; // a mock placeholder but realistic google forms id
                          setFormId(demoId);
                          loadFormAndResponses(demoId);
                        }}
                        className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-purple-400 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-zinc-800 transition-all"
                      >
                        Carregar ID de Exemplo
                      </button>
                      <a
                        href="https://forms.google.com"
                        target="_blank"
                        rel="noreferrer referrer"
                        className="px-3.5 py-2 bg-purple-500/10 text-purple-300 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-purple-500/20 hover:bg-purple-500/20 transition-all flex items-center gap-1.5"
                      >
                        Criar Novo Formulário
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* GOOGLE DRIVE TAB CONTENT */}
        {adminSubTab === 'drive' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 animate-fade-in" id="admin-drive-manager">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase text-white tracking-wide">Repositório Google Drive</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Armazene, organize e gerencie regulamentos de torneios, fotos originais e planilhas de finanças.</p>
                </div>
              </div>

              {!googleUser && isFirebaseEnabled && (
                <button
                  onClick={handleGoogleLogin}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-600/10 flex items-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M21.35 11.1H12v2.7h5.35c-.22 1.15-.87 2.13-1.84 2.78v2.3h3c1.76-1.62 2.77-4 2.77-6.88 0-.6-.05-1.2-.13-1.9zM12 21.3c2.5 0 4.6-.83 6.14-2.26l-3-2.3c-.83.56-1.9.9-3.14.9-2.42 0-4.47-1.63-5.2-3.83H1.1v2.4c1.5 3 4.63 5.09 8.22 5.09zM6.8 13.82c-.18-.56-.29-1.15-.29-1.77s.11-1.2.29-1.76V7.9H1.1c-.67 1.34-1.05 2.85-1.05 4.45s.38 3.1 1.05 4.45l4.7-3.98zM12 6.6c1.36 0 2.58.47 3.54 1.38l2.65-2.65C16.58 3.84 14.43 3 12 3c-3.6 0-6.72 2.08-8.23 5.09l4.7 3.98c.73-2.2 2.78-3.83 5.2-3.83z"/>
                  </svg>
                  Conectar Conta Google
                </button>
              )}
            </div>

            {!isFirebaseEnabled ? (
              <div className="text-center py-12 bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6">
                <AlertCircle className="w-12 h-12 text-amber-500/40 mx-auto mb-4 animate-pulse" />
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider text-amber-400">Integração Opcional Desativada (Modo Local)</h4>
                <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
                  A integração com o <strong>Google Drive</strong> requer uma configuração ativa do Firebase para autenticar o login do Google. 
                  Para testar esse recurso de forma autônoma, adicione suas chaves do Firebase no arquivo <code>.env</code>.
                </p>
                <div className="mt-4 bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl text-left inline-block max-w-xs text-[10px] font-mono text-gray-500">
                  VITE_FIREBASE_API_KEY="..."<br/>
                  VITE_FIREBASE_PROJECT_ID="..."
                </div>
              </div>
            ) : !googleUser ? (
              <div className="text-center py-12 bg-zinc-950/40 border border-zinc-800 rounded-2xl p-6">
                <FolderOpen className="w-12 h-12 text-blue-400/40 mx-auto mb-4" />
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Acesso Protegido</h4>
                <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
                  Para visualizar seu repositório de arquivos de torneios e backups de faturamento, conecte seu login ao Google Drive.
                </p>
                <button
                  onClick={handleGoogleLogin}
                  className="mt-6 px-6 py-3 bg-white hover:bg-gray-100 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
                >
                  Autorizar Acesso ao Drive
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Uploader and Action card */}
                <div className="bg-zinc-950/60 p-6 rounded-2xl border border-zinc-850 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black uppercase text-white tracking-wide">Documentos e Regulamentos Administrativos</h4>
                    <p className="text-xs text-gray-400 max-w-xl">
                      Crie e envie instantaneamente o Regulamento do Torneio de Beach Tennis e Vôlei de Areia atualizado para o seu Google Drive para impressão ou envio por e-mail para atletas!
                    </p>
                  </div>

                  <button
                    onClick={handleCreateDemoFile}
                    disabled={isUploadingDemo}
                    className="w-full sm:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-600/10 shrink-0 flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-800 disabled:text-gray-500"
                  >
                    {isUploadingDemo ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Criando Regulamento...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Criar e Enviar Regulamento
                      </>
                    )}
                  </button>
                </div>

                {driveErrorMsg && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium flex gap-2.5">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{driveErrorMsg}</span>
                  </div>
                )}

                {/* Listing Drive files */}
                <div className="bg-zinc-950/40 border border-zinc-800 rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/20">
                    <span className="text-xs font-black uppercase tracking-wider text-white">Arquivos no Google Drive</span>
                    <button
                      onClick={fetchDriveFiles}
                      disabled={isLoadingDrive}
                      className="text-[10px] uppercase font-black tracking-widest text-blue-400 hover:text-blue-300 disabled:text-gray-600 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDrive ? 'animate-spin' : ''}`} />
                      Atualizar Lista
                    </button>
                  </div>

                  {isLoadingDrive && driveFiles.length === 0 ? (
                    <div className="py-20 text-center space-y-3">
                      <div className="w-8 h-8 border-2 border-t-blue-500 border-zinc-800 rounded-full animate-spin mx-auto" />
                      <p className="text-xs text-gray-500 font-medium">Buscando lista de arquivos no Google Drive...</p>
                    </div>
                  ) : driveFiles.length === 0 ? (
                    <div className="py-16 text-center text-gray-500 text-xs font-medium space-y-2">
                      <p>Nenhum arquivo listado ou encontrado no seu Drive.</p>
                      <p className="text-[10px] text-gray-600">Clique em "Criar e Enviar Regulamento" acima para testar a sincronização!</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto max-h-[450px] scrollbar-thin">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-zinc-800 text-[10px] uppercase font-black tracking-widest text-gray-400 bg-zinc-950/60">
                            <th className="p-4">Nome do Arquivo</th>
                            <th className="p-4">Tipo</th>
                            <th className="p-4">ID do Arquivo</th>
                            <th className="p-4">Ação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900 text-xs">
                          {driveFiles.map((file: any) => {
                            const isText = file.mimeType === 'text/plain';
                            const isFolder = file.mimeType === 'application/vnd.google-apps.folder';

                            return (
                              <tr key={file.id} className="hover:bg-zinc-900/40 transition-colors">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                      isFolder ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-400'
                                    }`}>
                                      <FolderOpen className="w-4 h-4" />
                                    </div>
                                    <span className="font-bold text-white max-w-xs truncate" title={file.name}>
                                      {file.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-4 text-gray-400 font-mono text-[10px] max-w-[120px] truncate" title={file.mimeType}>
                                  {isFolder ? 'Pasta' : file.mimeType?.replace('application/', '')}
                                </td>
                                <td className="p-4 text-gray-500 font-mono text-[10px] max-w-[150px] truncate" title={file.id}>
                                  {file.id}
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2.5">
                                    {file.webViewLink && (
                                      <a
                                        href={file.webViewLink}
                                        target="_blank"
                                        rel="noreferrer referrer"
                                        className="text-blue-400 hover:underline hover:text-blue-300 font-extrabold flex items-center gap-1.5"
                                      >
                                        Abrir no Drive
                                        <ExternalLink className="w-3.5 h-3.5" />
                                      </a>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* MODAL: ADD MANUAL BOOKING OR BLOCK SLOT */}
      {showAddModal && modalSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="admin-action-modal">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl overflow-hidden z-10 animate-fade-in">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-yellow-400" />
            
            <div className="mb-6">
              <h3 className="text-lg font-black uppercase text-white tracking-wide font-display">
                {modalType === 'block' ? 'Bloquear Horário' : 'Nova Reserva Manual'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Quadra: <span className="text-orange-400 font-extrabold">{courtsMap[adminCourtId]?.name}</span> | Data: <span className="text-white font-extrabold">{new Date(adminDate + 'T00:00:00').toLocaleDateString('pt-BR')}</span> | Hora: <span className="text-yellow-400 font-extrabold">{modalSlot}</span>
              </p>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              {modalType === 'block' ? (
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">
                    Motivo do Bloqueio
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Manutenção Mensal, Aula da Escolinha, Torneio"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-orange-500 transition-all placeholder-gray-600"
                    id="admin-block-reason"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">
                      Nome do Cliente
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: João da Silva"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-orange-500 transition-all placeholder-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">
                      Celular / WhatsApp do Cliente
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: (67) 99807-2596"
                      value={customPhone}
                      onChange={(e) => setCustomPhone(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-orange-500 transition-all placeholder-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">
                      Esporte
                    </label>
                    <select
                      value={customSport}
                      onChange={(e) => setCustomSport(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-orange-500 transition-all"
                    >
                      {courtsMap[adminCourtId]?.sports.map(sp => (
                        <option key={sp} value={sp}>{sp}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-zinc-950 text-gray-400 font-bold text-xs uppercase tracking-widest rounded-xl border border-zinc-800 hover:text-white transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all cursor-pointer"
                >
                  Confirmar Ação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT MENU ITEM */}
      {showMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowMenuModal(false)} />
          
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl overflow-hidden z-10 animate-fade-in">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-yellow-400" />
            
            <div className="mb-4">
              <h3 className="text-lg font-black uppercase text-white tracking-wide font-display">
                {editingMenuItem ? 'Editar Item do Cardápio' : 'Novo Item no Cardápio'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Preencha as informações do prato, lanche ou bebida abaixo.</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingMenuItem) {
                const updated = menuItems.map(item => item.id === editingMenuItem.id ? {
                  ...item,
                  name: menuName,
                  description: menuDesc,
                  price: menuPrice,
                  category: menuCategory,
                  tag: menuTag.trim() || undefined,
                  image: menuImage.trim() || undefined
                } : item);
                updateMenuItems(updated);
              } else {
                const newItem: MenuItem = {
                  id: `menu-item-${Date.now()}`,
                  name: menuName,
                  description: menuDesc,
                  price: menuPrice,
                  category: menuCategory,
                  tag: menuTag.trim() || undefined,
                  image: menuImage.trim() || undefined
                };
                updateMenuItems([...menuItems, newItem]);
              }
              setShowMenuModal(false);
            }} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Nome do Item</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Iscas de Frango Grelhado"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Ex: 35.50"
                    value={menuPrice || ''}
                    onChange={(e) => setMenuPrice(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Tag Especial (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ex: Mais Pedido, Novidade"
                    value={menuTag}
                    onChange={(e) => setMenuTag(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Categoria</label>
                <select
                  value={menuCategory}
                  onChange={(e) => setMenuCategory(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="portions">Porções</option>
                  <option value="drinks">Bebidas</option>
                  <option value="meals">Refeições</option>
                  <option value="snacks">Lanches</option>
                </select>
              </div>

              <div>
                <ImageUploadField
                  label="Foto do Item (Opcional)"
                  value={menuImage}
                  onChange={(url) => setMenuImage(url)}
                  folder="menu"
                  placeholder="Cole a URL ou faça upload da foto do item"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Descrição</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ex: Deliciosa porção de frango cortada em cubos, temperada com tempero especial da casa..."
                  value={menuDesc}
                  onChange={(e) => setMenuDesc(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowMenuModal(false)}
                  className="flex-1 py-3 bg-zinc-950 text-gray-400 font-bold text-xs uppercase tracking-widest rounded-xl border border-zinc-800 hover:text-white transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all cursor-pointer"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT TOURNAMENT */}
      {showTournamentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowTournamentModal(false)} />
          
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl overflow-hidden z-10 animate-fade-in">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-yellow-400" />
            
            <div className="mb-4">
              <h3 className="text-lg font-black uppercase text-white tracking-wide font-display">
                {editingTournament ? 'Editar Torneio' : 'Novo Torneio de Areia'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Preencha os detalhes do campeonato abaixo para divulgação no site.</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const catArray = tourCategories.split(',').map(s => s.trim()).filter(Boolean);
              
              if (editingTournament) {
                const updated = tournaments.map(t => t.id === editingTournament.id ? {
                  ...t,
                  title: tourTitle,
                  date: tourDate,
                  categories: catArray,
                  description: tourDesc,
                  price: tourPrice,
                  status: tourStatus,
                  image: tourImage.trim() || undefined
                } : t);
                updateTournaments(updated);
              } else {
                const newTour: Tournament = {
                  id: `tour-item-${Date.now()}`,
                  title: tourTitle,
                  date: tourDate,
                  categories: catArray,
                  description: tourDesc,
                  price: tourPrice,
                  status: tourStatus,
                  image: tourImage.trim() || undefined
                };
                updateTournaments([...tournaments, newTour]);
              }
              setShowTournamentModal(false);
            }} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Nome do Torneio</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 2º Open Arena Prime de Vôlei de Praia"
                  value={tourTitle}
                  onChange={(e) => setTourTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Data / Período</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 12 e 13 de Dezembro, 2026"
                    value={tourDate}
                    onChange={(e) => setTourDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Preço Inscrição (R$)</label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 50.00"
                    value={tourPrice || ''}
                    onChange={(e) => setTourPrice(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Status</label>
                <select
                  value={tourStatus}
                  onChange={(e) => setTourStatus(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Inscrições Abertas">Inscrições Abertas</option>
                  <option value="Em Breve">Em Breve</option>
                  <option value="Encerrado">Encerrado</option>
                </select>
              </div>

              <div>
                <ImageUploadField
                  label="Capa / Banner do Torneio (Opcional)"
                  value={tourImage}
                  onChange={(url) => setTourImage(url)}
                  folder="tournaments"
                  placeholder="Cole a URL ou faça upload da capa do torneio"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Categorias (Separadas por vírgula)</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Duplas Masculinas A, Duplas Femininas B, Misto"
                  value={tourCategories}
                  onChange={(e) => setTourCategories(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Descrição do Torneio / Premiação</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ex: Troféus e medalhas exclusivas + premiação em dinheiro para os campeões de cada categoria!"
                  value={tourDesc}
                  onChange={(e) => setTourDesc(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTournamentModal(false)}
                  className="flex-1 py-3 bg-zinc-950 text-gray-400 font-bold text-xs uppercase tracking-widest rounded-xl border border-zinc-800 hover:text-white transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all cursor-pointer"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT GALLERY PHOTO */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="admin-gallery-modal">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowGalleryModal(false)} />
          
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl overflow-hidden z-10 animate-fade-in">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-yellow-400" />
            
            <div className="mb-4">
              <h3 className="text-lg font-black uppercase text-white tracking-wide font-display">
                {editingGalleryItem ? 'Editar Foto da Galeria' : 'Nova Foto na Galeria'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Preencha os detalhes da foto para atualizar o álbum de fotos do site.</p>
            </div>

            <form onSubmit={handleSaveGalleryItem} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Título / Legenda</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Quadras de Areia ao Entardecer"
                  value={galleryTitle}
                  onChange={(e) => setGalleryTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <ImageUploadField
                  label="Foto da Galeria"
                  value={gallerySrc}
                  onChange={(url) => setGallerySrc(url)}
                  folder="gallery"
                  placeholder="Cole a URL ou faça upload da foto para a galeria"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Texto Alternativo (Acessibilidade)</label>
                <input
                  type="text"
                  placeholder="Ex: Foto ampla das quadras com iluminação ligada"
                  value={galleryAlt}
                  onChange={(e) => setGalleryAlt(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Categoria de Exibição</label>
                <select
                  value={galleryCategory}
                  onChange={(e) => setGalleryCategory(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="arena">A Arena (Instalações / Recepção)</option>
                  <option value="sports">Esportes (Ação / Atletas / Partidas)</option>
                  <option value="food">Restaurante (Porções / Drinks / Pratos)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGalleryModal(false)}
                  className="flex-1 py-3 bg-zinc-950 text-gray-400 font-bold text-xs uppercase tracking-widest rounded-xl border border-zinc-800 hover:text-white transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all cursor-pointer"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
