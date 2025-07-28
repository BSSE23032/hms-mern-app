const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createuser);
router.get('/', userController.getAllusers);
router.post('/login', userController.loginuser);
router.put('/:id', userController.updateuser);
router.delete('/:id', userController.deleteuser);
// GET /api/users/:id
router.get('/doctors', userController.getDoctors);
router.get('/:id', userController.getuserbyID);

module.exports = router;
