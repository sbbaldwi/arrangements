const multer = require('multer');
const path = require('path');

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'audio/mpeg') {
        cb(null, true);
    } else {
        cb(null, false); // Reject file
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname); // Extract the file extension
        cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Append the original extension
    }
});

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
