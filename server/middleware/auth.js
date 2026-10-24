// FR-032 / NFR-005: every write route needs a valid token.
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export function requireAuth(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer /, '');
  try {
    req.admin = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Please log in again.' });
  }
}

export function signToken(username) {
  return jwt.sign({ username }, SECRET, { expiresIn: '2h' });
}
