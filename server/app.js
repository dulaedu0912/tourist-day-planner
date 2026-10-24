import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import placeRoutes from './routes/placeRoutes.js';
import authRoutes from './routes/authRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const app = express();

app.use(express.json({ limit: '100kb' })); // only JSON bodies
app.use(express.static(publicDir)); // built React app

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/places', placeRoutes);
app.use('/api', authRoutes);

// The React app is a single bundle, so /admin also serves index.html.
app.get('/admin', (req, res) => res.sendFile(path.join(publicDir, 'index.html')));

// Unknown API route -> JSON 404 instead of an HTML page.
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }));

// Any error thrown in a controller ends up here.
// Body-parser errors (e.g. an invalid JSON body) already carry a correct HTTP
// status code - forward it instead of masking every failure as a 500.
// (Found by the Iteration 11 integration suite: malformed JSON answered 500.)
app.use((err, req, res, next) => {
  console.error(err);
  const status = Number.isInteger(err.status) && err.status >= 400 ? err.status : 500;
  res.status(status).json({ error: 'Something went wrong on the server.' });
});

export default app;
