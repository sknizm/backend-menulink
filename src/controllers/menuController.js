const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all categories with their menu items for the logged-in user (hardcoded userId for now)
exports.getMenu = async (req, res) => {
  const userId = "demo-user-id"; // Replace with actual user logic
  try {
    const categories = await prisma.category.findMany({
      where: { userId },
      include: {
        menuItems: true
      },
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Failed to load menu", error: err.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete category", error: err.message });
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.menuItem.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete menu item", error: err.message });
  }
};

// Toggle availability of menu item
exports.toggleAvailability = async (req, res) => {
  const { id } = req.params;
  const { isAvailable } = req.body;

  try {
    const updated = await prisma.menuItem.update({
      where: { id },
      data: { isAvailable },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update availability", error: err.message });
  }
};
