const express = require('express');
const userController = require('../controllers/userController');
const authenticate = require('../controllers/authenticate');

const router = express.Router();

router.post('/login', userController.authenticateUser);
router.post('/register', userController.registerUser);
//utilise le midlleware pour se connecter et renvoyer les infos du User
router.post('/profile', authenticate, userController.getProfile);

module.exports = router;
