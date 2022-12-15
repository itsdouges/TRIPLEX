import { createServer } from 'https://deno.land/x/triplex_backend/mod.ts';
import { getConfig } from './config.ts';

const config = await getConfig();
const backendServer = await createServer(config);

await backendServer.listen(8000);
