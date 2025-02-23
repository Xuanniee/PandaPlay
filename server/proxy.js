import express from 'express';
import * as corsProxy from 'cors-anywhere';

const app = express();
const port = process.env.PORT || 3001; // Render dynamically assigns the port

// Create a CORS proxy server
corsProxy.createServer({
    originWhitelist: [],  // Allow all origins
    requireHeaders: ['origin', 'x-requested-with'], // Necessary headers
    removeHeaders: ['cookie', 'accept-encoding'], // Remove unnecessary headers
    setHeaders: {
        'Access-Control-Allow-Origin': '*',  // Allow credentials
    }
}).listen(port, () => {
    console.log(`CORS Anywhere Proxy server is running on port ${port}`);
});
