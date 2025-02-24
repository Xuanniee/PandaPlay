import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import { useParams } from "react-router-dom";

import AnimeListing from "../components/anime-search/AnimeListing";
import AnimeCarousel from "../components/anime-home/AnimeCarousel";
import "../components/video-player/CustomVideoPlayer.css";
import "./AnimeSearchResultsPage.css";

export default function AnimeSearchResultsPage({ }) {
    const [webResults, setWebResults] = useState(null);
    const [tvResults, setTvResults] = useState(null);
    const [movieResults, setMovieResults] = useState(null);
    const [specialResults, setSpecialResults] = useState(null);
    const [ovaResults, setOvaResults] = useState(null);
    const [otherResults, setOtherResults] = useState(null);
    const [isSearching, setIsSearching] = useState(true);
    // Extract query from URL
    const { searchQuery, pageNumber } = useParams();

    // useEffect Hook to update the search results whenever the search query changes
    useEffect(() => {
        const animeSearchFunction = async () => {
            try {
                // Create request body
                const reqBody = {
                    searchQuery: searchQuery,
                };
                if (pageNumber !== undefined) {
                    reqBody.pageNumber = pageNumber;
                }
                // const res = await fetch("http://localhost:3000/api/anime/fetch-search-results", {
                const res = await fetch("https://pandaplay-backend.onrender.com/api/anime/fetch-search-results", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(reqBody),
                })
        
                // Check res
                if (!res.ok) {
                    throw new Error("Network response from Anime Search was not ok.");
                }

                // Set the data received from the backend
                const searchData = await res.json();

                // Before setting, split the animes into various categories: Web Anime (ONA), Broadcast Anime (TV), Special, Movie, OVA
                const webAnimeResults = searchData.animes.filter((anime) => anime.type === "ONA");
                const broadcastResults = searchData.animes.filter((anime) => anime.type === "TV");
                const specialResults = searchData.animes.filter((anime) => anime.type === "Special");
                const movieResults = searchData.animes.filter((anime) => anime.type === "Movie");
                const ovaResults = searchData.animes.filter((anime) => anime.type === "OVA");
                // Collect all used types in a Set
                const categorisedTypes = new Set(["ONA", "TV", "Special", "Movie", "OVA"]);
                // Filter for anime that do not belong to the above types
                const otherResults = searchData.animes.filter((anime) => !categorisedTypes.has(anime.type));

                // Set the Anime
                setWebResults(webAnimeResults);
                setTvResults(broadcastResults);
                setSpecialResults(specialResults);
                setMovieResults(movieResults);
                setOvaResults(ovaResults);
                setOtherResults(otherResults);

                // Stop loading
                setIsSearching(false);
            }
            catch (error) {
                console.error(`Error with fetching anime search results: `, error);
            }

            
        };

        // Call the function to mount it once at least
        animeSearchFunction();
    }, [searchQuery]);
    



    return (
        <>
            <div>
                <Navbar />
                {isSearching && (
                    <div className="loader-container">
                        <div className="foot-loader"></div>
                        <div className="text-loader"></div>
                    </div>
                )}

                {tvResults?.length > 0 && (
                    <AnimeCarousel carouselName="Broadcast Anime" carouselAnimeDetails={tvResults} />
                )}

                {webResults?.length > 0 && (
                    <AnimeCarousel carouselName="Web Anime" carouselAnimeDetails={webResults} />
                )}

                {movieResults?.length > 0 && (
                    <AnimeCarousel carouselName="Anime Movies" carouselAnimeDetails={movieResults} />
                )}

                {specialResults?.length > 0 && (
                    <AnimeCarousel carouselName="Anime Specials" carouselAnimeDetails={specialResults} />
                )}

                {ovaResults?.length > 0 && (
                    <AnimeCarousel carouselName="Anime OVAs" carouselAnimeDetails={ovaResults} />
                )}

                {otherResults?.length > 0 && (
                    <AnimeCarousel carouselName="Others" carouselAnimeDetails={otherResults} />
                )}

                {!isSearching && !webResults?.length && !tvResults?.length && !specialResults?.length &&
                !otherResults?.length && !movieResults?.length && !ovaResults?.length && (
                    <p>No Search Results</p>
                )}
            </div>            
        </>
    );
}