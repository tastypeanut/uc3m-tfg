import React from 'react';
import { Box } from '@mui/material';
import MenuBar from "./components/general-ui/MenuBar";
import Footer from "./components/general-ui/Footer";
import { Outlet } from "react-router-dom";
import TableDisplay from "./components/display/TableDisplay";

function App() {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateRows: 'auto 1fr auto',
                minHeight: '100vh',
                maxWidth: '100vw',
            }}
        >
            <MenuBar/>
            <Box
                sx={{
                    maxWidth: '100vw',
                }}
            >
                <Outlet/>
            </Box>
            <Footer/>
        </Box>
    );
}

export default App;
