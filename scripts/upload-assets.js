#!/usr/bin/env node

/**
 * Upload built assets to Cloudflare KV for static file serving
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const KV_NAMESPACE = '2020realtors-assets';

async function uploadAssetsToKV() {
  console.log('📦 Uploading assets to Cloudflare KV...');
  
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ Dist directory not found. Run npm run build first.');
    process.exit(1);
  }

  try {
    // Get all files in dist directory
    const files = getAllFiles(DIST_DIR);
    
    console.log(`📁 Found ${files.length} files to upload`);
    
    for (const file of files) {
      const relativePath = path.relative(DIST_DIR, file);
      const kvKey = relativePath.replace(/\\/g, '/'); // Normalize path separators
      
      try {
        // Upload file to KV
        const command = `npx wrangler kv:key put "${kvKey}" --path "${file}" --binding KV`;
        execSync(command, { stdio: 'pipe' });
        console.log(`✅ Uploaded: ${kvKey}`);
      } catch (error) {
        console.warn(`⚠️  Failed to upload ${kvKey}:`, error.message);
      }
    }
    
    console.log('🎉 Asset upload completed!');
    
  } catch (error) {
    console.error('❌ Asset upload failed:', error);
    process.exit(1);
  }
}

function getAllFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Run the upload
uploadAssetsToKV().catch(console.error);