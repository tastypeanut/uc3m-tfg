import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import MenuBar from "./components/MenuBar";
import StatisticsToolPage from "./components/StatisticsToolPage";
import Footer from "./components/Footer";

function App() {
    const [currentPage, setCurrentPage] = useState('Statistics');

    const renderPageContent = () => {
        switch (currentPage) {
            case 'Statistics':
                return <StatisticsToolPage />;
            case 'About':
                return <AboutPage/>;
            case 'Contact':
                return <ContactPage/>;
            case 'Legal':
                return <LegalPage />;
            default:
                return <StatisticsToolPage/>;
        }
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                }}
            >
                <MenuBar onMenuSelect={setCurrentPage} />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        py: 2,
                        px: { xs: 2, sm: 4 }, // No padding on xs, 3 units of padding on sm and above
                    }}
                >
                    {renderPageContent()}
                </Box>
                <Footer/>
            </Box>
        </React.Fragment>
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
