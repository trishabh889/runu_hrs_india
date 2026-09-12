const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('--- Packaging Modular RUNO HRS INDIA Desktop Application ---');

const projectRoot = __dirname;
const electronDist = path.join(projectRoot, '..', 'node_modules', 'electron', 'dist');
const outputDir = path.join(projectRoot, 'dist', 'RUNO_HRS_INDIA_MIS');
const outputDirX64 = path.join(projectRoot, 'dist', 'RUNO_HRS_INDIA_MIS_Windows_x64');

if (!fs.existsSync(electronDist)) {
  console.error('Electron binaries not found at:', electronDist);
  process.exit(1);
}

// Ensure running instances are terminated so files are not locked
try {
  const killCmd = process.platform === 'win32' ? 'C:\\Windows\\System32\\taskkill.exe' : 'killall';
  execSync(`"${killCmd}" /F /IM RUNO_HRS_INDIA_MIS.exe /T`, { stdio: 'ignore' });
} catch (e) {}
Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 700);

fs.mkdirSync(outputDir, { recursive: true });

function copyRecursive(src, dest, overwrite = true) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      if (file === 'default_app.asar') continue;
      if (file === 'electron.exe') {
        const destExe = path.join(dest, 'RUNO_HRS_INDIA_MIS.exe');
        if (!fs.existsSync(destExe) || overwrite) {
          try { fs.copyFileSync(path.join(src, file), destExe); } catch (e) {}
        }
      } else {
        copyRecursive(path.join(src, file), path.join(dest, file), overwrite);
      }
    }
  } else {
    if (!fs.existsSync(dest) || overwrite) {
      try { fs.copyFileSync(src, dest); } catch (e) {}
    }
  }
}

console.log('Ensuring Electron runtime binaries...');
copyRecursive(electronDist, outputDir, false);
const targetExe = path.join(outputDir, 'RUNO_HRS_INDIA_MIS.exe');

// Clean and copy fresh application files to resources/app
const appDir = path.join(outputDir, 'resources', 'app');
if (fs.existsSync(appDir)) {
  try { fs.rmSync(appDir, { recursive: true, force: true }); } catch (e) {}
}
fs.mkdirSync(appDir, { recursive: true });

console.log('Copying modular application source files...');
const itemsToCopy = [
  'package.json', 'main.js', 'preload.js', 'logger.js',
  'db', 'ipc', 'src', 'testing', 'data'
];
itemsToCopy.forEach(item => {
  const itemPath = path.join(projectRoot, item);
  if (fs.existsSync(itemPath)) {
    copyRecursive(itemPath, path.join(appDir, item));
  }
});

// Copy standalone icon & shortcut installer for portable distribution
const distShortcuts = ['install_shortcut.ps1', 'Install_Desktop_Shortcut.cmd'];
distShortcuts.forEach(f => {
  const srcF = path.join(projectRoot, f);
  if (fs.existsSync(srcF)) fs.copyFileSync(srcF, path.join(outputDir, f));
});
const icoSrc = path.join(projectRoot, 'src', 'assets', 'app.ico');
if (fs.existsSync(icoSrc)) fs.copyFileSync(icoSrc, path.join(outputDir, 'app.ico'));

// Embed RUNO icon directly into PE executable binary
const rceditExe = path.join(projectRoot, '..', 'node_modules', 'electron-winstaller', 'vendor', 'rcedit.exe');
if (fs.existsSync(rceditExe) && fs.existsSync(icoSrc)) {
  let embedded = false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      execSync(`"${rceditExe}" "${targetExe}" --set-icon "${icoSrc}"`, { stdio: 'ignore' });
      console.log('✅ Successfully embedded RUNO icon into binary: RUNO_HRS_INDIA_MIS.exe');
      embedded = true;
      break;
    } catch (e) {
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 700);
    }
  }
  if (!embedded) console.warn('Note: rcedit deferred icon lock.');
}

// Sync to RUNO_HRS_INDIA_MIS_Windows_x64 distribution folder
console.log('Syncing x64 distribution package...');
if (fs.existsSync(outputDirX64)) {
  try {
    fs.rmSync(outputDirX64, { recursive: true, force: true });
  } catch (e) {}
}
copyRecursive(outputDir, outputDirX64);

// Create ZIP archive for direct distribution
const zipOutput = path.join(projectRoot, 'dist', 'RUNO_HRS_INDIA_MIS_Windows_x64.zip');
try {
  console.log('Generating ZIP distribution package...');
  if (fs.existsSync(zipOutput)) fs.unlinkSync(zipOutput);
  execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${outputDirX64}\\*' -DestinationPath '${zipOutput}' -Force"`, { stdio: 'inherit' });
  console.log('✅ Distribution archive created at:', zipOutput);
} catch (e) {
  console.warn('Note: ZIP archive generation skipped:', e.message);
}

console.log('✅ Standalone Modular Desktop Application successfully built at:');
console.log(targetExe);
