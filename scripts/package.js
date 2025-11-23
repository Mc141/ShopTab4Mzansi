/**
 * #ShopTab4Mzansi — Package script for creating extension ZIP files.
 * Copyright (C) 2025  M.C. Wolmarans
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 * Usage: node scripts/package.js [chrome|firefox]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const browser = process.argv[2] || 'chrome';
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

const filesToInclude = [
  'manifest.json',
  'content.js',
  'styles.css',
  'popup.html',
  'popup.js',
  'PRIVACY.md'
];

const iconFilesToInclude = [
  'icon16.png',
  'icon32.png',
  'icon48.png',
  'icon64.png',
  'icon96.png',
  'icon128.png'
];

function createPackage(browserType) {
  console.log(`\nCreating ${browserType} package...\n`);

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const packageName = `shoptab4mzansi-${browserType}-v1.0.0.zip`;
  const packagePath = path.join(distDir, packageName);
  const tempDir = path.join(distDir, `temp-${browserType}`);

  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  console.log('Copying files...');
  filesToInclude.forEach(file => {
    const src = path.join(projectRoot, file);
    const dest = path.join(tempDir, file);

    if (fs.existsSync(src)) {
      const stat = fs.statSync(src);
      if (stat.isDirectory()) {
        fs.cpSync(src, dest, { recursive: true });
      } else {
        fs.copyFileSync(src, dest);
      }
      console.log(`  [OK] ${file}`);
    } else {
      console.log(`  [WARN] ${file} not found (skipping)`);
    }
  });

  const iconsDir = path.join(tempDir, 'icons');
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log('Copying icon files...');
  iconFilesToInclude.forEach(iconFile => {
    const src = path.join(projectRoot, 'icons', iconFile);
    const dest = path.join(iconsDir, iconFile);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`  [OK] icons/${iconFile}`);
    } else {
      console.log(`  [WARN] icons/${iconFile} not found (skipping)`);
    }
  });

  if (browserType === 'firefox') {
    const manifestPath = path.join(tempDir, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log('  [OK] Manifest adjusted for Firefox');
    }
  }

  console.log('\nCreating ZIP archive...');
  try {
    if (fs.existsSync(packagePath)) {
      fs.unlinkSync(packagePath);
    }
    
    const zipModule = require('adm-zip');
    const zip = new zipModule();
    zip.addLocalFolder(tempDir);
    zip.writeZip(packagePath);
    console.log(`\n[SUCCESS] Package created: ${packagePath}\n`);
  } catch (error) {
    console.error('\n[ERROR] Error creating ZIP file:', error.message);
    console.log('\nTip: You can manually create a ZIP file from the temp directory');
    console.log(`   Location: ${tempDir}\n`);
    process.exit(1);
  }

  fs.rmSync(tempDir, { recursive: true, force: true });
}

if (browser === 'chrome' || browser === 'firefox') {
  createPackage(browser);
} else {
  console.error('Invalid browser type. Use "chrome" or "firefox"');
  process.exit(1);
}