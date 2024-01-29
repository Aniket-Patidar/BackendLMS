const express = require('express');
const router = express.Router();
const { login, register, profile } = require("../controllers/UserControllers");
const authenticateToken = require('../middleware/jwt');
router.post('/login', login)

router.post('/register', register)

router.get('/profile', authenticateToken, profile)

module.exports = router;

