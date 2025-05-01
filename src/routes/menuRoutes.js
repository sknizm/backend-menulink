// routes/menu.js
const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

// GET all menu data grouped by categories
router.post("/allmenu", menuController.getMenu);

router.get('/categories/:userId', menuController.getAllCategory)
router.post('/categories', menuController.AddCategory)
router.delete("/categories/:id", menuController.deleteCategory);

// DELETE a menu item
router.post("/items", menuController.addMenuItem);
router.get("/items/:id", menuController.getOneMenuItemById);
router.put("/items/:id", menuController.updateMenuItem);
router.delete("/items/:id", menuController.deleteMenuItem);

// PATCH availability of a menu item
router.patch("/items/:id/availability", menuController.toggleAvailability);



module.exports = router;
