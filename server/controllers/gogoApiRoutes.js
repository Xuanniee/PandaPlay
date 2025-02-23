import express from "express";

import { fetchAnimeStreamLinks, fetchAnimeEpisodes, fetchAnimeInfo, fetchAnimeSearchResults, fetchAnimeCategories, fetchAnimeEpisodeId, fetchAnimeHome, batchFetchAnimeDetails } from "../services/gogoApiUtils.js";

// Create a new Router for GogoAnime APIs
const animeRouter = express.Router();

// Note the URL here is listening, not to make a call to this endpoint
animeRouter.post('/fetch-info', async (req, res) => {
    try {
        // Retrieve animeId from request
        const animeId = req.body.animeId;

        // API Calls to get Anime Info & Episode List
        const animeInfo = await fetchAnimeInfo(animeId);
        const animeEpisodeList = await fetchAnimeEpisodes(animeId);

        // Construct a new JSON object based on the information from each API Call
        const animeDetails = {
            animeInfo: animeInfo.data.data.anime,
            animeEpisodeList: animeEpisodeList.data.data
        };
                
        // Send merged JSON response back to the client
        // console.log(`AnimeRoutesData:`, animeDetails);
        res.json(animeDetails);
    }
    catch (error) {
        console.error('Error in /fetch-info:', error);
        res.status(500).json({ error: 'Failed to fetch data from API' });
    }
})

animeRouter.post('/fetch-stream-link', async (req, res) => {
    try {
        // Extract the Anime ID from the req
        const { animeId, episodeNumber } = req.body;
        // Note that the episodeNumber required by the API =/= episodeNumber selected
        // console.log(`animeId: ${animeId} episodeNum: ${episodeNumber}`);
        const episodeData = await fetchAnimeEpisodeId(animeId, episodeNumber);
        // console.log(`Epsiode Data: ${episodeData}`);
        if (episodeData === null) {
            // Episode does not exist
            console.log(`Episode does not exist.`);
            return null;
        }
        
        // Found valid episodeId
        const animeEpisodeId = episodeData.episodeId;
        // console.log(`animeEpisodeId: ${animeEpisodeId}`);
        const animeStreamLink = await fetchAnimeStreamLinks(animeEpisodeId);

        res.json(animeStreamLink.data.data);
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

        res.json(searchResults.data.data);
    }
    catch (error) {
        console.error('Error in /fetch-search-results:', error);
        res.status(500).json({ error: 'Failed to fetch search results from API' });
    }
})

// Route to get a list of episodes for an anime, along their corresponding episodeNumbers
animeRouter.post('/fetch-anime-episodes', async (req, res) => {
    try {
        const animeId = req.body.animeId;
        // Retrieve the correct episodeID based on provided data
        const episodeListData = await fetchAnimeEpisodes(animeId);

        // console.log(`Epsiode list data: ${episodeListData.data.data.episodes}`)

        // Return the entire list of episodes
        res.json(episodeListData.data.data);
    }
    catch (error) {
        console.error(`Error in /fetch-anime-episodes: ${error}`);
    }
})

animeRouter.get('/fetch-latest-anime', async (req, res) => {
    try {
        // Fetch Anime Results from the Home
        const animeHomeResults = await fetchAnimeHome();
        // Fetch the recently updated, most popular, top-airing, movie
        const recentAnimeResults = await fetchAnimeCategories("recently-added");
        const popularAnimeResults = await fetchAnimeCategories("most-popular");
        const topAiringAnimeResults = await fetchAnimeCategories("top-airing");
        const animeMovieResults = await fetchAnimeCategories("movie");

        // Batch all the categories animes and get information for each anime, .data twice as there is a header called data
        const recentAnimeRes = await batchFetchAnimeDetails(recentAnimeResults.data.data.animes);
        const popularAnimeRes = await batchFetchAnimeDetails(popularAnimeResults.data.data.animes);
        const topAiringAnimeRes = await batchFetchAnimeDetails(topAiringAnimeResults.data.data.animes);
        const animeMoviesRes = await batchFetchAnimeDetails(animeMovieResults.data.data.animes);
        
        // Combined into a single JSON object to be returned
        const latestAnimes = {
            animeHomeResults: animeHomeResults.data.data,
            recentAnimeResults: recentAnimeRes,
            popularAnimeResults: popularAnimeRes,
            topAiringAnimeResults: topAiringAnimeRes,
            animeMovieResults: animeMoviesRes
        }
        res.json(latestAnimes);
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