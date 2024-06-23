import express from "express";

import { fetchAnimStreamLinks, fetchAnimeInfo, fetchAnimeSearchResults, fetchRecentAnimeEpisodes } from "../services/gogoApiUtils.js";

// Create a new Router for GogoAnime APIs
const animeRouter = express.Router();

// Note the URL here is listening, not to make a call to this endpoint
animeRouter.post('/fetch-info', async (req, res) => {
    try {
        // Retrieve animeId from request
        const animeId = req.body.animeId;
        const animeInfo = await fetchAnimeInfo(animeId);

        // Send JSON res back to client
        console.log(`AnimeRoutes: ${animeInfo}`);
        console.log(`AnimeRoutesData: ${animeInfo.data}`);
        res.json(animeInfo.data);
    }
    catch (error) {
        console.error('Error in /fetch-info:', error);
        res.status(500).json({ error: 'Failed to fetch data from API' });
    }
})

animeRouter.post('/fetch-stream-link', async (req, res) => {
    try {
        // Extract the Episode ID from the req
        const episodeId = req.body.episodeId;
        const animeStreamLink = await fetchAnimStreamLinks(episodeId);

        res.json(animeStreamLink.data);
    }
    catch (error) {
        console.error('Error in /fetch-stream-link:', error);
        res.status(500).json({ error: 'Failed to fetch stream data from API' });
    }
})

animeRouter.post('/fetch-search-results', async (req, res) => {
    try {
        var { searchQuery, pageNumber } = req.body;
        // Page number is 1 by default if undefined here
        const searchResults = await fetchAnimeSearchResults(searchQuery=searchQuery, pageNumber=pageNumber);

        res.json(searchResults.data);
    }
    catch (error) {
        console.error('Error in /fetch-search-results:', error);
        res.status(500).json({ error: 'Failed to fetch search results from API' });
    }
})

animeRouter.get('/fetch-latest-anime', async (req, res) => {
    try {
        const recentAnimeResults = await fetchRecentAnimeEpisodes();

        res.json(recentAnimeResults.data);
    }
    catch (error) {
        console.error(`Error in /fetch-latest-anime: `, error);
        res.status(500).json({ 
            error: `Failed to fetch recent episodes from API`
        });
    }
})

// Export Router
export default animeRouter;