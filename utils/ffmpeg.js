const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const downloadVideo = (url, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(url)
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .run();
  });
};

const overlayVideos = (video1Path, video2Path, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(video1Path)
      .input(video2Path)
      .complexFilter(['[0:v][1:v] overlay=0:0'])
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .run();
  });
};

const cleanUpFiles = (filePaths) => {
  filePaths.forEach((filePath) => {
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Failed to delete file ${filePath}: `, err);
    });
  });
};

module.exports = { downloadVideo, overlayVideos, cleanUpFiles };


module.exports = { downloadVideo, overlayVideos, cleanUpFiles };
