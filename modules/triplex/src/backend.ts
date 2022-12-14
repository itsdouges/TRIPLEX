import { createServer } from 'triplex_backend';
import { getConfig } from './config.ts';

const config = await getConfig();
const backendServer = await createServer(config);

await backendServer.listen(8000);
