const express = require('express');
const { home } = require('../controllers/courseControllers');
const router = express.Router();

router.get('/', home)

module.exports = router;