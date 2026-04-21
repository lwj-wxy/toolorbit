import fs from 'node:fs/promises'
import path from 'node:path'
import https from 'node:https'

const repoRoot = process.cwd()
const outDir = path.join(repoRoot, 'public', 'images', 'anime-covers')
const outData = path.join(repoRoot, 'app', 'data', 'personality', 'anime-characters.ts')

function getText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.setEncoding('utf8')
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`GET ${url} failed: ${res.statusCode}`))
          return
        }
        resolve(data)
      })
    }).on('error', reject)
  })
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (!res.statusCode || res.statusCode >= 400) {
        reject(new Error(`GET ${url} failed: ${res.statusCode}`))
        return
      }

      const chunks = []
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', async () => {
        try {
          await fs.writeFile(destPath, Buffer.concat(chunks))
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    }).on('error', reject)
  })
}

function extFromImagePath(imagePath) {
  const clean = imagePath.split('?')[0]
  const ext = path.extname(clean).toLowerCase()
  return ext || '.webp'
}

const rawUrl = 'https://raw.githubusercontent.com/tianxingleo/ACGTI/main/src/data/characters.json'
const raw = await getText(rawUrl)
const characters = JSON.parse(raw)

await fs.mkdir(outDir, { recursive: true })

const transformed = []
let downloaded = 0

for (const character of characters) {
  const ext = extFromImagePath(character.image || '')
  const localFilename = `${character.id}${ext}`
  const localPath = path.join(outDir, localFilename)
  const localUrl = `/images/anime-covers/${localFilename}`

  const sourcePath = String(character.image || '').startsWith('/') ? String(character.image) : `/images/characters/${character.id}.webp`
  const sourceUrl = encodeURI(`https://raw.githubusercontent.com/tianxingleo/ACGTI/main/public${sourcePath}`)

  try {
    await downloadFile(sourceUrl, localPath)
    downloaded += 1
  } catch (error) {
    console.error(`download failed for ${character.id}:`, error.message)
    continue
  }

  const desc = String(character.note || character.title || '').replace(/\s+/g, ' ').trim()
  transformed.push({
    id: String(character.id),
    name: String(character.name || ''),
    from: String(character.series || '未知作品'),
    description: desc.slice(0, 120),
    matchCode: String(character.matchCode || '').toUpperCase(),
    matchCodeFlex: Array.isArray(character.matchCodeFlex) ? character.matchCodeFlex.map((item) => String(item).toUpperCase()) : [],
    imageUrl: localUrl,
  })
}

const content = `export type AnimeCharacterData = {\n  id: string\n  name: string\n  from: string\n  description: string\n  matchCode: string\n  matchCodeFlex: string[]\n  imageUrl: string\n}\n\nexport const animeCharacters: AnimeCharacterData[] = ${JSON.stringify(transformed, null, 2)}\n`
await fs.writeFile(outData, content, 'utf8')

console.log(`characters source: ${characters.length}`)
console.log(`downloaded images: ${downloaded}`)
console.log(`written data: ${transformed.length}`)
