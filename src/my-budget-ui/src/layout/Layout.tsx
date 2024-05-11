import { FC, ReactNode } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material';

interface IProps {
  children: ReactNode;
}

const Layout: FC<IProps> = ({ children }) => {
  const menuItems = [
    { label: 'Report', link: '/' },
    { label: 'Rules configuration', link: '/rules' },
    { label: 'MCC', link: '/mcc' },
  ];

  return (
    <>
      <AppBar position="static">
        <Container maxWidth={'md'}>
          <Toolbar>
            {menuItems.map((menuItem) => (
              <Button key={menuItem.label} color="inherit" href={menuItem.link}>
                {menuItem.label}
              </Button>
            ))}
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth={'md'}>
        {children}
      </Container>
    </>
  );
}

export default Layout;