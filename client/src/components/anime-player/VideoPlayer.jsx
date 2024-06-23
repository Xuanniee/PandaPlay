import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Link, useLocation } from 'react-router-dom';

/**
 * Function to load and stream a particular anime based on videoUrl
 * @param {String} videoUrl 
 * @returns 
 */
export default function VideoPlayer({ episodeUrl, episodeId, lastEpisode }) {
    const location = useLocation();
    const { pathname } = location;
    var currEpisode = null;
    console.log(`last number ${lastEpisode}`);

    // Extract the current episode number
    const regexMatch = episodeId.match(/episode-(\d+)/);
    // Check if there is a match
    if (regexMatch && regexMatch[1]) {
        currEpisode = regexMatch[1];
    }

    // Set the episode numbers
    const prevEp = parseInt(currEpisode, 10) - 1;
    const nextEp = parseInt(currEpisode, 10) + 1;
    // Function to replace episode number in pathname
    const replaceEpisodeNumber = (pathname, episodeNumber) => {
        return pathname.replace(/episode-\d+/, `episode-${episodeNumber}`);
    };

    // Replace episode number with prevEp and nextEp
    const prevEpUrl = replaceEpisodeNumber(pathname, prevEp);
    const nextEpUrl = replaceEpisodeNumber(pathname, nextEp);

    console.log('Previous Episode URL:', prevEpUrl);
    console.log('Next Episode URL:', nextEpUrl);

    // return(
    //     <>
    //         <div className='container-fluid'>
    //             <div className='row'>
    //                 <div className='col text-left'>
    //                     {/** TODO Add next episode and previous episode */}
    //                     {prevEp >= 1 ? (
    //                         <Link to={prevEpUrl}>&larr; Episode {prevEp}</Link>
    //                     ) : (
    //                         <p>No prev ep</p>
    //                     )}
    //                 </div>
    //                 <div className='col text-right'>
    //                     {nextEp <= lastEpisode ? (
    //                         <Link to={nextEpUrl}>Episode {nextEp} &rarr;</Link>
    //                     ) : (
    //                         <p>No next ep</p>
    //                     )}
    //                 </div>    
    //             </div>

    //             <div className='col'>
    //                 <ReactPlayer key={episodeId} url={episodeUrl} controls={true} loop={false} />
    //             </div>
    //         </div>
    //     </>
    // );
    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col'>
                    {prevEp >= 1 ? (
                        <Link to={prevEpUrl} className='text-left'>&larr; Episode {prevEp}</Link>
                    ) : (
                        <p className='text-left'>No prev episode</p>
                    )}
                </div>
                <div className='col'>
                    <div className='row justify-content-end'>
                        <div className='col-auto'>
                            {nextEp <= lastEpisode ? (
                                <Link to={nextEpUrl} className='text-right'>Episode {nextEp} &rarr;</Link>
                            ) : (
                                <p className='text-right'>No next episode</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className='row'>
                <div className='col'>
                    <ReactPlayer key={episodeId} url={episodeUrl} controls={true} loop={false} />
                </div>
            </div>
        </div>
    );
}