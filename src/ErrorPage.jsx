import React from "react";
import { Outlet, useRouteError } from "react-router-dom";
import MenuBar from "./components/MenuBar";
import Footer from "./components/Footer";
import { Box, Typography, Container } from "@mui/material";

export default function ErrorPage() {
    const error = useRouteError();
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <MenuBar/>
            <Container
                component="main"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                <Box>
                    <Typography variant="h2" component="h1" gutterBottom>
                        ¡Vaya!
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Ha ocurrido un error.
                    </Typography>
                    {error.status && (
                        <Typography variant="h4" gutterBottom>
                            {error.status}
                        </Typography>
                    )}
                    <Typography variant="body2" color="textSecondary">
                        <i>{error.statusText || error.message}</i>
                    </Typography>
                </Box>
            </Container>
            <Footer/>
        </Box>
    );
}
