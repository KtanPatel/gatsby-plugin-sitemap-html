const fs = require('fs-extra');
const path = require('path');

(async () => {
  try {
    const src = path.join(__dirname, '..', 'src', 'templates');
    const dest = path.join(__dirname, '..', 'templates');
    if (!(await fs.pathExists(src))) {
      console.log('No src/templates directory found, skipping copy.');
      process.exit(0);
    }
    await fs.remove(dest);
    await fs.copy(src, dest);
    console.log(`Copied templates from ${src} -> ${dest}`);
  } catch (err) {
    console.error('Failed to copy templates:', err);
    process.exit(1);
  }
})();
