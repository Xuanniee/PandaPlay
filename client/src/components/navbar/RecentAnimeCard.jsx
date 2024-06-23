import React from "react";
import { useNavigate } from "react-router-dom";

export default function RecentAnimeCard({ animeResult }) {
    const currEpisodeId = animeResult.episodeId;
    const currAnimeId = animeResult.id;
    const navigate = useNavigate();

    const onCardClick = () => {
        // Redirect to the Current Episode Link /:animeId/:episodeId/:lastEpisode
        navigate(`/${currAnimeId}/${currEpisodeId}/${animeResult.episodeNumber}`);
    };


    return (
        <div className="card mx-5 mb-5" style={{ maxWidth: 'calc(15% - 20px)' }} onClick={onCardClick}>
            <img src={animeResult.image} className="card-img-top my-3 rounded mx-auto d-block" alt="" style={{ width: '100%', height: 'auto' }} />

            <div className="card-body">
                <h5 className="card-title">{animeResult.title}</h5>
                <p className="card-text">Latest Episode: {animeResult.episodeNumber}</p>
            </div>
        </div>
    );
}