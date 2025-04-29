const prisma = require('../../prisma/client');

// ✅ Check if restaurant exists by slug
exports.checkRestaurantIfAlreadyExist = async (req, res) => {
  try {
    const { slug } = req.params;
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
    });
    res.status(200).json({ exists: !!restaurant });
  } catch (error) {
    console.error('Error checking restaurant:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getRestaurantSlugByUserId = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId },
      select: { slug: true },
    });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    return res.status(200).json({ slug: restaurant.slug });
  } catch (err) {
    console.error("Error fetching slug:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Create restaurant
exports.createRestaurant = async (req, res) => {
  const { name, slug, whatsapp, userId  } = req.body;

  if (!name || !slug || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if slug is already taken
    const existing = await prisma.restaurant.findUnique({
      where: { slug },
    });

    if (existing) {
      return res.status(400).json({ error: 'Restaurant with the Same URL Exist' });
    }

    // Create restaurant
    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        slug,
        whatsapp,
        userId,
      },
    });

    // Calculate dates
    const now = new Date();
    const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +1 day

    // Create 1-day membership
    const membership = await prisma.membership.create({
      data: {
        restaurantId: restaurant.id,
        planId: "trial", // You can change this to match your pricing logic
        status: "ACTIVE",
        startDate: now,
        endDate: oneDayLater,
        renewsAt: oneDayLater,
      },
    });

    return res.status(201).json({
      message: 'Restaurant created',
      restaurant,
      membership,
    });

  } catch (err) {
    console.error('Create restaurant error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ✅ Get user’s restaurant summary
exports.getUserRestaurant = async (req, res) => {
  try {
    const { userId } = req.params;
    const restaurant = await prisma.restaurant.findFirst({
      where: { userId },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    res.status(200).json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
