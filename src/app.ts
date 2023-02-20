/**
 * Server entrypoint.
 * 
 * Starts an ExpressJS app and attaches routers to it.
 */
import dotenv from 'dotenv';
import server from './server';

dotenv.config();

const port = process.env.PORT || '8080';
server.start(port);
