import React, { useEffect, useState } from "react";

import Navbar from "../components/navbar/Navbar";
import RecentAnimeCard from "../components/navbar/RecentAnimeCard";
import MainAnimeCard from "../components/navbar/MainAnimeCard";
import AnimeCarousel from "../components/anime-home/AnimeCarousel";
import "./AnimeLandingPage.css";
import "../components/video-player/CustomVideoPlayer.css";

export default function AnimeLandingPage() {
    const [mainAnime, setMainAnime] = useState(null);
    const [animeHomeResults, setAnimeHomeResults] = useState(null);
    const [recentAnimeDetails, setRecentAnimeDetails] = useState(null);
    const [popularAnimeDetails, setPopularAnimeDetails] = useState(null);
    const [topAiringAnimeDetails, setTopAiringAnimeDetails] = useState(null);
    const [animeMovieDetails, setAnimeMovieDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const retrieveLatestAnimeEpisodes = async () => {
            try {
                // const res = await fetch("http://localhost:3000/api/anime/fetch-latest-anime");
                const res = await fetch("https://pandaplay-backend.onrender.com/api/anime/fetch-latest-anime");
    
                if (!res.ok) {
                    throw new Error("Network response from Recent Anime was not ok.");
                }
    
                // Extract the relevant data
                const resData = await res.json();
                const animeHomeResults = resData.animeHomeResults;
                const topAiringAnimeResults = resData.topAiringAnimeResults;
                const recentAnimeResults = resData.recentAnimeResults;
                const popularAnimeResults = resData.popularAnimeResults;
                const animeMovieResults = resData.animeMovieResults;

                // Update the Main Anime
                setMainAnime(animeHomeResults.spotlightAnimes[0]);
                // Slice a new array, excluding the first element, to update the remaining Top Airing
                const remainingAnime = animeHomeResults.spotlightAnimes.slice(1);
                setAnimeHomeResults(remainingAnime);
                // Add the other Genres
                setTopAiringAnimeDetails(topAiringAnimeResults);
                setRecentAnimeDetails(recentAnimeResults);
                setPopularAnimeDetails(popularAnimeResults);
                setAnimeMovieDetails(animeMovieResults);
                
                setLoading(false);
            }
            catch (error) {
                console.error(`Error with fetching anime search results: `, error);
                setLoading(false);
            }
    
        };

        // Mount the function once
        retrieveLatestAnimeEpisodes();
    }, []);
    

    return(
        <div>
            <Navbar/>

            {loading ? (
                <div className="loader-container">
                    <div className="foot-loader"></div>
                    <div className="text-loader"></div>
                </div>
            ) : (
                <div className="landing-page">

                    {/* Main Recent Anime Spotlight Section */}
                    <div className="landing-page-section">
                        <div className="main-anime-section">
                            <div className="spacer"></div>

                            <MainAnimeCard animeDetail={mainAnime} />
                        
                            <div className="spacer"></div>
                        </div>
                    </div>

                    {/* Anime Home */}
                    <div className="landing-page-section">
                        <AnimeCarousel carouselName="Spotlight Anime" carouselAnimeDetails={animeHomeResults} />
                    </div>
                    
                    {/* Top Airing Anime Section */}
                    <div className="landing-page-section">
                        <AnimeCarousel carouselName="Top Airing Anime" carouselAnimeDetails={topAiringAnimeDetails} />
                    </div>

                    {/* Recently Updated */}
                    <div className="landing-page-section">
                        <AnimeCarousel carouselName="Recently Updated Anime" carouselAnimeDetails={recentAnimeDetails} />
                    </div>

                    {/* Most Popular Animes */}
                    <div className="landing-page-section">
                        <AnimeCarousel carouselName="Most Popular" carouselAnimeDetails={popularAnimeDetails}/>
                    </div>
                    
                    {/* Anime Movies */}
                    <div className="landing-page-section">
                        <AnimeCarousel carouselName="Anime Movies" carouselAnimeDetails={animeMovieDetails} />
                    </div>
                </div>
            )}
            
        </div>
    );
}


