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

// ✅ Create restaurant
exports.createRestaurant = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      logo,
      address,
      phone,
      whatsapp,
      instagram,
      userId,
    } = req.body;

    const newRestaurant = await prisma.restaurant.create({
      data: {
        name,
        slug,
        description,
        logo,
        address,
        phone,
        whatsapp,
        instagram,
        userId,
      },
    });

    res.status(201).json(newRestaurant);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ✅ Get restaurant slug by user ID
exports.getRestaurantSlugByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const restaurant = await prisma.restaurant.findFirst({
      where: { userId },
      select: { slug: true },
    });

    res.status(200).json({ slug: restaurant?.slug ?? null });
  } catch (error) {
    console.error('Error fetching slug:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
