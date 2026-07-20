import { Court, MenuItem, Tournament, Booking, GalleryItem } from './types';

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'g-1',
    src: '/src/assets/images/arena_prime_hero_1784287633068.jpg',
    alt: 'Quadras de Areia Arena Prime ao Entardecer',
    category: 'arena',
    title: 'Nossas Quadras ao Entardecer'
  },
  {
    id: 'g-2',
    src: '/src/assets/images/arena_prime_atleta_bt_1784289981099.jpg',
    alt: 'Jogador focado em partida intensa de Beach Tennis',
    category: 'sports',
    title: 'Atleta de Beach Tennis'
  },
  {
    id: 'g-3',
    src: '/src/assets/images/arena_prime_casal_proprietario_1784289995907.jpg',
    alt: 'Proprietários recebendo os clientes na recepção decorada',
    category: 'arena',
    title: 'Fundadores Arena Prime'
  },
  {
    id: 'g-4',
    src: '/src/assets/images/arena_prime_torneio_podio_1784290009809.jpg',
    alt: 'Premiação de torneio com troféu exclusivo de campeão no pódio',
    category: 'sports',
    title: 'Campeões Arena Prime'
  },
  {
    id: 'g-5',
    src: '/src/assets/images/arena_prime_smash_sunset_1784290023226.jpg',
    alt: 'Jogador em salto e smash incrível sob o pôr do sol',
    category: 'sports',
    title: 'Smash sob o Pôr do Sol'
  },
  {
    id: 'g-6',
    src: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop',
    alt: 'Grupo de atletas reunidos celebrando torneio de vôlei de areia',
    category: 'sports',
    title: 'Nossa Galera na Areia'
  },
  {
    id: 'g-7',
    src: '/src/assets/images/arena_prime_restaurant_1784287646644.jpg',
    alt: 'Nossas deliciosas porções rústicas do restaurante',
    category: 'food',
    title: 'Porção Gourmet Arena'
  },
  {
    id: 'g-8',
    src: 'https://images.unsplash.com/photo-1510127008689-419b7b7b3c8a?q=80&w=1200&auto=format&fit=crop',
    alt: 'Porção de frango crocante com cerveja',
    category: 'food',
    title: 'Petiscos & Chopp Gelado'
  },
  {
    id: 'g-9',
    src: 'https://images.unsplash.com/photo-1605497746444-ac9dbd39f69c?q=80&w=1200&auto=format&fit=crop',
    alt: 'Taça de drinks tropicais coloridos',
    category: 'food',
    title: 'Coquetéis Refrescantes'
  }
];

export const COURTS: Court[] = [
  {
    id: 'court-1',
    name: 'Quadra 1 (Perto da Cozinha)',
    type: 'sand',
    sports: ['Beach Tennis', 'Vôlei de Praia', 'Futvôlei'],
    description: 'Nossa quadra principal com dimensões oficiais, areia super fina tratada e iluminação de LED profissional para jogos noturnos.',
    priceHourly: 80,
    image: '/src/assets/images/arena_prime_smash_sunset_1784290023226.jpg'
  },
  {
    id: 'court-2',
    name: 'Quadra 2 (Do Lado Direito da Quadra 1)',
    type: 'sand',
    sports: ['Beach Tennis', 'Vôlei de Praia', 'Futvôlei'],
    description: 'Quadra ideal para treinos e partidas, cercada por rede de proteção e com drenagem de última geração.',
    priceHourly: 70,
    image: '/src/assets/images/arena_prime_atleta_bt_1784289981099.jpg'
  }
];

export const TIME_SLOTS = [
  '17:00 - 18:00',
  '18:00 - 19:00',
  '19:00 - 20:00',
  '20:00 - 21:00',
  '21:00 - 22:00'
];

