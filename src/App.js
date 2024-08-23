import React from 'react';
import { Box } from '@mui/material';
import MenuBar from "./components/MenuBar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

function App() {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateRows: 'auto 1fr auto',
                minHeight: '100vh',
            }}
        >
            <MenuBar/>
            <Box>
                <Outlet/>
            </Box>
            <Footer/>
        </Box>
    );
}

export default App;
