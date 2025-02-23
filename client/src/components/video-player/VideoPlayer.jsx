import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import CustomVideoPlayer from './CustomVideoPlayer';
import "./VideoPlayer.css";

/**
 * Function to load and stream a particular anime based on videoUrl
 * @param {String} videoUrl @param {Integer} episodeNumber @param {Integer} lastEpisode @param {JSON} episodeSources
 * episodeSources contains all the streaming links for various video qualities
 * @returns 
 */
export default function VideoPlayer({ episodeUrl, episodeNumber, lastEpisode, episodeSources, setEpisodeUrl, animeSubtitles }) {
    // Hoisting the Loading State up so that the loader covers the video and next and prev episode button
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const { pathname } = location;
    const currEpisode = episodeNumber;

    // // Extract the current episode number
    // const regexMatch = episodeId.match(/episode-(\d+)/);
    // // Check if there is a match
    // if (regexMatch && regexMatch[1]) {
    //     currEpisode = regexMatch[1];
    // }

    // Set the episode numbers
    const prevEp = parseInt(currEpisode, 10) - 1;
    const nextEp = parseInt(currEpisode, 10) + 1;

    // Function to replace episode number in pathname
    const replaceEpisodeNumUrl = (pathname, episodeNum) => {
        return pathname.replace(/episode-\d+/, `episode-${episodeNum}`);
    };

    // Replace episode number with prevEp and nextEp
    const prevEpUrl = replaceEpisodeNumUrl(pathname, prevEp);
    const nextEpUrl = replaceEpisodeNumUrl(pathname, nextEp);

    // console.log('Previous Episode URL:', prevEpUrl);
    // console.log('Next Episode URL:', nextEpUrl);

    return (
        <div className='video-player-container'>
            {/* Render Next & Prev Ep with Video if only loading is stopped */}
            {!loading && (
                <div className='video-player-buttons-container'>
                    <div>
                        {prevEp >= 1 ? (
                            <Link to={prevEpUrl} className='text-left'>
                                <button className='episode-btn'>
                                    &larr; Episode {prevEp}
                                </button>
                            </Link>
                        ) : (
                            <></>
                            // <p className='text-left'>No prev episode</p>
                        )}
                    </div>
                    <div>
                        {nextEp <= lastEpisode ? (
                            <Link to={nextEpUrl} className='text-right'>
                                <button className='episode-btn'>
                                    Episode {nextEp} &rarr;
                                </button>
                            </Link>
                        ) : (
                            <></>
                            // <p className='text-right'>No next episode</p>
                        )}
                    </div>
                </div>
            )}

            {/* Cannot be wrapped with loading since we need video to be loaded to change the useState. Also within got logic to handle alr */}
            <div className='custom-video-container'>
                <CustomVideoPlayer 
                    episodeNumber={episodeNumber} 
                    episodeUrl={episodeUrl} 
                    controls={false} 
                    loop={false}
                    loading={loading}
                    setLoading={setLoading} 
                    episodeSources={episodeSources}
                    // Pass the setter to change the episodeURL as well
                    setEpisodeUrl={setEpisodeUrl}
                    animeSubtitles={animeSubtitles}
                />
            </div>
                
        </div>
    );
}