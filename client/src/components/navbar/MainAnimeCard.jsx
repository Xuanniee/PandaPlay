import React from "react";
import { useNavigate } from "react-router-dom";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { IconButton } from "@mui/material";

import "./AnimeCard.css";

export default function MainAnimeCard({ animeDetail }) {
    const navigate = useNavigate();
    const MAX_LENGTH = 200;
    console.log(`Image URL: ${animeDetail.poster}`);

    const handleRedirect = () => {
        // navigate(`/${animeDetail.id}/${animeResult.episodes.sub}/${animeResult.episodes.sub}`);
        navigate(`/anime-info/${animeDetail.id}`);
    }

    return (
        <>
            {/* Have the background of the Anime Title be the image of the poster but blurred */}
            <div 
                className="main-anime-card"
                style={{ "--animePosterUrl": `url(${animeDetail.poster})` }}
            >
                {/* Add a Blur Overlay */}
                <div className="main-anime-card-overlay"></div>

                {/* Left Side: Anime Details */}
                <div className="main-anime-card-body">
                    <div className="main-anime-card-body-leftdiv">
                        {/* Anime Title */}
                        <span className="main-anime-card-title">{ animeDetail.name }</span>

                        <span className="main-anime-card-latest">Just Released: Episode { animeDetail.episodes["sub"] }</span>

                        {/* Anime Description - Limit the word count */}
                        <span className="main-anime-card-description">{ `${animeDetail.description.substring(0, MAX_LENGTH)}...` }</span>

                        <div className="watch-button-div">
                            <button onClick={handleRedirect} className="watch-button">
                                <PlayArrowIcon className="watch-button-icon"/>
                                Watch Now!
                            </button>
                        </div>
                        
                    </div>

                    <div className="main-anime-card-body-rightdiv"></div>
                </div>

                {/* Right Side: Unblurred Anime Poster */}
                <div 
                    className="main-anime-card-image"
                    style={{ backgroundImage: `url(${animeDetail.poster})` }}
                ></div>
            </div>
        
        </>
    );
}