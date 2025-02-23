import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as corsProxy from 'cors-anywhere';

import animeRouter from "./controllers/gogoApiRoutes.js"

// Initialise an Express App
const app = express();
const port = process.env.PORT || 3000;

// Before any routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Add the Router middlewares to use other routers
app.use('/api/anime', animeRouter);

/**
 * Using cors-anywhere library, just append actual URL we want to go to after the CORS server I set up
 * and it will send a proxy request on my behalf
 */
// Create a CORS proxy server (on a different port, say 3001)
corsProxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeaders: ['origin', 'x-requested-with'], // Necessary Headers
    removeHeaders: ['cookie', 'accept-encoding'], // Remove unnecessary headers
    setHeaders: {
        'Access-Control-Allow-Origin': '*',  // Allow credentials
    }
}).listen(3001, () => {
    console.log('CORS Anywhere Proxy server is running on port 3001');
});

// Starting my main Backend Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});