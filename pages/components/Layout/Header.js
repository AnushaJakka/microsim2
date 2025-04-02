import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton } from '@mui/material';
import Image from 'next/image';

const Header = () => {
  return (
    <AppBar 
      position="static" 
      color="transparent" 
      elevation={0}
      sx={{ 
        bgcolor: 'white', 
        boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
        py: 1
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Left Side */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}>
              <Image
                src="/MicroSim Learning Logo-Black.png"
                alt="Logo"
                width={30}
                height={30}
              />
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  color: 'black'
                }}
              >
                MicroSim Learning
              </Typography>
            </Box>
          </Box>

          {/* Right Side */}
          <Box sx={{ display: 'flex', gap: 2 }}>
          <button className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-sm">
         Help
       </button>
            <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg text-sm">
         Sign In
       </button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;