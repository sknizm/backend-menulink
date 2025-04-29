const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');

router.post('/memberships', membershipController.createMembership);
router.get('/memberships/active/:restaurantId', membershipController.isMembershipActive);
router.get('/memberships/:restaurantId', membershipController.getRestaurantMembership);

module.exports = router;
