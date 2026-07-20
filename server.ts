import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { db } from './src/db/index.ts';
import { courts, bookings, menuItems, tournaments, galleryItems, siteSettings } from './src/db/schema.ts';
import { eq } from 'drizzle-orm';
import { COURTS, MENU_ITEMS, TOURNAMENTS, INITIAL_GALLERY, getInitialBookings } from './src/data.ts';

const __filename = typeof import.meta !== 'undefined' && import.meta.url ? fileURLToPath(import.meta.url) : '';
const __dirname = __filename ? path.dirname(__filename) : '';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Database Seeding Helper
  async function seedDatabase() {
    try {
      console.log('Checking database table contents for automatic seeding...');
      
      // 1. Seed Courts
      const existingCourts = await db.select().from(courts);
      if (existingCourts.length === 0) {
        console.log('Seeding courts...');
        for (const c of COURTS) {
          await db.insert(courts).values({
            id: c.id,
            name: c.name,
            type: c.type,
            sports: c.sports.join(','),
            description: c.description,
            priceHourly: c.priceHourly,
            image: c.image || null,
          });
        }
      }

      // 2. Seed Menu Items
      const existingMenu = await db.select().from(menuItems);
      if (existingMenu.length === 0) {
        console.log('Seeding menu items...');
        for (const item of MENU_ITEMS) {
          await db.insert(menuItems).values({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            image: item.image || null,
            tag: item.tag || null,
          });
        }
      }

      // 3. Seed Tournaments
      const existingTournaments = await db.select().from(tournaments);
      if (existingTournaments.length === 0) {
        console.log('Seeding tournaments...');
        for (const t of TOURNAMENTS) {
          await db.insert(tournaments).values({
            id: t.id,
            title: t.title,
            date: t.date,
            categories: t.categories.join(','),
            description: t.description,
            price: t.price,
            status: t.status,
            image: t.image || null,
          });
        }
      }

      // 4. Seed Gallery Items
      const existingGallery = await db.select().from(galleryItems);
      if (existingGallery.length === 0) {
        console.log('Seeding gallery items...');
        for (const g of INITIAL_GALLERY) {
          await db.insert(galleryItems).values({
            id: g.id,
            src: g.src,
            alt: g.alt,
            category: g.category,
            title: g.title,
          });
        }
      }

      // 5. Seed Site Settings
      const existingSettings = await db.select().from(siteSettings);
      if (existingSettings.length === 0) {
        console.log('Seeding default site settings...');
        await db.insert(siteSettings).values({
          key: 'hero_image',
          value: '/src/assets/images/arena_prime_hero_1784287633068.jpg',
        });
        await db.insert(siteSettings).values({
          key: 'restaurant_image',
          value: '/src/assets/images/arena_prime_restaurant_1784287646644.jpg',
        });
      }

      // 6. Seed default bookings
      const existingBookings = await db.select().from(bookings);
      if (existingBookings.length === 0) {
        console.log('Seeding default bookings...');
        const defaults = getInitialBookings();
        for (const b of defaults) {
          await db.insert(bookings).values({
            id: b.id,
            courtId: b.courtId,
            courtName: b.courtName,
            customerName: b.customerName,
            customerPhone: b.customerPhone,
            customerEmail: b.customerEmail || null,
            sport: b.sport,
            date: b.date,
            timeSlot: b.timeSlot,
            status: b.status,
            isBlockedSlot: b.isBlockedSlot || false,
            blockReason: b.blockReason || null,
            createdAt: b.createdAt,
          });
        }
      }

      console.log('Database verification and seeding completed.');
    } catch (err) {
      console.error('Error seeding database:', err);
    }
  }

  // Run seeding on startup
  await seedDatabase();

  // API ROUTES

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 1. Courts API
  app.get('/api/courts', async (req, res) => {
    try {
      const data = await db.select().from(courts);
      // Map database format to frontend interface (parse sports list)
      const mapped = data.map(c => ({
        ...c,
        sports: c.sports.split(',') as ('Beach Tennis' | 'Vôlei de Praia' | 'Futvôlei')[],
      }));
      res.json(mapped);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/courts', async (req, res) => {
    try {
      const { id, name, type, sports, description, priceHourly, image } = req.body;
      const sportsStr = Array.isArray(sports) ? sports.join(',') : sports;
      
      await db.insert(courts).values({
        id,
        name,
        type,
        sports: sportsStr,
        description,
        priceHourly,
        image,
      }).onConflictDoUpdate({
        target: courts.id,
        set: { name, type, sports: sportsStr, description, priceHourly, image }
      });
      
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 2. Bookings API
  app.get('/api/bookings', async (req, res) => {
    try {
      const data = await db.select().from(bookings);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/bookings', async (req, res) => {
    try {
      const { id, courtId, courtName, customerName, customerPhone, customerEmail, sport, date, timeSlot, status, isBlockedSlot, blockReason, createdAt } = req.body;
      await db.insert(bookings).values({
        id,
        courtId,
        courtName,
        customerName,
        customerPhone,
        customerEmail,
        sport,
        date,
        timeSlot,
        status,
        isBlockedSlot: isBlockedSlot || false,
        blockReason,
        createdAt,
      }).onConflictDoUpdate({
        target: bookings.id,
        set: { courtId, courtName, customerName, customerPhone, customerEmail, sport, date, timeSlot, status, isBlockedSlot, blockReason }
      });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/bookings/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(bookings).where(eq(bookings.id, id));
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. Menu Items API
  app.get('/api/menu', async (req, res) => {
    try {
      const data = await db.select().from(menuItems);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/menu', async (req, res) => {
    try {
      const { id, name, description, price, category, image, tag } = req.body;
      await db.insert(menuItems).values({
        id,
        name,
        description,
        price,
        category,
        image,
        tag,
      }).onConflictDoUpdate({
        target: menuItems.id,
        set: { name, description, price, category, image, tag }
      });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/menu/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(menuItems).where(eq(menuItems.id, id));
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 4. Tournaments API
  app.get('/api/tournaments', async (req, res) => {
    try {
      const data = await db.select().from(tournaments);
      const mapped = data.map(t => ({
        ...t,
        categories: (t.categories || '').split(','),
      }));
      res.json(mapped);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/tournaments', async (req, res) => {
    try {
      const { id, title, date, categories, description, price, status, image } = req.body;
      const categoriesStr = Array.isArray(categories) ? categories.join(',') : categories;
      await db.insert(tournaments).values({
        id,
        title,
        date,
        categories: categoriesStr,
        description,
        price,
        status,
        image,
      }).onConflictDoUpdate({
        target: tournaments.id,
        set: { title, date, categories: categoriesStr, description, price, status, image }
      });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/tournaments/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(tournaments).where(eq(tournaments.id, id));
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. Gallery API
  app.get('/api/gallery', async (req, res) => {
    try {
      const data = await db.select().from(galleryItems);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/gallery', async (req, res) => {
    try {
      const { id, src, alt, category, title } = req.body;
      await db.insert(galleryItems).values({
        id,
        src,
        alt,
        category,
        title,
      }).onConflictDoUpdate({
        target: galleryItems.id,
        set: { src, alt, category, title }
      });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/gallery/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(galleryItems).where(eq(galleryItems.id, id));
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 6. Site Settings API
  app.get('/api/settings', async (req, res) => {
    try {
      const data = await db.select().from(siteSettings);
      const settingsMap: Record<string, string> = {};
      data.forEach(item => {
        settingsMap[item.key] = item.value;
      });
      res.json(settingsMap);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/settings', async (req, res) => {
    try {
      const updates = req.body; // Key-value pairs
      for (const [key, value] of Object.entries(updates)) {
        await db.insert(siteSettings).values({
          key,
          value: String(value),
        }).onConflictDoUpdate({
          target: siteSettings.key,
          set: { value: String(value) },
        });
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });


  // GOOGLE WORKSPACE API PROXIES (Calendar, Forms, Drive)
  // These endpoints take the user's Google OAuth accessToken from the frontend's Authorization header and forward requests directly to official Google REST APIs.

  // Google Calendar Proxy
  app.get('/api/google/calendar/events', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Missing OAuth access token in Authorization header' });
      }

      const googleResponse = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=30&orderBy=startTime&singleEvents=true&timeMin=' + new Date().toISOString(),
        {
          headers: {
            'Authorization': authHeader,
          },
        }
      );

      if (!googleResponse.ok) {
        const errText = await googleResponse.text();
        return res.status(googleResponse.status).json({ error: 'Google Calendar API error', details: errText });
      }

      const data = await googleResponse.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/google/calendar/events', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Missing OAuth access token in Authorization header' });
      }

      const googleResponse = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req.body),
        }
      );

      if (!googleResponse.ok) {
        const errText = await googleResponse.text();
        return res.status(googleResponse.status).json({ error: 'Google Calendar API error', details: errText });
      }

      const data = await googleResponse.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Google Forms Proxy
  app.get('/api/google/forms/:formId', async (req, res) => {
    try {
      const { formId } = req.params;
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Missing OAuth access token' });
      }

      const googleResponse = await fetch(
        `https://forms.googleapis.com/v1/forms/${formId}`,
        {
          headers: { 'Authorization': authHeader },
        }
      );

      if (!googleResponse.ok) {
        const errText = await googleResponse.text();
        return res.status(googleResponse.status).json({ error: 'Google Forms API error', details: errText });
      }

      const data = await googleResponse.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/google/forms/:formId/responses', async (req, res) => {
    try {
      const { formId } = req.params;
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Missing OAuth access token' });
      }

      const googleResponse = await fetch(
        `https://forms.googleapis.com/v1/forms/${formId}/responses`,
        {
          headers: { 'Authorization': authHeader },
        }
      );

      if (!googleResponse.ok) {
        const errText = await googleResponse.text();
        return res.status(googleResponse.status).json({ error: 'Google Forms Responses error', details: errText });
      }

      const data = await googleResponse.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Google Drive Proxy
  app.get('/api/google/drive/files', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Missing OAuth access token' });
      }

      // Query to list files from Drive, preferring images, pdfs, and folders
      const googleResponse = await fetch(
        'https://www.googleapis.com/drive/v3/files?pageSize=40&fields=nextPageToken,files(id,name,mimeType,thumbnailLink,webViewLink,iconLink,size)&orderBy=name',
        {
          headers: { 'Authorization': authHeader },
        }
      );

      if (!googleResponse.ok) {
        const errText = await googleResponse.text();
        return res.status(googleResponse.status).json({ error: 'Google Drive API error', details: errText });
      }

      const data = await googleResponse.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/google/drive/files', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Missing OAuth access token' });
      }

      const googleResponse = await fetch(
        'https://www.googleapis.com/drive/v3/files',
        {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req.body),
        }
      );

      if (!googleResponse.ok) {
        const errText = await googleResponse.text();
        return res.status(googleResponse.status).json({ error: 'Google Drive Create file error', details: errText });
      }

      const data = await googleResponse.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite Middleware Setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
