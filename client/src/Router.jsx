import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";

import AnimeLandingPage from "./pages/AnimeLandingPage";
import AnimeProfilePage from "./pages/AnimeProfilePage";
import AnimePlayerPage from "./pages/AnimePlayerPage";
import AnimeSearchResultsPage from "./pages/AnimeSearchResultsPage";

// Create a Client Router
const clientRouter = createBrowserRouter([
    {
        path: "/",
        element: <AnimeLandingPage />,
    },
    {
        // Pass the animeId through the URL
        path: "/anime-info/:animeId",
        element: <AnimeProfilePage />,
    },
    {
        path: "/:animeId/:episodeNumber/:lastEpisode",
        element: <AnimePlayerPage />
    },
    {
        path: "/search/:searchQuery",
        element: <AnimeSearchResultsPage />
    }
]);

export { clientRouter };