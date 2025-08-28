const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); //yha file save hogi
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // unique name
  },
});
const upload = multer({ storage });

module.exports = upload;