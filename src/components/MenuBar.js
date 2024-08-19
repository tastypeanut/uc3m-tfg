import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import EmailIcon from '@mui/icons-material/Email';
import CopyrightTwoToneIcon from '@mui/icons-material/CopyrightTwoTone';

const MenuBar = ({ onMenuSelect }) => {
    const [openDrawer, setOpenDrawer] = useState(false);

    const toggleDrawer = () => {
        setOpenDrawer(!openDrawer);
    };

    const pages = [
        { name: 'Estadísticas', icon: <AssessmentIcon /> },
        { name: 'Acerca De', icon: <HelpCenterIcon /> },
        { name: 'Contacto', icon: <EmailIcon /> },
        { name: 'Aviso Legal', icon: <CopyrightTwoToneIcon /> },
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <AppBar position="static" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="" //TODO: Add a proper href
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                //letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            INESTAT.com
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                onClick={toggleDrawer}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="" //TODO: Add a proper href
                            sx={{
                                mr: 4.5,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                //letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            INESTAT.com
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (
                                <Button
                                    key={page.name}
                                    onClick={() => onMenuSelect(page.name)}
                                    sx={{ p: 2, color: 'white'}}
                                    startIcon={page.icon}
                                    variant="outlined"
                                >
                                    {page.name}
                                </Button>
                            ))}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            {openDrawer && (
                <Box>
                    <Drawer
                        variant="temporary"
                        anchor="top"
                        open={openDrawer}
                        onClose={toggleDrawer}
                        sx={{
                            '& .MuiDrawer-paper': {
                                position: 'fixed',
                                xs: { paddingTop: '48px' }, //DO NOT CHANGE, workaround to fit the app bar on top.
                                sm: { paddingTop: '64px' }, //DO NOT CHANGE, workaround to fit the app bar on top.
                            },
                        }}
                    >
                        <List sx={{ width: '100%' }}>
                            {pages.map((page, index) => (
                                <React.Fragment key={page.name}>
                                    <ListItem>
                                        <ListItemButton onClick={() => {
                                            toggleDrawer();
                                            onMenuSelect(page.name);
                                        }}>
                                        <ListItemIcon>
                                                {page.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={page.name} />
                                        </ListItemButton>
                                    </ListItem>
                                    {index < pages.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Drawer>
                </Box>
            )}
        </Box>
    );
};

export default MenuBar;
