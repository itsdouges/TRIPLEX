import { createServer } from 'https://deno.land/x/triplex_backend@0.4.0/mod.ts';
import { getConfig } from './config.ts';

const config = await getConfig();
const backendServer = await createServer(config);

await backendServer.listen(8000);
