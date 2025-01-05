import React, { useState, useEffect } from "react";

import './SlideBar.css';

export default function VideoSeekBar({videoRef, currentTime, setCurrentTime, videoDuration, videoBuffered, setVideoBuffered}) {
    // Use States for Updating the Playback Seek Bar
    const [seekBarStyle, setSeekBarStyle] = useState({});

    // Helper Function - User change timestamp manually
    const handleSeekChange = (e) => {
        // Get the timestamp user clicked
        const newTimestampSelected = e.target.value;
        videoRef.current.currentTime = newTimestampSelected;

        // Set useState
        setCurrentTime(newTimestampSelected);
    };

    /**
     * useEffect Hook to update the colors of slider bar for:
     * Played, Unplayed and Buffered
     * 
     * Updates everytime currentTime is updated
     */
    useEffect(() => {
        // Calculate the Buffered Video Percentage
        // Only interested in the buffered ranges from currentTime onwards, assuming is the first range
        const videoBufferedRanges = videoRef.current.buffered;
        console.log(`Number of Video Ranges that are Buffered: ${videoBufferedRanges.length}`);

        // Although this is a progressive buffering video, we need to consider all the video buffered ranges.
        // Because user might skip ahead to another section, creating 2 buffered ranges
        for (let i = 0; i < videoBufferedRanges.length; i += 1) {
            console.log(`Start of Buffer: ${videoBufferedRanges.start(i)} End: ${videoBufferedRanges.end(i)}`);

            // Update the useState for videosBuffered if empty or got new max
            if ((videoBuffered == [0, 0]) || (videoBufferedRanges.end(i) > videoBuffered[1])) {
                setVideoBuffered([
                    videoBufferedRanges.start(i),
                    videoBufferedRanges.end(i)
                ]);
            }
        }

        // Determine the currentTime and buffered percentage
        const currTimePer = ((videoRef.current.currentTime / videoDuration) * 100);
        const bufferPer = (videoBuffered[1] / videoDuration) * 100;  // Buffered percentage

        // Set the CSS as a linear gradient dynamically
        setSeekBarStyle(
            // Indicate direction, and what color to use for different segments
            `linear-gradient(to right,
                    #78A2D2 0% ${currTimePer}%,
                    #C0D6E9 ${currTimePer}% ${bufferPer}%,
                    #d3d3d3 ${bufferPer}% 100%
            )`
        );
    }, [currentTime]);


    return (
        <>
            {/** Seek Bar */}
            <input
                type="range"    
                min="0"
                max={isNaN(videoDuration) ? 0 : videoDuration} // Fallback to 0 if videoDuration is NaN
                step="0.1"
                value={currentTime}
                onChange={handleSeekChange}
                className="slider-bar"
                style={{
                    background: seekBarStyle
                }}
            />

        </>
    )
}