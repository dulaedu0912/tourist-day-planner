import { ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';

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
