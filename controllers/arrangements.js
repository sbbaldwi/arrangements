const path = require('path');
const multer = require('multer');
const Arrangement = require('../models/arrangement');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname); // Extract the file extension
    const originalFilename = path.basename(file.originalname, ext); // Extract the original filename without extension
    const newFilename = file.fieldname + '-' + originalFilename + '-' + uniqueSuffix + ext; // Construct the new filename
    cb(null, newFilename); // Use the new filename
  }
});


const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.mimetype === 'audio/mpeg') {
    cb(null, true);
  } else {
    cb(null, false); // Reject file
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
}).fields([{ name: 'sheetMusic', maxCount: 1 }, { name: 'recording', maxCount: 1 }]);


exports.getAllArrangements = (req, res) => {
  Arrangement.find()
    .then(arrangements => {
      res.status(200).json(arrangements);
    })
    .catch(err => {
      res.status(500).json({ message: "Error fetching arrangements", error: err });
    });
};

// Get an arrangement by ID
exports.getArrangementById = (req, res) => {
  Arrangement.findById(req.params.id)
    .then(arrangement => {
      if (arrangement) {
        res.status(200).json(arrangement);
      } else {
        res.status(404).json({ message: "Arrangement not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error fetching arrangement", error: err });
    });
};

exports.uploadArrangement = (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(500).json({ message: "Error uploading files.", error: err });
    }
    // Create a new arrangement with the request body and file paths
    const { title, composer, ensembleType, difficultyLevel, minimumPurchase } = req.body;
    const arrangement = new Arrangement({
      title,
      composer,
      ensembleType,
      difficultyLevel: parseInt(difficultyLevel),
      minimumPurchase: parseInt(minimumPurchase),
      sheetMusic: req.files.sheetMusic[0].path, // Corrected: Use req.files.sheetMusic instead of req.files.sheetMusic[0].path
      recording: req.files.recording[0].path // Corrected: Use req.files.recording instead of req.files.recording[0].path
    });

    // Save the arrangement to the database
    arrangement.save()
      .then(result => {
        res.status(201).json({
          message: "Arrangement uploaded successfully",
          createdArrangement: result
        });
      })
      .catch(err => {
        res.status(500).json({ message: "Failed to save arrangement", error: err });
      });
  });
};


// Update an arrangement
exports.updateArrangement = (req, res) => {
  const id = req.params.id;
  Arrangement.findByIdAndUpdate(id, req.body, { new: true })
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
    .catch(err => {
      res.status(500).json({ message: "Error updating arrangement", error: err });
    });
};

// Delete an arrangement
exports.deleteArrangement = (req, res) => {
  const id = req.params.id;
  Arrangement.findByIdAndRemove(id)
    .then(result => {
      if (result) {
        res.status(200).json({ message: "Arrangement deleted successfully" });
      } else {
        res.status(404).json({ message: "Arrangement not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error deleting arrangement", error: err });
    });
};