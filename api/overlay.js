const express = require('express');
const { downloadVideo, overlayVideos, cleanUpFiles } = require('../utils/ffmpeg');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

app.post('/api/overlay', async (req, res) => {
  const { video1Url, video2Url } = req.body;

  if (!video1Url || !video2Url) {
    return res.status(400).send('Both video URLs are required.');
  }

  const video1Path = path.join('/tmp', `${uuidv4()}.mp4`);
  const video2Path = path.join('/tmp', `${uuidv4()}.mp4`);
  const outputPath = path.join('/tmp', `${uuidv4()}.mp4`);

  try {
    await downloadVideo(video1Url, video1Path);
    await downloadVideo(video2Url, video2Path);
    await overlayVideos(video1Path, video2Path, outputPath);

    const result = fs.readFileSync(outputPath);
    res.setHeader('Content-Type', 'video/mp4');
    res.send(result);
  } catch (err) {
    console.error('Error processing videos:', err);
    res.status(500).send('Failed to process videos.');
  } finally {
    cleanUpFiles([video1Path, video2Path, outputPath]);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
