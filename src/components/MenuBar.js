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
import Grid2 from "@mui/material/Unstable_Grid2";
import InsightsIcon from '@mui/icons-material/Insights';

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
                    <Toolbar disableGutters sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                        <Grid2 // Desktop
                            container
                            xs={12}
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                justifyContent: 'space-between', // Distribute space between the two items
                                alignItems: 'center',
                            }}
                        >
                            <Grid2
                                item
                                xs="auto"
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    mr: 'auto', // Ensures the rest of the content centers by pushing it to the right
                                }}
                            >
                                <IconButton
                                    size="large"
                                    onClick={toggleDrawer}
                                    color="inherit">
                                    <MenuIcon />
                                </IconButton>
                            </Grid2>
                            <Grid2
                                item
                                xs="auto"
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexGrow: 1,
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    noWrap
                                    component="a"
                                    href="" // TODO: Add a proper href
                                    sx={{
                                        fontFamily: 'monospace',
                                        fontWeight: 700,
                                        color: 'inherit',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <InsightsIcon
                                        fontSize="large"
                                        sx={{
                                            verticalAlign: 'middle', // Align the icon vertically (might not be necessary)
                                            marginRight: 1,          // Adjust spacing between icon and text
                                        }}
                                        color="inherit"
                                    />
                                    INESTAT.com
                                </Typography>
                            </Grid2>
                        </Grid2>
                        <Grid2 // Desktop
                            container
                            xs={12}
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                justifyContent: 'space-between', // Distribute space between the two items
                                alignItems: 'center',
                            }}
                        >
                            <Grid2
                                item
                                xs="auto"
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    noWrap
                                    component="a"
                                    href="" // TODO: Add a proper href
                                    sx={{
                                        fontFamily: 'monospace',
                                        fontWeight: 700,
                                        color: 'inherit',
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <InsightsIcon
                                        fontSize="large"
                                        sx={{
                                            verticalAlign: 'middle', // Align the icon vertically
                                            marginRight: 1, // Adjust spacing between icon and text
                                        }}
                                        color="inherit"
                                    />
                                    INESTAT.com
                                </Typography>
                            </Grid2>

                            <Grid2
                                item
                                xs="auto"
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                }}
                            >
                                <Box sx={{ display: 'flex' }}>
                                    {pages.map((page) => (
                                        <Button
                                            key={page.name}
                                            onClick={() => onMenuSelect(page.name)}
                                            sx={{ px: 2, color: 'white', textTransform: 'none' }} // `textTransform: 'none'` preserves original text case
                                            startIcon={page.icon}
                                            size={'large'}
                                        >
                                            {page.name}
                                        </Button>
                                    ))}
                                </Box>
                            </Grid2>
                        </Grid2>
                    </Toolbar>
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
