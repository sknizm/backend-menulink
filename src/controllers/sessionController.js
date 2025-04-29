const prisma = require('../../prisma/client');
const { v4: uuidv4 } = require('uuid');

const SESSION_COOKIE_NAME = 'my.menulink.session-token';
exports.checkSession = async (req, res) => {
  try {
    const token = req.cookies[SESSION_COOKIE_NAME];
    if (!token) return res.status(200).json({ user: null });

    const session = await prisma.session.findUnique({
      where: { sessionToken: token },
      include: { user: true },
    });

    if (!session) {
      return res.status(200).json({ user: null });
    }

    // Sanitize user object
    const { password, ...safeUser } = session.user;

    return res.status(200).json({ user: safeUser });
  } catch (error) {
    console.error('Session check failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Create a session and set cookie
exports.createSession = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const sessionToken = uuidv4();
    const expires = new Date();
    expires.setDate(expires.getDate() + 30); // 30 days

    // Save session in DB
    await prisma.session.create({
      data: {
        sessionToken,
        userId,
        expires,
      },
    });

    // Set cookie
    res.cookie(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: true, 
      sameSite: 'None',
      path: '/',
      expires,
    });

    res.status(201).json({ message: 'Session created' });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete session and remove cookie
exports.deleteSession = async (req, res) => {
  try {
    const sessionToken = req.cookies[SESSION_COOKIE_NAME];

    if (sessionToken) {
      await prisma.session.deleteMany({
        where: { sessionToken },
      });
    }

    res.clearCookie(SESSION_COOKIE_NAME, {
      path: '/',
    });

    res.status(200).json({ message: 'Session deleted' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
