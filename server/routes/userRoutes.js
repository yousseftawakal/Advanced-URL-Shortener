const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.patch(
  '/updateMyPassword',
  userController.getMe,
  authController.updatePassword
);
router.delete('/deleteMe', userController.getMe, userController.deleteUser);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:username')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.patch('/updatePassword/:username', authController.updatePassword);

module.exports = router;
