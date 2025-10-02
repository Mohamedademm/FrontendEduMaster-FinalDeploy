import React from 'react';
import { AppBar, Toolbar, Typography, styled, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const HeaderContainer = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  marginBottom: '20px',
}));

const HeaderText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  color: theme.palette.common.white,
  marginLeft: '20px',
  flex: 1,
}));

const HeaderActions = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const AvatarStyled = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  marginLeft: '20px',
  cursor: 'pointer',
}));

const DHeader = ({ adminName, onToggleSidebar, avatarUrl }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  // Open menu
  const openMenu = (event) => setAnchorEl(event.currentTarget);

  // Close menu
  const closeMenu = () => setAnchorEl(null);

  // Navigate to Profile page when Avatar is clicked
  const handleProfileClick = () => {
    navigate('/Profile');
    closeMenu();
  };

  return (
    <HeaderContainer position="static">
      <Toolbar>
        {/* Menu Icon (Hamburger) */}
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={onToggleSidebar}>
          <MenuIcon />
        </IconButton>

        {/* Header Text */}
        <HeaderText variant="h6">Admin: {adminName}</HeaderText>

        {/* Header Actions - Avatar */}
        <HeaderActions>
          <AvatarStyled
            alt={adminName}
            src={avatarUrl || "/static/images/avatar/1.jpg"} 
            onClick={openMenu}
          />
        </HeaderActions>
      </Toolbar>

      {/* Menu for Avatar */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
        <MenuItem onClick={closeMenu}>Settings</MenuItem>
        <MenuItem onClick={closeMenu}>Logout</MenuItem>
      </Menu>
    </HeaderContainer>
  );
};

export default DHeader;
