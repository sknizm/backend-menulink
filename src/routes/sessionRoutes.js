const express = require('express');
const router = express.Router();
const { createSession, deleteSession, checkSession } = require('../controllers/sessionController');

router.get('/', checkSession);   
router.post('/', createSession);    // Create session
router.delete('/', deleteSession);  // Delete session

module.exports = router;
