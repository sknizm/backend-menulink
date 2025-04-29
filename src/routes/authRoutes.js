const express = require('express');
const { createUser, loginUser, logoutUser } = require('../controllers/userController');
const router = express.Router();

router.post('/signup', createUser)
router.post('/signin', loginUser)
router.post('/signout', logoutUser)


module.exports = router;