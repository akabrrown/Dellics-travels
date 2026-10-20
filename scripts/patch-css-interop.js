/**
 * Patches react-native-css-interop's stringify() function to prevent crashes
 * when Object.entries() encounters objects with throwing getter traps
 * (e.g. React Navigation's NavigationStateContext default value).
 *
 * Run after: pnpm install
 */
const fs = require('fs');
const path = require('path');

const targetFile = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-css-interop',
  'dist',
  'runtime',
  'native',
  'render-component.js'
);

if (!fs.existsSync(targetFile)) {
  console.log('[patch] react-native-css-interop not found, skipping patch.');
  process.exit(0);
}

let content = fs.readFileSync(targetFile, 'utf8');

const needle = `        for (const entry of Object.entries(value)) {
            newValue[entry[0]] = replace(entry[0], entry[1]);
        }`;

if (content.includes('[Unserializable]')) {
  console.log('[patch] react-native-css-interop already patched, skipping.');
  process.exit(0);
}

if (!content.includes(needle)) {
  console.log('[patch] react-native-css-interop stringify target not found, skipping.');
  process.exit(0);
}

const replacement = `        try {
            for (const entry of Object.entries(value)) {
                try {
                    newValue[entry[0]] = replace(entry[0], entry[1]);
                } catch (_e) {
                    newValue[entry[0]] = "[Unserializable]";
                }
            }
        } catch (_e) {
            seen.delete(value);
            return "[Unserializable]";
        }`;

content = content.replace(needle, replacement);
fs.writeFileSync(targetFile, content, 'utf8');
console.log('[patch] react-native-css-interop stringify patched successfully.');
