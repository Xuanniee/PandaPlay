import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/navbar/Navbar";
import VideoPlayer from "../components/video-player/VideoPlayer";
import VideoEpisodeListCard from "../components/video-player/VideoEpisodeListCard";
import './AnimePlayerPage.css';

export default function AnimePlayerPage() {
    // Extract the episodeNumber from the URL
    const { animeId, episodeNumber, lastEpisode } = useParams();
    const [episodeUrl, setEpisodeUrl] = useState(null);
    // Track the state containing the various stream qualities
    const [episodeSources, setEpisodeSources] = useState(null);
    // State for subtitles
    const [animeSubtitles, setAnimeSubtitles] = useState([]);
    // UseState to track all the episodes in the episode list
    const [episodeListData, setEpisodeListData] = useState([])
    // State to track anime title to pass it down
    const [animeInfo, setAnimeInfo] = useState(null);

    const getAnimeInfo = async (animeId) => {
        console.log(`Get anime Info was called once`);
        // API Call to get Anime Title
        // const res = await fetch("http://localhost:3000/api/anime/fetch-info", {
        const res = await fetch("https://pandaplay-backend.onrender.com/api/anime/fetch-info", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                animeId
            })
        });
        
        if (!res.ok) {
            throw new Error("Network response from Fetch Anime Info was not ok.");
        }

        const jsonData = await res.json();
        
        // animeInfo contains the data after .anime, .info is a child of it too
        setAnimeInfo(jsonData.animeInfo);
    }

    
    // API call to get URL for stream
    useEffect(() => {
        const retrieveAnimeStreamLink = async () => {
            try {
                // const res = await fetch("http://localhost:3000/api/anime/fetch-stream-link", {
                const res = await fetch("https://pandaplay-backend.onrender.com/api/anime/fetch-stream-link", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ 
                        animeId, 
                        episodeNumber 
                    })
                });
    
                if (!res.ok) {
                    throw new Error("Network response from Anime Stream Link was not ok.");
                }
    
                // Destructure the sources & always get the default quality
                const streamData = await res.json();
                const episodeSources = streamData.sources;
                // const defaultQualityIndex = episodeSources.findIndex(source => source.quality === "default");

                // Update all the streaming links and pass it to the player
                setEpisodeSources(episodeSources);

                // Set the subtitles as well
                setAnimeSubtitles(streamData.tracks);

                console.log(`Episode Soruces: ${episodeSources[0].url}`);
                console.log(`Subtitles: ${animeSubtitles}`);

                // Set the first quality otherwise
                if (episodeSources) {
                    setEpisodeUrl(episodeSources[0].url);
                    // setEpisodeUrl("https://fds.biananset.net/_v7/bcc52d54faa312a4db378d17489cb8a004d0e466d2734810803aa4ceb961f23f284642f711fba4bbca93d3ce1f4a812a7d7f9cd4c48150fef35b7c3f31be6b6fded8afc1bab364cdd53e67ee2a279e91515dd28bd0f91d4ffd14b5e2dfd5b6283d011385480e67b720707cf4dc4daa744f35ffd57103b2cb10437298d113311f/master.m3u8");
                    console.log(`episodeUrl: ${episodeUrl}`);
                }

                // if (defaultQualityIndex !== -1) {
                //     // Set the default quality if found
                //     setEpisodeUrl(episodeSources[defaultQualityIndex].url);
                // } else {
                //     // Set the first quality otherwise
                //     setEpisodeUrl(episodeSources[0].url);
                // }

            } catch (error) {
                console.error('Error fetching anime stream data:', error);
            }
        };

        // API Call to retrieve list of episodes only need to be caught once
        const retrieveEpisodeList = async (animeId) => {
            try {
                // const res = await fetch("http://localhost:3000/api/anime/fetch-anime-episodes", {
                const res = await fetch("https://pandaplay-backend.onrender.com/api/anime/fetch-anime-episodes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        animeId: animeId
                    })
                });

                if (!res.ok) {
                    throw new Error("Network response from Fetch Anime Episodes was not ok.");
                }

                // json() is also an async operation
                const episodeListData = await res.json();
                setEpisodeListData(episodeListData);

                console.log(`Set List: ${episodeListData.episodes[0].title}`);
                console.log(`EpisodeListData99: ${episodeListData.episodes}`);
            }
            catch (error) {
                console.error(`Error in making API Call to /fetch-anime-episodes: ${error}`);
            }
        }    

        // Call the Episodes list API once when page is loaded
        retrieveEpisodeList(animeId);

        // Get the title once
        getAnimeInfo(animeId);

        // Initialise the function
        retrieveAnimeStreamLink();
    }, [episodeNumber]);  // Re-run the effect when episodeNumber changes
    

    return (
        <div className="main-player-page-container">
            <Navbar />
            {episodeNumber && episodeListData ? (
                <div className="main-player-page-content-container">
                    {/* Video Player */}
                    <div className="video-player-container">
                        <VideoPlayer 
                            episodeUrl={episodeUrl} 
                            episodeNumber={episodeNumber} 
                            lastEpisode={lastEpisode} 
                            episodeSources={episodeSources} 
                            setEpisodeUrl={setEpisodeUrl} 
                            animeSubtitles={animeSubtitles}
                        />

                        <div className="spacer"></div>
                    </div>

                    {/* Episode List */}
                    <div className="episode-list-card-container">
                        <VideoEpisodeListCard
                            episodeListData={episodeListData.episodes}
                            animeInfo={animeInfo}
                            totalEpisodes={episodeListData.totalEpisodes}
                        />
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>

    );
}