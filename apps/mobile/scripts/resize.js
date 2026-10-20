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
    
    // Trim empty space if requested
    if (options.trim) {
      pipeline = pipeline.trim();
    }
    
    // Resize
    if (size) {
      pipeline = pipeline.resize(size.width, size.height, {
        fit: options.fit || 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
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
  console.log('Starting image processing...');
  
  // 1. Playstore Icon (Expo Icon) -> 1024x1024
  await processImage('Playstore Icon.png', { width: 1024, height: 1024 }, { trim: true });
  
  // 2. Favicon -> 48x48
  await processImage('Favicon.png', { width: 48, height: 48 }, { trim: true });
  
  // 3. Splash Screen -> 1242x2436 (Expo default splash screen size is commonly 1242x2436, or we can just trim it and resize to a reasonable bounds)
  // Let's trim the splash screen logo and then place it centered in a 1242x2436 canvas
  await processImage('Splash Screen.png', { width: 800, height: 800 }, { trim: true, fit: 'inside' });
  
  // 4. Other icons just get trimmed
  await processImage('Website icon.png', null, { trim: true });
  await processImage('Background Icon.png', null, { trim: true });
  
  console.log('Done!');
}

run();
