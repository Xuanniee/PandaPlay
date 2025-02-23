import React, { useState } from "react";
import SettingsApplicationsTwoToneIcon from '@mui/icons-material/SettingsApplicationsTwoTone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Icon, IconButton } from '@mui/material';

import './SettingsButton.css';

export default function SettingsButton({ 
    activeMenu, 
    setActiveMenu, 
    isSettingsVisible, 
    setIsSettingsVisible, 
    videoQuality,
    setVideoQuality,
    autoplayVideos,
    setAutoplayVideos,
    setEpisodeUrl,
    subtitlesOn,
    setSubtitlesOn,
    playbackSpeed,
    setPlaybackSpeed,
    episodeSources,
    hlsInstance,
    animeSubtitles,
    selectedSubtitles,
    setSelectedSubtitles
}) {
    // Create an array to store all the possible video qualities
    const allQualityLevels = [360, 480, 720, 1080, 2160];
    // Use a usestate to track the current video quality
    const [currVideoQuality, setCurrVideoQuality] = useState(1080);

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

    /**
     * Function to change subtitles for the video player
     * @param {Track Object} track 
     */
    const handleSubtitlesChange = (track) => {
        // console.log(`Setting Subtitles: ${track.kind} ${track.file}`);
        // Switch the subtitles on if it is not already turned on
        if (!subtitlesOn) {
            setSubtitlesOn(true);
        }
        // Change to the correct subtitles
        setSelectedSubtitles(track);

        // Close the menu after changing
        toggleSettingsMenu();

        // console.log(`SubtitlesOn: ${subtitlesOn} selectedSubtitles: ${selectedSubtitles}`);
        return 0;
    }

    /**
     * Function to change Stream Quality using HLS
     * @param {*} episodeSource 
     */
    const handleStreamQualityChange = (selectedQualityHeight) => {
        // console.log(`Switching to Quality: ${selectedQualityHeight}p`);
        // Iterate over all the video qualities
        videoQuality.forEach((quality, index) => {
            if (quality.height === selectedQualityHeight) {
                // Found Desired Video Quality, Set it
                hlsInstance.currentLevel = index;
                setCurrVideoQuality(quality.height);
                // console.log(`Successfully switched to: ${quality.height}p`);
            }
        })
        // Failed to find the video quality
    }

    const openSettingsMenu = () => {
        // Open and Close the Main Settings Menu
        // console.log('Opening main menu:', activeMenu);  // Debug line
        
        if (activeMenu === null) {
            // OpenMenu
            setActiveMenu("main");
        }
        else {
            // Close Menu
            setActiveMenu(null);
        }

        // TODO Add a time delay so that the settings will disappear or event checker
    }

    const handleAutoplay = () => {
        // Check if the current state of the checkbox (binded) is autoplaying
        if (autoplayVideos) {
            // Change the state
            setAutoplayVideos(false);
        }
        else {
            setAutoplayVideos(true);
        }
    };

    const handleSubtitles = () => {
        // Check if subtitles needs to be enabled
        // Assume true -> currently enabled
        if (!subtitlesOn) {
            // Currently Disabled
            setSubtitlesOn(true);
            // Enable
        }
        else {
            setSubtitlesOn(false);
            // Disable Subs
        }

    };

    // Function to modify playback speed
    const handlePlaybackSpeed = (newSpeed) => {
        // Update the useState
        setPlaybackSpeed(newSpeed);
    }

    return (
        <>
            {/* Settings Button */}
            <div className="settings-container">
                {/* Settings Icon */}
                <IconButton onClick={() => openSettingsMenu()} className="responsive-mediabar-container">
                    <SettingsApplicationsTwoToneIcon className="responsive-mediabar-button" />
                </IconButton>

                {/* Setting Menu - Show when no submenu is active */}
                <div className="settings-menu-container">
                    {/* Show when no submenu active */}
                    {activeMenu === "main" && (
                        // Main Menu should show a 2 x 2 grid
                        <div className={`main-settings-menu ${activeMenu === "main" ? "menu-visible" : ""}`}>
                            <div className="menu-grid-container">
                                <div className="menu-grid-item" onClick={() => handleSubMenuSelection("quality")}>Quality</div>
                                <div className="menu-grid-item" onClick={() => handleSubMenuSelection("subtitles")}>Subtitles</div>
                                <div className="menu-grid-item" onClick={() => handleSubMenuSelection("servers")}>Servers</div>
                                <div className="menu-grid-item" onClick={() => handleSubMenuSelection("audio")}>Audio</div>
                            </div>

                            {/* Add a Line Break here to separate the options */}
                            <div className="divider-line"></div>

                            {/* AutoPlay Feature */}
                            <div className="settings-menu-option">
                                <p className="settings-menu-option-title">Auto Play</p>

                                {/* Checkbox Slider */}
                                <label className="switch">
                                    <input 
                                        type="checkbox" 
                                        onChange={handleAutoplay} // onChange fires after render phase is complete unlike, onClick
                                        checked={autoplayVideos}  // Bind the value of the checkbox to a state variable so we need not hold a reference to check on it
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            {/* Enable/Disable Subtitles Features */}
                            <div className="settings-menu-option">
                                {subtitlesOn ? (
                                    <p className="settings-menu-option-title">Disable Subtitles</p>
                                ) : (
                                    <p className="settings-menu-option-title">Enable Subtitles</p>
                                )}
                                

                                {/* Checkbox Slider */}
                                <label className="switch">
                                    <input 
                                        type="checkbox" 
                                        onChange={handleSubtitles}
                                        checked={subtitlesOn}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            {/* Playback Settings */}
                            <div className="settings-menu-option" onClick={() => handleSubMenuSelection("playback")}>
                                <p className="settings-menu-option-title">Playback Settings</p>
                                <span className="settings-menu-option-icon"> &gt; </span>
                            </div>


                        </div>
                        
                    )}

                    {/* Sub-Menus */}
                    {activeMenu === "subtitles" && (
                        // Pass menu-visible classs if curr submenu is active
                        <div className={`subtitles-menu ${activeMenu === "subtitles" ? 'menu-visible' : ''}`}>
                            {/* SubMenu Title */}
                            <div className="submenu-title">
                                <IconButton onClick={() => handleSubMenuSelection("main")} className="responsive-mediabar-container">
                                    <ArrowBackIcon className="responsive-mediabar-button" />
                                </IconButton>

                                <p>Subtitles</p>
                            </div>

                            <div className="divider-line"></div>

                            {/* {console.log(`animeSubtitles: ${animeSubtitles}`)} */}

                            {animeSubtitles ? (
                                animeSubtitles.map((track, index) => {
                                    // console.log(`Track: ${track} and ${track.file} Type: ${track.kind}`);
                                    if (track.kind === "captions") {
                                        // Found a valid subtitiles file, so return it
                                        return (
                                            <div className="settings-menu-option  option-selector" key={index} onClick={() => handleSubtitlesChange(track)}>
                                                <li className="settings-menu-option-title" >
                                                    { track.label }
                                                </li>

                                                {/* Show a checkmark only if this is the current selected subtitles */}
                                                {subtitlesOn && selectedSubtitles === track ? (
                                                    <IconButton className="responsive-mediabar-container">
                                                        <CheckCircleIcon className="responsive-mediabar-button" />
                                                    </IconButton>
                                                ): null}
                                            </div>
                                        );
                                    } else {
                                        // console.log("No Captions");
                                        return null;
                                    }
                                })
                            ) : (
                                <p>No Subtitles Available</p>
                            )}
                        </div>
                    )}
                    
                    {/* Playback Settings */}
                    {activeMenu === "playback" && (
                        <div className={`playback-menu ${activeMenu === "playback" ? 'menu-visible' : ''}`}>
                            {/* SubMenu Title */}
                            <div className="submenu-title" onClick={() => handleSubMenuSelection("main")}>
                                <IconButton className="responsive-mediabar-container">
                                    <ArrowBackIcon className="responsive-mediabar-button" />
                                </IconButton>

                                <p>Playback Settings</p>
                            </div>

                            <div className="divider-line"></div>

                            {/* Playback Speed */}
                            <p>Playback Speed</p>
                            <div className="submenu-row">
                                {/* The Speed Bar itself */}
                                <div className="speed-bar">
                                    {/* Each of the speed options */}
                                    <div 
                                        onClick={() => {handlePlaybackSpeed(0.25)}}
                                        className={`speed-option ${playbackSpeed === 0.25 ? "selected" : ""}`}
                                    >0.25x</div>
                                    <div 
                                        onClick={() => {handlePlaybackSpeed(0.5)}} 
                                        className={`speed-option ${playbackSpeed === 0.5 ? "selected" : ""}`}
                                    >0.5x</div>
                                    <div 
                                        onClick={() => {handlePlaybackSpeed(1.0)}} 
                                        className={`speed-option ${playbackSpeed === 1.0 ? "selected" : ""}`}
                                    >1.0x</div>
                                    <div 
                                        onClick={() => {handlePlaybackSpeed(1.5)}}
                                        className={`speed-option ${playbackSpeed === 1.5 ? "selected" : ""}`}
                                    >1.5x</div>
                                    <div 
                                        onClick={() => {handlePlaybackSpeed(2.0)}}
                                        className={`speed-option ${playbackSpeed === 2.0 ? "selected" : ""}`}
                                    >2.0x</div>
                                </div>
                            </div>
                        </div>
                            )}


                    {activeMenu === "quality" && (

                        <ul className={`quality-menu ${activeMenu === "quality" ? "menu-visible" : ""}`}>
                            {/* SubMenu Title */}
                            <div className="submenu-title" onClick={() => handleSubMenuSelection("main")}>
                                <IconButton className="responsive-mediabar-container">
                                    <ArrowBackIcon className="responsive-mediabar-button" />
                                </IconButton>

                                <p>Quality</p>
                            </div>

                            <div className="divider-line"></div>

                            {/* <li onClick={() => handleSubMenuSelection("main")} className="">&lt; Quality (videoQuality)</li> */}
                            {videoQuality.map((qualityLevel, index) => (

                                // Show the available video quality based on the heights
                                <div className="settings-menu-option  option-selector" key={index}>
                                    <li className="settings-menu-option-title" onClick={() => handleStreamQualityChange(qualityLevel.height)}>
                                        { qualityLevel.height }p
                                    </li>
                                    {/* {console.log(`qualityLevel.height: ${qualityLevel.height} currVideoQuality: ${currVideoQuality}`)} */}

                                    {/* Add a tick icon beside the currently selected quality level */}
                                    {qualityLevel.height === currVideoQuality && (
                                        <IconButton className="responsive-mediabar-container">
                                            <CheckCircleIcon className="responsive-mediabar-button" />
                                        </IconButton>
                                    )}
                                </div>
                            ))}
                            
                            <div className="divider-line"></div>
                        </ul>
                    )}
                </div>
            </div>
</>
    )
}