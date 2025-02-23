import React from "react";

import Navbar from "../components/navbar/Navbar";
import { IconButton } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';

export default function MoviesLandingPage() {


    return (
        <>
            <Navbar />

            {/* Create a card to store the entire movies search results */}
            <div className="landing-page-card">
                <div className="landing-page-title-row">
                    <h3 className="landing-page-title">Explore Movies</h3>
                    {/* Add a login Button */}
                    <IconButton>
                        <LoginIcon />
                    </IconButton>
                </div>

                {/* Add the Search Bar here and/or with a filter button */}

                {/* Rows of Trending Movies here */}
                <div>


                </div>
                




            </div>
        </>
    );
}