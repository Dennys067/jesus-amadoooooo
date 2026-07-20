import { useState, useEffect } from 'react';
import { Trophy, ShieldCheck, MapPin, Sparkles, Target, Zap, Clock, Star, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tournament } from '../types';

interface HomeSectionProps {
  onNavigateToBooking: () => void;
  onNavigateToMenu: () => void;
  heroImage: string;
  tournaments: Tournament[];
}

export default function HomeSection({ onNavigateToBooking, onNavigateToMenu, heroImage, tournaments }: HomeSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      url: '/src/assets/images/arena_prime_atleta_bt_1784289981099.jpg',
      label: 'Nossas quadras em atividade'
    },
    {
      url: '/src/assets/images/arena_prime_casal_proprietario_1784289995907.jpg',
      label: 'Ambiente familiar e acolhedor'
    },
    {
      url: '/src/assets/images/arena_prime_torneio_podio_1784290009809.jpg',
      label: 'Torneios e pódios memoráveis'
    },
    {
      url: '/src/assets/images/arena_prime_smash_sunset_1784290023226.jpg',
      label: 'Jogos de alto nível técnico'
    },
    {
      url: heroImage,
      label: 'Comunidade Arena Prime'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const sports = [
    {
      title: 'Beach Tennis',
      description: 'O esporte que mais cresce no Brasil! Uma mistura contagiante de tênis tradicional, vôlei de praia e badminton. Fácil de aprender, extremamente divertido e ótimo para queimar calorias na areia.',
      benefits: ['Fácil de jogar para qualquer idade', 'Desenvolve agilidade e reflexos rápidos', 'Baixo impacto nas articulações devido à areia'],
      hours: '17:00 às 22:00',
      color: 'from-orange-500 to-amber-500'
    },
    {
      title: 'Vôlei de Praia',
      description: 'Clássico das areias brasileiras. Excelente para trabalhar a coordenação, o salto, o fôlego e o espírito de equipe. Nossa areia premium tratada simula a sensação exata de jogar na praia!',
      benefits: ['Fortalecimento muscular completo', 'Excelente treino cardiovascular', 'Perfeito para jogar em duplas ou quartetos'],
      hours: '17:00 às 22:00',
      color: 'from-amber-500 to-yellow-400'
    },
    {
      title: 'Futvôlei',
      description: 'Habilidade, controle e muita diversão! Combine as regras do vôlei com a arte do futebol. Use a cabeça, ombros, peito e pés para mandar a bola por cima da rede sem deixá-la cair.',
      benefits: ['Desenvolve excelente controle corporal', 'Grande gasto calórico e definição muscular', 'Altamente social e competitivo'],
      hours: '17:00 às 22:00',
      color: 'from-orange-600 to-yellow-500'
    }
  ];

  const handleRegisterTournament = (tournament: Tournament) => {
    const text = encodeURIComponent(
      `Olá Arena Prime! Gostaria de realizar minha inscrição no torneio: *${tournament.title}*\n` +
      `Data: ${tournament.date}\n` +
      `Por favor, me enviem o formulário de cadastro!`
    );
    window.open(`https://wa.me/5567998072596?text=${text}`, '_blank');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-black text-white min-h-screen" id="home-section-container">
      
      {/* HERO SECTION */}
      <div className="relative min-h-[640px] md:min-h-[720px] lg:min-h-[85vh] flex flex-col justify-between overflow-hidden border-b border-orange-500/15">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Arena Prime Sand Courts"
            className="w-full h-full object-cover object-center scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/20" />
        </div>

        {/* Top Spacer */}
        <div className="h-6 md:h-12" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left w-full my-auto py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-yellow-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
              Nossa Casa, Sua Praia
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-4 uppercase leading-none">
              A SUA ARENA DE <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300">
                ESPORTES DE AREIA
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-xl font-medium">
              Venha jogar Beach Tennis, Vôlei de Praia e Futvôlei na melhor estrutura de <span className="text-orange-400 font-semibold">Glória de Dourados/MS</span>. Quadras premium e um restaurante completo esperam por você!
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={onNavigateToBooking}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-600 to-yellow-500 text-black font-extrabold rounded-xl shadow-lg shadow-orange-500/20 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
                id="btn-hero-booking"
              >
                Reservar Quadra Agora
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onNavigateToMenu}
                className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
                id="btn-hero-menu"
              >
                Cardápio do Restaurante
                <Star className="w-5 h-5 text-yellow-400" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Quick Stats Panel */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 mb-8 mt-auto hidden md:block">
          <div className="bg-zinc-900/95 border border-zinc-800/80 backdrop-blur-md rounded-2xl p-6 grid grid-cols-4 gap-6 text-center">
            <div className="border-r border-zinc-800">
              <div className="text-3xl font-black text-orange-500">2</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold mt-1">Quadras de Areia</div>
            </div>
            <div className="border-r border-zinc-800">
              <div className="text-3xl font-black text-yellow-400">17h-22h</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold mt-1">Segunda a Domingo</div>
            </div>
            <div className="border-r border-zinc-800">
              <div className="text-3xl font-black text-orange-500">100%</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold mt-1">Areia Tratada</div>
            </div>
            <div>
              <div className="text-3xl font-black text-yellow-400">Prime</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold mt-1">Lanchonete e Bar</div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STATS GRID */}
      <div className="md:hidden bg-zinc-950 border-b border-zinc-900 py-6 px-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
            <div className="text-2xl font-black text-orange-500">2</div>
            <div className="text-xs text-gray-400 mt-1">Quadras de Areia</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
            <div className="text-2xl font-black text-yellow-400">17h às 22h</div>
            <div className="text-xs text-gray-400 mt-1">Segunda a Domingo</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
            <div className="text-2xl font-black text-orange-500">Areia Fina</div>
            <div className="text-xs text-gray-400 mt-1">Qualidade Premium</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
            <div className="text-2xl font-black text-yellow-400">Restaurante</div>
            <div className="text-xs text-gray-400 mt-1">Cardápio Completo</div>
          </div>
        </div>
      </div>

      {/* SPORTS SECTION */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-black tracking-widest text-orange-500 uppercase mb-2">Esportes & Diversão</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight">
            NOSSAS <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400">MODALIDADES</span>
          </h3>
          <p className="text-gray-400 mt-4 text-sm sm:text-base">
            Oferecemos as melhores quadras de areia de Glória de Dourados. Pratique saúde, faça amigos e divirta-se em um ambiente moderno e familiar.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {sports.map((sport, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-zinc-900/40 rounded-3xl border border-zinc-800/85 hover:border-orange-500/30 transition-all p-8 flex flex-col justify-between group relative overflow-hidden"
              id={`sport-card-${index}`}
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all" />
              
              <div>
                {/* Title */}
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-2xl font-black uppercase tracking-wide text-white">{sport.title}</h4>
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${sport.color}`} />
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {sport.description}
                </p>

                {/* Benefits List */}
                <div className="space-y-3 mb-8">
                  <div className="text-xs uppercase text-orange-500 tracking-wider font-extrabold">Benefícios:</div>
                  {sport.benefits.map((benefit, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2 text-xs text-gray-300">
                      <Target className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hours Footer */}
              <div className="pt-6 border-t border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>Disponível: <strong className="text-white">{sport.hours}</strong></span>
                </div>
                <button
                  onClick={onNavigateToBooking}
                  className="p-2 rounded-lg bg-orange-500/10 text-yellow-400 group-hover:bg-orange-500 group-hover:text-black transition-all cursor-pointer"
                  title={`Agendar ${sport.title}`}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* WHY CHOOSE ARENA PRIME */}
      <div className="bg-zinc-950 py-20 border-t border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Text details */}
            <div>
              <h2 className="text-xs font-black tracking-widest text-yellow-400 uppercase mb-2">Estrutura Profissional</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight mb-6">
                POR QUE ESCOLHER A <span className="text-orange-500">ARENA PRIME</span>?
              </h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                    <ShieldCheck className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white uppercase tracking-wide">Areia Tratada de Primeira Linha</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Areia especial fina que não retém calor excessivo, não compacta e passa por higienização periódica para garantir a segurança da sua saúde e articulações.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center shrink-0 border border-yellow-400/20">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white uppercase tracking-wide">Sistema Online Descomplicado</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Esqueça telefonemas longos. Agende sua quadra diretamente pelo celular em menos de 1 minuto, receba o comprovante e confirme diretamente via WhatsApp.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                    <Zap className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white uppercase tracking-wide">Estilo de Vida e Lazer Completo</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Aqui você não vem apenas para jogar. Relaxe após os treinos em nosso bar e restaurante de praia, saboreie porções deliciosas e desfrute de bons drinks.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphic callout box */}
            <div className="relative rounded-3xl overflow-hidden border border-zinc-800 p-8 flex flex-col justify-center min-h-[350px] shadow-2xl">
              {/* Autoplay Slideshow Background with Crossfade */}
              <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSlide}
                    src={slides[currentSlide].url}
                    alt={slides[currentSlide].label}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="w-full h-full object-cover object-center absolute inset-0"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
                {/* Overlay to ensure ultra-high text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60 z-10" />
              </div>

              <div className="relative z-20 text-center flex flex-col justify-between h-full">
                <div>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30">
                    <MapPin className="w-6 h-6 text-black animate-bounce" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide mb-2">Visite nossa Arena!</h4>
                  <p className="text-gray-200 max-w-sm mx-auto text-xs sm:text-sm mb-5 leading-relaxed">
                    Estamos localizados em Glória de Dourados/MS. Venha conhecer nossas quadras premium, nossa lanchonete e nosso bar completo!
                  </p>
                  <div className="text-yellow-400 font-extrabold text-xs uppercase tracking-widest border border-yellow-500/20 inline-block px-4 py-2 rounded-xl bg-yellow-500/5 backdrop-blur-md">
                    Av. Presidente Vargas, Glória de Dourados/MS
                  </div>
                </div>

                {/* Slider label caption */}
                <div className="mt-8 text-[10px] text-gray-400 font-black uppercase tracking-wider flex items-center justify-center gap-1.5 bg-black/45 py-1.5 px-3 rounded-full w-fit mx-auto backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 text-orange-500 animate-pulse" />
                  <span>{slides[currentSlide].label}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* TOURNAMENTS & EVENTS SECTION */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="tournaments-section">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-black tracking-widest text-yellow-400 uppercase mb-2">Calendário de Competições</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight">
            TORNEIOS & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400">EVENTOS</span>
          </h3>
          <p className="text-gray-400 mt-4 text-sm sm:text-base">
            Participe dos nossos torneios emocionantes, desafie-se e sinta a adrenalina da competição na areia com toda a comunidade!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tournaments.map((tour) => (
            <div
              key={tour.id}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between hover:border-yellow-400/30 transition-all relative"
            >
              {/* Badge for status */}
              <div className="absolute top-4 right-4">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  tour.status === 'Inscrições Abertas'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : tour.status === 'Em Breve'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {tour.status}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block mb-1">
                  {tour.date}
                </span>
                <h4 className="text-xl font-black text-white uppercase tracking-wide mb-3 leading-tight pr-20">
                  {tour.title}
                </h4>
                <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                  {tour.description}
                </p>

                {/* Categories */}
                <div className="mb-6">
                  <div className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-2">Categorias:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {tour.categories.map((cat, idx) => (
                      <span key={idx} className="bg-zinc-800/80 text-gray-300 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Inscrição (por atleta)</div>
                  <div className="text-lg font-extrabold text-white">R$ {tour.price.toFixed(2)}</div>
                </div>
                {tour.status === 'Inscrições Abertas' ? (
                  <button
                    onClick={() => handleRegisterTournament(tour)}
                    className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-1 cursor-pointer"
                  >
                    Inscrever-se
                    <Trophy className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-xs text-gray-500 font-semibold italic">Breve no WhatsApp</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
