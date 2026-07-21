import { Court, MenuItem, Tournament, Booking, GalleryItem } from './types';

export const INITIAL_GALLERY: GalleryItem[] = [
    
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
    name: 'Quadra 2 (Do Lado Direito da Quadra 1 )',
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

export const MENU_ITEMS: MenuItem[] = [];

export const TOURNAMENTS: Tournament[] = [];

// Helper to get formatted dates relative to today's local time (dynamic)
export const getRelativeDateString = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getInitialBookings = (): Booking[] => {
  return [];
};
