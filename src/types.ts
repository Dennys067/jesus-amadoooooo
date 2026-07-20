export interface Court {
  id: string;
  name: string;
  type: 'sand';
  sports: ('Beach Tennis' | 'Vôlei de Praia' | 'Futvôlei')[];
  description: string;
  priceHourly: number; // Price per hour (or standard slot)
  image?: string;
}

export interface Booking {
  id: string;
  courtId: string;
  courtName: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  sport: 'Beach Tennis' | 'Vôlei de Praia' | 'Futvôlei';
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "18:30 - 20:00"
  status: 'pending' | 'confirmed' | 'cancelled';
  isBlockedSlot?: boolean; // Owner blocked this slot (e.g., for maintenance, tournament)
  blockReason?: string;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'portions' | 'drinks' | 'meals' | 'snacks';
  image?: string;
  tag?: string; // e.g. "Mais Pedido", "Lançamento"
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Tournament {
  id: string;
  title: string;
  date: string; // e.g. "25 de Agosto, 2026"
  categories: string[];
  description: string;
  price: number; // In BRL
  status: 'Inscrições Abertas' | 'Encerrado' | 'Em Breve';
  image?: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: 'arena' | 'sports' | 'food';
  title: string;
}

export interface GoogleUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

