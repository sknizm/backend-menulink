const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantControler');

router.get('/check-slug/:slug', restaurantController.checkRestaurantIfAlreadyExist);
router.post('/create-restaurant', restaurantController.createRestaurant);
router.get("/slug/:userId", restaurantController.getRestaurantSlugByUserId);
router.get('/by-user/:userId', restaurantController.getRestaurantByUserId);
router.get('/slug-check', restaurantController.checkSlug);
router.put('/update', restaurantController.updateRestaurant);

module.exports = router;
