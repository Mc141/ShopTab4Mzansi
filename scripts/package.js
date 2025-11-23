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
  'icons',
  'PRIVACY.md'
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
    const isWindows = process.platform === 'win32';
    const zipCommand = isWindows
      ? `powershell Compress-Archive -Path "${tempDir}\\*" -DestinationPath "${packagePath}" -Force`
      : `cd "${tempDir}" && zip -r "${packagePath}" .`;

    execSync(zipCommand, { stdio: 'inherit' });
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