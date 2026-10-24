import express from 'express';

const app = express();

app.use(express.json({ limit: '100kb' })); // only JSON bodies

// Health check: the first endpoint of the project.
app.get('/api/health', (req, res) => res.json({ ok: true }));

export default app;
