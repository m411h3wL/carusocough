const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const recordingsDir = path.join(__dirname, 'recordings');
if (!fs.existsSync(recordingsDir)) {
  fs.mkdirSync(recordingsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, recordingsDir),
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    cb(null, `recording-${timestamp}.webm`);
  }
});
const upload = multer({ storage });

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.post('/api/recordings', upload.single('audio'), (req, res) => {
  res.json({ saved: req.file.filename });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Vocal trainer running at http://localhost:${PORT}`);
});
