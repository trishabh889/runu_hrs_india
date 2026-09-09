const fs = require('fs');
const path = require('path');

console.log('--- Packaging Modular RUNO HRS INDIA Desktop Application ---');

const projectRoot = __dirname;
const electronDist = path.join(projectRoot, '..', 'node_modules', 'electron', 'dist');
const outputDir = path.join(projectRoot, 'dist', 'RUNO_HRS_INDIA_MIS');

if (!fs.existsSync(electronDist)) {
  console.error('Electron binaries not found at:', electronDist);
  process.exit(1);
}

// Clean output directory
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir, { recursive: true });

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      if (file === 'default_app.asar') continue;
      if (file === 'electron.exe') {
        fs.copyFileSync(path.join(src, file), path.join(dest, 'RUNO_HRS_INDIA_MIS.exe'));
        console.log('Created binary: RUNO_HRS_INDIA_MIS.exe');
      } else {
        copyRecursive(path.join(src, file), path.join(dest, file));
      }
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Copying Electron runtime binaries...');
copyRecursive(electronDist, outputDir);
const targetExe = path.join(outputDir, 'RUNO_HRS_INDIA_MIS.exe');

// Copy application files to resources/app
const appDir = path.join(outputDir, 'resources', 'app');
fs.mkdirSync(appDir, { recursive: true });

console.log('Copying modular application source files...');
const itemsToCopy = ['package.json', 'main.js', 'preload.js', 'db', 'ipc', 'src'];
itemsToCopy.forEach(item => {
  copyRecursive(path.join(projectRoot, item), path.join(appDir, item));
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
const { execSync } = require('child_process');
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


console.log('✅ Standalone Modular Desktop Application successfully built at:');
console.log(targetExe);

