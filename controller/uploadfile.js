const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No File Exist",
    });
  }

  res.status(200).json({
    success: true,
    message: "✅ File uploaded successfully",
    filePath: `http://localhost:5000/uploads/${req.file.filename}`,
  });
};

module.exports = { uploadFile };
