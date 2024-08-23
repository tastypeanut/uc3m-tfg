import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import MenuBar from "./components/MenuBar";
import StatisticsToolPage from "./components/StatisticsToolPage";
import Footer from "./components/Footer";
import Grid2 from "@mui/material/Unstable_Grid2";
import {Outlet} from "react-router-dom";

function App() {

    //Setting the default page as statistics
    const [currentPage, setCurrentPage] = useState('Estadísticas');

    // Map each page to its corresponding component
    const pages = {
        'Estadísticas': <StatisticsToolPage/>,
        'Acerca De': <AboutPage />,
        'Contacto': <ContactPage />,
        'Aviso Legal': <LegalPage />,
    };

    return (
        <>
            <style>
                {`
          bod * {
            border: 1px solid red; /* Adjust the color and thickness as needed */
          }
        `}
            </style>
            {/*
                <MenuBar onMenuSelect={setCurrentPage}/>
                {pages[currentPage]}
            */}
            <MenuBar/>
            <Outlet/>
        </>
    );
}

const AboutPage = () => (
    <div>
        <h1>Acerca de</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
);

const ContactPage = () => (
    <div>
        <h1>Contacto</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
);

const LegalPage = () => (
    <div>
        <h1>Aviso Legal</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
);

export default App;
