import { ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';
import { buildPlace } from '../models/place.js';

const places = () => getDb().collection('places');
const toId = (value) => (ObjectId.isValid(value) ? new ObjectId(value) : null);

// FR-001 / FR-005: list places, optionally filtered by category.
export async function list(req, res) {
  const filter = {};
  if (req.query.category) filter.category = String(req.query.category).slice(0, 50);
  res.json(await places().find(filter).sort({ name: 1 }).toArray());
}

// FR-003 / FR-010 - FR-015
export async function getOne(req, res) {
  const _id = toId(req.params.id);
  if (!_id) return res.status(404).json({ error: 'Place not found.' });

  const place = await places().findOne({ _id });
  if (!place) return res.status(404).json({ error: 'Place not found.' });
  res.json(place);
}

// FR-033
export async function create(req, res) {
  const { place, warning, error } = buildPlace(req.body);
  if (error) return res.status(400).json({ error });

  const result = await places().insertOne({ ...place, createdAt: new Date() });
  res.status(201).json({ ...place, _id: result.insertedId, warning });
}

// FR-034
export async function update(req, res) {
  const _id = toId(req.params.id);
  if (!_id) return res.status(404).json({ error: 'Place not found.' });

  const { place, warning, error } = buildPlace(req.body);
  if (error) return res.status(400).json({ error });

  const result = await places().updateOne({ _id }, { $set: place });
  if (!result.matchedCount) return res.status(404).json({ error: 'Place not found.' });
  res.json({ ...place, _id, warning });
}

// FR-035
export async function remove(req, res) {
  const _id = toId(req.params.id);
  if (!_id) return res.status(404).json({ error: 'Place not found.' });

  const result = await places().deleteOne({ _id });
  if (!result.deletedCount) return res.status(404).json({ error: 'Place not found.' });
  res.json({ ok: true });
}
