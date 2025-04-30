// routes/menu.js
const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

// GET all menu data grouped by categories
router.get("/", menuController.getMenu);

// DELETE a category
router.delete("/categories/:id", menuController.deleteCategory);

// DELETE a menu item
router.delete("/items/:id", menuController.deleteMenuItem);

// PATCH availability of a menu item
router.patch("/items/:id/availability", menuController.toggleAvailability);

module.exports = router;
