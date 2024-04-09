const path = require('path');
const multer = require('multer');

// Define storage settings
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let uploadPath;
        if (file.mimetype === 'application/pdf') {
            uploadPath = 'uploads/pdf/';
        } else if (file.mimetype === 'audio/mpeg') { // Assuming MP3 files have 'audio/mpeg' mimetype
            uploadPath = 'uploads/mp3/';
        } else if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            uploadPath = 'uploads/images/';
        } else {
            // Handle unsupported file types
            return cb(new Error('Unsupported file type'));
        }
        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        let ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

// Define file filter function
const fileFilter = function(req, file, callback) {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'audio/mpeg' ||
        file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        callback(null, true);
    } else {
        callback(new Error('Unsupported file type'));
    }
};

// Initialize multer with settings
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 2 // Limit file size to 2MB
    }
});

module.exports = upload;

