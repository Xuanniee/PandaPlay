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
export default function CustomVideoPlayer({ episodeNumber, episodeUrl, controls, loop, loading, setLoading, episodeSources, setEpisodeUrl, animeSubtitles }) {
    // useRef hook to get a direct reference to a DOM element & to store any mutable value that needs to persist across renders but should not trigger re-renders when it changes
    const videoRef = useRef(null);

    // useState Hooks to track the states of various video playback controls
    // Cannot autoplay without muting, so allow user to trigger instead
    const [isPlaying, setIsPlaying] = useState(true);
    // Autoplay only works if initially muted
    const [volume, setVolume] = useState(0);
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
    // Manages the Video Quality
    const [hlsInstance, setHlsInstance] = useState(null);
    // Video Quality
    const [videoQuality, setVideoQuality] = useState([]);
    // Determines if video should be autoplayed
    const [autoplayVideos, setAutoplayVideos] = useState(true);
    // useState that tracks subtitles text
    const [subtitlesOn, setSubtitlesOn] = useState(false);
    // State variable that determines which subtitles is being used
    const [selectedSubtitles, setSelectedSubtitles] = useState(null);
    // Video Speed
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

    // Track Error states - Loading is passed from parent component (Video Player itself)
    const [error, setError] = useState(null);

    // Helper Function to make an HTTP request to my proxy server to get the m3u8 actual file
    const fetchM3U8File = async () => {
        try {
            // Build the proxyUrl using the provided Url - ProxyURL/episodeURL
            // const proxyUrl = `http://localhost:3001/${episodeUrl}`;
            // Proxy Server
            const proxyUrl = `https://pandaplay-proxy-backend.onrender.com/${episodeUrl}`;

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
                    // console.log("Reaches Eevent 1 - Manifest Parsed");
                    const videoElement = videoRef.current;

                    // Video is ready to play after we determined the duration and remove the error
                    setVideoDuration(videoElement.duration);
                    
                    // Clear any previous Errors
                    setError(null);
                    // Stop Loading & Play Video
                    setLoading(false); 
                    videoElement.play();
                    setIsPlaying(true);

                    // Set the Video Quality to the highest
                    let qualityLevels = hls.levels;
                    hls.currentLevel = qualityLevels.length - 1;
                    // console.log(`Number of Quality Levels: ${qualityLevels.length}`);
                    // hls.levels.forEach((level, index) => {
                    //     console.log(`Level ${index}: ${level.width}x${level.height} @ ${level.bitrate}bps`);
                    // });

                    // Remember to always set the HLS Instance to track it
                    setHlsInstance(hls);
                    // Set the qualitys too
                    setVideoQuality(hls.levels);
                });

                
            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                // Fallback for Safari which natively supports HLS
                videoRef.current.src = episodeUrl;
                // Stop loading when the fallback is used
                setLoading(false);  
            } else {
                setError('HLS not supported in this browser.');
                // Basically we cannot load if we want to show error
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
            // Stop loading on fetch error
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

    // Effect Hook that updates playback rate
    useEffect(() => {
        // Update the rate whenever the speed changes
        console.log(`User just changed playbackrate to ${playbackSpeed}`);
        videoRef.current.playbackRate = playbackSpeed;
    }, [playbackSpeed]);
    
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.loop = loop;
        }
    }, [loop]);

    // Update subtitles whenever one is switched
    useEffect(() => {
        // Stop hiding the subs
        const tracks = videoRef.current.textTracks;
        // Hide any other active subs
        for (let track of tracks) {
            if (track.label === selectedSubtitles?.label) {
                // Show the selected track
                track.mode = "showing";  
            } else {
                // Hide all other subtitles
                track.mode = "hidden";
            }
        }
    }, [selectedSubtitles])

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
            {/* Show loading indicator while fetching and processing */}
            {loading && (
                <div className="loader-container">
                    <div className="foot-loader"></div>
                    <div className="text-loader"></div>
                </div>
            )}

            {/* Show error message only if there's an actual error and no loading */}
            {!loading && error && <p className="error-message">{error}</p>}

            {/* Actual HTML Video, cannot place it in an conditional if clause since it will prevent the video element from rendering and crashing */}
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
                crossOrigin="anonymous"
            >
                {/* Add Subtitles here in Video */}
                {selectedSubtitles !== null && (
                    <track
                        kind="subtitles"
                        key={selectedSubtitles.file}
                        src={selectedSubtitles.file}
                        label={selectedSubtitles.label}
                    />
                )}
            </video>



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

                                {/** Volume Controls */}
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
                                {/* Settings Button */}
                                <SettingsButton
                                    activeMenu={activeMenu}
                                    setActiveMenu={setActiveMenu}
                                    isSettingsVisible={isSettingsVisible}
                                    setIsSettingsVisible={setIsSettingsVisible}
                                    videoQuality={videoQuality}
                                    setVideoQuality={setVideoQuality}
                                    autoplayVideos={autoplayVideos}
                                    setAutoplayVideos={setAutoplayVideos}
                                    setEpisodeUrl={setEpisodeUrl}
                                    subtitlesOn={subtitlesOn}
                                    setSubtitlesOn={setSubtitlesOn}
                                    playbackSpeed={playbackSpeed}
                                    setPlaybackSpeed={setPlaybackSpeed}
                                    episodeSources={episodeSources}
                                    hlsInstance={hlsInstance}
                                    animeSubtitles={animeSubtitles}
                                    selectedSubtitles={selectedSubtitles}
                                    setSelectedSubtitles={setSelectedSubtitles}
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