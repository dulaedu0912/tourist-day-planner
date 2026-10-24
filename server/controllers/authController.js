import bcrypt from 'bcryptjs';
import { getDb } from '../config/db.js';
import { signToken } from '../middleware/auth.js';

// FR-029 / FR-030
export async function login(req, res) {
  const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  const admin = await getDb().collection('admins').findOne({ username });
  const valid = admin && (await bcrypt.compare(password, admin.passwordHash));

  if (!valid) return res.status(401).json({ error: 'Invalid username or password.' });
  res.json({ token: signToken(username) });
}
