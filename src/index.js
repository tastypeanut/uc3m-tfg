import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material";
import { createBrowserRouter, redirect, RouterProvider} from "react-router-dom";
import ErrorPage from "./ErrorPage";
import StatisticsToolPage from "./components/StatisticsToolPage";

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
