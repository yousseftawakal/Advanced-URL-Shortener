const express = require('express');
const Link = require('../models/linkModel');
const router = express.Router();

router.get('/links', async (req, res) => {
  const links = await Link.find();

  res.status(200).json({
    status: 'success',
    results: links.length,
    data: {
      links,
    },
  });
});

module.exports = router;
