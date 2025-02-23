import React, { useRef } from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import RecentAnimeCard from "../navbar/RecentAnimeCard";
import { IconButton } from "@mui/material";
import "./Carousel.css";

export default function AnimeCarousel({ carouselName, carouselAnimeDetails }) {
    // Create a reference hook to the carousell
    const carouselRef = useRef(null);
        
    // Function to scroll left
    const scrollLeft = () => {
        // Check if there is a reference element to hold
        if (carouselRef.current) {
            // Left by subtracting
            carouselRef.current.scrollLeft -= 1000;
        }
    };

    // Function to scroll right
    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollLeft += 1000;
        }
    };

    return (
        <>
            <div className="anime-home-section">
                <div className="anime-home-section-top">
                    <span className="anime-home-section-header">{ carouselName }</span>

                    <div className="carousel-spacer"></div>
                    
                    <div className="anime-home-carousel-controls">
                        <IconButton className="responsive-carousel-button" onClick={scrollLeft}>
                            <ArrowBackIcon className="responsive-carousel-icon" />
                        </IconButton>

                        <IconButton className="responsive-carousel-button" onClick={scrollRight}>
                            <ArrowForwardIcon className="responsive-carousel-icon" />
                        </IconButton>
                    </div>
                </div>
                
                {/* Carousel that holds all the anime, allowing user to slide in the X direction */}
                <div className="anime-home-carousel" ref={carouselRef}>
                    <div className="anime-home-carousel-track">
                        {carouselAnimeDetails ? (
                            carouselAnimeDetails.map((anime, index) => [
                                <RecentAnimeCard key={index} animeResult={anime} />
                            ])
                        ) : (
                            <p>No recent anime</p>
                        )}
                    </div>
                </div>
            </div>
        
        </>
    );
}