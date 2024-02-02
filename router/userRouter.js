const express = require('express');
const router = express.Router();
const { login, register, profile, update, uploadAvatar, forgetPasswordMale, changePasswordByOTP, enrolledCourses, logout, dashboard ,jwt} = require("../controllers/userControllers");
const authenticateToken = require('../middleware/jwt');
const upload = require('../middleware/uploadImg');

router.post('/register', register)

router.post('/login', login)

router.get('/profile', authenticateToken, profile)

router.post('/update-profile', authenticateToken, update)

router.post('/avatar', authenticateToken, upload.single("avatar"), uploadAvatar)

router.post('/forget-password-mail', forgetPasswordMale)

router.post('/changePasswordByOTP', changePasswordByOTP)

router.get('/EnrolledCourses', authenticateToken, enrolledCourses)

router.get('/logout', authenticateToken, logout);

router.get('/dashboard', authenticateToken, dashboard);

router.post('/jwt', authenticateToken, jwt);



module.exports = router;

