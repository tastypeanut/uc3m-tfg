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
            style={{ height: '100%', textAlign: 'center', padding: theme.spacing(2) }}
        >
            <img src={NoDataImage} alt="No data" style={{ width: '50%', opacity: 0.5, marginBottom: theme.spacing(2) }} />
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
