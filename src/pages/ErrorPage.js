import React from "react";
import { useRouteError } from "react-router-dom";
import MenuBar from "../components/general-ui/MenuBar";
import Footer from "../components/general-ui/Footer";
import { Box, Typography, Container } from "@mui/material";

export default function ErrorPage() {
    const error = useRouteError();
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateRows: 'auto 1fr auto',
                minHeight: '100vh',
                maxWidth: '100vw',
            }}
        >
            <MenuBar />
            <Container
                sx={{
                    maxWidth: '100vw',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                <Box sx={{
                    textAlign: 'center',
                    maxWidth: '100vw'
                }}>
                    <Typography variant="h2" component="h1" gutterBottom>
                        ¡Vaya!
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Ha ocurrido un error
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
