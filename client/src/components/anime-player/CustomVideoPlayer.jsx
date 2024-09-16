import React, { useEffect, useRef, useState } from "react";
import PlayCircleFilledTwoToneIcon from '@mui/icons-material/PlayCircleFilledTwoTone';
import PauseCircleFilledTwoToneIcon from '@mui/icons-material/PauseCircleFilledTwoTone';
import FastRewindTwoToneIcon from '@mui/icons-material/FastRewindTwoTone';
import FastForwardTwoToneIcon from '@mui/icons-material/FastForwardTwoTone';
import FullscreenTwoToneIcon from '@mui/icons-material/FullscreenTwoTone';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import SettingsApplicationsTwoToneIcon from '@mui/icons-material/SettingsApplicationsTwoTone';
import VolumeUpTwoToneIcon from '@mui/icons-material/VolumeUpTwoTone';
import VolumeMuteTwoToneIcon from '@mui/icons-material/VolumeMuteTwoTone';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { IconButton } from '@mui/material';
import Hls from 'hls.js';

// Import CSS
import './CustomVideoPlayer.css';

export default function CustomVideoPlayer({ episodeId, videoUrl, controls, loop }) {
    // useRef hook to get a direct reference to a DOM element & to store any mutable value that needs to persist across renders but should not trigger re-renders when it changes
    const videoRef = useRef(null);
    // useState Hooks to track the states of various video playback controls
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [currentTime, setCurrentTime] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);
    const [fullScreen, setFullScreen] = useState(false);

    // Track Loading & Error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // HTTP Live Streaming (HLS)
    useEffect(() => {
        // If videoUrl is not available, do nothing instead of adding an intentional delay
        if (!videoUrl) {
            return;
        }
        
        // Library to play HLS streams in browsers that do not natively support it
        // Instance of HLS to load video and handle playback
        const hls = new Hls();

        // Check if the browers requires HLS
        if (Hls.isSupported()) {
            // Load the Video
            hls.loadSource(videoUrl);
            // Attach the HLS stream to the video HTML element
            hls.attachMedia(videoRef.current);
            
            // Event fired when HLS manifest file is parsed and video is ready to be played
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                const videoElement = videoRef.current;
                setVideoDuration(videoElement.duration);
                // Video is ready to play after we determined the duration
                setLoading(false); 
                videoRef.current.play();
            });

            // Event fired when there is an error with playing with HLS streams
            hls.on(Hls.Events.ERROR, (_, data) => {
                switch (data.fatal) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        setError('Network error while loading video.');
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        setError('Media error while loading video.');
                        break;
                    case Hls.ErrorTypes.OTHER_ERROR:
                        setError('An unknown error occurred.');
                        break;
                    default:
                        setError('An unexpected error occurred.');
                        break;
                }
                setLoading(false); // Stop loading on error
            });
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            // Fallback for Safari which natively supports HLS
            videoRef.current.src = videoUrl;
        } else {
            setError('HLS not supported in this browser.');
            setLoading(false);
        }

        return () => {
            // Clean up the instance
            hls.destroy();
        };
    }, [videoUrl]); // Only re-run effect when videoUrl changes
    
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.loop = loop;
        }
    }, [loop]);

    // Updates whenever volume changes
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
        }
    }, [volume]);

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

    /**
     * General Helper Functions
     */
    // Triggered when video metadata like dimensions have been loaded
    const handleLoadedMetaData = () => {
        // Set duration for max value of seek bar
        const currVideoDuration = videoRef.current.duration;
        setVideoDuration(currVideoDuration);
        setLoading(false);
    };

    const handleVolumeChange = (e) => {
        // Retrieve the New Volume user wants
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
    };

    // Updates the seek bar and current time of video playback
    const handleTimeUpdate = () => {
        // Get the current timestamp
        const newTimestamp = videoRef.current.currentTime;
        setCurrentTime(newTimestamp);
    };

    // When user manually changed the timestamp
    const handleSeekChange = (e) => {
        // Get the timestamp user clicked
        const newTimestampSelected = e.target.value;
        videoRef.current.currentTime = newTimestampSelected;
        setCurrentTime(newTimestampSelected);
    };

    // Formats the timestamp to be human readable
    const formatTimestamp = (timestamp) => {
        // Calculate the time and ensure it is minimally 2 digits
        const hours = Math.floor(timestamp / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((timestamp % 3600) / 60).toString().padStart(2, '0');
        const seconds = Math.floor(timestamp % 60).toString().padStart(2, '0');

        // Return hours only if there is
        if (hours > 0) {
            return `${hours}:${minutes}:${seconds}`;
        } else {
            return `${minutes}:${seconds}`;
        }
    };

    /**
     * Helper Function for the Media Bar
     */
    const toggleMute = () => {
        // Set the video to 0 volume
        videoRef.current.volume = 0;
        // Update for visual
        setVolume(videoRef.current.volume);
    };

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

    const handleError = () => {
        setError('Error loading video. Please try again later.');
    };

    return (
        <div className="custom-videoplayer-div">
            {/** Disable the Default Video Controls so that we can provide our own */}
            {loading && <div className="spinner"></div>}
            {error && <p className="error-message">{error}</p>}
            <video
                ref={videoRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetaData}
                onError={() => setError('Error loading video. Please try again later.')}
                width="100%"
                controls={false}
            />

            {/** custom-videoplayer-controls represents the div covering the entire video */}
            {!controls && !error && !loading && (
                <div className="custom-videoplayer-controls">
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
                    
                    <div className="custom-media-bar">
                        {/** Seek Bar */}
                        <input
                            type="range"    
                            min="0"
                            max={videoDuration}
                            step="0.1"
                            value={currentTime}
                            onChange={handleSeekChange}
                            className="slider-bar"
                        />
                        {/** Bottom Media Bar for Controlling Media */}
                        <div className="custom-media-bar-controls">
                            <div className="media-buttons-container">
                                {/** Play/Pause Button */}
                                <IconButton className="responsive-mediabar-container" onClick={togglePlayPause}>
                                    { isPlaying ? <PauseIcon className="responsive-mediabar-button" /> : <PlayArrowIcon  className="responsive-mediabar-button" /> }
                                </IconButton>

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

                                {/** Video Playback Timestamp */}
                                <span>
                                    { formatTimestamp(currentTime) } / { formatTimestamp(videoDuration) }
                                </span>
                            </div>

                            <div className="media-buttons-container">
                                {/** Subtitles, Settings & Full Screen Button */}
                                <IconButton className="responsive-mediabar-container">
                                    <SubtitlesIcon className="responsive-mediabar-button" />
                                </IconButton>

                                <IconButton className="responsive-mediabar-container">
                                    <SettingsApplicationsTwoToneIcon className="responsive-mediabar-button" />
                                </IconButton>

                                <IconButton className="responsive-mediabar-container" onClick={toggleFullscreen}>
                                    <FullscreenTwoToneIcon className="responsive-mediabar-button" />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}