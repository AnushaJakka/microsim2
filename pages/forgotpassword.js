import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, FormControl, Paper, Typography, Snackbar, Alert, Stack, Link } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';

const ForgotPassword = () => {
  const [email, setEmail] = React.useState('');

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const navigate = useRouter();
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      setSnackbarMessage('Please fill in all fields.');
      setOpenSnackbar(true);
    } else if (!validateEmail(email)) {
      setSnackbarMessage('Please enter a valid email address.');
      setOpenSnackbar(true);
    } else {
      
      try {
        const response = await axios.post('https://micro-sim-backend.vercel.app/api/password-reset/', { email });
        if (response.status === 200) {
          setSnackbarMessage('Reset Password Link Sent To Your Email');
          setOpenSnackbar(true);
            setTimeout(() => navigate.push("/"), 3000); 
        }
      } catch (error) {
        setSnackbarMessage(error.response?.data?.email);
        setOpenSnackbar(true);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box>
      <Stack flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
        <Stack alignItems={"flex-end"}>
          <img src='/static/images/MicroSim Learning Logo-Black.png' alt="logo" width={60} />
        </Stack>
        <Typography fontSize={{ md: "20", xs: 25 }} fontWeight={"bold"} my={3}>
        MicroSim Learning
        </Typography>
      </Stack>
      <Paper
        elevation={3}
        sx={{
          display: "flex", justifyContent: 'center', flexDirection: "column", alignItems: "center",
          p: 3, mx: { xs: "5%", sm: "10%", md: "20%" }, width: "450", boxShadow:10
        }}
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <Typography fontSize={{ md: "20", xs: 25 }} textAlign={"center"} fontWeight={"bold"} my={3}>
          Forgot Password
        </Typography>
        <FormControl sx={{ m: 1, width: '80%' }} variant="outlined">
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            sx={{ mb: 3 }}
            placeholder='Email'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!validateEmail(email) && email.length > 0}
            helperText={!validateEmail(email) && email.length > 0 ? "Invalid email format" : ""}
          />
        </FormControl>

        <Button variant='contained' type='submit' sx={{ my: 3 }} >Reset Password</Button>
        <Stack direction={{ md: "row", xs: "column" }} display={"flex"} justifyContent={"space-between"} spacing={4}>
          <Link href="/register" style={{ textDecoration: "none", fontSize:  {xs: 20,  lg: '16px'} }} textAlign={"center"}>Create New Account</Link>
          <Link href="/login" style={{ textDecoration: "none", fontSize:  {xs: 20,  lg: '16px'}, }} textAlign={"center"}>Login</Link>
        </Stack>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarMessage === 'Reset Password Link Sent To Your Email' ? 'success' : 'error'} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ForgotPassword;
