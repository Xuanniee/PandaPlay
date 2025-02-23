import React from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import "./AnimeListing.css";

/**
 * Prints a listing block of a single anime
 * @param {JSON Object} animeSearchResult 
 * @returns a Listing of the Anime in the search results
 */
export default function AnimeListing({ animeSearchResult }) {
    const navigate = useNavigate();
    // console.log(JSON.stringify(animeSearchResult));

    const handleRedirect = (path) => {
        navigate(path);
    }

    return (
        <>
            <div className="search-result-div" onClick={() => handleRedirect(`/anime-info/${animeSearchResult.id}`)}>
                <img src={animeSearchResult.poster} className="search-result-image" />

                <div className="search-result-details-div">
                    <div className="search-results-top">
                        <span className="search-result-title">{ animeSearchResult.name }</span>
                        <span className="search-result-type">{ animeSearchResult.type }</span>
                    </div>

                    <span className="search-result-duration">{ animeSearchResult.duration }</span>
                </div>
            </div>
        </>
    );

    // <div className="card-body">
    //                 <div className="row align-items-center">
    //                     <div className="col-auto">
    //                         {/* Image */}
    //                         <img
    //                             src={animeSearchResult.poster}
    //                             className="rounded img-fluid"
    //                             alt={animeSearchResult.name}
    //                             style={{ width: "150px", height: "auto", border: "5px solid #31363F" }}
    //                         />
    //                     </div>

    //                     <div className="col">
    //                         {/* Details */}
    //                         <div className="row mb-3">
    //                             <div className="col-auto">
    //                                 <h5 className="mb-0">
    //                                     <Link to={`/anime-info/${animeSearchResult.id}`}>
    //                                         {animeSearchResult.name}
    //                                     </Link>
    //                                 </h5>
    //                             </div>
    //                             {/* <div className="col-auto">
    //                                 <Button className="btn subOrDubButton btn-sm">{animeSearchResult.subOrDub}</Button>
    //                             </div> */}
    //                         </div>
    //                         <p>
    //                             {animeSearchResult.type
    //                                 ? animeSearchResult.releaseDate
    //                                 : "No Identifiable Type"}
    //                         </p>
    //                     </div>
    //                 </div>
    //             </div>
}

                