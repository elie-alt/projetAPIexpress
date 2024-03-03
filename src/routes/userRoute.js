const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authenticate = require('../controllers/authenticate');
const upload = require('../controllers/upload');

router.post('/login', userController.authenticateUser);
router.post('/register', userController.registerUser);
//utilise le midlleware pour se connecter et renvoyer les infos du User
router.get('/profile', authenticate, userController.getProfile);

router.post('/add-file', authenticate, upload.single('file'), userController.uploadFile);
router.delete('/users/rm/:userId', authenticate, userController.deleteUser);
router.post('/users/ban/:userId', authenticate, userController.banUser);
router.get('/users/list', authenticate, userController.listUsers);
router.post('/users/up/:userId', authenticate, userController.upgradeUser);
router.post('/users/down/:userId', authenticate, userController.downgradeUser);

module.exports = router;
