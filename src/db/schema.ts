import { pgTable, text, boolean, doublePrecision } from 'drizzle-orm/pg-core';

export const courts = pgTable('courts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  sports: text('sports').notNull(), // Comma-separated or JSON
  description: text('description').notNull(),
  priceHourly: doublePrecision('price_hourly').notNull(),
  image: text('image'),
});

export const bookings = pgTable('bookings', {
  id: text('id').primaryKey(),
  courtId: text('court_id').notNull(),
  courtName: text('court_name').notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  sport: text('sport').notNull(),
  date: text('date').notNull(), // YYYY-MM-DD
  timeSlot: text('time_slot').notNull(),
  status: text('status').notNull(), // 'pending' | 'confirmed' | 'cancelled'
  isBlockedSlot: boolean('is_blocked_slot').default(false),
  blockReason: text('block_reason'),
  createdAt: text('created_at').notNull(),
});

export const menuItems = pgTable('menu_items', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: doublePrecision('price').notNull(),
  category: text('category').notNull(), // 'portions' | 'drinks' | 'meals' | 'snacks'
  image: text('image'),
  tag: text('tag'),
});

export const tournaments = pgTable('tournaments', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  date: text('date').notNull(),
  categories: text('categories').notNull(), // Comma-separated
  description: text('description').notNull(),
  price: doublePrecision('price').notNull(),
  status: text('status').notNull(), // 'Inscrições Abertas' | 'Encerrado' | 'Em Breve'
  image: text('image'),
});

export const galleryItems = pgTable('gallery_items', {
  id: text('id').primaryKey(),
  src: text('src').notNull(),
  alt: text('alt').notNull(),
  category: text('category').notNull(), // 'arena' | 'sports' | 'food'
  title: text('title').notNull(),
});

export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});