export const MENU_ITEMS: MenuItem[] = [
  // Portions (Porções)
  {
    id: 'p1',
    name: 'Iscas de Tilápia Crocante',
    description: 'Iscas de tilápia super crocantes empanadas no panko, acompanhadas de limão e molho tártaro caseiro. Perfeito para acompanhar um chopp!',
    price: 68.00,
    category: 'portions',
    tag: 'Mais Vendido'
  },
  {
    id: 'p2',
    name: 'Frango a Passarinho Prime',
    description: 'Pedacinhos de frango fritos e crocantes, temperados com alho dourado e salsa fresca.',
    price: 48.00,
    category: 'portions'
  },
  {
    id: 'p3',
    name: 'Batata Frita Especial com Queijo e Bacon',
    description: 'Porção generosa de fritas rústicas crocantes por fora e macias por dentro, cobertas com queijo derretido e pedacinhos de bacon.',
    price: 38.00,
    category: 'portions',
    tag: 'Clássico'
  },
  {
    id: 'p4',
    name: 'Picanha na Chapa com Mandioca',
    description: 'Picanha fatiada acebolada na chapa quente, acompanhada de mandioca frita macia.',
    price: 95.00,
    category: 'portions',
    tag: 'Premium'
  },

  // Drinks (Bebidas)
  {
    id: 'd1',
    name: 'Chopp Pilsen Trincando (400ml)',
    description: 'Copo super gelado com colarinho perfeito, ideal para refrescar após aquela partida intensa de areia.',
    price: 11.00,
    category: 'drinks'
  },
  {
    id: 'd2',
    name: 'Caipirinha de Limão e Cachaça Artesanal',
    description: 'Tradicional caipirinha brasileira, feita com limão fresco, açúcar e cachaça da região selecionada.',
    price: 18.00,
    category: 'drinks',
    tag: 'Recomendado'
  },
  {
    id: 'd3',
    name: 'Gin Tônica de Frutas Vermelhas',
    description: 'Gin premium, água tônica, mix de amoras, morangos e mirtilos frescos com um toque de alecrim.',
    price: 28.00,
    category: 'drinks'
  },
  {
    id: 'd4',
    name: 'Suco Natural de Laranja (500ml)',
    description: 'Suco 100% puro espremido na hora, rico em vitamina C e sem adição de água.',
    price: 10.00,
    category: 'drinks'
  },
  {
    id: 'd5',
    name: 'Refrigerante Lata',
    description: 'Opções: Coca-Cola, Guaraná Antarctica, Sprite (Zero ou Comum).',
    price: 6.50,
    category: 'drinks'
  },

  // Meals (Refeições)
  {
    id: 'm1',
    name: 'Sobá Tradicional da Arena',
    description: 'Delicioso prato típico sul-mato-grossense: macarrão artesanal, caldo de carne super aromático quente, tiras de omelete fina, cebolinha fresca e carne bovina grelhada suculenta.',
    price: 39.00,
    category: 'meals',
    tag: 'Típico MS'
  },
  {
    id: 'm2',
    name: 'Parmegiana de Filé Mignon (Serve 2 pessoas)',
    description: 'Filé mignon suculento empanado, coberto com molho de tomate artesanal e queijo muçarela gratinado. Acompanha arroz e fritas.',
    price: 85.00,
    category: 'meals'
  },

  // Snacks (Lanches)
  {
    id: 's1',
    name: 'Prime Burger Double',
    description: 'Dois blends de carne bovina de 120g grelhados no fogo, queijo prato derretido, cebola caramelizada, bacon crocante e maionese defumada no pão brioche.',
    price: 36.00,
    category: 'snacks',
    tag: 'Novidade'
  },
  {
    id: 's2',
    name: 'Sanduíche Natural de Frango',
    description: 'Opção leve e saudável: pão integral, patê de frango desfiado com cenoura, alface americana fresca e rodelas de tomate.',
    price: 22.00,
    category: 'snacks'
  }
];

export const TOURNAMENTS: Tournament[] = [
  {
    id: 'tour-1',
    title: '1º Open Arena Prime de Beach Tennis',
    date: '15 e 16 de Agosto, 2026',
    categories: ['Duplas Masculinas A/B/C', 'Duplas Femininas A/B/C', 'Mistas'],
    description: 'O maior torneio de Beach Tennis de Glória de Dourados e região! Premiação em dinheiro para os finalistas, kit atleta com camiseta e squeeze inclusos, hidratação livre e mesa de frutas. Venha fazer parte dessa festa esportiva!',
    price: 80.00,
    status: 'Inscrições Abertas'
  },
  {
    id: 'tour-2',
    title: 'Desafio das Areias - Torneio de Vôlei de Praia',
    date: '05 de Setembro, 2026',
    categories: ['Duplas Masculinas Pro', 'Duplas Femininas Pro', 'Iniciantes'],
    description: 'Prepare-se para o melhor do vôlei de praia regional. Duplas disputando ponto a ponto sob as areias de alta performance da Arena Prime. Troféus e medalhas exclusivas do torneio!',
    price: 60.00,
    status: 'Inscrições Abertas'
  },
  {
    id: 'tour-3',
    title: 'Prime Cup - Campeonato de Futvôlei',
    date: '24 de Outubro, 2026',
    categories: ['Amador', 'Intermediário', 'Misto'],
    description: 'Chama o parceiro e vem pro jogo! Evento com churrasco integrado no restaurante, música ao vivo e as melhores duplas de futvôlei do estado em ação.',
    price: 70.00,
    status: 'Em Breve'
  }
];

