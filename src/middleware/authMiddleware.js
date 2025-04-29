// src/middleware/authMiddleware.js
const prisma = require('../../prisma/client');

const SESSION_COOKIE_NAME = 'nizmweb.session-token';

const requireAuth = async (req, res, next) => {
  const token = req.cookies[SESSION_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No session token' });
  }

  const session = await prisma.session.findUnique({
    where: { sessionToken: token },
    include: { user: true },
  });

  if (!session || new Date(session.expires) < new Date()) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
  }

  req.user = session.user; // attach user to req object
  next();
};

module.exports = requireAuth;
