const express = require('express');
const router = express.Router();
const { login, home } = require("../controllers/userControllers")
router.get('/', home)

module.exports = router;