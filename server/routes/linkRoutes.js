const express = require('express');
const linkController = require('./../controllers/linkController');

const router = express.Router();

router.get('/', linkController.getAllLinks);
router.get('/i/:shortCode', linkController.getLink);
router.get('/g/:shortCode', linkController.goToLink);
router.post('/c', linkController.createLink);
router.patch('/u/:shortCode', linkController.updateLink);
router.delete('/d/:shortCode', linkController.deleteLink);

module.exports = router;
