#!/usr/bin/env node

/**
 * Build Version Script
 * Generates a build timestamp and injects it into the HTML for version tracking
 */

const fs = require('fs');
const path = require('path');

const buildTime = Date.now();
const buildDate = new Date().toISOString();

console.log(`🔨 Build started at: ${buildDate}`);
console.log(`📦 Build timestamp: ${buildTime}`);

// Create version info file
const versionInfo = {
  buildTime,
  buildDate,
  version: `v${buildTime}`,
  environment: process.env.NODE_ENV || 'development'
};

// Write version file to public directory
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(
  path.join(publicDir, 'version.json'),
  JSON.stringify(versionInfo, null, 2)
);

console.log(`✅ Version file created: ${JSON.stringify(versionInfo, null, 2)}`);

// Update index.html template if it exists
const indexPath = path.join(__dirname, '..', 'index.html');
if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Add build time meta tag
  const metaTag = `<meta name="build-time" content="${buildTime}">`;
  
  if (indexContent.includes('<meta name="build-time"')) {
    // Replace existing meta tag
    indexContent = indexContent.replace(
      /<meta name="build-time" content="[^"]*">/,
      metaTag
    );
  } else {
    // Add new meta tag
    indexContent = indexContent.replace(
      '<head>',
      `<head>\n    ${metaTag}`
    );
  }
  
  fs.writeFileSync(indexPath, indexContent);
  console.log(`✅ Updated index.html with build timestamp`);
}

console.log(`🚀 Build version setup complete!`);
