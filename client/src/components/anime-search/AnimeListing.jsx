import React from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

/**
 * Prints a listing block of a single anime
 * @param {JSON Object} animeSearchResult 
 * @returns a Listing of the Anime in the search results
 */
export default function AnimeListing({ animeSearchResult }) {
    const navigate = useNavigate();

    const handleRedirect = (path) => {
        navigate(path);
    }

    return (
        <>
            <div className="container-fluid">
            <div className="card rounded mb-4" onClick={() => handleRedirect(`/anime-info/${animeSearchResult.id}`)}>
                <div className="card-body">
                    <div className="row align-items-center">
                        <div className="col-auto">
                            {/* Image */}
                            <img
                                src={animeSearchResult.image}
                                className="rounded img-fluid"
                                alt={animeSearchResult.title}
                                style={{ width: "150px", height: "auto", border: "5px solid #31363F" }}
                            />
                        </div>

                        <div className="col">
                            {/* Details */}
                            <div className="row mb-3">
                                <div className="col-auto">
                                    <h5 className="mb-0">
                                        <Link to={`/anime-info/${animeSearchResult.id}`}>
                                            {animeSearchResult.title}
                                        </Link>
                                    </h5>
                                </div>
                                <div className="col-auto">
                                    <Button className="btn subOrDubButton btn-sm">{animeSearchResult.subOrDub}</Button>
                                </div>
                            </div>
                            <p>
                                {animeSearchResult.releaseDate
                                    ? animeSearchResult.releaseDate
                                    : "No release date found"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        </>
    );
}