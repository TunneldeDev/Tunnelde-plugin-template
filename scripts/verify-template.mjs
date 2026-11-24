import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspectArchive, verifyArchive } from '@tunnelde/plugin-sdk/tools';

const root = fileURLToPath(new URL('../', import.meta.url));
// Generated plugin repositories inherit CI; only an uninitialized template is scaffolded.
const identity = JSON.parse(await readFile(join(root, 'tunnelde-plugin.json'), 'utf8'));
if (identity.id !== 'example-plugin') {
  console.log('Template initialization acceptance skipped for an already initialized plugin.');
  process.exit(0);
}
const temporary = await mkdtemp(join(tmpdir(), 'tunnelde-template-acceptance-'));
const source = join(temporary, 'source');
const installed = join(temporary, 'installed');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const run = args => execFileSync(npm, args, { cwd: source, stdio: 'inherit', timeout: 180000 });
try {
  await cp(root, source, { recursive: true, filter: path =>
    !['.git', 'node_modules', 'artifacts', 'dist'].includes(path.slice(root.length).split(/[\\/]/)[0]) });
  run(['ci', '--ignore-scripts']);
  run(['run', 'init', '--', 'template-acceptance', 'Template Acceptance', 'TunneldeDev', 'template-acceptance']);
  const manifest = JSON.parse(await readFile(join(source, 'tunnelde-plugin.json'), 'utf8'));
  assert.equal(manifest.id, 'template-acceptance');
  assert.equal(manifest.name, 'Template Acceptance');
  assert.deepEqual(manifest.permissions, []);
  // Inherited CI must also work after the developer initializes their repository.
  run(['run', 'verify:template']);
  run(['run', 'build']);
  run(['run', 'verify']);
  run(['run', 'package']);
  const artifact = join(source, 'artifacts', `template-acceptance-${manifest.version}.zip`);
  const bytes = await readFile(artifact);
  const entry = JSON.parse(await readFile(join(source, 'artifacts', 'marketplace.json'), 'utf8'));
  assert.equal(entry.url, `https://github.com/TunneldeDev/template-acceptance/releases/download/v${manifest.version}/template-acceptance-${manifest.version}.zip`);
  verifyArchive(bytes, entry);
  const checksums = await readFile(join(source, 'artifacts', 'SHA256SUMS'), 'utf8');
  assert.equal(checksums, `${entry.sha256}  template-acceptance-${manifest.version}.zip\n`);
  run(['run', 'package']);
  assert.ok(bytes.equals(await readFile(artifact)), 'Repeated packaging must produce identical bytes');
  // Only extract after the SDK has checked hashes, identity, paths and entries.
  for (const [name, content] of inspectArchive(bytes)) {
    const target = join(installed, name);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, content);
  }
  const requests = [
    { jsonrpc: '2.0', id: 1, method: 'initialize', params: { apiVersion: 1 } },
    { jsonrpc: '2.0', id: 2, method: 'command.run', params: { command: 'hello' } },
  ];
  const output = execFileSync(process.execPath, [resolve(installed, manifest.main)], {
    cwd: temporary, encoding: 'utf8', timeout: 10000,
    input: requests.map(request => JSON.stringify(request)).join('\n') + '\n',
  });
  const responses = output.trim().split('\n').map(line => JSON.parse(line));
  assert.equal(responses[0].result.ok, true);
  assert.equal(responses[1].result.text, 'Hello, Tunnelde!');
  console.log('Initialized template, reproducible package and dependency-free installed stdio passed.');
} finally {
  await rm(temporary, { recursive: true, force: true });
}
