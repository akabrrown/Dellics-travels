const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const assetsDir = path.join(__dirname, '../assets');

async function processImage(filename, size, options = {}) {
  const inputPath = path.join(assetsDir, filename);
  const outputPath = path.join(assetsDir, `processed_${filename}`);
  
  if (!fs.existsSync(inputPath)) {
    console.log(`Skipping ${filename}, file not found.`);
    return;
  }

  try {
    let pipeline = sharp(inputPath);
    
    // Resize
    if (size) {
      pipeline = pipeline.resize(size.width, size.height, {
        fit: options.fit || 'cover',
      });
    }

    await pipeline.toFile(outputPath);
    
    // Replace original
    fs.renameSync(outputPath, inputPath);
    console.log(`Successfully processed ${filename}`);
  } catch (err) {
    console.error(`Error processing ${filename}:`, err);
  }
}

async function run() {
  console.log('Starting image processing for updated assets...');
  
  // 1. App Icon (Expo Icon) -> 1024x1024 (iOS requires exactly square without alpha)
  await processImage('app icon.png', { width: 1024, height: 1024 });
  
  // 2. Favicon -> 48x48
  await processImage('Favicon.png', { width: 48, height: 48 });
  
  // 3. Splash Screen -> 1242x2436 (Expo default portrait size)
  await processImage('Splash Screen.png', { width: 1242, height: 2436 }, { fit: 'cover' });
  
  // 4. Website icon
  await processImage('Website icon.png', { width: 512, height: 512 });
  
  console.log('Done!');
}

run();
