import React from "react";
import FullscreenTwoToneIcon from '@mui/icons-material/FullscreenTwoTone';
import { IconButton } from '@mui/material';

import '../OnScreenMediaControls.css';

export default function FullscreenButton({ fullScreen, setFullScreen }) {
    /**
     * Set entire container to full screen.
     * However, video element needs to be made responsive or it will not be full screen as well.
     */
    const toggleFullscreen = () => {
        // Retrieve the entire video player container, not just the video element
        const videoPlayerContainer = document.querySelector('.custom-videoplayer-div');
        // const element = videoRef.current; NOT THIS ONLY

        // Check if currently full screen
        if (!fullScreen) {
            // Not Full Screen
            if (videoPlayerContainer.requestFullscreen) {
                videoPlayerContainer.requestFullscreen();
            } else if (videoPlayerContainer.mozRequestFullScreen) { // Firefox
                videoPlayerContainer.mozRequestFullScreen();
            } else if (videoPlayerContainer.webkitRequestFullscreen) { // Chrome, Safari and Opera
                videoPlayerContainer.webkitRequestFullscreen();
            } else if (videoPlayerContainer.msRequestFullscreen) { // IE/Edge
                videoPlayerContainer.msRequestFullscreen();
            }

            // Change state to full screen
            setFullScreen(true);
        }
        else {
            // Currently Full Screen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }

            setFullScreen(false);
        }
    };

    return (
        <>
            {/* Fullscreen Button */}
            <IconButton className="responsive-mediabar-container" onClick={toggleFullscreen}>
                <FullscreenTwoToneIcon className="responsive-mediabar-button" />
            </IconButton>
        </>
    );
}