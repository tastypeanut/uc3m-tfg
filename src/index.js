import React, {Profiler} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material";
import { createBrowserRouter, redirect, RouterProvider} from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import StatisticsToolPage from "./pages/StatisticsToolPage";
import './index.css';
import {esES} from "@mui/material/locale";


const theme = createTheme({
    palette: {
        primary: {
            main: '#3f51b5', // Customize primary color
        },
        secondary: {
            main: '#f50057', // Customize secondary color
        },
        background: {
            default: '#f0f0f0', // Customize default background color
        },
    },
    esES, //THIS SETS MUI COMPONENT LANGUAGE TO SPANISH
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                // This will redirect from "/" to "/search"
                index: true,  // Indicates that this is the default child route when path is "/"
                loader: () => redirect('/search'), // Redirects to /search
            },
            {
                path: "search",
                element: <StatisticsToolPage />,
            },
            {
                path: "about",
                element: <StatisticsToolPage />,
            },
            {
                path: "contact",
                element: <StatisticsToolPage />,
            },
            {
                path: "legal",
                element: <StatisticsToolPage />,
            },
        ],
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        <RouterProvider router={router}/>
    </ThemeProvider>
);