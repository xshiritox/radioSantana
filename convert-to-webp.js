const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function convertToWebP(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);
    console.log(`Successfully converted ${inputPath} to ${outputPath}`);
  } catch (error) {
    console.error('Error converting image:', error);
  }
}

// Convert logo.jpg to logo.webp
const inputPath = path.join(__dirname, 'src', 'assets', 'logo.jpg');
const outputPath = path.join(__dirname, 'src', 'assets', 'logo.webp');

convertToWebP(inputPath, outputPath);
