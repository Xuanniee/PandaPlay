import axios from "axios";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '../.env') });

/**
 * Async function to retrieve the details of an anime from Aniwatch
 * @param {String} animeId 
 * @returns JSON object of all the details of an anime
 */
async function fetchAnimeInfo(animeId) {
    try {
        // Input Validation
        // const baseUrl = process.env.CONSUMET_BASE_URL;
        const baseUrl = process.env.ANIWATCH_BASE_URL;
        if (!animeId) {
            throw new Error('Anime ID is not defined');
        }

        // API Call
        // const animeInfoUrl = `${baseUrl}/anime/gogoanime/info/${animeId}`;
        const animeInfoUrl = `${baseUrl}/api/v2/hianime/anime/${animeId}`;
        const res = await axios.get(animeInfoUrl);
        
        return res;
    } 
    catch (error) {
        console.error("Error in fetching anime information: ", error);
        throw error;
    }
}

/**
 * Async Function to retrieve an Episode List with Episode Metadata
 * @param {String} animeId 
 * 
 * @returns a JSON object containing episode count, each episode title etc
 */
async function fetchAnimeEpisodes(animeId) {
    // Check to ensure params are provided
    if (!animeId) {
        throw new Error(`Anime ID is not defined`);
    }

    // Make API Call
    try {
        const baseUrl = process.env.ANIWATCH_BASE_URL;
        const animeEpisodeUrl = `${baseUrl}/api/v2/hianime/anime/${animeId}/episodes`;

        const res = await axios.get(animeEpisodeUrl);

        // Just return the res directly, the processing will be done elsewhere
        return res;
    }
    catch (error) {
        console.error("Error in fetching anime episode list: ", error);
        throw error;
    }
}

/**
 * Async function to retrieve the URL of an anime to stream
 * @param {String} animeEpisodeId 
 * @returns JSON object containing the links to stream anime of various qualities
 */
async function fetchAnimeStreamLinks(animeEpisodeId) {
    try {
        // const baseUrl = process.env.CONSUMET_BASE_URL;
        const baseUrl = process.env.ANIWATCH_BASE_URL;

        if (!animeEpisodeId) {
            throw new Error('Episode ID is not defined');
        }

        // const animeStreamUrl = `${baseUrl}/anime/gogoanime/watch/${episodeId}`;
        // Append &server=hd-1&category=sub if u want to specify the server or category
        const animeStreamUrl = `${baseUrl}/api/v2/hianime/episode/sources?animeEpisodeId=${animeEpisodeId}`;
        // console.log(`animeStreamUrl: ${animeStreamUrl}`);
        const res = await axios.get(animeStreamUrl);

        return res;
    }
    catch (error) {
        throw error;
    }
}

/**
 * Function that returns the episodeId of a particular episode using the Episode List
 * @param {string} animeId 
 */
async function fetchAnimeEpisodeId(animeId, targetEpisodeNumber) {
    try {
        if (!animeId) {
            throw new Error(`Anime ID not provided in retrieving the list of episodes.`);
        }
        
        // Make the API Call to get the list of episodes
        const baseUrl = process.env.ANIWATCH_BASE_URL;
        const animeEpisodeListUrl = `${baseUrl}/api/v2/hianime/anime/${animeId.toString()}/episodes`;
        // console.log('Making Episode List API Call');
        const res = await axios.get(animeEpisodeListUrl);

        // Assume that the Episode List is 1 indexed, Retrieve the Correct Episode ID
        const episodeList = res.data.data.episodes;
        const episodeData = episodeList[targetEpisodeNumber-1];
        // console.log(`Teest: ${episodeData.number}`);

        // Check if it is correct
        if (parseInt(episodeData.number, 10) === parseInt(targetEpisodeNumber, 10)) {
            return episodeData;
        }

        // If no match, use some searching algorithm to get the correct episode
        for (const episodeData of episodeList) {
            if (parseInt(episodeData.number, 10) === parseInt(targetEpisodeNumber, 10)) {
                // Found the correct data
                return episodeData;
            }
        }
        // Cannot find the episode
        return null;
    }
    catch (error) {
        console.error(`Error in finding target Episode Id: ${error}`);
    }

}

async function fetchAnimeSearchResults(searchQuery, pageNumber = 1) {
    try {
        if (!searchQuery) {
            throw new Error(`Search Query is not provided`);
        }

        // Construct API Call
        const baseUrl = process.env.ANIWATCH_BASE_URL;
        const animeSearchUrl = `${baseUrl}/api/v2/hianime/search?q=${searchQuery}&page=${pageNumber}`;

        const res = await axios.get(animeSearchUrl);

        return res;
    }
    catch (error) {
        throw error;
    }

}

/**
 * Fetches Anime from a Category (1 Page) for Home Page
 * @returns 
 */
async function fetchAnimeCategories(animeCategory) {
    try {
        // const BASE_URL = process.env.CONSUMET_BASE_URL;
        const baseUrl = process.env.ANIWATCH_BASE_URL;
        // const recentUrl = `${baseUrl}/api/v2/hianime/category/{name}?page={page}`;
        const categoryUrl = `${baseUrl}/api/v2/hianime/category/${animeCategory}?page=1`;
        // console.log(categoryUrl);

        const res = await axios.get(categoryUrl);

        return res;
    }
    catch (e) {
        throw e;
    }
}

/**
 * Retrieves the list of Animes that are featured in the Homepage
 * @returns 
 */
async function fetchAnimeHome() {
    try {
        // const BASE_URL = process.env.CONSUMET_BASE_URL;
        const baseUrl = process.env.ANIWATCH_BASE_URL;
        const homeUrl = `${baseUrl}/api/v2/hianime/home`;
        // console.log(homeUrl);

        const res = await axios.get(homeUrl);

        return res;
    }
    catch (e) {
        throw e;
    }
}

/**
 * Batches and makes parallel API calls to retrieve the anime details of multiple animes at once
 * to avoid the N+1 problem
 * @param {*} requestedAnimes 
 */
async function batchFetchAnimeDetails(requestedAnimes) {
    try {
        const baseUrl = process.env.ANIWATCH_BASE_URL;
        if (!requestedAnimes) {
            throw new Error('Batch of animes not provided for API Call');
        }

        // Create an array of promises for all the animes whose info is required
        const animeDetailedRequests = requestedAnimes.map(anime => axios.get(`${baseUrl}/api/v2/hianime/anime/${anime.id}`));
        
        // Return only when all promises are resolved
        const responses = await Promise.all(animeDetailedRequests);
        const standardisedRes = responses.map((res) => {
            // Extract the relevant information
            const { id, name, description, poster } = res.data.data.anime.info;
            const episodes = res.data?.data?.anime?.info?.stats?.episodes || null;

            // Format and store it in standardised format
            return {
                id: id,
                name: name,
                description: description,
                poster: poster,
                episodes: episodes
            };
        });
        return standardisedRes;
    } 
    catch (error) {
        console.error("Error in fetching anime information: ", error);
        throw error;
    }
}

export { fetchAnimeInfo, fetchAnimeEpisodes, fetchAnimeStreamLinks, fetchAnimeEpisodeId, fetchAnimeSearchResults, fetchAnimeCategories, fetchAnimeHome, batchFetchAnimeDetails };