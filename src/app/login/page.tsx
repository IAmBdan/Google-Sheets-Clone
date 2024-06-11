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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const encodeCredentials = (username : string, password : string) => {
    return btoa(`${username}:${password}`);
  };

  const handleLogin = async () => {
    const credentials = encodeCredentials(email, password);

    try {
      const response = await fetch('/api/v1/checkUser', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      });

      if (response.status === 200) {
        window.location.href = "/dashboard";
      } else if (response.status === 401 || response.status === 404) {
        setErrorMessage("Invalid email or password");
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
              id="email"
              label="Email Address"
              name="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <a href={"/register"}>Don't have an account? Register</a>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
