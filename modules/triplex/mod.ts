import {
  dirname,
  fromFileUrl,
  join,
} from 'https://deno.land/std@0.103.0/path/mod.ts';

const root = dirname(fromFileUrl(import.meta.url));

const backendProcess = Deno.run({
  cmd: [
    'deno',
    'run',
    '--allow-read',
    '--allow-write',
    '--allow-net',
    ...Deno.args,
    join(root, 'src/backend.ts'),
  ],
});

const frontendProcess = Deno.run({
  cmd: [
    'deno',
    'run',
    '--allow-ffi',
    '--unstable',
    '--allow-read',
    '--allow-sys',
    '--allow-run',
    '--allow-env',
    '--allow-write',
    '--allow-net',
    ...Deno.args,
    join(root, 'src/frontend.ts'),
  ],
});

await Promise.all([backendProcess.status(), frontendProcess.status()]);
