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
                height: '30vh',
                background: 'linear-gradient(45deg, #3f51b5, #4db6ac)', // Gradiente con verde aqua intermedio
                backgroundSize: '400% 400%',
                animation: 'gradientFlow 10s ease infinite',
                color: 'white',
                textAlign: 'center',
                padding: '20px',
                '@keyframes gradientFlow': {
                    '0%': {
                        backgroundPosition: '0% 0%'
                    },
                    '50%': {
                        backgroundPosition: '100% 100%'
                    },
                    '100%': {
                        backgroundPosition: '0% 0%'
                    }
                }
            }}
        >


        <Typography
                variant="h2"
                sx={{
                    fontWeight: 'bold',
                    margin: '10px',
                }}
            >
                Estadísticas al alcance de{' '}
                <span
                    style={{
                        position: 'relative',
                        display: 'inline-block',
                    }}
                >
                <span
                    style={{
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                  todos
                </span>
                <span
                    style={{
                        position: 'absolute',
                        bottom: '-2px', // Ajusta este valor para aumentar/disminuir el espacio
                        left: 0,
                        width: '100%',
                        height: '4px', // Grosor del subrayado
                        backgroundColor: 'white', // Color del subrayado
                    }}
                />
              </span>
            </Typography>
            <Typography variant="h6" sx={{
                fontWeight: 'medium',
                margin: '10px',
            }}>
                Explora los datos del INE, analiza tendencias y realiza consultas personalizadas con datos en tiempo real
            </Typography>
            <Typography variant="h5" sx={{
                fontWeight: 'bold',
                margin: '10px',
            }}>
                Todo desde una sola plataforma
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