const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/login', userController.authenticateUser);
router.post('/register', userController.registerUser);

module.exports = router;
