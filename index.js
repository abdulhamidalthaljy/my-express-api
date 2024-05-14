const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const path = require("path");

const app = express();
const upload = multer({ dest: "/tmp/uploads" }); // Custom upload directory

// Handle request for /favicon.ico
app.get("/favicon.ico", (req, res) => {
  res.status(204).end(); // Respond with No Content status code
});

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const imagePath = path.join(__dirname, req.file.path);

  Tesseract.recognize(imagePath, "deu", { logger: (e) => console.log(e) })
    .then((out) => {
      console.log(out);
      res.send(out.text); // Sending the recognized text as response
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred during OCR.");
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Export the Express app
