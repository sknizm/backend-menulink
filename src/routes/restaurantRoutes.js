const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantControler');

router.get('/exists/:slug', restaurantController.checkRestaurantIfAlreadyExist);
router.post('/', restaurantController.createRestaurant);
router.get('/slug/:userId', restaurantController.getRestaurantSlugByUserId);
router.get('/by-user/:userId', restaurantController.getUserRestaurant);

module.exports = router;
