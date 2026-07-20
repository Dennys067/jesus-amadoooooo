import React, { useState, useMemo } from 'react';
import { Utensils, Beer, Flame, Sparkles, HelpCircle, Clock } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuSectionProps {
  restaurantImage: string;
  menuItems: MenuItem[];
}

export default function MenuSection({ restaurantImage, menuItems }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'portions' | 'drinks' | 'meals' | 'snacks'>('all');

  // Category tags definitions
  const categories = [
    { id: 'all', label: 'Todos', icon: Utensils },
    { id: 'portions', label: 'Porções', icon: Flame },
    { id: 'drinks', label: 'Bebidas', icon: Beer },
    { id: 'meals', label: 'Refeições', icon: Utensils },
    { id: 'snacks', label: 'Lanches', icon: Sparkles },
  ];

  // Filtering products
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return menuItems;
    return menuItems.filter(item => item.category === activeCategory);
  }, [activeCategory, menuItems]);

  return (
    <div className="bg-black text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8 animate-fade-in" id="menu-section-root">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-black uppercase tracking-widest rounded-full mb-3">
            <Beer className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
            Restaurante & Bar
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            CARDÁPIO <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400">DIGITAL</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">
            Saboreie nossas deliciosas porções rústicas, refeições típicas e bebidas trincando.
          </p>
        </div>

        {/* HERO FEATURE CARD (using generated food photo) */}
        <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/40 mb-12 h-64 sm:h-80 flex items-end">
          <div className="absolute inset-0 z-0">
            <img
              src={restaurantImage}
              alt="Delicious food at Arena Prime"
              className="w-full h-full object-cover object-center scale-102"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          </div>
          
          <div className="relative z-10 p-6 sm:p-8 max-w-2xl">
            <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full bg-orange-500 text-black font-extrabold mb-3 inline-block">
              Destaque do Chef
            </span>
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-wide text-white leading-tight">
              A combinação perfeita entre esporte e gastronomia
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-lg hidden sm:block">
              Porções crocantes feitas na hora com ingredientes frescos, cerveja trincando e refrigerantes ideais para repor as energias após o play na areia.
            </p>
          </div>
        </div>

        {/* CATEGORY BAR TABS */}
        <div className="flex flex-wrap gap-2.5 bg-zinc-900/60 p-2 rounded-2xl border border-zinc-800/80 mb-8" id="menu-categories-tabs">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-600 to-yellow-500 text-black shadow-lg shadow-orange-500/10'
                    : 'bg-zinc-950 text-gray-400 hover:text-white border border-zinc-850 hover:border-zinc-700'
                }`}
                id={`cat-btn-${cat.id}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* PRODUCT GRID - FULL WIDTH */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12" id="menu-items-grid">
          {filteredItems.map((item) => {
            return (
              <div
                key={item.id}
                className="bg-zinc-900/40 border border-zinc-800 hover:border-orange-500/20 rounded-3xl p-6 flex flex-col justify-between transition-all group relative overflow-hidden"
              >
                {/* Badge Tag */}
                {item.tag && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-yellow-400 text-black px-2.5 py-0.5 rounded-full shadow-sm">
                      {item.tag}
                    </span>
                  </div>
                )}

                <div>
                  {/* Placeholder Food Drawing/Visual */}
                  <div className="w-full h-36 rounded-2xl bg-zinc-950 flex items-center justify-center border border-zinc-850 mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-yellow-500/5 group-hover:scale-105 transition-all duration-300" />
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" referrerPolicy="no-referrer" />
                    ) : (
                      <Utensils className="w-10 h-10 text-orange-500/30 group-hover:text-orange-500/50 transition-all" />
                    )}
                  </div>

                  <h4 className="text-lg font-black uppercase text-white leading-tight group-hover:text-yellow-400 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-gray-400 text-xs mt-1.5 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-zinc-800 flex items-center justify-between w-full">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block">Preço</span>
                    <span className="text-xl font-black text-white">R$ {item.price.toFixed(2)}</span>
                  </div>

                  <div className="text-[10px] text-gray-500 italic flex items-center gap-1 font-medium bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-850">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    Feito na hora
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM ORDER INFORMATION (Friendly Reminder) */}
        <div className="max-w-3xl mx-auto bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-2xl flex items-center justify-center text-black shrink-0 shadow-lg shadow-orange-500/10">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-base font-black text-white uppercase tracking-wider">Como fazer seu pedido?</h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Consulte nosso cardápio e faça seu pedido diretamente com nossos garçons e atendentes na areia ou no bar do clube. Preparamos tudo na hora para você saborear o melhor da culinária de praia!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
