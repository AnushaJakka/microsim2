import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, FormControl, Grid, IconButton, InputLabel, OutlinedInput, Paper, Typography, Snackbar, Alert, Select, MenuItem, Stack } from '@mui/material';

import { Link as MuiLink } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';

const Register = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phonenumber, setPhonenumber] = React.useState('');
  const [dateOfBirth, setDateOfBirth] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = React.useState(false);
  const [confPassword, setConfPassword] = React.useState('');
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [waiting, setwaiting] = React.useState(false);
  // const [showConfPassword, setShowConfPassword] = React.useState(false);
  // const [countryCode, setCountryCode] = React.useState('+91'); // Default country code with type

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const navigate = useRouter();
  // const handleClickShowConfPassword = () => setShowConfPassword((show) => !show);

  const validateEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateDateOfBirth = (date) => {
    // Check if the entered date matches the format yyyy-mm-dd and is between 2009 and now
    const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
    const match = date.match(dateRegex);

    if (!match) return false;

    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);
    const now = new Date();

    if (year > 2009 || year > now.getFullYear()) return false;
    if (month < 1 || month > 12) return false;

    const lastDayOfMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > lastDayOfMonth) return false;

    return true;
  };

  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!firstName || !lastName || !email || !password   || !dateOfBirth || !gender ) {
      setSnackbarMessage('Please fill in all fields.');
      setOpenSnackbar(true);
    } else if (!validateEmail(email)) {
      setSnackbarMessage('Please enter a valid email address.');
      setOpenSnackbar(true);
    } else if (!validateDateOfBirth(dateOfBirth)) {
      setSnackbarMessage('Please enter a valid date of birth (YYYY-MM-DD) above 2009 ');
      setOpenSnackbar(true);
    } else {
      try {
        const response = await axios.post('https://micro-sim-backend.vercel.app/api/register/', {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          // password: confPassword,
          // phone_number: phonenumber,
          date_of_birth: dateOfBirth,
          gender,
        });
        if (response.status === 201 || response.status === 200) {
          setSnackbarMessage('Verification Link Sent To Your Mail!');
          setOpenSuccessSnackbar(true);
          setwaiting(false);
          setTimeout(() => navigate.push("/login"), 3000);
        }
      } catch (error) {
        setwaiting(false);
        setSnackbarMessage(error.response?.data?.error);
        setOpenSnackbar(true);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setOpenSuccessSnackbar(false);
  };

    return (
      <Box  sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Stack flexDirection={"row"} justifyContent={"center"} alignItems={"center"} spacing={2}
        sx={{ 
          display: { md: "none", xs: "flex" },
          py: 2,
          px: 1
        }}>
          <img src='/static/images/MicroSim Learning Logo-Black.png' alt ="logo" width={60} />
        <Typography fontSize={{ md: "20", xs: 25 }}  fontWeight={"bold"} my={3} >
        MicroSim Learning
        </Typography>
      </Stack>
  
       <Grid container alignItems={"center"} >
               <Grid md={6} sx={{
                   display: { xs: "none", md: "flex" },
                   justifyContent: "center",
                   alignItems: "center",
                   height: '100%'
                 }}>
                 <Stack 
                   direction="row" 
                   alignItems="center"
                   spacing={2}
                   sx={{ 
                     maxWidth: 500,
                     width: '100%',
                     px: 4
                   }}
                 >
                   <img src='/static/images/MicroSim Learning Logo-Black.png' alt ="logo" width={90} height={90}/>
                   <Typography fontSize={28} fontWeight={"bold"} padding={2} >MicroSim Learning</Typography>
                 </Stack>
               </Grid>
                <Grid 
                 item 
                 xs={12} 
                 md={6}
                 sx={{
                   display: 'flex',
                   justifyContent: 'center',
                   alignItems: 'center',
                   p: { xs: 2, md: 2 },
                   marginLeft: { xs: 0, sm: 20, md: 38 }
                 }}
               >
            <Paper
              elevation={3}
              sx={{
                display: "flex",
                justifyContent: 'center',
                flexDirection: "column",
                alignItems: "center",
                mt: { md: "10%", xs: "0" },
                mb: { md: "10%", xs: "25%" },
                mr:{md:"20", xs:"30%"},
                p: 3,
                mx: {xs:"5%",md:'auto'},
                width: {md: 420, sm: 380, xs: 360},
                boxShadow:10
              }}
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <Typography fontSize={{ md: "20", xs: 25 }} textAlign={"center"} fontWeight={"bold"} my={3}>
                Create a new account
              </Typography>
  
              {/* Form Content */}
              <Grid container spacing={2} mb={2} >
              <Grid size={6}>
                  <TextField
                    fullWidth
                    id="FirstName"
                    required
                    placeholder='First Name'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    id="LastName"
                    required
                    placeholder='Last Name'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Grid>
            
  
              <Grid size={6}>
                  <TextField
                    fullWidth
                    id="dateOfBirth"
                    required
                    placeholder="YYYY-MM-DD"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    helperText={!validateDateOfBirth(dateOfBirth) && dateOfBirth.length > 0 ? "Invalid date format or age above 16" : ""}
                  />
                </Grid>
                <Grid size={6}>
                  <FormControl fullWidth sx={{ '& .MuiInputBase-root': { height: 55 } }}>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      labelId='Genderlabel'
                      id="gender"
                      required
                      value={gender}
                      label="Gender"
                      onChange={(e) => setGender(e.target.value)}
                      sx={{
                        '& .MuiSelect-select': {
                          padding: '12px 14px',
                          fontSize: '0.875rem'
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            '& .MuiMenuItem-root': {
                              fontSize: '0.875rem',
                              padding: '8px 16px'
                            }
                          }
                        }
                      }}
                    >
                      <MenuItem value={"male"}>Male</MenuItem>
                      <MenuItem value={"female"}>Female</MenuItem>
                      <MenuItem value={"other"}>Others</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
  
             
              <Grid item  size={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    id="email"
                    required
                    placeholder='Email'
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ height: 55, }}
                  />
                </Grid>
                
  
              <Grid size={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>
                </Grid>
              
              <Grid item size={12}>
                <FormControl sx={{ ml: 1, width: { md: '95%', xs: "95%" } }} variant="outlined">
                  <Button type='submit' variant="contained" disabled={waiting} >
                    Register
                  </Button>
                </FormControl>
              </Grid>
  
              <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                  {snackbarMessage}
                </Alert>
              </Snackbar>
  
              <Snackbar open={openSuccessSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                  {snackbarMessage}
                </Alert>
              </Snackbar>
  
              <Typography mt={1} ml={{ xs: 4, sm: 4, md: 7 }}>
                Already have an account? {' '}
                <Link href="/login" passHref legacyBehavior>
                  <MuiLink underline='none'>
                    Sign in
                  </MuiLink>
                </Link>
              </Typography>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        
      </Box>
    );
  };
  
  export default Register;