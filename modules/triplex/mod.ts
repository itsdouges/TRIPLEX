import {
  dirname,
  fromFileUrl,
  join,
} from 'https://deno.land/std@0.103.0/path/mod.ts';

const root = dirname(fromFileUrl(import.meta.url));
const args = Deno.args.includes('--watch') ? ['--watch'] : [];

const backendProcess = Deno.run({
  cwd: Deno.cwd(),
  cmd: [
    'deno',
    'run',
    '--allow-net',
    '--allow-read',
    '--allow-write',
    ...args,
    join(root, 'src/backend.ts'),
  ],
});

const frontendProcess = Deno.run({
  cwd: Deno.cwd(),
  cmd: [
    'deno',
    'run',
    '--allow-env',
    '--allow-ffi',
    '--allow-net',
    '--allow-read',
    '--allow-run',
    '--allow-sys',
    '--allow-write',
    '--node-modules-dir',
    '--unstable',
    ...args,
    join(root, 'src/frontend.ts'),
  ],
});

await Promise.all([backendProcess.status(), frontendProcess.status()]);
