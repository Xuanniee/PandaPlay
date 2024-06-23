import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import AnimeProfilePage from "./pages/AnimeProfilePage";
import AnimePlayerPage from "./pages/AnimePlayerPage";
import AnimeSearchResultsPage from "./pages/AnimeSearchResultsPage";

// Create a Client Router
const clientRouter = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
    },
    {
        // Pass the animeId through the URL
        path: "/anime-info/:animeId",
        element: <AnimeProfilePage />,
    },
    {
        path: "/:animeId/:episodeId/:lastEpisode",
        element: <AnimePlayerPage />
    },
    {
        path: "/search/:searchQuery",
        element: <AnimeSearchResultsPage />
    }
]);

export { clientRouter };