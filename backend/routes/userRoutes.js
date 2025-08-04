const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');

router.post('/', userController.createuser);
router.post('/login', userController.loginuser);
router.get('/doctors', userController.getDoctors);
router.get('/', verifyToken, verifyAdmin, userController.getAllusers);
router.delete('/:id', verifyToken, verifyAdmin, userController.deleteuser);
router.get('/:id', verifyToken, userController.getuserbyID);
module.exports = router;
