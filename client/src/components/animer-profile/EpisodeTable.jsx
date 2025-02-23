import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import "./AnimeProfile.css";
import { IconButton } from "@mui/material";

export default function EpisodeTable({ animeEpisodeList }) {
    // Extract all the necessary details from the JSON object
    const { totalEpisodes, episodes } = animeEpisodeList;
    // const { title, episodes } = animeEpisodeList;
    const navigate = useNavigate();
    const { animeId } = useParams();

    // useState for Pagination
    const [currPage, setCurrPage] = useState(1);
    const EPISODES_PER_PAGE = 20;
    const totalPages = Math.ceil(totalEpisodes / EPISODES_PER_PAGE);

    // Handler to retrieve and redirect to the correct episode
    const HandleAnimeEpisodeClick = (episodeId, episodeNumber) => {
        // Replaces URL with this after Root path - Give them animeEpisodeID, which is compromised of animeID and episode number
        navigate(`/${animeId}/${episodeNumber}/${totalEpisodes}`);
    };

    return (
        <>
            <table className="episode-table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Episode</th>
                    </tr>
                </thead>

                <tbody>
                    { episodes && episodes.length > 0 ? (
                        episodes.slice((currPage-1) * EPISODES_PER_PAGE, (currPage-1) * EPISODES_PER_PAGE + EPISODES_PER_PAGE).map((episode, index) => (
                            <tr key={index} onClick={() => HandleAnimeEpisodeClick(episode.episodeId, index+1)} style={{ cursor: 'pointer' }}>
                                <td scope="row">{ (((currPage-1) * EPISODES_PER_PAGE) + index + 1) }</td>
                                <td>{ episode.title } - Episode { episode.number }</td>
                            </tr>
                        ))
                    ) : (
                        // No episodes to display
                        <tr>
                            <td scope="row">1</td>
                            <td>No Episodes Available Currently.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="episode-table-pagination-controls">
                <IconButton className="episode-table-icon-button" onClick={() => setCurrPage(1)}>
                    <FirstPageIcon className="episode-table-icon" />
                </IconButton>

                <IconButton className="episode-table-icon-button" onClick={currPage > 1 ? () => setCurrPage(currPage-1) : null}>
                    <NavigateBeforeIcon className="episode-table-icon" />
                </IconButton>
                
                <span className="episode-table-page-counter">{ currPage }</span>

                <IconButton className="episode-table-icon-button" onClick={currPage < totalPages ? () => setCurrPage(currPage+1) : null}>
                    <NavigateNextIcon className="episode-table-icon" />
                </IconButton>

                <IconButton className="episode-table-icon-button" onClick={() => setCurrPage(totalPages)}>
                    <LastPageIcon className="episode-table-icon" />
                </IconButton>
            </div>
        </>
    );
}