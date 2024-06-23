import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SearchBar({ onSearchHandler }) {
    const [searchQuery, setSearchQuery] = useState("");

    // Initialise event listeners to submit search query
    const handleInputChange = (event) => {
        // e.target is the element that triggered the event, in this case the search bar
        // e.target.value is the value contained by the element, i.e. input field
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        
        // Use the provided search function
        onSearchHandler(searchQuery);
      };


    return(
        <>
            <form className="d-flex me-2 search-bar-debug" onSubmit={handleSearchSubmit}>
                <input 
                    className="form-control me-2" 
                    type="search"
                    placeholder="Search" 
                    aria-label="Search"
                    onChange={handleInputChange}
                    value={searchQuery}
                />
            </form>
        </>
    );
}