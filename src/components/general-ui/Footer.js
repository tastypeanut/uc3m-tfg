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
            }}
        >
            <Typography variant="body2" color="text.secondary" align="center">
                <Link color="inherit" href="/public">
                    inestat.com
                </Link>{' © '}
                {new Date().getFullYear()}
                {' - Todos los derechos reservados.'}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" fontStyle="italic">
                nani gigantum humeris insidentes
            </Typography>
        </Box>
    );
};

export default Footer;
