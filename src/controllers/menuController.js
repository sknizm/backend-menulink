const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Middleware: Get restaurantId from user
async function getRestaurantId(userId) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { userId },
    select: { id: true },
  });
  return restaurant?.id;
}

// ✅ Get Menu (Categories with Menu Items)
exports.getMenu = async (req, res) => {
  try {
    
    const { userId } = req.body;
    
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  
    const restaurantId = await getRestaurantId(userId);
    if (!restaurantId) return res.status(404).json({ message: "Restaurant not found" });

    const categories = await prisma.category.findMany({
      where: { restaurantId },
      include: {
        menuItems: true,
      },
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Failed to load menu", error: err.message });
  }
};

// ✅ Get All Categories (Scoped to Restaurant)
exports.getAllCategory = async (req, res) => {
  const userId = req.params.userId;
  try {
    const restaurantId = await getRestaurantId(userId);
    const categories = await prisma.category.findMany({ where: { restaurantId } });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// ✅ Add Categories (Scoped to Restaurant)
// ✅ Create a new category
exports.AddCategory = async (req, res) => {
  const { userId, name, description } = req.body;

  if (!userId || !name) {
    return res.status(400).json({ error: "userId and name are required" });
  }

  try {
    const restaurantId = await getRestaurantId(userId);

    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
        restaurantId,
      },
    });

    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: "Failed to create category", message: err.message });
  }
};

// ✅ Delete Category (Scoped)
exports.deleteCategory = async (req, res) => {
  
  const { id } = req.params;
  const { userId } = req.query;
  try {
    const restaurantId = await getRestaurantId(userId);

    // Ensure the category belongs to this restaurant
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category || category.restaurantId !== restaurantId) {
      return res.status(403).json({ message: "Unauthorized or not found" });
    }

    await prisma.category.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete category", error: err.message });
  }
};

exports.addMenuItem = async (req, res) => {
  const { userId, name, description, price, image, categoryId } = req.body;

  if (!userId || !name || !price || !categoryId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const restaurantId = await getRestaurantId(userId);

    // Optional: Check if the category belongs to this restaurant
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category || category.restaurantId !== restaurantId) {
      return res.status(403).json({ message: "Invalid category" });
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        isAvailable: true,
        categoryId,
        restaurantId,
      },
    });

    res.status(201).json(menuItem);
  } catch (err) {
    res.status(500).json({ message: "Failed to add menu item", error: err.message });
  }
};

exports.getOneMenuItemById = async (req, res) => {
  const { userId } = req.query;
  const { id } = req.params;

  try {
    const restaurantId = await getRestaurantId(userId);

    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!menuItem || menuItem.restaurantId !== restaurantId) {
      return res.status(403).json({ message: "Unauthorized or item not found" });
    }

    res.json(menuItem);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch menu item", error: err.message });
  }
};

// ✅ Delete Menu Item (Scoped)
exports.deleteMenuItem = async (req, res) => {
  const { userId } = req.query;
  const { id } = req.params;
  try {
    const restaurantId = await getRestaurantId(userId);

    const menuItem = await prisma.menuItem.findUnique({ where: { id } });
    if (!menuItem || menuItem.restaurantId !== restaurantId) {
      return res.status(403).json({ message: "Unauthorized or not found" });
    }

    await prisma.menuItem.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete menu item", error: err.message });
  }
};

// ✅ Toggle Availability
exports.toggleAvailability = async (req, res) => {
  const { id } = req.params;
  const { isAvailable , userId } = req.body;

  try {
    const restaurantId = await getRestaurantId(userId);

    const menuItem = await prisma.menuItem.findUnique({ where: { id } });
    if (!menuItem || menuItem.restaurantId !== restaurantId) {
      return res.status(403).json({ message: "Unauthorized or not found" });
    }

    const updated = await prisma.menuItem.update({
      where: { id },
      data: { isAvailable },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update availability", error: err.message });
  }
};

exports.createCategory = async (req, res) => {
  const userId = req.user?.id;
  const { name, description } = req.body;

  try {
    const restaurantId = await getRestaurantId(userId);
    const category = await prisma.category.create({
      data: {
        name,
        description,
        restaurantId,
      },
    });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Failed to create category", error: err.message });
  }
};
exports.updateMenuItem = async (req, res) => {
  const { userId, name, description, price, image, isAvailable, categoryId } = req.body;
  const { id } = req.params;

  if (!userId || !id) {
    return res.status(400).json({ message: "Missing userId or menu item ID" });
  }

  try {
    const restaurantId = await getRestaurantId(userId);

    // Fetch the existing menu item
    const existingItem = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!existingItem || existingItem.restaurantId !== restaurantId) {
      return res.status(403).json({ message: "Unauthorized or item not found" });
    }

    

    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        image,
        isAvailable,
        categoryId,
      },
    });

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: "Failed to update menu item", error: err.message });
  }
};
