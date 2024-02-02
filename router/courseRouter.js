const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const authenticateToken = require('../middleware/jwt');
const { getAllCourses, create, update, Delete, enrolledCourse, getByIdCourse } = require('../controllers/courseControllers');

router.get('/', getAllCourses)
router.get('/:id', getByIdCourse)

router.post('/create', isAdmin, create)

router.post('/update/:id', isAdmin, update)

router.post('/delete/:id', isAdmin, Delete)

router.post('/enrolled-course', authenticateToken, enrolledCourse)

module.exports = router;