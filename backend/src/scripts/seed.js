'use strict';

/**
 * Seeds demo data: four movies with showtimes for the next 7 days and a
 * demo user. Safe to run again. Each run replaces the seeded movies, drops
 * bookings made against them and resets the demo user's password.
 *
 *   MONGO_URI        Mongo connection string (required)
 *   PUBLIC_API_URL   Public URL of this API, used for banner image links
 *                    (default http://localhost:5001)
 *   DEMO_EMAIL       default demo@scoop.demo
 *   DEMO_PASSWORD    default ScoopDemo2026
 *   SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD
 *                    optional. Creates or updates an admin account.
 */

const { MongoClient, ObjectId } = require('mongodb');
const bcryptjs = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/scoopCinema';
const PUBLIC_API_URL = (process.env.PUBLIC_API_URL || 'http://localhost:5001').replace(/\/$/, '');
const DEMO_EMAIL = process.env.DEMO_EMAIL || 'demo@scoop.demo';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'ScoopDemo2026';

const banner = (file) => `${PUBLIC_API_URL}/assets/Movies/${file}`;

const MOVIES = [
  {
    title: 'Moana 2',
    description: 'Moana answers a call from her ancestors and sails to the far seas of Oceania with a new crew.',
    releaseDate: '2024-11-27',
    duration: 100,
    genre: 'Animation',
    rating: '6.8',
    ageRating: 'E',
    tallBanner: banner('TallBanners/1.jpg'),
    wideBanner: banner('WideBanners/Moana2Banner.webp'),
    actors: ["Auli'i Cravalho", 'Dwayne Johnson'],
    director: 'David G. Derrick Jr.',
  },
  {
    title: 'Interstellar',
    description: 'A team of explorers travels through a wormhole in search of a new home for humanity.',
    releaseDate: '2014-11-07',
    duration: 169,
    genre: 'Sci-Fi',
    rating: '8.7',
    ageRating: 'PG-13',
    tallBanner: banner('TallBanners/14.jpg'),
    wideBanner: banner('WideBanners/Interstellar.jpeg'),
    actors: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    director: 'Christopher Nolan',
  },
  {
    title: 'Inception',
    description: 'A thief who steals secrets through dreams is offered a chance to plant an idea instead.',
    releaseDate: '2010-07-16',
    duration: 148,
    genre: 'Action',
    rating: '8.8',
    ageRating: 'PG-13',
    tallBanner: banner('TallBanners/Inception.jpg'),
    wideBanner: banner('WideBanners/Inception.jpg'),
    actors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
    director: 'Christopher Nolan',
  },
  {
    title: 'The Matrix Resurrections',
    description: 'Neo lives an ordinary life in San Francisco until a familiar choice pulls him back down the rabbit hole.',
    releaseDate: '2021-12-22',
    duration: 148,
    genre: 'Sci-Fi',
    rating: '5.7',
    ageRating: 'R',
    tallBanner: banner('TallBanners/TheMatrix.jpg'),
    wideBanner: banner('WideBanners/TheMatrix.jpeg'),
    actors: ['Keanu Reeves', 'Carrie-Anne Moss', 'Yahya Abdul-Mateen II'],
    director: 'Lana Wachowski',
  },
];

const CINEMAS = [
  { name: 'SCOPE CINEMA - ColPetty', formats: ['Digital 2D', 'IMAX 3D'] },
  { name: 'Main Hall', formats: ['Digital 2D'] },
];
const TIMES = ['10:30AM', '02:00PM', '06:30PM', '09:15PM'];

function nextDays(n) {
  const days = [];
  const start = new Date();
  for (let i = 0; i < n; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function buildCinemas(movieIndex) {
  const days = nextDays(7);
  return CINEMAS.map((cinema, cIdx) => ({
    name: cinema.name,
    formats: cinema.formats.map((type, fIdx) => ({
      type,
      // Spread movies across time slots so each day has a full schedule
      showtimes: days.flatMap((date) =>
        TIMES.filter((_, tIdx) => (tIdx + movieIndex + cIdx + fIdx) % 2 === 0).map((time) => ({
          showtimeId: new ObjectId().toHexString(),
          time,
          date,
        })),
      ),
    })),
  }));
}

async function upsertUser(db, { email, password, firstName, lastName, isAdmin, isDemo }) {
  const hashed = await bcryptjs.hash(password, 10);
  await db.collection('users').updateOne(
    { email },
    {
      $set: { password: hashed, isAdmin, isDemo, firstName, lastName },
      $setOnInsert: { email, phone: '0770000000' },
    },
    { upsert: true },
  );
}

async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db('scoopCinema');

  const oldIds = (await db.collection('movies').find({ seed: true }, { projection: { _id: 1 } }).toArray())
    .map((m) => m._id);
  if (oldIds.length) {
    const asStrings = oldIds.map((id) => id.toHexString());
    await db.collection('bookings').deleteMany({ movieId: { $in: [...oldIds, ...asStrings] } });
    await db.collection('movies').deleteMany({ _id: { $in: oldIds } });
  }

  const docs = MOVIES.map((movie, i) => ({
    ...movie,
    cinemas: buildCinemas(i),
    adultTicketPrice: 1500,
    kidTicketPrice: 1000,
    seed: true,
  }));
  await db.collection('movies').insertMany(docs);

  await upsertUser(db, {
    email: DEMO_EMAIL, password: DEMO_PASSWORD, firstName: 'Demo', lastName: 'User', isAdmin: false, isDemo: true,
  });
  if (process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_PASSWORD) {
    await upsertUser(db, {
      email: process.env.SEED_ADMIN_EMAIL,
      password: process.env.SEED_ADMIN_PASSWORD,
      firstName: 'Scoop',
      lastName: 'Admin',
      isAdmin: true,
      isDemo: false,
    });
  }

  console.log(`Seeded ${docs.length} movies (removed ${oldIds.length} old ones) and demo user ${DEMO_EMAIL}`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
