const fs = require('fs')
const p = 'app/data/personality/tests.ts'
let s = fs.readFileSync(p, 'utf8')
if (!s.includes("import { animeCharacters } from './anime-characters'")) {
  s = "import { animeCharacters } from './anime-characters'\n\n" + s.replace(/^\uFEFF/, '')
}
const start = s.indexOf('type AnimeCharacter = {')
const end = s.indexOf('const animeAxisMeta = [')
if (start !== -1 && end !== -1 && end > start) {
  s = s.slice(0, start) + s.slice(end)
}
fs.writeFileSync(p, s, 'utf8')
console.log('rewritten', start !== -1 && end !== -1)
