import axios from "axios";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '../.env') });

/**
 * Async function to retrieve the details of an anime
 * @param {String} animeId 
 * @returns JSON object of all the details of an anime
 */
async function fetchAnimeInfo(animeId) {
    try {
        // Input Validation
        const baseUrl = process.env.CONSUMET_BASE_URL;
        if (!animeId) {
            throw new Error('Anime ID is not defined');
        }

        // API Call
        const animeInfoUrl = `${baseUrl}/anime/gogoanime/info/${animeId}`;
        const res = await axios.get(animeInfoUrl);
        
        return res;
    } 
    catch (error) {
        console.error("Error in fetching anime information: ", error);
        throw error;
    }
}

/**
 * Async function to retrieve the URL of an anime to stream
 * @param {String} episodeId 
 * @returns JSON object containing the links to stream anime of various qualities
 */
async function fetchAnimStreamLinks(episodeId) {
    try {
        const baseUrl = process.env.CONSUMET_BASE_URL;
        if (!episodeId) {
            throw new Error('Episode ID is not defined');
        }

        const animeStreamUrl = `${baseUrl}/anime/gogoanime/watch/${episodeId}`;
        const res = await axios.get(animeStreamUrl);

        return res;
    }
    catch (error) {
        throw error;
    }
}

async function fetchAnimeSearchResults(searchQuery, pageNumber = 1) {
    try {
        if (!searchQuery) {
            throw new Error(`Search Query is not provided`);
        }

        // Construct API Call
        const BASE_URL = process.env.CONSUMET_BASE_URL;
        const animeSearchUrl = `${BASE_URL}/anime/gogoanime/${searchQuery}?page=${pageNumber}`;

        const res = await axios.get(animeSearchUrl);

        return res;
    }
    catch (error) {
        throw error;
    }

}

async function fetchRecentAnimeEpisodes() {
    try {
        const BASE_URL = process.env.CONSUMET_BASE_URL;
        const recentUrl = `${BASE_URL}/anime/gogoanime/recent-episodes`;

        const res = await axios.get(recentUrl);

        return res;
    }
    catch (e) {
        throw e;
    }
}

export { fetchAnimeInfo, fetchAnimStreamLinks, fetchAnimeSearchResults, fetchRecentAnimeEpisodes };