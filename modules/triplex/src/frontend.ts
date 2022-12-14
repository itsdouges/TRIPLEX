import { createServer } from 'triplex_frontend';
import { getConfig } from './config.ts';

const config = await getConfig();
const frontendServer = await createServer(config);

await frontendServer.listen(5173);

globalThis.addEventListener('unload', () => {
  frontendServer.close();
});
