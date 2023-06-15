import React, { useState, FormEvent } from "react";
import {
  Box,
  Grid,
  CssBaseline,
  TextField,
  Typography,
  Container,
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { LoadingButton } from "@mui/lab";
import { signInWithGoogleHandler } from "@/firebase/signIn";
import { signUpWithEmailAndPasswordHandler } from "@/firebase/signUp";
import { useRouter } from "next/router";
import Link from "next/link";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"© " + new Date().getFullYear() + " Psychopal"}
    </Typography>
  );
}

export default function GetStarted() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
  const [emailInUse, setInvalidAuth] = useState<boolean>(false);
  const [weakPassword, setWeakPassword] = useState<boolean>(false);
  const [isLoading, setLoadingState] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadingState(true);

    const { result, error }: any = await signUpWithEmailAndPasswordHandler(
      email,
      password
    );

    if (error) {
      if (error.code === "auth/invalid-email") {
        setInvalidEmail(true);
        document.getElementById("email")?.focus();
      } else setInvalidEmail(false);
      if (error.code === "auth/weak-password") {
        setWeakPassword(true);
        document.getElementById("password")?.focus();
      } else setWeakPassword(false);
      if (error.code === "auth/email-already-in-use") {
        setInvalidAuth(true);
        document.getElementById("email")?.focus();
      } else setInvalidAuth(false);
      console.log(error);
    } else if (result) return router.push("/");

    setLoadingState(false);
  };

  const handleGoogleSignIn = async () => {
    setLoadingState(true);
    const { result } = await signInWithGoogleHandler();

    setLoadingState(false);
    if (result) return router.push("/");
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up to Psychopal
        </Typography>

        <LoadingButton
          fullWidth
          variant="outlined"
          sx={{ mt: 2, mb: 2 }}
          loading={isLoading}
          startIcon={<GoogleIcon />}
          onClick={() => handleGoogleSignIn()}
        >
          Sign Up with Google
        </LoadingButton>

        <Divider>or</Divider>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={invalidEmail || emailInUse}
            helperText={
              invalidEmail
                ? "Please enter a valid email address."
                : emailInUse
                ? "Email already in use. Please try a different email."
                : null
            }
            autoComplete="email"
            autoFocus
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            type="password"
            id="password"
            error={weakPassword}
            helperText={
              weakPassword
                ? "Password must be at least 6 characters long."
                : null
            }
            autoComplete="current-password"
          />

          <Grid container>
            <Grid item>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2">
                  Already have an account?&nbsp;
                </Typography>
                <Link href="/auth/login" className="link">
                  Sign In
                </Link>
              </Box>
            </Grid>
          </Grid>

          <LoadingButton
            loading={isLoading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!password || !email}
          >
            Sign In
          </LoadingButton>
        </Box>
      </Box>

      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
