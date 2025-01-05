import React from "react";
import SettingsApplicationsTwoToneIcon from '@mui/icons-material/SettingsApplicationsTwoTone';
import { IconButton } from '@mui/material';

import './SettingsButton.css';

export default function SettingsButton({ 
    activeMenu, 
    setActiveMenu, 
    isSettingsVisible, 
    setIsSettingsVisible, 
    videoQuality, 
    setVideoQuality,
    setEpisodeUrl,
    episodeSources
}) {
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
</>
    )
}