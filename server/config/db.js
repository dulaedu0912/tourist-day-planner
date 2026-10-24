// MongoDB connection. One client for the whole app.
import { MongoClient } from 'mongodb';

let db = null;

export async function connectDB() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  // Atlas links often end in "/?retryWrites=..." (no database name), so pick one here.
  db = client.db(process.env.DB_NAME || 'touristPlanner');
  return db;
}

export function getDb() {
  if (!db) throw new Error('Database is not connected yet.');
  return db;
}
