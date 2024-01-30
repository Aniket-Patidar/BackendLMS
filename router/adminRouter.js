const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/jwt');
const { dashboard } = require('../controllers/adminController');
const isAdmin = require('../middleware/isAdmin')

router.post('/dashboard', isAdmin, dashboard);

module.exports = router;

