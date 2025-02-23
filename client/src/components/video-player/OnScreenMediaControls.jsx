import React from "react";
import PlayCircleFilledTwoToneIcon from '@mui/icons-material/PlayCircleFilledTwoTone';
import PauseCircleFilledTwoToneIcon from '@mui/icons-material/PauseCircleFilledTwoTone';
import FastRewindTwoToneIcon from '@mui/icons-material/FastRewindTwoTone';
import FastForwardTwoToneIcon from '@mui/icons-material/FastForwardTwoTone';
import { IconButton } from '@mui/material';

import './OnScreenMediaControls.css';

export default function OnScreenMediaControls({ videoRef, isPlaying, setIsPlaying, setCurrentTime }) {
    /**
     * Helper Functions for Onscreen Media Controls
     */
    const togglePlayPause = () => {
        // Retrieve current video playback state
        if (videoRef.current.paused) {
            // Video is currently paused
            videoRef.current.play();
            setIsPlaying(true);
        }
        else {
            // Video is playing
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const toggleSkipForward = () => {
        if (videoRef.current) {
            // Skip 10s ahead
            const currTimestamp = videoRef.current.currentTime;

            // Take note that videoRef represents the timestamp of the video for us to manipulate
            videoRef.current.currentTime += 10;
            // While the useState is just a variable we track so we can show users
            setCurrentTime(currTimestamp + 10);
        }
    }

    const toggleRewindBack = () => {
        if (videoRef.current) {
            // Rewind 10s
            const currTimestamp = videoRef.current.currentTime;
            videoRef.current.currentTime -= 10;
            setCurrentTime(currTimestamp - 10);
        }
    }


    return (
        <>
            {/** Onscreen Media Controls */}
            <div className="onscreen-media-controls">
                <IconButton className="responsive-media-container" onClick={toggleRewindBack}>
                    <FastRewindTwoToneIcon className="responsive-media-button" />
                </IconButton>

                <IconButton className="responsive-media-container" onClick={togglePlayPause}>
                    { isPlaying ? <PauseCircleFilledTwoToneIcon className="responsive-media-button" /> : <PlayCircleFilledTwoToneIcon  className="responsive-media-button" /> }
                </IconButton>

                <IconButton className="responsive-media-container" onClick={toggleSkipForward}>
                    <FastForwardTwoToneIcon className="responsive-media-button" />
                </IconButton>
            </div>
        </>
    );
}