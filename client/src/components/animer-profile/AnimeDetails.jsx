import React from "react";
import { Button } from "react-bootstrap";

export default function AnimeDetails({ animeDetails }) {
    const thumbnailDesc = `${ animeDetails.title } thumbnail`;

    return (
        <div className="row my-4">
        {/** Anime Picture */}
        <div className="col-12 col-md-4 mb-4 mb-md-0">
            <img 
                src={animeDetails.image} 
                className="rounded img-fluid" 
                alt={thumbnailDesc}
                style={{ maxWidth: "100%", height: "auto", border: "5px solid #31363F" }}
            />
        </div>

        {/** Anime Description */}
        <div className="col-12 col-md-8">
            <div className="row mb-4">
                <div className="col-auto">
                    <h2 className="mb-0">{animeDetails.title}</h2>
                </div>
                <div className="col-auto">
                    <button disabled={true} className="ml-2 subOrDubButton">{animeDetails.subOrDub}</button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h5>Released on: {animeDetails.releaseDate}</h5>
                    <h5>Status: {animeDetails.status}</h5>

                    {/** Genres as buttons */}
                    <h5>Genres:</h5>
                    <div className="d-flex flex-wrap">
                        {animeDetails.genres && animeDetails.genres.length > 0 ? (
                            animeDetails.genres.map((genre, index) => (
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

                    <p className="lead mt-3">
                        {animeDetails.description}
                    </p>
                </div>
            </div>
        </div>
    </div>
    );
}

