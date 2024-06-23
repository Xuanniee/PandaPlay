import React from "react";
import { useNavigate } from "react-router-dom";

export default function MainAnimeCard({ animeDetail }) {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(`/${animeDetail.id}/${animeDetail.episodeId}/${animeDetail.episodeNumber}`)
    }

    return (
        <>
            <div className="card my-5 mx-5" onClick={handleRedirect}>
                <h5 className="card-header">Latest Updates</h5>

                <div className="card-body">
                    <h5 className="card-title">{ animeDetail.title }</h5>

                    <p className="card-text">Just Released: Episode { animeDetail.episodeNumber }</p>
                    <a href="" className="btn">Watch Now!</a>
                </div>
            </div>
        
        </>
    );
}