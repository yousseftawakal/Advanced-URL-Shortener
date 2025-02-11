const express = require('express');
const linkController = require('./../controllers/linkController');

const router = express.Router();

router.get('/links', linkController.getAllLinks);
router.get('/links/:shortCode', linkController.getLink);
router.get('/:shortCode', linkController.goToLink);

module.exports = router;
