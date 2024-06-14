// @author giastina
"use client";

import { LockOutlined } from "@mui/icons-material";
import React, { useState } from "react";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Function to encode username and password into base64
  const encodeCredentials = (username : string, password : string) => {
    return btoa(`${username}:${password}`);
  };

    // Function to handle login button click
  const handleLogin = async () => {
    const credentials = encodeCredentials(username, password);
    // Use client-side fetch to send credentials to server
    try {
      // const response = await fetch('https://husksheets.fly.dev/api/v1/checkUser', {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': `Basic ${credentials}`
      //   }
      // });
      const response = { status: 200 };
      // Handle different response statuses

      if (response.status === 200) {
        window.location.href = `/dashboard/${username}`;
      } else if (response.status === 401 || response.status === 404) {
        setErrorMessage("Invalid username or password");
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    } catch (error) {
      setErrorMessage("An error occurred while attempting to log in");
    }
  };

  return (
    <>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            mt: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5">Login</Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            {errorMessage && (
              <Typography color="error">{errorMessage}</Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
            >
              Login
            </Button>
            <Grid container justifyContent={"flex-end"}></Grid>
            <a href={"/register"}>Don&apos;t have an account? Register</a>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
