import { createServer } from 'https://deno.land/x/triplex_frontend/mod.ts';
import { getConfig } from './config.ts';

const config = await getConfig();
const frontendServer = await createServer(config);

await frontendServer.listen(5173);

globalThis.addEventListener('unload', () => {
  frontendServer.close();
});
