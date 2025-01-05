import React from "react";
import VolumeUpTwoToneIcon from '@mui/icons-material/VolumeUpTwoTone';
import VolumeMuteTwoToneIcon from '@mui/icons-material/VolumeMuteTwoTone';
import { IconButton } from '@mui/material';

import './SlideBar.css';

export default function VolumeBar({ videoRef, volume, setVolume, oldVolume, setOldVolume }) {

    // Mute Sound Function
    const toggleMute = () => {
        // Check if already muted
        if (volume > 0) {
            // Store old volume
            setOldVolume(volume);
            // Set the video to 0 volume
            videoRef.current.volume = 0;
            // Update for visual
            setVolume(videoRef.current.volume);
        }
        else {
            // Unmute
            videoRef.current.volume = oldVolume;
            setVolume(oldVolume);
        }
    };

    // Update Volume Function
    const handleVolumeChange = (e) => {
        // Retrieve the New Volume user wants
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
    };

    return (
        <>
            {/** Volume Button */}
            <div className="volume-container">
                <IconButton className="responsive-mediabar-container" onClick={toggleMute}>
                    { volume == 0 ? <VolumeMuteTwoToneIcon className="responsive-mediabar-button"/> : <VolumeUpTwoToneIcon className="responsive-mediabar-button"/> }
                </IconButton>

                {/** Volume Slider */}
                <div className="volume-bar">
                    {/* Volume is bound between 0 to 1 so we put 0.01 so it becomes 100 */}
                    <span>{ Math.round(volume * 100) }</span>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="slider-bar"
                    />
                </div>
            </div>
        
        </>
    );
}