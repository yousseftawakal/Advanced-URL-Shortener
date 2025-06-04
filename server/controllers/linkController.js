const Link = require('../models/linkModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const QRCode = require('qrcode');

const generateShortCode = async () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let shortCode;
  let isUnique = false;

  while (!isUnique) {
    const length = Math.floor(Math.random() * 16) + 1;

    shortCode = '';
    for (let i = 0; i < length; i++) {
      shortCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const existingLink = await Link.findOne({ shortCode });
    if (!existingLink) isUnique = true;
  }

  return shortCode.trim();
};

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

  res.status(200).json({
    status: 'success',
    data: {
      url: link.url,
    },
  });
});

function normalizeURL(url) {
  if (url) return url.replace(/^(?!https?:\/\/)/, 'https://');
}

exports.createLink = catchAsync(async (req, res) => {
  let { title, url, shortCode } = req.body;
  url = normalizeURL(url);

  if (title === '') title = undefined;
  if (!shortCode) shortCode = await generateShortCode();

  const fullShortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
  const qrCode = await QRCode.toDataURL(fullShortUrl);

  const link = await Link.create({
    title,
    url,
    shortCode,
    qrCode,
    user: req.user.id,
  });

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
  let { title, url, shortCode } = req.body;
  url = normalizeURL(url);

  let qrCode;
  if (shortCode) {
    const fullShortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
    qrCode = await QRCode.toDataURL(fullShortUrl);
  }

  const link = await Link.findOneAndUpdate(
    getFields(req),
    { title, url, shortCode, qrCode: qrCode || undefined },
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
