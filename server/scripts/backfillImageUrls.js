// One-off migration for existing databases.
//
// Place photos used to be bundled with the frontend and matched by name. They
// now live in the `imageUrl` field of each place, so every document created
// before that change needs its URL copied across once.
//
// Safe to re-run: only fills imageUrl when it is missing or empty, so photos
// an admin has already set are never overwritten.
//
//   node server/scripts/backfillImageUrls.js
import 'dotenv/config';
import { MongoClient } from 'mongodb';
import { SEED_PLACES } from '../data/seedPlaces.js';

const { MONGODB_URI, DB_NAME } = process.env;

if (!MONGODB_URI) {
  console.error('[!] MONGODB_URI is missing. Add it to .env first.');
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI);

try {
  await client.connect();
  const places = client.db(DB_NAME).collection('places');
  const missingImage = { $or: [{ imageUrl: { $exists: false } }, { imageUrl: '' }] };

  let updated = 0;
  let untouched = 0;

  for (const seed of SEED_PLACES) {
    const result = await places.updateOne(
      { name: seed.name, ...missingImage },
      { $set: { imageUrl: seed.imageUrl } }
    );

    if (result.modifiedCount) {
      updated += 1;
      console.log(`  + ${seed.name}`);
    } else {
      untouched += 1;
    }
  }

  const stillMissing = await places.countDocuments(missingImage);

  console.log(`\nBackfilled ${updated} place(s). ${untouched} seed place(s) already had a photo.`);
  if (stillMissing) {
    console.log(
      `${stillMissing} other place(s) still have no photo - they show the placeholder until an admin adds one.`
    );
  }
} finally {
  await client.close();
}
