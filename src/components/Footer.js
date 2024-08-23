import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 2,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
            }}
        >
            <Typography variant="body2" color="text.secondary" align="center">
                {'© '}
                <Link color="inherit" href="">
                    Mi Aplicación
                </Link>{' '}
                {new Date().getFullYear()}
                {'. Derechos blabla.'}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
                nani gigantum humeris insidentes
            </Typography>
        </Box>
    );
};

export default Footer;
