const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const authenticateToken = require('../middleware/jwt');
const { getAllCourses, create, update, Delete, enrolledCourse, getByIdCourse, Order, ValidateOrder,review ,question, answer} = require('../controllers/courseControllers');

router.get('/', getAllCourses)
router.get('/:id', getByIdCourse)

router.post('/create', isAdmin, create)

router.post('/order/:id', authenticateToken, Order)

router.post('/order/validate/:id', authenticateToken, ValidateOrder)

router.post('/update/:id', isAdmin, update)

router.post('/delete/:id', isAdmin, Delete)

router.post('/enrolled-course', authenticateToken, enrolledCourse)

router.post('/review', authenticateToken, review)

router.post('/question', authenticateToken, question)

router.post('/answer', authenticateToken, answer)



module.exports = router;