import React, { useState } from 'react';
import { Phone, Instagram, MapPin, Clock, Send, MessageCircle, HelpCircle, Mail } from 'lucide-react';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('Geral');
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const formattedText = 
      `Olá Arena Prime! Meu nome é *${name.trim()}*.\n` +
      `Gostaria de falar sobre o assunto: *${subject}*.\n\n` +
      `*Mensagem:*\n${message.trim()}`;

    const encoded = encodeURIComponent(formattedText);
    window.open(`https://wa.me/5567998072596?text=${encoded}`, '_blank');
  };

  const contactCards = [
    {
      icon: Phone,
      title: 'WhatsApp Oficial',
      detail: '(67) 99807-2596',
      sub: 'Clique para iniciar conversa imediata',
      link: 'https://wa.me/5567998072596',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      icon: Instagram,
      title: 'Instagram',
      detail: '@arena_prime2026',
      sub: 'Acompanhe nosso dia a dia e fotos',
      link: 'https://www.instagram.com/arena_prime2026/',
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/20'
    },
    {
      icon: MapPin,
      title: 'Endereço',
      detail: 'Av. Presidente Vargas',
      sub: 'Glória de Dourados/MS — CEP 79730-000',
      link: 'https://maps.google.com/?q=Arena+Prime+Gloria+de+Dourados+MS',
      color: 'text-orange-400 bg-orange-500/10 border-orange-500/20'
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8" id="contact-section-root">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-black uppercase tracking-widest rounded-full mb-3">
            <MessageCircle className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            Canais de Comunicação
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            FALE COM A <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300">ARENA</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">
            Estamos prontos para tirar suas dúvidas sobre reservas de mensalistas, eventos, torneios ou parcerias comerciais!
          </p>
        </div>

        {/* 3 COLUMN CONTACT OPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16" id="contact-quick-cards">
          {contactCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <a
                href={card.link}
                target="_blank"
                rel="noreferrer"
                key={idx}
                className={`p-6 rounded-3xl border bg-zinc-900/40 hover:border-orange-500/30 hover:bg-zinc-900/60 transition-all flex flex-col items-center text-center group cursor-pointer`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-5 group-hover:scale-105 transition-all ${card.color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black uppercase text-white mb-1">{card.title}</h3>
                <p className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300 font-mono">
                  {card.detail}
                </p>
                <p className="text-xs text-gray-500 mt-2 font-medium">{card.sub}</p>
              </a>
            );
          })}
        </div>

        {/* BOTTOM ROW: FORM & MAP SIMULATOR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* CONTACT CONCIERGE FORM (7 COLS) */}
          <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between" id="contact-form-panel">
            <div>
              <h3 className="text-xl font-black uppercase text-white tracking-wide mb-2">
                Envie uma Mensagem Direta
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                Preencha o formulário rápido abaixo para gerar uma mensagem formatada e abrir o WhatsApp imediatamente de forma limpa.
              </p>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">
                      Seu Nome
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Oliveira"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-orange-500 transition-all placeholder-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">
                      Assunto Principal
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-orange-500 transition-all"
                    >
                      <option value="Geral">Dúvida Geral</option>
                      <option value="Mensalista">Ser Mensalista de Quadra</option>
                      <option value="Torneio">Dúvida sobre Torneio</option>
                      <option value="Eventos">Aluguel da Arena para Eventos</option>
                      <option value="Patrocínio">Parcerias e Patrocínio</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">
                    Sua Mensagem
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Escreva detalhadamente o que você precisa..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-orange-500 transition-all placeholder-gray-700 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-orange-600 to-yellow-500 text-black font-extrabold rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-orange-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer ml-auto"
                >
                  Enviar via WhatsApp
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* SIMULATED MAP / OPERATIONAL HOURS (5 COLS) */}
          <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between space-y-6" id="contact-info-panel">
            
            {/* Operational hours card */}
            <div className="space-y-4">
              <h3 className="text-xl font-black uppercase text-white tracking-wide border-b border-zinc-800 pb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Horários de Funcionamento
              </h3>
              
              <div className="space-y-2.5 text-xs text-gray-300">
                <div className="flex justify-between py-1 border-b border-zinc-800/50">
                  <span className="font-bold">Segunda a Domingo</span>
                  <span className="text-white font-extrabold">17:00 às 22:00</span>
                </div>
                <div className="flex justify-between py-1 text-orange-400">
                  <span className="font-bold font-sans">Bar & Restaurante</span>
                  <span className="font-extrabold">Aberto a partir das 17:00</span>
                </div>
              </div>
            </div>

            {/* Map Simulator block */}
            <div className="relative h-48 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center text-center p-6">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-yellow-500/5" />
              
              <MapPin className="w-8 h-8 text-orange-500 animate-bounce mb-3" />
              <h4 className="text-sm font-black text-white uppercase tracking-wider">Como Chegar</h4>
              <p className="text-[10px] text-gray-400 max-w-xs mt-1 leading-relaxed">
                Av. Presidente Vargas, Glória de Dourados/MS.<br />
                Ao lado da principal avenida esportiva da cidade. Estacionamento fácil e seguro no local!
              </p>
              
              <a
                href="https://maps.google.com/?q=Arena+Prime+Gloria+de+Dourados+MS"
                target="_blank"
                rel="noreferrer"
                className="mt-3.5 px-4 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-orange-500/30 text-[10px] uppercase tracking-widest font-black rounded-lg transition-all text-orange-400 hover:text-white"
              >
                Abrir no Google Maps
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
