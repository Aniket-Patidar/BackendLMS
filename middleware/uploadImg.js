const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads') // Correct the destination directory
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, function (err, buff) {
      const fn = buff.toString("hex") + path.extname(file.originalname);
      cb(null, fn);
    });
  }
})

const upload = multer({ storage: storage });

module.exports = upload; // Correct the export statement
