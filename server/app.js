import express from 'express';
import { list } from './controllers/placeController.js';

const app = express();

app.use(express.json({ limit: '100kb' })); // only JSON bodies

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Iteration 1: serve the seeded places (temporary wiring - routes move into
// server/routes in Iteration 2).
app.get('/api/places', (req, res, next) => Promise.resolve(list(req, res)).catch(next));

// Any error thrown in a controller ends up here.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

export default app;
