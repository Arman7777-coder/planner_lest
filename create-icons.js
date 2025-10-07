const fs = require('fs');
const path = require('path');

// Simple script to create placeholder icons
// Run this on a system with ImageMagick or manually convert the SVG

console.log('Creating placeholder icons...');
console.log('Please convert icons/icon-512.svg to PNG files in these sizes:');
console.log('16x16, 24x24, 32x32, 48x48, 64x64, 128x128, 256x256, 512x512');

const sizes = [16, 24, 32, 48, 64, 128, 256, 512];

sizes.forEach(size => {
  const filename = `icon-${size}.png`;
  console.log(`- ${filename} (${size}x${size})`);
});

console.log('\nUse online tools like:');
console.log('- https://cloudconvert.com/svg-to-png');
console.log('- https://favicon.io/favicon-converter/');
console.log('- Or any image editor (Photoshop, GIMP, etc.)');

// Create a simple HTML file for testing icons
const testHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Icon Test</title>
</head>
<body>
    <h1>FocusPlanner Icons</h1>
    <p>Check that all icon sizes are created correctly:</p>
    ${sizes.map(size => `<img src="icons/icon-${size}.png" alt="${size}x${size}" style="margin: 10px;">`).join('')}
</body>
</html>
`;

fs.writeFileSync('icon-test.html', testHtml);
console.log('\nCreated icon-test.html for verification');