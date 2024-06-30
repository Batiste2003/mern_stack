const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');

// Auth
router.post('/register', authController.signUp);

// User db
router.get('/', userController.getAllUsers);

router.get('/:id', userController.getUserById);

module.exports = router;
