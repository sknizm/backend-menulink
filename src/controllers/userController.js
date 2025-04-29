const prisma = require('../../prisma/client');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const SESSION_COOKIE_NAME = 'my.menulink.session-token';

// Utility: hash password
async function passwordHasher(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Utility: create session and return token + expires
async function createSession(userId) {
  const sessionToken = uuidv4();
  const expires = new Date();
  expires.setDate(expires.getDate() + 30); // 30 days expiry

  await prisma.session.create({
    data: {
      sessionToken,
      userId,
      expires,
    },
  });

  return { sessionToken, expires };
}

// Utility: set session cookie
function setSessionCookie(res, sessionToken, expires) {
  res.cookie(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: true, 
    sameSite: 'None',
    path: '/',
    expires,
  });
}

// ✅ Check if user exists by email
exports.checkUserIfAlreadyExist = async (email) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  return !!existingUser;
};

// ✅ Get full user by email
exports.getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

// ✅ Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(401).json({ error: 'Email is Missing' });
    }

    if (!password) {
      return res.status(401).json({ error: 'Password is Missing' });
    }

    const user = await exports.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'User does not Exist, Please Signup' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { sessionToken, expires } = await createSession(user.id);
    setSessionCookie(res, sessionToken, expires);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.logoutUser = async (req, res) => {
  try {
    const sessionToken = req.cookies[SESSION_COOKIE_NAME];

    if (!sessionToken) {
      return res.status(200).json({ message: 'No active session' });
    }

    // Delete session from database
    await prisma.session.delete({
      where: { sessionToken },
    });

    // Clear cookie
    res.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: true, 
      secure: true, 
      sameSite: 'None',
      path: '/',
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// ✅ Create user and session
exports.createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await passwordHasher(password);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const { sessionToken, expires } = await createSession(newUser.id);
    setSessionCookie(res, sessionToken, expires);

    res.status(201).json({ message: 'User created', status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
