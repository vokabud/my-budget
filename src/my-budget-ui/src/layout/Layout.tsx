import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { FC, ReactNode } from 'react';
import { Container, Menu, MenuItem } from '@mui/material';

interface IProps {
  children: ReactNode;
}

const Layout: FC<IProps> = ({ children }) => {
  const menuItems = [
    { label: 'Report', link: '/' },
    { label: 'About', link: '/about' },
    { label: 'Contact', link: '/contact' },
  ];

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="sm">
          <Toolbar>
            {menuItems.map((menuItem) => (
              <Button key={menuItem.label} color="inherit" href={menuItem.link}>
                {menuItem.label}
              </Button>
            ))}
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="sm">
        {children}
      </Container>
    </>
  );
}

export default Layout;