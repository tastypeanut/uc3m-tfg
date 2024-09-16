import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Banner = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                //height: '30vh',
                background: 'linear-gradient(135deg, #3f51b5, #2196f3)', // Gradiente de fondo llamativo
                color: 'white',
                textAlign: 'center',
                padding: '20px',
            }}
        >
            <Typography variant="h2" sx={{
                fontWeight: 'bold',
                margin: '10px',
            }}>
                Acceso fácil a datos estadísticos del INE
            </Typography>
            <Typography variant="h6" sx={{
                fontWeight: 'medium',
                margin: '10px',
            }}>
                Explora tendencias y realiza consultas personalizadas con datos en tiempo real.
            </Typography>

            {/*
            <Button
                variant="contained"
                size="large"
                sx={{
                    backgroundColor: '#ff4081', // Color de botón llamativo
                    color: '#fff',
                    padding: '10px 20px',
                    fontSize: '16px',
                    '&:hover': {
                        backgroundColor: '#f50057',
                    },
                }}
            >
                Comienza tu consulta
            </Button>*/}
        </Box>
    );
};

export default Banner;