    import React, { useState } from "react";
    import { useNavigate, NavLink } from "react-router-dom";
    import 'bootstrap/dist/css/bootstrap.min.css';
    import 'bootstrap/dist/js/bootstrap.bundle.min';

    import SearchBar from "./SearchBar";

    export default function Navbar() {
        const navigate = useNavigate();

        const handleSearchSubmit = (query) => {
            console.log('Search query:', query);
            navigate(`/search/${query}`);

        };  

        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                {/** Full width container that spans entire width of viewport*/}
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">PandaPlay</a>

                    {/** Create a menu button when viewport becomes too small */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" 
                    aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/** Container for collapsible navbar content, i.e. what will be in the menu */}
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                {/** Active since default landing page */}
                                <a className="nav-link active" aria-current="page" href="/">Home</a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="/popular">Most Popular</a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="/movies">Movies</a>
                            </li>
                        </ul>

                        {/** Search Bar */}
                        <SearchBar onSearchHandler={handleSearchSubmit}/>

                        {/** Login */}
                        <button className="btn btn-info me-2 my-2" type="button">Log In</button>
                        <button className="btn btn-primary me-2 my-2" type="button">Register</button>
                    </div>
                </div>
            </nav>
        );
    }
