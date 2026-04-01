const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'source/_posts');

fs.readdir(postsDir, (err, files) => {
  files.forEach(file => {
    if (!file.endsWith('.md')) return;
    const newName = file.replace(/^\d{8}/, '');
    if (newName === file) return;
    fs.renameSync(
      path.join(postsDir, file),
      path.join(postsDir, newName)
    );
    console.log('✅ 已改:', newName);
  });
});