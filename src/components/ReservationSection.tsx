import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, User, Phone, Mail, CheckCircle2, ChevronRight, HelpCircle, Flame, Clock, CalendarRange, Sparkles, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Court, Booking } from '../types';
import { TIME_SLOTS, getRelativeDateString } from '../data';
import { GoogleUser as FirebaseUser } from '../types';

interface ReservationSectionProps {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  courts: Court[];
  googleUser: FirebaseUser | null;
  googleToken: string | null;
  handleGoogleLogin: () => void;
}

export default function ReservationSection({
  bookings,
  addBooking,
  courts,
  googleUser,
  googleToken,
  handleGoogleLogin,
}: ReservationSectionProps) {
  // Calendar: next 14 days starting from 2026-07-17
  const calendarDates = useMemo(() => {
    const dates = [];
    const baseDate = new Date('2026-07-17T00:00:00');
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    for (let i = 0; i < 14; i++) {
      const currentDate = new Date(baseDate);
      currentDate.setDate(baseDate.getDate() + i);
      
      const dateString = currentDate.toISOString().split('T')[0];
      const dayName = weekDays[currentDate.getDay()];
      const dayNum = currentDate.getDate();
      const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');

      dates.push({
        dateString,
        dayName,
        dayNum,
        monthName
      });
    }
    return dates;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(calendarDates[0].dateString);
  const [selectedCourtId, setSelectedCourtId] = useState<string>('');
  const [selectedSport, setSelectedSport] = useState<'Beach Tennis' | 'Vôlei de Praia' | 'Futvôlei'>('Beach Tennis');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Set default court ID once courts are loaded
  React.useEffect(() => {
    if (courts && courts.length > 0 && !selectedCourtId) {
      setSelectedCourtId(courts[0].id);
    }
  }, [courts, selectedCourtId]);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastCreatedBooking, setLastCreatedBooking] = useState<Booking | null>(null);

  // Google Calendar Integration State
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [calendarSyncStatus, setCalendarSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  const fetchGoogleCalendarEvents = async () => {
    if (!googleToken) return;
    try {
      setIsLoadingEvents(true);
      const res = await fetch('/api/google/calendar/events', {
        headers: {
          'Authorization': `Bearer ${googleToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.items) {
          // Filter out cancelled events and sort
          const activeEvents = data.items
            .filter((e: any) => e.status !== 'cancelled' && (e.start?.dateTime || e.start?.date))
            .sort((a: any, b: any) => {
              const dateA = new Date(a.start.dateTime || a.start.date).getTime();
              const dateB = new Date(b.start.dateTime || b.start.date).getTime();
              return dateA - dateB;
            });
          setCalendarEvents(activeEvents);
        }
      }
    } catch (err) {
      console.error('Error fetching calendar events:', err);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  React.useEffect(() => {
    if (googleToken) {
      fetchGoogleCalendarEvents();
    } else {
      setCalendarEvents([]);
    }
  }, [googleToken]);

  const handleSyncToGoogleCalendar = async (booking: Booking) => {
    if (!googleToken) {
      handleGoogleLogin();
      return;
    }

    try {
      setCalendarSyncStatus('syncing');
      const [startStr, endStr] = booking.timeSlot.split(' - ');
      const startIso = `${booking.date}T${startStr.trim()}:00`;
      const endIso = `${booking.date}T${endStr.trim()}:00`;

      const eventBody = {
        summary: `Reserva - ${booking.courtName}`,
        description: `Agendamento Arena Prime para praticar ${booking.sport}.\n\nCliente: ${booking.customerName}\nContato: ${booking.customerPhone}\nStatus: ${booking.status.toUpperCase()}`,
        start: {
          dateTime: startIso,
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: endIso,
          timeZone: 'America/Sao_Paulo',
        },
      };

      const res = await fetch('/api/google/calendar/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${googleToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventBody)
      });

      if (res.ok) {
        setCalendarSyncStatus('success');
        fetchGoogleCalendarEvents();
        setTimeout(() => setCalendarSyncStatus('idle'), 4000);
      } else {
        setCalendarSyncStatus('error');
      }
    } catch (err) {
      console.error('Failed to sync to Google Calendar:', err);
      setCalendarSyncStatus('error');
    }
  };

  // Get active court details
  const activeCourt = useMemo(() => {
    const fallbackCourt: Court = courts[0] || {
      id: '',
      name: 'Nenhuma Quadra Cadastrada',
      type: 'sand',
      sports: ['Beach Tennis'],
      description: '',
      priceHourly: 0
    };
    return courts.find(c => c.id === selectedCourtId) || fallbackCourt;
  }, [selectedCourtId, courts]);

  // Adjust sport if current court doesn't support the currently selected sport
  useMemo(() => {
    if (activeCourt && !activeCourt.sports.includes(selectedSport)) {
      setSelectedSport(activeCourt.sports[0]);
    }
  }, [activeCourt, selectedSport]);

  // Map slot status for active date and active court
  const slotStatuses = useMemo(() => {
    const statuses: Record<string, { isBooked: boolean; isBlocked: boolean; booking?: Booking }> = {};
    
    TIME_SLOTS.forEach(slot => {
      const match = bookings.find(
        b => b.date === selectedDate && 
             b.courtId === selectedCourtId && 
             b.timeSlot === slot &&
             b.status !== 'cancelled'
      );

      if (match) {
        statuses[slot] = {
          isBooked: !match.isBlockedSlot,
          isBlocked: !!match.isBlockedSlot,
          booking: match
        };
      } else {
        statuses[slot] = {
          isBooked: false,
          isBlocked: false
        };
      }
    });

    return statuses;
  }, [bookings, selectedDate, selectedCourtId]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.substring(0, 11);
    
    // Format: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
    if (val.length > 6) {
      val = `(${val.substring(0, 2)}) ${val.substring(2, 7)}-${val.substring(7)}`;
    } else if (val.length > 2) {
      val = `(${val.substring(0, 2)}) ${val.substring(2)}`;
    } else if (val.length > 0) {
      val = `(${val}`;
    }
    setCustomerPhone(val);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!selectedSlot) {
      setFormError('Por favor, selecione um horário disponível na grade.');
      return;
    }
    if (!customerName.trim()) {
      setFormError('Por favor, insira o seu nome completo.');
      return;
    }
    if (customerPhone.replace(/\D/g, '').length < 10) {
      setFormError('Por favor, insira um número de telefone/WhatsApp válido.');
      return;
    }

    const newBooking: Booking = {
      id: `b-user-${Date.now()}`,
      courtId: activeCourt.id,
      courtName: activeCourt.name,
      customerName: customerName.trim(),
      customerPhone: customerPhone,
      customerEmail: customerEmail.trim() || undefined,
      sport: selectedSport,
      date: selectedDate,
      timeSlot: selectedSlot,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    addBooking(newBooking);
    setLastCreatedBooking(newBooking);
    setShowSuccessModal(true);

    // Reset slot selection & customer form, keep user info for easier repeated bookings
    setSelectedSlot(null);
  };

  const handleWhatsAppConfirm = () => {
    if (!lastCreatedBooking) return;
    
    const formattedDate = new Date(lastCreatedBooking.date + 'T00:00:00')
      .toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const messageText = 
      `Olá Arena Prime!\n\n` +
      `Acabei de realizar uma reserva pelo site.\n\n` +
      `Nome: ${lastCreatedBooking.customerName}\n` +
      `Telefone: ${lastCreatedBooking.customerPhone}\n\n` +
      `Modalidade: ${lastCreatedBooking.sport}\n` +
      `Quadra: ${lastCreatedBooking.courtName}\n\n` +
      `Data: ${formattedDate}\n` +
      `Horário: ${lastCreatedBooking.timeSlot}\n\n` +
      `Gostaria de receber a chave Pix para efetuar o pagamento e concluir minha reserva.`;

    const encodedMessage = encodeURIComponent(messageText);
    window.open(`https://wa.me/5567998072596?text=${encodedMessage}`, '_blank');
    setShowSuccessModal(false);
  };

  return (
    <div className="bg-black text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8" id="reservation-section-root">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-black uppercase tracking-widest rounded-full mb-3">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            Rápido & Prático
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            RESERVA DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400">QUADRAS</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">
            Selecione o dia, a quadra, a modalidade do seu jogo e garanta o seu horário na areia!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: CONFIGURATION & CALENDAR (8 COLS) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* STEP 1: CALENDAR SELECTOR */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6" id="calendar-selector-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span className="text-sm font-black uppercase tracking-wider text-white">1. Selecione a Data</span>
                </div>
                <span className="text-xs text-gray-400 font-semibold italic">
                  Mostrando os próximos 14 dias
                </span>
              </div>

              {/* Horizontal Scrollable Dates Container */}
              <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {calendarDates.map((item) => {
                  const isSelected = selectedDate === item.dateString;
                  return (
                    <button
                      key={item.dateString}
                      onClick={() => {
                        setSelectedDate(item.dateString);
                        setSelectedSlot(null); // Reset slot selection
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl min-w-[72px] h-24 transition-all duration-300 border cursor-pointer select-none ${
                        isSelected
                          ? 'bg-gradient-to-br from-orange-600 to-yellow-500 text-black border-transparent shadow-lg shadow-orange-500/20 scale-102'
                          : 'bg-zinc-900 border-zinc-800 text-gray-400 hover:border-gray-700 hover:text-white'
                      }`}
                      id={`date-btn-${item.dateString}`}
                    >
                      <span className={`text-[10px] uppercase font-bold tracking-widest ${isSelected ? 'text-black font-extrabold' : 'text-gray-500'}`}>
                        {item.dayName}
                      </span>
                      <span className="text-2xl font-black my-0.5 leading-none">
                        {item.dayNum}
                      </span>
                      <span className={`text-[9px] uppercase font-bold ${isSelected ? 'text-black' : 'text-gray-400'}`}>
                        {item.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: COURT SELECTOR */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6" id="court-selector-card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span className="text-sm font-black uppercase tracking-wider text-white">2. Escolha a Quadra</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courts.map((court) => {
                  const isSelected = selectedCourtId === court.id;
                  return (
                    <button
                      key={court.id}
                      onClick={() => {
                        setSelectedCourtId(court.id);
                        setSelectedSlot(null); // Reset slot selection
                      }}
                      className={`text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-900 border-orange-500 shadow-md shadow-orange-500/10'
                          : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                      }`}
                      id={`court-btn-${court.id}`}
                    >
                      <div>
                        {court.image && (
                          <div className="w-full h-44 rounded-xl overflow-hidden mb-4 relative">
                            <img
                              src={court.image}
                              alt={court.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-black uppercase ${isSelected ? 'text-orange-400' : 'text-white'}`}>
                            {court.name}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 bg-zinc-800 px-2 py-0.5 rounded">
                            Areia
                          </span>
                        </div>
                        <p className="text-gray-400 text-[11px] leading-relaxed mb-4 line-clamp-2">
                          {court.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between w-full">
                        <div className="flex flex-wrap gap-1">
                          {court.sports.map((sp, sIdx) => (
                            <span key={sIdx} className="text-[9px] font-semibold bg-orange-500/10 text-yellow-400 px-1.5 py-0.5 rounded">
                              {sp}
                            </span>
                          ))}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[9px] text-gray-500 block uppercase font-bold">Slot 1h</span>
                          <span className="text-xs font-black text-white">R$ {court.priceHourly}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: SPORT TYPE SELECTOR */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6" id="sport-selector-card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span className="text-sm font-black uppercase tracking-wider text-white">3. Selecione a Modalidade</span>
              </div>

              <div className="flex flex-wrap gap-3">
                {activeCourt.sports.map((sport) => {
                  const isSelected = selectedSport === sport;
                  return (
                    <button
                      key={sport}
                      onClick={() => setSelectedSport(sport)}
                      className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-yellow-400 text-black shadow-md shadow-yellow-400/10'
                          : 'bg-zinc-950 border border-zinc-800 text-gray-400 hover:text-white hover:border-zinc-700'
                      }`}
                      id={`sport-btn-${sport}`}
                    >
                      {sport}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 4: TIME SLOTS GRID */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6" id="slots-selector-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span className="text-sm font-black uppercase tracking-wider text-white">4. Selecione o Horário</span>
                </div>
                {/* Legends */}
                <div className="flex gap-3 text-[10px] text-gray-400 font-semibold">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-zinc-800 inline-block border border-zinc-700" />
                    <span>Livre</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-red-500/20 inline-block border border-red-500/30" />
                    <span>Ocupado</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-zinc-700/60 inline-block" />
                    <span>Bloqueado</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TIME_SLOTS.map((slot) => {
                  const status = slotStatuses[slot];
                  const isSelected = selectedSlot === slot;
                  
                  let buttonClass = 'bg-zinc-950 border-zinc-800 text-gray-300 hover:border-orange-500/50 hover:bg-orange-500/5';
                  let isDisabled = false;
                  let subtitle = 'Disponível';

                  if (status.isBlocked) {
                    buttonClass = 'bg-zinc-800/40 border-transparent text-gray-600 cursor-not-allowed';
                    isDisabled = true;
                    subtitle = 'Bloqueado';
                  } else if (status.isBooked) {
                    buttonClass = 'bg-red-500/10 border-red-500/20 text-red-400/80 cursor-not-allowed';
                    isDisabled = true;
                    subtitle = status.booking?.sport || 'Reservado';
                  } else if (isSelected) {
                    buttonClass = 'bg-orange-500 text-black border-transparent font-black shadow-lg shadow-orange-500/10';
                  }

                  return (
                    <button
                      key={slot}
                      disabled={isDisabled}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-4 rounded-2xl border transition-all duration-200 text-center flex flex-col justify-center items-center ${buttonClass} ${!isDisabled && 'cursor-pointer'}`}
                      id={`slot-btn-${slot.replace(/\s/g, '')}`}
                    >
                      <span className="text-sm font-bold tracking-wide">{slot}</span>
                      <span className={`text-[9px] uppercase tracking-wider mt-1 ${
                        isSelected 
                          ? 'text-black font-extrabold' 
                          : status.isBooked 
                          ? 'text-red-400/85' 
                          : status.isBlocked 
                          ? 'text-gray-500' 
                          : 'text-emerald-400'
                      }`}>
                        {subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: CUSTOMER INFO & RESUME (4 COLS) */}
          <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6" id="booking-sidebar-panel">
            <h3 className="text-lg font-black uppercase tracking-wider text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-orange-500" />
              Resumo da Reserva
            </h3>

            {/* Booking specifications summary */}
            <div className="space-y-3 bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800/50 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold uppercase tracking-widest text-[9px]">Data:</span>
                <span className="text-white font-extrabold">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold uppercase tracking-widest text-[9px]">Quadra:</span>
                <span className="text-orange-400 font-extrabold">{activeCourt.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold uppercase tracking-widest text-[9px]">Esporte:</span>
                <span className="text-yellow-400 font-extrabold">{selectedSport}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold uppercase tracking-widest text-[9px]">Horário:</span>
                <span className={`font-extrabold ${selectedSlot ? 'text-white' : 'text-orange-500 animate-pulse'}`}>
                  {selectedSlot || 'Selecione um horário'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-800/80 text-sm">
                <span className="text-white font-black uppercase tracking-wide">Valor do Período:</span>
                <span className="text-emerald-400 font-black">R$ {activeCourt.priceHourly.toFixed(2)}</span>
              </div>
            </div>

            {/* FORM FOR CUSTOMER DETAILS */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-orange-500">Dados do Cliente</h4>
              
              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">
                  Seu Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: João da Silva"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-orange-500 transition-all placeholder-gray-600"
                    id="input-customer-name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">
                  WhatsApp / Celular
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    required
                    placeholder="Ex: (67) 99807-2596"
                    value={customerPhone}
                    onChange={handlePhoneChange}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-orange-500 transition-all placeholder-gray-600"
                    id="input-customer-phone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">
                  E-mail (Opcional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    placeholder="Ex: joao@gmail.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-orange-500 transition-all placeholder-gray-600"
                    id="input-customer-email"
                  />
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-orange-600 to-yellow-500 text-black font-extrabold rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-orange-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                id="btn-confirm-reservation"
              >
                Solicitar Reserva de Quadra
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>

            <div className="p-4 bg-zinc-950/40 rounded-xl border border-zinc-800 flex gap-3">
              <HelpCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <div className="text-[10px] text-gray-400 leading-relaxed">
                Após solicitar a reserva no site, você será convidado a enviar o comprovante diretamente ao WhatsApp da Arena Prime para garantir a confirmação final com os proprietários.
              </div>
            </div>

          </div>

        </div>

        {/* GOOGLE CALENDAR TIMELINE INTEGRATION */}
        <div className="mt-12 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden" id="google-calendar-integration-widget">
          {/* Decorative glowing gradient circle */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-800 pb-6 mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <CalendarRange className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider text-white">
                  Agenda Esportiva do Google
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Visualize seus compromissos pessoais e sincronize suas reservas de quadras da Arena Prime.
                </p>
              </div>
            </div>

            {googleUser && (
              <button
                onClick={fetchGoogleCalendarEvents}
                disabled={isLoadingEvents}
                className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-xs text-gray-300 font-bold uppercase tracking-wider rounded-xl border border-zinc-800 transition-all cursor-pointer flex items-center gap-2"
              >
                <Clock className={`w-3.5 h-3.5 ${isLoadingEvents ? 'animate-spin' : ''}`} />
                {isLoadingEvents ? 'Atualizando...' : 'Atualizar Agenda'}
              </button>
            )}
          </div>

          {!googleUser ? (
            <div className="text-center py-10 px-4 flex flex-col items-center justify-center">
              <Sparkles className="w-10 h-10 text-yellow-400/80 mb-4 animate-pulse" />
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Mantenha seus Jogos Sincronizados
              </h4>
              <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
                Conecte sua conta do Google para visualizar seus compromissos nesta tela e salvar suas reservas diretamente no seu Google Calendar com apenas um clique!
              </p>
              <button
                onClick={handleGoogleLogin}
                className="mt-6 flex items-center gap-3 bg-white hover:bg-gray-100 text-black font-extrabold text-xs uppercase tracking-widest py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:scale-[1.02]"
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
                <span>Conectar Google Calendar</span>
              </button>
            </div>
          ) : (
            <div>
              {isLoadingEvents && calendarEvents.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-2 border-t-blue-500 border-zinc-800 rounded-full animate-spin" />
                  <span className="text-xs text-gray-500 font-medium">Buscando seus compromissos no Google...</span>
                </div>
              ) : calendarEvents.length === 0 ? (
                <div className="py-10 text-center">
                  <Check className="w-8 h-8 text-emerald-500/60 mx-auto mb-3" />
                  <h4 className="text-xs font-bold text-gray-300">Sua agenda está livre!</h4>
                  <p className="text-[10px] text-gray-500 mt-1">Nenhum compromisso encontrado para os próximos dias no seu Google Calendar principal.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {calendarEvents.map((event: any) => {
                    const startVal = event.start.dateTime || event.start.date;
                    const dateObj = new Date(startVal);
                    const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                    const formattedTime = event.start.dateTime ? dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Dia Inteiro';

                    const isArenaEvent = event.summary?.toLowerCase().includes('arena prime') || event.summary?.toLowerCase().includes('reserva');

                    return (
                      <div
                        key={event.id}
                        className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-3 ${
                          isArenaEvent
                            ? 'bg-blue-950/20 border-blue-500/20 shadow-lg shadow-blue-500/5'
                            : 'bg-zinc-950/40 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-md ${
                              isArenaEvent ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-zinc-800 text-gray-400'
                            }`}>
                              {isArenaEvent ? 'Arena Prime' : 'Pessoal'}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-extrabold font-mono">
                              <Clock className="w-3 h-3 text-gray-500" />
                              <span>{formattedTime}</span>
                            </div>
                          </div>
                          <h4 className="text-xs font-bold text-white tracking-wide truncate mt-1">
                            {event.summary || '(Sem Título)'}
                          </h4>
                          {event.description && (
                            <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                        <div className="text-[10px] font-black text-gray-400 font-mono border-t border-zinc-800/60 pt-2 flex items-center justify-between">
                          <span>📅 {formattedDate}</span>
                          {event.htmlLink && (
                            <a
                              href={event.htmlLink}
                              target="_blank"
                              rel="noreferrer referrer"
                              className="text-blue-400 hover:underline hover:text-blue-300"
                            >
                              Ver no Google
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* WHATSAPP CONFIRMATION SUCCESS DIALOG MODAL */}
      <AnimatePresence>
        {showSuccessModal && lastCreatedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="success-modal">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl overflow-hidden z-10"
            >
              {/* Top orange gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-yellow-400" />
              
              <div className="text-center mt-4">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <h3 className="text-xl font-black uppercase text-white tracking-wide">
                  Pedido de Reserva Salvo!
                </h3>
                <p className="text-xs text-gray-400 mt-2 px-2">
                  Sua reserva foi pré-agendada localmente com sucesso. Agora, falta apenas confirmar pelo WhatsApp para oficializar com a equipe da Arena Prime!
                </p>
              </div>

              {/* Receipt details */}
              <div className="my-6 bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-xs text-left space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Quadra:</span>
                  <span className="text-white font-extrabold">{lastCreatedBooking.courtName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Esporte:</span>
                  <span className="text-yellow-400 font-extrabold">{lastCreatedBooking.sport}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Data:</span>
                  <span className="text-white font-extrabold">
                    {new Date(lastCreatedBooking.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Horário:</span>
                  <span className="text-white font-extrabold">{lastCreatedBooking.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cliente:</span>
                  <span className="text-white font-extrabold">{lastCreatedBooking.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Telefone:</span>
                  <span className="text-white font-extrabold">{lastCreatedBooking.customerPhone}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleWhatsAppConfirm}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  id="btn-modal-whatsapp"
                >
                  Confirmar via WhatsApp
                </button>

                {/* Google Calendar Sync Button */}
                <button
                  onClick={() => handleSyncToGoogleCalendar(lastCreatedBooking)}
                  disabled={calendarSyncStatus === 'syncing' || calendarSyncStatus === 'success'}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2.5 border cursor-pointer ${
                    calendarSyncStatus === 'success'
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 font-extrabold'
                      : calendarSyncStatus === 'syncing'
                      ? 'bg-zinc-900 border-zinc-800 text-gray-400 font-bold'
                      : 'bg-white hover:bg-gray-100 text-black border-transparent shadow-md font-bold'
                  }`}
                >
                  {calendarSyncStatus === 'success' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      Salvo na Agenda!
                    </>
                  ) : calendarSyncStatus === 'syncing' ? (
                    <>
                      <Clock className="w-4 h-4 text-gray-500 animate-spin" />
                      Salvando na Agenda...
                    </>
                  ) : (
                    <>
                      <CalendarIcon className="w-4 h-4 text-blue-600" />
                      Adicionar ao Google Agenda
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-3 bg-zinc-950 text-gray-400 font-bold text-xs uppercase tracking-widest rounded-xl border border-zinc-800 hover:text-white transition-all cursor-pointer"
                  id="btn-modal-close"
                >
                  Fechar e Continuar no Site
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
