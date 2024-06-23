import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import { useParams } from "react-router-dom";

import AnimeListing from "../components/anime-search/AnimeListing";

export default function AnimeSearchResultsPage({ }) {
    const [searchResults, setSearchResults] = useState(null);
    // Extract query from URL
    const { searchQuery, pageNumber } = useParams();

    // useEffect Hook to update the search results whenever the search query changes
    useEffect(() => {
        const animeSearchFunction = async () => {
            try {
                // Create request body
                const reqBody = {
                    searchQuery: searchQuery,
                };
                if (pageNumber !== undefined) {
                    reqBody.pageNumber = pageNumber;
                }
                const res = await fetch("http://localhost:3000/api/anime/fetch-search-results", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(reqBody),
                })
        
                // Check res
                if (!res.ok) {
                    throw new Error("Network response from Anime Search was not ok.");
                }

                // Set the data received from the backend
                const searchData = await res.json();
                setSearchResults(searchData.results);
            }
            catch (error) {
                console.error(`Error with fetching anime search results: `, error);
            }

            
        };

        // Call the function to mount it once at least
        animeSearchFunction();
    }, [searchQuery]);
    



    return (
        <>
            <div>
                <Navbar />
                {/** Spacer here */}
                <div className="my-4"></div>

                <div className="col mx-auto">
                    {searchResults ? (
                        <div>
                            <strong className="mx-3 my-3">Anime Title:</strong>
                            <div className="my-2"></div>
                            {searchResults.map((searchResult, index) => (
                                <AnimeListing key={index} animeSearchResult={searchResult} />
                            ))}
                        </div>
                    ) : (
                        <p>No search results found.</p>
                    )}
                </div>

                
            </div>            
        </>
    );
}