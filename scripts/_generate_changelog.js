const cp = require('child_process');
const fs = require('fs');
const path = require('path');

function runCapture(cmd, args) {
  try {
    return cp.execFileSync(cmd, args, { encoding: 'utf8' }).toString().trim();
  } catch (e) {
    return null;
  }
}

const lastTag = runCapture('git', ['describe', '--tags', '--abbrev=0']);
let commitsRaw = null;
if (lastTag) {
  commitsRaw = runCapture('git', ['log', `${lastTag}..HEAD`, '--pretty=format:%s']);
} else {
  commitsRaw = runCapture('git', ['log', '--pretty=format:%s', '-n', '50']);
}
const commits = commitsRaw ? commitsRaw.split('\n').filter(Boolean) : [];

const conventionalRe = /^(\w+)(?:\([^\)]+\))?:\s*(.+)$/;
const sections = { Added: [], Fixed: [], Changed: [] };
commits.forEach((c) => {
  const m = conventionalRe.exec(c);
  let type, desc;
  if (m) {
    type = m[1];
    desc = m[2];
  } else {
    const parts = c.split(':');
    if (parts.length > 1) {
      type = parts[0];
      desc = parts.slice(1).join(':').trim();
    } else {
      type = 'chore';
      desc = c;
    }
  }
  const t = (type || '').toLowerCase();
  const section = (t === 'feat' || t === 'feature') ? 'Added' : (t === 'fix' || t === 'bugfix') ? 'Fixed' : 'Changed';
  sections[section].push('- ' + desc);
});

let md = '';
['Added', 'Fixed', 'Changed'].forEach((sec) => {
  if (sections[sec].length) {
    md += `### ${sec}\n\n`;
    md += sections[sec].join('\n') + '\n\n';
  }
});

const pkg = require(path.join(__dirname, '..', 'package.json'));
const versionParts = pkg.version.split('.').map(Number);
versionParts[2] = (versionParts[2] || 0) + 1;
const nextVersion = versionParts.join('.');
const date = new Date().toISOString().slice(0,10);
const entry = `## [${nextVersion}] - ${date}\n\n${md.trim()}\n`;

console.log('=== Generated changelog entry for dry-run ===\n');
console.log(entry);
console.log('\n=== Commands that would run in dry-run ===\n');
console.log('[dry-run] npm test');
console.log('[dry-run] npm run build');
console.log('[dry-run] node ./scripts/copy-templates.js');
console.log(`[dry-run] npm version patch -m "chore(release): %s" (would set version to ${nextVersion})`);
console.log('[dry-run] Would update CHANGELOG.md with the above entry');
console.log('[dry-run] git push origin HEAD --follow-tags');
console.log('[dry-run] npm publish --access public (skipped in dry-run)');
