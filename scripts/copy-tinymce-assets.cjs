const fs = require('fs')
const path = require('path')

const sourceDir = path.resolve(__dirname, '..', 'node_modules', 'tinymce')
const targetDir = path.resolve(__dirname, '..', 'public', 'tinymce')

if (!fs.existsSync(sourceDir)) {
  console.warn('[copy:tinymce] source not found, skipping:', sourceDir)
  process.exit(0)
}

fs.mkdirSync(path.dirname(targetDir), { recursive: true })
fs.cpSync(sourceDir, targetDir, { recursive: true, force: true })

console.log('[copy:tinymce] copied assets to', targetDir)
