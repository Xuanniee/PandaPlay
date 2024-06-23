import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/navbar/Navbar";
import VideoPlayer from "../components/anime-player/VideoPlayer";

export default function AnimePlayerPage() {
    // Extract the episodeId from the URL
    const { episodeId, lastEpisode } = useParams();
    const [episodeUrl, setEpisodeUrl] = useState(null);

    // API call to get URL for stream
    useEffect(() => {
        const retrieveAnimeStreamLink = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/anime/fetch-stream-link", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ episodeId })
                });
    
                if (!res.ok) {
                    throw new Error("Network response from Anime Stream Link was not ok.");
                }
    
                // Destructure the sources & always get the default quality
                const streamData = await res.json();
                const episodeSources = streamData.sources;
                const defaultQualityIndex = episodeSources.findIndex(source => source.quality === "default");

                if (defaultQualityIndex !== -1) {
                    // Set the default quality if found
                    setEpisodeUrl(episodeSources[defaultQualityIndex].url);
                } else {
                    // Set the first quality otherwise
                    setEpisodeUrl(episodeSources[0].url);
                }

            } catch (error) {
                console.error('Error fetching anime stream data:', error);
            }
        };

        // Initialise the function
        retrieveAnimeStreamLink();
    }, [episodeId]);  // Re-run the effect when episodeId changes
    

    return (
        <div>
            <Navbar />
            <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="row">
                    <div className="col-12 d-flex justify-content-center align-items-center">
                        {episodeId ? (
                            // TODO Add a Server dropdown box to choose server and quality and name of current episode
                            <VideoPlayer episodeUrl={episodeUrl} episodeId={episodeId} lastEpisode={lastEpisode} />
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}