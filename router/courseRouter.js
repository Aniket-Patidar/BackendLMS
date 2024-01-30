const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const authenticateToken = require('../middleware/jwt');
const { getAllCourses, create, update, Delete,enrolledCourse } = require('../controllers/courseControllers');

router.get('/', getAllCourses)

router.post('/create', isAdmin, create)

router.post('/update/:id', isAdmin, update)

router.post('/delete/:id', isAdmin, Delete)

router.post('/Enrolled-course/:id', authenticateToken, enrolledCourse)

module.exports = router;