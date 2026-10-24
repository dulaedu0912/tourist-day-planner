// Iteration 1: the first read endpoints, straight from the seeded collection.
import { getDb } from '../config/db.js';

// The collection is pre-filled by the seed script at startup (BR-003).
export async function list(req, res) {
  const places = await getDb().collection('places').find().sort({ name: 1 }).toArray();
  res.json(places);
}
