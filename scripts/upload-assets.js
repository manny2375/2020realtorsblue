#!/usr/bin/env node

/**
 * Upload built assets to Cloudflare KV for static file serving
 * This script uploads all files from the dist directory to KV storage
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const KV_BINDING = 'KV'; // This should match the binding name in wrangler.toml

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
    
    let successCount = 0;
    let failCount = 0;
    
    for (const file of files) {
      const relativePath = path.relative(DIST_DIR, file);
      const kvKey = relativePath.replace(/\\/g, '/'); // Normalize path separators
      
      try {
        // Upload file to KV
        const command = `npx wrangler kv key put "${kvKey}" --path "${file}" --binding ${KV_BINDING}`;
        execSync(command, { stdio: 'pipe' });
        console.log(`✅ Uploaded: ${kvKey}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to upload ${kvKey}:`, error.message);
        failCount++;
      }
    }
    
    console.log(`\n🎉 Asset upload completed!`);
    console.log(`✅ Successfully uploaded: ${successCount} files`);
    if (failCount > 0) {
      console.log(`❌ Failed uploads: ${failCount} files`);
    }
    
    if (successCount === 0) {
      console.error('\n❌ No files were uploaded successfully. Check your KV namespace configuration.');
      process.exit(1);
    }
    
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
        // Only include files that should be served
        if (!item.startsWith('.') && !item.endsWith('.map')) {
        files.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Run the upload