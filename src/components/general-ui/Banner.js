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
                //height: '35vh',
                background: 'linear-gradient(#3f51b5, #2196f3)', // Gradiente de fondo llamativo
                //background: '#3f51b5', // Gradiente de fondo llamativo
                color: 'white',
                textAlign: 'center',
                pt: '2rem',
                pb: '4rem',
                px: '0.7rem',
                mb: '2rem',
                clipPath: 'polygon(100% 0%, 0% 0% , 0.00% 99.20%, 2.00% 98.54%, 4.00% 97.73%, 6.00% 96.78%, 8.00% 95.73%, 10.00% 94.63%, 12.00% 93.50%, 14.00% 92.39%, 16.00% 91.33%, 18.00% 90.37%, 20.00% 89.54%, 22.00% 88.87%, 24.00% 88.38%, 26.00% 88.08%, 28.00% 88.00%, 30.00% 88.13%, 32.00% 88.47%, 34.00% 89.00%, 36.00% 89.71%, 38.00% 90.58%, 40.00% 91.56%, 42.00% 92.63%, 44.00% 93.75%, 46.00% 94.88%, 48.00% 95.97%, 50.00% 97.00%, 52.00% 97.92%, 54.00% 98.70%, 56.00% 99.32%, 58.00% 99.74%, 60.00% 99.97%, 62.00% 99.98%, 64.00% 99.78%, 66.00% 99.37%, 68.00% 98.78%, 70.00% 98.01%, 72.00% 97.11%, 74.00% 96.09%, 76.00% 95.00%, 78.00% 93.87%, 80.00% 92.75%, 82.00% 91.67%, 84.00% 90.68%, 86.00% 89.80%, 88.00% 89.07%, 90.00% 88.52%, 92.00% 88.16%, 94.00% 88.01%, 96.00% 88.06%, 98.00% 88.33%, 100.00% 88.80%)'
            }}
        >
        <Typography
                variant="h3"
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
            <Typography variant="h5" sx={{
                fontWeight: '300',
                lineHeight: '2rem',
                padding: '2rem',
            }}>
                Explora los datos del INE, analiza tendencias y realiza consultas personalizadas con datos en tiempo real.
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