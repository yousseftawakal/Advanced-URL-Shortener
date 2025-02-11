const Link = require('../models/linkModel');

exports.getAllLinks = async (req, res) => {
  const links = await Link.find();

  res.status(200).json({
    status: 'success',
    results: links.length,
    data: {
      links,
    },
  });
};

exports.getLink = async (req, res) => {
  const link = await Link.findOne({ shortCode: req.params.shortCode });

  if (!link)
    return res.status(404).json({
      status: 'fail',
      message: 'URL could not be found.',
    });

  res.status(200).json({
    status: 'success',
    data: {
      link,
    },
  });
};

exports.goToLink = async (req, res) => {
  const link = await Link.findOne({ shortCode: req.params.shortCode });

  if (!link)
    return res.status(404).json({
      status: 'fail',
      message: 'URL could not be found.',
    });

  res.status(302).redirect(link.url);
};
