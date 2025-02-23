import React from "react";
import { Button } from "react-bootstrap";

import "./AnimeProfile.css";

export default function AnimeInfo({ animeInfo }) {

    const thumbnailDesc = `${ animeInfo.info.name } thumbnail`;

    return (
        <div className="anime-profile">
            {/** Anime Picture */}
            <div className="anime-profile-left-div">
                <img 
                    src={ animeInfo.info.poster }
                    className="anime-profile-image" 
                    alt={thumbnailDesc}
                />
            </div>

            {/** Anime Description */}
            <div className="anime-profile-right-div">
                <div className="anime-profile-right-title-div">
                    <span className="anime-profile-right-details-title">{ animeInfo.info.name }</span>
                    {/* Add a Sub/Dub indicator here */}
                </div>

                <div className="anime-profile-right-metadata-div">
                    <span><span className="anime-profile-headers">Released on:</span> { animeInfo.moreInfo.aired }</span>
                    <span><span className="anime-profile-headers">Status:</span> { animeInfo.moreInfo.status }</span>

                    {/** Genres as buttons */}
                    <span className="anime-profile-headers">Genres:</span>
                    <div className="anime-profile-right-genres-div">
                        {animeInfo.moreInfo.genres && animeInfo.moreInfo.genres.length > 0 ? (
                            animeInfo.moreInfo.genres.map((genre, index) => (
                                <Button
                                    key={index}
                                    variant="secondary"
                                    className="m-1"
                                >
                                    {genre}
                                </Button>
                            ))
                        ) : (
                            // Provide fallback if genres are empty
                            <span>No genres found</span>
                        )}
                    </div>

                    <span className="anime-profile-description">
                        { animeInfo.info.description }
                    </span>
                </div>
            </div>
        </div>
    );
}
