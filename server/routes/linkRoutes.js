const express = require('express');
const linkController = require('./../controllers/linkController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/g/:shortCode', linkController.goToLink);
router.get('/i/:shortCode', linkController.getLink);

router.use(authController.protect);

router.post('/c', linkController.createLink);
router.patch('/u/:shortCode', linkController.updateLink);
router.delete('/d/:shortCode', linkController.deleteLink);

router.get('/', authController.restrictTo('admin'), linkController.getAllLinks);

module.exports = router;
