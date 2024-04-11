const path = require('path');
const multer = require('multer');
const { body, param, validationResult } = require('express-validator');
const Arrangement = require('../models/arrangement');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const originalFilename = path.basename(file.originalname, ext);
    const newFilename = `${file.fieldname}-${originalFilename}-${uniqueSuffix}${ext}`;
    cb(null, newFilename);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.mimetype === 'audio/mpeg') {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } 
}).fields([{ name: 'sheetMusic', maxCount: 1 }, { name: 'recording', maxCount: 1 }]);

const validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    res.status(400).json({ errors: errors.array() });
  };
};

exports.getAllArrangements = (req, res) => {
  Arrangement.find()
    .then(arrangements => res.status(200).json(arrangements))
    .catch(err => res.status(500).json({ message: "Error fetching arrangements", error: err }));
};

exports.getArrangementById = [
  param('id').isMongoId(),
  validate,
  (req, res) => {
    Arrangement.findById(req.params.id)
      .then(arrangement => {
        if (arrangement) {
          res.status(200).json(arrangement);
        } else {
          res.status(404).json({ message: "Arrangement not found" });
        }
      })
      .catch(err => res.status(500).json({ message: "Error fetching arrangement", error: err }));
  }
];

exports.uploadArrangement = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('composer').trim().notEmpty().withMessage('Composer is required'),
  body('ensembleType').trim().notEmpty().withMessage('Ensemble Type is required'),
  body('difficultyLevel').isInt({ min: 1, max: 5 }).withMessage('Difficulty level must be between 1 and 5'),
  body('minimumPurchase').isInt({ min: 1 }).withMessage('Minimum purchase must be at least 1'),
  validate,
  (req, res) => {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ message: "Multer uploading error", error: err.message });
      } else if (err) {
        return res.status(500).json({ message: "File upload error", error: err.message });
      }
      const { title, composer, ensembleType, difficultyLevel, minimumPurchase } = req.body;
      const sheetMusicPath = req.files['sheetMusic'] ? req.files['sheetMusic'][0].path : undefined;
      const recordingPath = req.files['recording'] ? req.files['recording'][0].path : undefined;

      const arrangement = new Arrangement({
        title, composer, ensembleType, difficultyLevel: parseInt(difficultyLevel),
        minimumPurchase: parseInt(minimumPurchase), sheetMusic: sheetMusicPath, recording: recordingPath
      });

      arrangement.save()
        .then(result => res.status(201).json({
          message: "Arrangement uploaded successfully",
          createdArrangement: result
        }))
        .catch(err => res.status(500).json({ message: "Failed to save arrangement", error: err }));
    });
  }
];

exports.updateArrangement = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  body().custom(value => Object.keys(value).length !== 0).withMessage('Please provide data to update'),
  validate,
  (req, res) => {
    Arrangement.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(result => {
        if (result) {
          res.status(200).json({
            message: "Arrangement updated successfully",
            updatedArrangement: result
          });
        } else {
          res.status(404).json({ message: "Arrangement not found" });
        }
      })
      .catch(err => res.status(500).json({ message: "Error updating arrangement", error: err }));
  }
];

exports.deleteArrangement = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  validate,
  (req, res) => {
    Arrangement.findByIdAndDelete(req.params.id)
      .then(arrangement => {
        if (arrangement) {
          res.status(200).json({ message: 'Arrangement deleted successfully' });
        } else {
          res.status(404).json({ message: 'Arrangement not found' });
        }
      })
      .catch(err => res.status(500).json({ message: 'Failed to delete arrangement', error: err.message }));
  }
];
