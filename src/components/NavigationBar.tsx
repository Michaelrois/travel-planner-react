import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import avatarImage from '../icons8-circled-u-50.png';
import { signOut } from 'aws-amplify/auth';
import { DataStore } from '@aws-amplify/datastore';
import {UserProfile} from '../models';
import { getCurrentUser } from 'aws-amplify/auth';
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";


const pages = [
    {
        title: 'Editor',
        href: '/edit'
    }
];

const handleSignOut = async () => {
    try {
        await signOut();
    } catch (error) {
        console.log('error signing out: ', error);
    }
};

const settings = [
    {
        name: 'Profile',
        callback: () => {
            // Handle opening the submenu
        }
    },
    {
        name: 'Account',
        callback: () => {
            window.location.href = '/account';
        }
    },
    {
        name: 'Dashboard',
        callback: () => {
            window.location.href = '/dashboard';
        }
    },
    {
        name: 'Logout',
        callback: handleSignOut
    }
];


function NavigationBar() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [anchorElProfile, setAnchorElProfile] = React.useState<null | HTMLElement>(null);
    const [hasUserProfile, setHasUserProfile] = React.useState<boolean>(false);
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const checkUserProfile = async () => {
            try {
                const currentUser = await getCurrentUser();
                if (!currentUser || !currentUser.username) {
                    throw new Error("User not found");
                }

                const userProfiles = await DataStore.query(UserProfile);
                setHasUserProfile(userProfiles.length > 0);
            } catch (error) {
                console.error("Error fetching user profile: ", error);
            }
        };
        checkUserProfile();
    }, []);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    function handleClose() {
        setOpen(false);
    }

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleOpenProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElProfile(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleCloseProfileMenu = () => {
        setAnchorElProfile(null);
    };

    const profileSubmenu = [
        {
            name: 'Create User Profile',
            callback: () => {
                window.location.href = '/createProfile';
            }
        },
        {
            name: 'Delete User Profile',
            callback: () => {
                handleCloseUserMenu();
                setOpen(true);
            }
        },
        {
            name: 'Go to Profile Page',
            callback: () => {
                window.location.href = '/profile';
            }
        }
    ];

    async function handleConfirmDelete(): Promise<void> {
        try {
            const userProfiles = await DataStore.query(UserProfile);
            if (userProfiles.length > 0) {
                const toDelete = userProfiles[0]; // Adjust this as needed to target the specific profile
                await DataStore.delete(toDelete);
                console.log('User profile deleted successfully');
            } else {
                console.log('User profile not found');
            }
            handleCloseUserMenu();
            setOpen(false);
            window.location.href = '/';
        } catch (error) {
            console.error('Error deleting user profile:', error);
        }
    }

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none'
                        }}
                    >
                        LOGO
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left'
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left'
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' }
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.title} onClick={() => (window.location.href = page.href)}>
                                    <Typography textAlign="center">{page.title}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none'
                        }}
                    >
                        LOGO
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.title}
                                onClick={() => (window.location.href = page.href)}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page.title}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="User avatar" src={avatarImage} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) =>
                                setting.name === 'Profile' ? (
                                    <MenuItem key={setting.name} onClick={handleOpenProfileMenu}>
                                        <Typography textAlign="center">{setting.name}</Typography>
                                    </MenuItem>
                                ) : (
                                    <MenuItem key={setting.name} onClick={setting.callback}>
                                        <Typography textAlign="center">{setting.name}</Typography>
                                    </MenuItem>
                                )
                            )}
                        </Menu>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="submenu-profile"
                            anchorEl={anchorElProfile}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            open={Boolean(anchorElProfile)}
                            onClose={handleCloseProfileMenu}
                        >
                            {profileSubmenu
                                .filter(subitem => !(subitem.name === 'Create User Profile' && hasUserProfile))
                                .map((subitem) => (
                                    <MenuItem key={subitem.name} onClick={subitem.callback}>
                                        <Typography textAlign="center">{subitem.name}</Typography>
                                    </MenuItem>
                                ))}
                        </Menu>
                        <ConfirmDeleteDialog
                            open={open}
                            onClose={handleClose}
                            onConfirm={handleConfirmDelete}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavigationBar;
