const Link = require('../models/linkModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllLinks = catchAsync(async (req, res) => {
  const links = await Link.find();

  res.status(200).json({
    status: 'success',
    results: links.length,
    data: {
      links,
    },
  });
});

exports.getLink = catchAsync(async (req, res, next) => {
  const link = await Link.findOne({
    shortCode: req.params.shortCode,
  }).populate({
    path: 'user',
    select: 'name username photo',
  });

  if (!link)
    return next(
      new AppError(
        `No link found with short code '${req.params.shortCode}'.`,
        404
      )
    );

  res.status(200).json({
    status: 'success',
    data: {
      link,
    },
  });
});

exports.goToLink = catchAsync(async (req, res, next) => {
  const link = await Link.findOne({ shortCode: req.params.shortCode });

  if (!link)
    return next(
      new AppError(
        `No link found with short code '${req.params.shortCode}'.`,
        404
      )
    );

  ++link.accessCount;
  link.save();

  res.status(302).redirect(link.url);
});

function normalizeURL(url) {
  if (url) return url.replace(/^(?!https?:\/\/)/, 'https://');
}

exports.createLink = catchAsync(async (req, res) => {
  let { url, shortCode } = req.body;
  url = normalizeURL(url);

  const link = await Link.create({ url, shortCode, user: req.user.id });

  res.status(201).json({
    status: 'success',
    data: {
      link,
    },
  });
});

const getFields = (req) => {
  const fields =
    req.user.role === 'admin'
      ? { shortCode: req.params.shortCode }
      : { shortCode: req.params.shortCode, user: req.user.id };
  return fields;
};

exports.updateLink = catchAsync(async (req, res, next) => {
  let { url, shortCode } = req.body;
  url = normalizeURL(url);

  const link = await Link.findOneAndUpdate(
    getFields(req),
    { url, shortCode },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!link)
    return next(
      new AppError(`No link found with short code '${shortCode}'.`, 404)
    );

  res.status(200).json({
    status: 'success',
    data: {
      link,
    },
  });
});

exports.deleteLink = catchAsync(async (req, res, next) => {
  const link = await Link.findOneAndDelete(getFields(req));

  if (!link)
    return next(
      new AppError(
        `No link found with short code '${req.params.shortCode}'.`,
        404
      )
    );

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
