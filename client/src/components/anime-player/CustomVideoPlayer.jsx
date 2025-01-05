import React, { act, useEffect, useRef, useState } from "react";
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
import { duration, IconButton } from '@mui/material';
import Hls from 'hls.js';

// Import CSS
import './CustomVideoPlayer.css';

/**
 * Composable function that renders the entire video player (just the player)
 * @param {JSON} episodeSources
 * episodeSources contains all the streaming links for various video qualities
 * 
 * @returns 
 */
export default function CustomVideoPlayer({ episodeId, episodeUrl, controls, loop, loading, setLoading, episodeSources, setEpisodeUrl }) {
    // useRef hook to get a direct reference to a DOM element & to store any mutable value that needs to persist across renders but should not trigger re-renders when it changes
    const videoRef = useRef(null);
    
    // useState Hooks to track the states of various video playback controls
    const [isPlaying, setIsPlaying] = useState(true);
    const [volume, setVolume] = useState(0.5);
    const [oldVolume, setOldVolume] = useState(0.5);
    const [fullScreen, setFullScreen] = useState(false);

    // Use States for Updating the Playback Seek Bar
    const [currentTime, setCurrentTime] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);
    const [videoBuffered, setVideoBuffered] = useState([0, 0]);
    const [seekBarStyle, setSeekBarStyle] = useState({});

    // useStates for Settings
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    // Manages which sub-menu under settings is active e.g. quality or speed
    const [activeMenu, setActiveMenu] = useState(null);
    // Video Quality
    const [videoQuality, setVideoQuality] = useState("Default");

    // Track Error states - Loading is passed from parent component (Video Player itself)
    const [error, setError] = useState(null);

    // Helper Function to make an HTTP request to my proxy server to get the m3u8 actual file
    const fetchM3U8File = async () => {
        try {
            // Build the proxyUrl using the provided Url - ProxyURL/episodeURL
            const proxyUrl = `http://localhost:3001/${episodeUrl}`;

            // Library to play HLS streams in browsers that do not natively support it
            // Instance of HLS to load video and handle playback
            const hls = new Hls();

            // Check if the browers supports HLS
            if (Hls.isSupported()) {
                // Loads the video using a proxied server to prevent a CORS error
                hls.loadSource(proxyUrl);

                // Attach the HLS stream to the video HTML element
                hls.attachMedia(videoRef.current);
                
                // Event 1 - HLS manifest file is parsed and Video can be played
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    const videoElement = videoRef.current;
                    setVideoDuration(videoElement.duration);
                    // Video is ready to play after we determined the duration
                    setLoading(false); 
                    videoRef.current.play();
                });

                // Event 2 - Errors with playing with HLS streams
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
                videoRef.current.src = episodeUrl;
            } else {
                setError('HLS not supported in this browser.');
                setLoading(false);
            }

            return () => {
                // Clean up the instance
                hls.destroy();
            };

        }
        catch (err) {
            console.error("Error fetching .m3u8 file:", err);
            setError("Failed to load video stream.");
            setLoading(false);
        }
    }

    // HTTP Live Streaming (HLS) - Handles adaptive bitrate streaming
    useEffect(() => {
        // If episodeUrl is not available, do nothing instead of adding an intentional delay
        if (!episodeUrl) {
            return;
        }

        fetchM3U8File();
    }, [episodeUrl]); // Only re-run effect when episodeUrl changes

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
        const currTimePer = ((currentTime / videoDuration) * 100);
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
     * Helper Function for Settings
     */
    // Function to Open the Menu
    const toggleSettingsMenu = () => {
        // Toggle between the visibility settings
        setIsSettingsVisible(!isSettingsVisible);

        // Reset activeMenu whenever we open main or close main menu
        setActiveMenu(null);
    }

    // Decide which menu to open
    const handleSubMenuSelection = (menu) => {
        setActiveMenu(menu);
    }

    const handleStreamQualityChange = (episodeSource) => {
        // Parse the source to change the stream url
        const { url, isM3U8, quality } = episodeSource;

        // Change the Stream Quality
        setEpisodeUrl(url);
        // Update the Read Value on the Settings
        setVideoQuality(quality);
    }

    const openSettingsMenu = () => {
        // Open and Close the Main Settings Menu
        if (activeMenu === null) {
            // OpenMenu
            setActiveMenu("main");
        }
        else {
            // Close Menu
            setActiveMenu(null);
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
            {loading && (
                <div className="loader-container">
                    <div className="foot-loader"></div>
                    <div className="text-loader"></div>
                </div>
            )}
            {error && <p className="error-message">{error}</p>}
            <video
                ref={videoRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetaData}
                onError={() => setError('Error loading video. Please try again later.')}
                width="100%"
                controls={false}
                // Ensure video always play first so we can standardise the icon
                autoPlay
                // Add the loaded className if no longer loading
                className={`custom-videoplayer-div video ${loading ? "" : "loaded"}`} 
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
                            max={isNaN(videoDuration) ? 0 : videoDuration} // Fallback to 0 if videoDuration is NaN
                            step="0.1"
                            value={currentTime}
                            onChange={handleSeekChange}
                            className="slider-bar"
                            style={{
                                background: seekBarStyle
                            }}
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

                                <div className="settings-container">
                                    {/* Settings Icon */}
                                    <IconButton onClick={() => openSettingsMenu()} className="responsive-mediabar-container">
                                        <SettingsApplicationsTwoToneIcon className="responsive-mediabar-button" />
                                    </IconButton>

                                    {/* Setting Menu - Show when no submenu is active */}
                                    <div className="settings-menu-container">
                                        {/* Show when no submenu active */}
                                        {activeMenu === "main" && (
                                            <ul className={`main-settings-menu ${activeMenu === "main" ? "menu-visible" : ""}`}>
                                                <li onClick={() => handleSubMenuSelection("subtitles")}>Subtitles</li>
                                                <li onClick={() => handleSubMenuSelection("speed")}>Speed</li>
                                                <li onClick={() => handleSubMenuSelection("quality")}>Quality</li>
                                            </ul>
                                        )}

                                        {/* Sub-Menus */}
                                        {activeMenu === "subtitles" && (
                                            // Pass menu-visible classs if curr submenu is active
                                            <ul className={`subtitles-menu ${activeMenu === "subtitles" ? 'menu-visible' : ''}`}>
                                                <li onClick={() => handleSubMenuSelection("main")}>&lt; Subtitles</li>
                                                {/* TODO placeholder currently */}
                                                <li>English</li>
                                                <li>Chinese</li>
                                            </ul>
                                        )}
                                        
                                        {activeMenu === "speed" && (
                                            <ul className={`speed-menu ${activeMenu === "speed" ? "menu-visible" : ""}`}>
                                                <li onClick={() => handleSubMenuSelection("main")}>&lt; Speed</li>
                                            </ul>
                                        )}

                                        {activeMenu === "quality" && (
                                            <ul className={`quality-menu ${activeMenu === "quality" ? "menu-visible" : ""}`}>
                                                <li onClick={() => handleSubMenuSelection("main")}>&lt; Quality (videoQuality)</li>
                                                {episodeSources.map((source, index) => (
                                                    // Show the available qualities to be clicked except for Backup
                                                    (source.quality != "backup") ? (
                                                        <li onClick={() => handleStreamQualityChange(source)} key={index}>{ source.quality }</li>
                                                    ) : null
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>

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