import { expandGlob } from 'https://deno.land/std@0.103.0/fs/expand_glob.ts';

const typeCheckIndexModuleName = 'type-check-index.ts';

console.log('Creating a temporary index module to check…');

let rawModule = '';

for await (const { path } of expandGlob('./packages/**/{mod,main}.{ts,tsx}')) {
  rawModule += `import "${path}";\n`;
}

console.log(rawModule);

await Deno.writeTextFile(typeCheckIndexModuleName, rawModule);

console.log('Checking the temporary index module…');

const process = Deno.run({
  cmd: ['deno', 'check', typeCheckIndexModuleName],
  stdout: 'piped',
  stderr: 'piped',
});

const { code } = await process.status();
const rawOutput = await process.output();
const rawError = await process.stderrOutput();

if (code === 0) {
  await Deno.stdout.write(rawOutput);
} else {
  await Deno.stderr.write(rawError);
}

console.log('Deleting the temporary index module…');

await Deno.remove(typeCheckIndexModuleName);

Deno.exit(code);
