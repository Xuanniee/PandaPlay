import React, { useEffect, useRef, useState } from "react";
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { duration, IconButton } from '@mui/material';
import Hls from 'hls.js';

// Import CSS
import './CustomVideoPlayer.css';
import VideoSeekBar from "./VideoSeekBar";
import VolumeBar from "./VolumeBar";
import OnScreenMediaControls from "./OnScreenMediaControls";
import FullscreenButton from "./buttons/FullscreenButton";
import SettingsButton from "./buttons/SettingsButton";

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

    // Updates the seek bar and current time of video playback
    const handleTimeUpdate = () => {
        // Get the current timestamp
        const newTimestamp = videoRef.current.currentTime;
        setCurrentTime(newTimestamp);
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
                    <OnScreenMediaControls
                        videoRef={videoRef}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        setCurrentTime={setCurrentTime}
                    />
                    
                    <div className="custom-media-bar">
                        {/** Seek Bar */}
                        <VideoSeekBar
                            videoRef={videoRef}
                            currentTime={currentTime}
                            setCurrentTime={setCurrentTime}
                            videoDuration={videoDuration}
                            videoBuffered={videoBuffered}
                            setVideoBuffered={setVideoBuffered}
                        />
                 
                        {/** Bottom Media Bar for Controlling Media */}
                        <div className="custom-media-bar-controls">
                            <div className="media-buttons-container">
                                {/** Play/Pause Button */}
                                <IconButton className="responsive-mediabar-container" onClick={togglePlayPause}>
                                    { isPlaying ? <PauseIcon className="responsive-mediabar-button" /> : <PlayArrowIcon  className="responsive-mediabar-button" /> }
                                </IconButton>

                                {/** Volume Control */}
                                <VolumeBar
                                    videoRef={videoRef}
                                    volume={volume}
                                    setVolume={setVolume}
                                    oldVolume={oldVolume}
                                    setOldVolume={setOldVolume}
                                />

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

                                {/* Settings Button */}
                                <SettingsButton
                                    activeMenu={activeMenu}
                                    setActiveMenu={setActiveMenu}
                                    isSettingsVisible={isSettingsVisible}
                                    setIsSettingsVisible={setIsSettingsVisible}
                                    videoQuality={videoQuality}
                                    setVideoQuality={setVideoQuality}
                                    setEpisodeUrl={setEpisodeUrl}
                                    episodeSources={episodeSources}
                                />
                                
                                {/* Fullscreen Button */}
                                <FullscreenButton
                                    fullScreen={fullScreen}
                                    setFullScreen={setFullScreen}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}