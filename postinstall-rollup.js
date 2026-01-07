// Postinstall script for Windows local development only
// Exits immediately in CI/CD or non-Windows environments

// Check environment first - exit early if not Windows or in CI
// This prevents the script from running in Oryx (Azure) or GitHub Actions
if (process.platform !== 'win32' || process.arch !== 'x64' || process.env.CI || process.env.GITHUB_ACTIONS) {
  process.exit(0);
}

// Only proceed on Windows local development
// Use require for compatibility (works in both CommonJS and with createRequire in ES modules)
let fs, path, child_process;
try {
  // Try CommonJS first
  fs = require('fs');
  path = require('path');
  child_process = require('child_process');
} catch (e) {
  // If that fails, we're in ES module mode - exit gracefully
  process.exit(0);
}

try {
  const rollupWinPath = path.join(process.cwd(), 'node_modules', '@rollup', 'rollup-win32-x64-msvc');
  const rollupPath = path.join(process.cwd(), 'node_modules', 'rollup');

  if (!fs.existsSync(rollupWinPath) && fs.existsSync(rollupPath)) {
    const installProcess = child_process.spawn('npm', ['install', '@rollup/rollup-win32-x64-msvc@4.55.1', '--no-save', '--legacy-peer-deps'], {
      shell: true,
      stdio: 'inherit',
      cwd: process.cwd()
    });

    installProcess.on('exit', (code) => {
      process.exit(code || 0);
    });
  } else {
    process.exit(0);
  }
} catch (error) {
  // If anything fails, exit gracefully (don't break the build)
  process.exit(0);
}
