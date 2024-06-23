import React from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function EpisodeTable({ animeDetails }) {
    // Extract all the necessary details from the JSON object
    const { title, episodes } = animeDetails;
    const navigate = useNavigate();
    const { animeId } = useParams();

    // Handler to retrieve and redirect to the correct episode
    const HandleAnimeEpisodeClick = (episodeId, lastEpisode) => {
        // Replaces URL with this after Root
        navigate(`/${animeId}/${episodeId}/${lastEpisode}`);
    };

    return (
        <>
            <table className="table table-striped rounded-table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Episode</th>
                    </tr>
                </thead>
                <tbody>
                    { episodes && episodes.length > 0 ? (
                        // map() provides curr and index as args
                        episodes.map((episode, index) => (
                            <tr key={index} onClick={() => HandleAnimeEpisodeClick(episode.id, episodes.length)} style={{ cursor: 'pointer' }}>
                                <td scope="row">{ (index+1) }</td>
                                <td>{ title } - Episode { episode.number }</td>
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
        </>
    );
}