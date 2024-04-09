const Arrangement = require('../models/arrangement');
const middleware = require('../middleware/upload');


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
        sheetMusic: req.files.sheetMusic[0].path,
        recording: req.files.recording[0].path
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