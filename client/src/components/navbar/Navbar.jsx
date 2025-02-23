    import React, { useState } from "react";
    import { useNavigate, NavLink } from "react-router-dom";
    import HomeWorkIcon from '@mui/icons-material/HomeWork';
    import MovieFilterIcon from '@mui/icons-material/MovieFilter';
    import MosqueIcon from '@mui/icons-material/Mosque';
    import LoginIcon from '@mui/icons-material/Login';

    import SearchBar from "./SearchBar";
    import "./Navbar.css";
import { IconButton } from "@mui/material";

    export default function Navbar() {
        const navigate = useNavigate();

        const handleSearchSubmit = (query) => {
            // console.log('Search query:', query);
            navigate(`/search/${query}`);

        };  

        return(
            <nav className="custom-navbar">
                {/* Replace with website logo */}
                <a className="" style={{color:"white"}} href="/">PandaPlay</a>

                {/* Left-leaning icons */}
                <div className="left-navbar">
                    <ul className="">
                        <li className="navbar-item">
                            {/** Active since default landing page */}
                            <IconButton disabled={true} className="navbar-item-icon">
                                <HomeWorkIcon />    
                            </IconButton>
                            <a className="" aria-current="page" href="/">Home</a>
                        </li>

                        <li className="navbar-item">
                            <IconButton disabled={true} className="navbar-item-icon">
                                <MosqueIcon />
                            </IconButton>
                            <a className="" href="/popular">Anime</a>
                        </li>

                        <li className="navbar-item">
                            <IconButton disabled={true} className="navbar-item-icon">
                                <MovieFilterIcon />
                            </IconButton>
                            <a className="" href="/movies">Movies</a>
                        </li>
                    </ul>
                </div>
                
                <div className="navbar-spacer"></div>

                {/** Container for collapsible navbar content, i.e. what will be in the menu */}
                <div className="right-navbar" id="navbarSupportedContent">
                    {/** Search Bar */}
                    <SearchBar onSearchHandler={handleSearchSubmit}/>

                    {/** Login */}
                    <IconButton className="navbar-item-icon">
                        <LoginIcon />
                    </IconButton>
                </div>

                {/** Create a menu button when viewport becomes too small, make visible only when viewport is small */}
                <button className="" hidden={true} type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" 
                aria-expanded="false" aria-label="Toggle navigation">
                    <span className=""></span>
                </button>
            </nav>
        );
    }
