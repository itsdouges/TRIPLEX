import { createServer as createViteServer } from 'npm:vite@3.2.4';
import reactImport from 'npm:@vitejs/plugin-react@2.2.0';
import glsl from 'npm:vite-plugin-glsl@0.5.4';
import {
  dirname,
  fromFileUrl,
  join,
} from 'https://deno.land/std@0.103.0/path/mod.ts';
import deno from 'vite-deno-resolve';
// HACK: We need to import frontend deps in the deno module so the deps are actually installed.
// ISSUE: https://github.com/denoland/deno/issues/17043
import './deps.ts';

const userModuleDir = join(Deno.cwd(), 'node_modules', '.triplex');
const moduleDir = dirname(fromFileUrl(import.meta.url));
const react = reactImport as unknown as typeof reactImport.default;

export async function createServer(config: { publicDir?: string }) {
  try {
    await Deno.mkdir(join(Deno.cwd(), 'node_modules'), { recursive: true });
    await Deno.symlink(moduleDir, userModuleDir);
  } catch (_) {
    // Link probably already exists
  }

  const frontendServer = await createViteServer({
    configFile: false,
    define: {
      __CWD__: `"${Deno.cwd()}"`,
    },
    plugins: [deno(), react(), glsl()],
    publicDir: config.publicDir,
    resolve: {
      preserveSymlinks: true,
    },
    root: Deno.cwd(),
  });

  return frontendServer;
}
