import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../components/navbar/Navbar";
import AnimeInfo from "../components/animer-profile/AnimeDetails";
import EpisodeTable from "../components/animer-profile/EpisodeTable";

import "../components/video-player/CustomVideoPlayer.css";
import "./AnimeProfilePage.css";

export default function AnimeProfilePage() {
    // Extract the animeId dynamically from the URL. animeId is what uniquely identifies each anime.
    const { animeId } = useParams();
    const [animeDetails, setAnimeDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnimeData = async () => {
            try {
                // Retrieve the details by POSTing the animeId
                // For local deployment
                const res = await fetch("http://localhost:3000/api/anime/fetch-info", {
                // const res = await fetch("https://pandaplay-backend.onrender.com/api/anime/fetch-info", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ animeId }),
                })

                // Validate res
                if (!res.ok) {
                    throw new Error("Network response from Anime Info was not ok.");
                }

                // Set the data
                const animeData = await res.json();
                // console.log(animeData);
                setAnimeDetails(animeData);
                setLoading(false);
            }
            catch (error) {
                console.error('Error fetching anime data:', error);
            }
        }

        // Ensure initial function call when component is mounted
        fetchAnimeData();
    }, [animeId]);

    // Render loading state until animeDetails is fetched
    // if (!animeDetails) {
    //     return (
    //         <div>
    //             <Navbar />
    //             <div className="container">
    //                 <h1>Loading...</h1>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div>
            <Navbar />
            {loading ? (
                <div className="loader-container">
                    <div className="foot-loader"></div>
                    <div className="text-loader"></div>
                </div>
            ) : (
                <div className="anime-profile-div">
                    <div className="spacer"></div>

                    <div className="anime-profile-details-div">
                        {/** Showing all the details of an anime, i.e. their profile page */}
                        <AnimeInfo animeInfo={ animeDetails.animeInfo }/>
                        <EpisodeTable animeEpisodeList={ animeDetails.animeEpisodeList }/>
                    </div>
                    
                    <div className="spacer"></div>
                </div>
            )}
        </div>
    );
}