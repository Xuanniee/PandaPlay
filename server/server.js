import express from 'express';
import { Sequelize } from 'sequelize';
import bodyParser from 'body-parser';
import cors from 'cors';

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


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});