import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import NoDataImage from './frogs.webp'; // Adjust the path as needed

function NoDataLanding() {
    const theme = useTheme();

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <img src={NoDataImage} alt="No data" loading="lazy" style={{ width: '50vh', opacity: 0.5, marginBottom: theme.spacing(2) }} />
            <Typography variant="h6" color="textSecondary">
                ¡Vaya! Parece que todavía no hay datos...
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
                ¡Prueba a hacer una consulta!
            </Typography>
        </Box>
    );
}

export default NoDataLanding;
