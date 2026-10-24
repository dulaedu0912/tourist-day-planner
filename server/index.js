// Entry point: load .env, connect to Atlas, seed once, start the server.
import 'dotenv/config';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed/seedDatabase.js';
import app from './app.js';

const PORT = process.env.PORT || 3000;

if (!process.env.MONGODB_URI) {
  console.error('\n[!] MONGODB_URI is missing. Copy .env.example to .env and paste your Atlas link.\n');
  process.exit(1);
}

const db = await connectDB();
await seedDatabase(db);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
