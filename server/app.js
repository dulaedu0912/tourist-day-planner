import express from 'express';
import placeRoutes from './routes/placeRoutes.js';

const app = express();

app.use(express.json({ limit: '100kb' })); // only JSON bodies

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/places', placeRoutes);

// Unknown API route -> JSON 404 instead of an HTML page.
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }));

// Any error thrown in a controller ends up here.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

export default app;
