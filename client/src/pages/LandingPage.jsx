import React, { useEffect, useState } from "react";

import Navbar from "../components/navbar/Navbar";
import RecentAnimeCard from "../components/navbar/RecentAnimeCard";
import MainAnimeCard from "../components/navbar/MainAnimeCard";

export default function LandingPage() {
    const [mainRecentAnime, setMainRecentAnime] = useState(null);
    const [recentAnimeDetails, setRecentAnimeDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const retrieveLatestAnimeEpisodes = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/anime/fetch-latest-anime");
    
                if (!res.ok) {
                    throw new Error("Network response from Recent Anime was not ok.");
                }
    
                // Set the data
                const resData = await res.json();
                const animeResults = resData.results;
                setMainRecentAnime(animeResults[0]);

                // Slice a new array, excluding the first element
                const remainingAnime = animeResults.slice(1);
                setRecentAnimeDetails(remainingAnime);
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
                <p>Loading...</p>
            ) : (
                <div className="col">
                    <MainAnimeCard animeDetail={mainRecentAnime} />
                    
                    <div className="row card-container">
                        {recentAnimeDetails ? (
                            recentAnimeDetails.map((recentAnime, index) => [
                                <RecentAnimeCard key={index} animeResult={recentAnime} />
                            ])
                        ) : (
                            <p>No recent anime</p>
                        )}
                    </div>
                </div>
            )}
            
        </div>
    );
}


