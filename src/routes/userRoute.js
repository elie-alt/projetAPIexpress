const express = require('express');
const userController = require('../controllers/userController');
const authenticate = require('../controllers/authenticate');
const upload = require('../controllers/upload');

const router = express.Router();

router.post('/login', userController.authenticateUser);
router.post('/register', userController.registerUser);
//utilise le midlleware pour se connecter et renvoyer les infos du User
router.get('/profile', authenticate, userController.getProfile);

router.post('/add-file', authenticate, upload.single('file'), userController.uploadFile);

module.exports = router;
