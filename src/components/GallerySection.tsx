import { useState } from 'react';
import { Image as ImageIcon, Camera, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GalleryItem } from '../types';

interface GallerySectionProps {
  galleryItems: GalleryItem[];
}

export default function GallerySection({ galleryItems }: GallerySectionProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'arena' | 'sports' | 'food'>('all');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const filters = [
    { id: 'all', label: 'Tudo' },
    { id: 'arena', label: 'A Arena' },
    { id: 'sports', label: 'Esportes' },
    { id: 'food', label: 'Restaurante' },
  ];

  const filteredItems = galleryItems.filter(
    item => activeFilter === 'all' || item.category === activeFilter
  );

  return (
    <div className="bg-black text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8" id="gallery-section-root">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-black uppercase tracking-widest rounded-full mb-3">
            <Camera className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            Galeria Digital
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            ÁLBUM DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300">FOTOS</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">
            Confira imagens reais da Arena Prime: nossas quadras, o clima contagiante das partidas e os pratos incríveis servidos em nosso restaurante.
          </p>
        </div>

        {/* GALLERY TABS */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" id="gallery-filters-container">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-black shadow-lg shadow-orange-500/15'
                  : 'bg-zinc-900 text-gray-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* PHOTO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="gallery-photos-grid">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={item.src + idx}
                onClick={() => setLightboxImage(item.src)}
                className="group relative h-64 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-850 cursor-pointer shadow-md"
              >
                {/* Image */}
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Cover Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5" />
                
                {/* Text details on Hover */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-[9px] font-black uppercase bg-orange-500 text-black px-2 py-0.5 rounded-full inline-block mb-1.5 font-sans">
                    {item.category === 'arena' ? 'Arena' : item.category === 'sports' ? 'Esporte' : 'Restaurante'}
                  </span>
                  <h4 className="text-sm font-black uppercase text-white tracking-wide truncate">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-gray-300 truncate mt-0.5 font-medium flex items-center gap-1">
                    <Eye className="w-3 h-3 text-yellow-400" />
                    Clique para ampliar
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" id="gallery-lightbox">
            {/* Close touch trigger on backdrop */}
            <div className="absolute inset-0 cursor-zoom-out" onClick={() => setLightboxImage(null)} />
            
            {/* Close button */}
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 p-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full border border-zinc-800 transition-all z-20 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image Wrap */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center z-10"
            >
              <img
                src={lightboxImage}
                alt="Enlarged view of Arena Prime"
                className="max-w-full max-h-full object-contain rounded-2xl border border-zinc-800 shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
