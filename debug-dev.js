const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Debugging development environment...\n');

// Check 1: Build files
console.log('1. Checking build files...');
const buildDir = path.join(__dirname, 'build');
const mainJs = path.join(buildDir, 'main.js');
const rendererBuild = path.join(__dirname, 'build', 'renderer');

if (!fs.existsSync(buildDir)) {
  console.log('❌ Build directory missing');
} else {
  console.log('✅ Build directory exists');
}

if (!fs.existsSync(mainJs)) {
  console.log('❌ main.js missing');
} else {
  console.log('✅ main.js exists');
}

if (!fs.existsSync(rendererBuild)) {
  console.log('❌ Renderer build missing');
} else {
  console.log('✅ Renderer build exists');
}

// Check 2: Port 3000
console.log('\n2. Checking port 3000...');
try {
  const result = execSync('netstat -ano | findstr :3000', { encoding: 'utf8' });
  if (result.trim()) {
    console.log('✅ Port 3000 is in use (webpack dev server)');
  } else {
    console.log('❌ Port 3000 is not in use');
  }
} catch (error) {
  console.log('❌ Port 3000 is not in use');
}

// Check 3: Node processes
console.log('\n3. Checking Node.js processes...');
try {
  const processes = execSync('tasklist /fi "imagename eq node.exe"', { encoding: 'utf8' });
  const nodeCount = (processes.match(/node\.exe/g) || []).length;
  console.log(`✅ Found ${nodeCount} Node.js processes`);
} catch (error) {
  console.log('❌ No Node.js processes found');
}

// Check 4: Electron processes
console.log('\n4. Checking Electron processes...');
try {
  const processes = execSync('tasklist /fi "imagename eq electron.exe"', { encoding: 'utf8' });
  const electronCount = (processes.match(/electron\.exe/g) || []).length;
  console.log(`✅ Found ${electronCount} Electron processes`);
} catch (error) {
  console.log('❌ No Electron processes found');
}

// Check 5: File watchers
console.log('\n5. Checking source files...');
const srcDir = path.join(__dirname, 'src', 'dev');
const rendererDir = path.join(__dirname, 'renderer', 'dev');

if (fs.existsSync(srcDir)) {
  const srcFiles = fs.readdirSync(srcDir, { recursive: true });
  console.log(`✅ Found ${srcFiles.length} source files in src/dev/`);
} else {
  console.log('❌ src/dev/ directory missing');
}

if (fs.existsSync(rendererDir)) {
  const rendererFiles = fs.readdirSync(rendererDir, { recursive: true });
  console.log(`✅ Found ${rendererFiles.length} renderer files in renderer/dev/`);
} else {
  console.log('❌ renderer/dev/ directory missing');
}

console.log('\n🎯 Debug complete!');
console.log('💡 If you see ❌ marks, try:');
console.log('   1. yarn clean && yarn build');
console.log('   2. Restart terminal');
console.log('   3. yarn dev'); 