const { brotliCompress, gzip } = require('node:zlib');
const { promisify } = require('node:util');
const fs = require('node:fs/promises');
const path = require('node:path');
const zlib = require('node:zlib');

const gzipAsync = promisify(gzip);
const brotliAsync = promisify(brotliCompress);

const root = process.cwd();
const targets = [
  path.join(root, '.next', 'static'),
  path.join(root, 'public'),
];

const extensions = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.mjs',
  '.svg',
  '.txt',
  '.wasm',
  '.xml',
]);

const minBytes = 1024;

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  if (!(await exists(dir))) {
    return [];
  }

  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walk(entryPath);
      }

      if (!entry.isFile()) {
        return [];
      }

      if (entry.name.endsWith('.gz') || entry.name.endsWith('.br')) {
        return [];
      }

      if (!extensions.has(path.extname(entry.name))) {
        return [];
      }

      const stat = await fs.stat(entryPath);
      return stat.size >= minBytes ? [entryPath] : [];
    }),
  );

  return files.flat();
}

async function compressFile(filePath) {
  const source = await fs.readFile(filePath);
  const [gzipped, brotlied] = await Promise.all([
    gzipAsync(source, { level: zlib.constants.Z_BEST_COMPRESSION }),
    brotliAsync(source, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
      },
    }),
  ]);

  await Promise.all([
    fs.writeFile(`${filePath}.gz`, gzipped),
    fs.writeFile(`${filePath}.br`, brotlied),
  ]);
}

async function main() {
  const files = (await Promise.all(targets.map(walk))).flat();
  await Promise.all(files.map(compressFile));
  console.log(`Precompressed ${files.length} static files`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
