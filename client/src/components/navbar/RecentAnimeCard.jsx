import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { IconButton } from "@mui/material";

import "./AnimeCard.css";

export default function RecentAnimeCard({ animeResult }) {
    const currEpisodeId = animeResult.episodes.sub;
    const currAnimeId = animeResult.id;
    const navigate = useNavigate();
    // Set a max length for the description
    const MAX_LENGTH = 80;
    const PORT_MAX_LENGTH = 40;

    // useState to track if hovering over element
    const [isHovering, setIsHovering] = useState(false);
    // useState to track if image is a portrait
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = animeResult.poster;
        img.onload = () => {
            setIsPortrait(img.naturalHeight > img.naturalWidth);
        };
    }, [animeResult.poster]); // Runs when poster URL changes

    const onCardClick = () => {
        // Redirect to the Current Episode Link /:animeId/:episodeId/:lastEpisode
        // Navigate to profile page temp
        navigate(`/anime-info/${currAnimeId}`);
    };

    return (
        <>
            {/* Use the Anime Poster Image can already */}
            <div className="anime-card-div">
                <div 
                    className={`anime-card ${isPortrait ? "portrait" : ""}`}
                    style={{ "--animePosterUrl": `url(${animeResult.poster})` }} 
                    // Set to Hovering true if mouse enters
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {/* Have the watch button appear on top of the original div only when hovered */}
                    {isHovering && (
                        <div className="watch-button-div recent-anime" onClick={onCardClick}>
                            <button onClick={onCardClick} className="watch-button">
                                <PlayArrowIcon className="watch-button-icon"/>
                                Watch Now!
                            </button>
                        </div>
                    )}
                </div>

                

                {/* Show this Div if user hovers over the above div and this div */}
                {isHovering && (
                    <div 
                        className={`anime-card-details-div ${isPortrait ? "portrait" : ""}`}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        {/* Query to check if it is landscape or portrait */}
                        <img 
                            className={`anime-card-details-div-image ${isPortrait ? "portrait" : ""}`}
                            src={ animeResult.poster } 
                        />
                        {/* A Div containing the ratings in stars for this anime */}
                        <div className="">
                            
                        </div>

                        <div className="anime-card-details-div-details">
                            <span className="anime-card-details-div-title">{ animeResult.name }</span>
                            {/* Description might not be present */}
                            {animeResult?.description && (
                                <span className="anime-card-details-div-body">{ `${animeResult?.description?.substring(0, isPortrait ? PORT_MAX_LENGTH: MAX_LENGTH)}...` }</span>
                            )}
                            {animeResult?.status && (
                                <span className="anime-card-details-div-body">Status: { animeResult?.status }</span>
                            )}

                            <div className="spacer"></div>
                        </div>
                    </div>
                )}
            </div>
            
        </>
        
    );
}