// Helper to get formatted dates relative to today's local time (2026-07-17)
export const getRelativeDateString = (offsetDays: number): string => {
  const baseDate = new Date('2026-07-17T00:00:00');
  baseDate.setDate(baseDate.getDate() + offsetDays);
  return baseDate.toISOString().split('T')[0];
};

export const getInitialBookings = (): Booking[] => {
  return [
    {
      id: 'b-1',
      courtId: 'court-1',
      courtName: 'Quadra 1 (Perto da Cozinha)',
      customerName: 'Rodrigo Mendonça',
      customerPhone: '(67) 99123-4567',
      customerEmail: 'rodrigo@gmail.com',
      sport: 'Beach Tennis',
      date: getRelativeDateString(0), // Today
      timeSlot: '17:00 - 18:00',
      status: 'confirmed',
      createdAt: '2026-07-15T14:30:00Z'
    },
    {
      id: 'b-2',
      courtId: 'court-1',
      courtName: 'Quadra 1 (Perto da Cozinha)',
      customerName: 'Renata Souza',
      customerPhone: '(67) 99888-2233',
      sport: 'Vôlei de Praia',
      date: getRelativeDateString(0), // Today
      timeSlot: '18:00 - 19:00',
      status: 'confirmed',
      createdAt: '2026-07-16T10:15:00Z'
    },
    {
      id: 'b-3',
      courtId: 'court-2',
      courtName: 'Quadra 2 (Do Lado Direito da Quadra 1)',
      customerName: 'Aulas de Beach Tennis (Infantil)',
      customerPhone: '(67) 99807-2596',
      sport: 'Beach Tennis',
      date: getRelativeDateString(0), // Today
      timeSlot: '17:00 - 18:00',
      status: 'confirmed',
      isBlockedSlot: true,
      blockReason: 'Aulas de Escolinha de Sand Sports',
      createdAt: '2026-07-10T08:00:00Z'
    },
    {
      id: 'b-4',
      courtId: 'court-2',
      courtName: 'Quadra 2 (Do Lado Direito da Quadra 1)',
      customerName: 'Marcos Oliveira',
      customerPhone: '(67) 99654-9876',
      sport: 'Beach Tennis',
      date: getRelativeDateString(0), // Today
      timeSlot: '18:00 - 19:00',
      status: 'confirmed',
      createdAt: '2026-07-16T18:40:00Z'
    },
    {
      id: 'b-5',
      courtId: 'court-1',
      courtName: 'Quadra 1 (Perto da Cozinha)',
      customerName: 'Felipe Camargo',
      customerPhone: '(67) 99912-1122',
      sport: 'Futvôlei',
      date: getRelativeDateString(0), // Today
      timeSlot: '20:00 - 21:00',
      status: 'confirmed',
      createdAt: '2026-07-15T09:20:00Z'
    },
    {
      id: 'b-6',
      courtId: 'court-1',
      courtName: 'Quadra 1 (Perto da Cozinha)',
      customerName: 'Manutenção Mensal de Areia',
      customerPhone: '(67) 99807-2596',
      sport: 'Beach Tennis',
      date: getRelativeDateString(1), // Tomorrow
      timeSlot: '17:00 - 18:00',
      status: 'confirmed',
      isBlockedSlot: true,
      blockReason: 'Nivelamento e irrigação preventiva da areia',
      createdAt: '2026-07-16T07:00:00Z'
    },
    {
      id: 'b-7',
      courtId: 'court-2',
      courtName: 'Quadra 2 (Do Lado Direito da Quadra 1)',
      customerName: 'Gustavo Lima',
      customerPhone: '(67) 99233-4455',
      sport: 'Futvôlei',
      date: getRelativeDateString(1), // Tomorrow
      timeSlot: '18:00 - 19:00',
      status: 'confirmed',
      createdAt: '2026-07-16T12:00:00Z'
    }
  ];
};
