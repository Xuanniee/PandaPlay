import { Icon, IconButton } from "@mui/material";
import { React, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

import "./VideoEpisodeListCard.css";


export default function VideoEpisodeListCard ({ episodeListData, animeInfo, totalEpisodes }) {
    const navigate = useNavigate();
    const { animeId, episodeNumber, lastEpisode } = useParams();
    const MAX_LENGTH = 200;

    // useState to track which page of episodelist we are on
    const [currentEpPage, setCurrentEpPage] = useState(1);
    // Determine the total number of pages
    const episodesPerPage = 10;
    const totalPages = Math.ceil(totalEpisodes / episodesPerPage);
    // useState to track if the Description should be expanded
    const [expandedDescription, setExpandedDescription] = useState(false);
    // Dropdown list selector
    const [isEpisodeSelectExpanded, setIsEpisodeSelectExpanded] = useState(false);

    // Get current page episodes
    const startIndex = (currentEpPage - 1) * episodesPerPage;
    const currentEpisodes = (episodeListData?.slice(startIndex, startIndex + episodesPerPage)) || [];

    /**
     * Helper Function to change the current playing Episode
     * @param {*} selectedEpisode
     */
    const handleSwitchingEpisode = (selectedEpisode) => {
        // Just update the episode we are watching and it will trigger the useEffect hook in the parent to get new link
        // Can be changed by navigating
        // console.log(`Navigating to /${animeId}/${selectedEpisode}/${lastEpisode}`);
        navigate(`/${animeId}/${selectedEpisode}/${lastEpisode}`);
    }

    // ✅ Prevent rendering until data is ready
    if (!episodeListData || episodeListData.length === 0 || animeInfo === null) {
        return <div>Loading episodes...</div>;
    }

    // Helper to expand Anime Description
    const handleDescription = () => {
        if (expandedDescription) {
            setExpandedDescription(false);
        }
        else {
            setExpandedDescription(true);
        }
    }

    return (
        <div className="episode-card">
            {/* Metadata */}
            <div className="episode-card-header">
                <h5>{ animeInfo.info.name }</h5>
            </div>

            <div className="divider-line"></div>

            {/* Pagination Controls */}
            <div className="episode-card-list-pagination">
                <div className="episode-card-list-pagination-spacer"></div>

                {/* Previous Page */}
                <IconButton
                    disabled={ currentEpPage === 1 }
                    onClick={() => setCurrentEpPage((currPage) => Math.max(currPage-1, 1))}
                    className="selector-icon-button"
                >
                    <ArrowCircleLeftIcon />
                </IconButton>

                {/* Current Page Dropdown List - Hide until Clicked*/}
                <select
                    className="custom-episode-selector"
                    value={currentEpPage}
                    onChange={(e) => {
                        // Update the page to show different episodes
                        setCurrentEpPage(Number(e.target.value));
                        // Collapse the dropdown after selecting a page
                        isEpisodeSelectExpanded(false);
                    }}
                    // onFocus to expand it
                    onFocus={() => setIsEpisodeSelectExpanded(true)}
                    // onBlur, if not focused e.g. clicked outside
                    onBlur={() => setIsEpisodeSelectExpanded(false)}
                >
                    {/* Create an Array with "totalPages" number of items, then run a function over every item of the array while iterating */}
                    {Array.from({ length: totalPages }, (_, index) => (
                        // Every option will represent the page number
                        <option key={index + 1} value={index + 1}>
                            Page {index + 1}
                        </option>
                    ))}
                </select>
                

                {/* Next Page */}
                <IconButton
                    disabled={ currentEpPage === totalPages }
                    onClick={() => setCurrentEpPage((currPage) => Math.min(currPage+1, totalPages))}
                    className="selector-icon-button"
                >
                    <ArrowCircleRightIcon />
                </IconButton>

                <div className="episode-card-list-pagination-spacer"></div>
            </div>

            {/* Episode List - Use Optional Chaining as the object may not be defined when rendered */}
            <div className="episode-card-body">
                <ul className="episode-card-list">
                    {episodeListData.length > 0 ? (
                        episodeListData?.slice(((currentEpPage-1) * episodesPerPage), ((currentEpPage-1) * episodesPerPage + episodesPerPage)).map((episode, index) => (
                            <div key={episode.number} className="episode-card-list-item" onClick={() => handleSwitchingEpisode(episode.number)}>
                                {/* Actual Item for Episode To Click */}
                                <li>
                                    {episode.number}. {episode.title}
                                </li>

                                {/* Only show the playing icon if this is the current selected episode */}
                                {Number(episode.number) === Number(episodeNumber) && (
                                    <IconButton className="responsive-mediabar-container">
                                        <PlayArrowIcon className="responsive-mediabar-button" />
                                    </IconButton>
                                )}
                            </div>
                        ))) : null
                    }
                </ul>
            </div>
            
            <div className="divider-line"></div>

            <div className="episode-card-row">
                <div className="anime-profile-summary">
                    <img src={ animeInfo.info.poster } />
                    
                    <div className="metadata-container">
                        <h6>Status</h6>
                        <p>{ animeInfo.moreInfo.status }</p>

                        <h6>Production</h6>
                        <p>{ animeInfo.moreInfo.studios }</p>

                        <h6>Aired</h6>
                        <p>{ animeInfo.moreInfo.aired }</p>
                    </div>
                </div>
            </div>

            <div className="episode-card-row">
                <h5>{ animeInfo.info.name }</h5>
            </div>
            
            {/* Description of Anime */}
            <div className="episode-card-row episode-card-description" onClick={() => handleDescription()}>
                <p>
                    { // Check if description should be expanded. If not, just show chars up till max_length
                        expandedDescription ? animeInfo.info.description 
                        : `${animeInfo.info.description.substring(0, MAX_LENGTH)}...`
                    }
                </p>
            </div>

            {/* Genres */}
            <div className="episode-card-row">
                <div className="genre-grid">
                    {animeInfo.moreInfo.genres && (
                        animeInfo.moreInfo.genres.map((genre, index) => (
                            <button key={index} className="genre-button" disabled>{ genre }</button>
                        ))
                    )}
                </div>
            </div>

            {/* Cast - Becuse in a list, it should have a unique identifier*/}
            <div className="episode-card-row">
                <div className="cast-card-table">
                    {animeInfo.info.charactersVoiceActors && (                        
                        animeInfo.info.charactersVoiceActors.map((cast, index) => (
                            // Create a Card to store all the Cast Details
                            <div key={index} className="cast-card-div">
                                <img src={ cast.voiceActor.poster } alt="Image of Voice Actor" />

                                <div className="cast-name-section">
                                    <p className="character-name">{ cast.character.name }</p>
                                    <p className="voiceactor-name">{ cast.voiceActor.name }</p>
                                </div>

                                <div className="spacer">
                                </div>

                                <img src={ cast.character.poster } alt="Image of Anime Character" />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}