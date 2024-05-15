const multer = require("multer");
const Tesseract = require("tesseract.js");

const express = require("express");
const path = require("path");

const app = express();

// Serve the "index.html" file from the root folder
app.use(express.static(path.join(__dirname)));

// Define your routes
// Example route to handle requests to the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
// Route to handle file uploads
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
