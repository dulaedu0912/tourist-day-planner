// Runs once at startup: inserts the 10 places (if empty) and one admin (if missing).
import bcrypt from 'bcryptjs';
import { SEED_PLACES } from '../data/seedPlaces.js';
import { distanceKm } from '../utils/distance.js';

export async function seedDatabase(db) {
  const places = db.collection('places');
  const admins = db.collection('admins');

  if ((await places.countDocuments()) === 0) {
    await places.insertMany(
      SEED_PLACES.map((place) => ({
        ...place,
        distanceKm: distanceKm(place.lat, place.lng),
        createdAt: new Date(),
      }))
    );
    console.log(`Seeded ${SEED_PLACES.length} places.`);
  }

  // NFR-006: only the bcrypt hash is stored.
  const username = process.env.ADMIN_USER || 'admin';
  if (!(await admins.findOne({ username }))) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASS || 'admin123', 10);
    await admins.insertOne({ username, passwordHash });
    console.log(`Created admin user "${username}".`);
  }
}
