import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Button, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';

const MenuBar = ({ onMenuSelect }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handlePageChange = (newPage) => {
        onMenuSelect(newPage);
        handleMenuClose();
    };

    return (
        <AppBar position="static">
            <Toolbar>
                {isSmallScreen ? (
                    <React.Fragment>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleMenuOpen}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={() => handlePageChange('Statistics')}>Estadísticas</MenuItem>
                            <MenuItem onClick={() => handlePageChange('About')}>Acerca de</MenuItem>
                            <MenuItem onClick={() => handlePageChange('Contact')}>Contacto</MenuItem>
                            <MenuItem onClick={() => handlePageChange('Legal')}>Aviso Legal</MenuItem>
                        </Menu>
                        <Typography variant="h6" style={{ flexGrow: 1 }}>
                            Mi Aplicación
                        </Typography>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Typography variant="h6" style={{ flexGrow: 1 }}>
                            Mi Aplicación
                        </Typography>
                        <Button color="inherit" onClick={() => handlePageChange('Statistics')}>
                            Estadísticas
                        </Button>
                        <Button color="inherit" onClick={() => handlePageChange('About')}>
                            Acerca de
                        </Button>
                        <Button color="inherit" onClick={() => handlePageChange('Contact')}>
                            Contacto
                        </Button>
                        <Button color="inherit" onClick={() => handlePageChange('Legal')}>
                            Aviso Legal
                        </Button>
                    </React.Fragment>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default MenuBar;
