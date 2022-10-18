import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';

import Auth from '../utils/auth';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import SignUpImage from '../assets/images/signup.jpeg';

export default function SignUp() {
    const [addUser, { error }] = useMutation(ADD_USER);

    const [errorMessage, setErrorMessage] = useState("");
    const [imgData, setImgData] = useState(null)

    const uploadImage = (e) => {
        let file = e.target.files[0];

        if (!file) {
            return false;
        }

        if (file.size > 10e6) {
            setErrorMessage("Please upload a file smaller than 10 MB");
            return false;
        }

        const reader = new FileReader();
        reader.addEventListener("load", () => {
            setImgData(reader.result);
        });
        reader.readAsDataURL(e.target.files[0]);
    }

    const handleSubmit = async (event) => {
        const validateEmail = (email) => {
            return String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
        };

        const validatePassword = (password) => {
            if (password.length >= 6) {
                return true;
            } else {
                return false;
            }
        };

        event.preventDefault();
        const data = new FormData(event.currentTarget);

        if (!data.get('username')) {
            setErrorMessage("Please enter a username!");
            return;
        }

        if (!validateEmail(data.get('email'))) {
            setErrorMessage("Please enter a valid email!");
            return;
        }
        if (!validatePassword(data.get('password'))) {
            setErrorMessage("Password has at least 6 characters!");
            return;
        }

        let profileImage = "";

        if (data.get('avatar').name) {
            const response = await fetch("/profile", {
                method: 'POST',
                body: data
            })

            if (response.ok) {
                const data = await response.json();
                profileImage = data.path;
            } else {
                const res = await response.json();
                setErrorMessage(res.message);
            }
        }

        try {
            const mutationResponse = await addUser({
                variables: { username: data.get('username'), email: data.get('email'), password: data.get('password'), profileImage: profileImage }
            });
            const token = mutationResponse.data.addUser.token;
            Auth.login(token);
        } catch (e) {
            setErrorMessage(e.message);
        }
    };

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <Button
                            variant="contained"
                            component="label"
                        >
                            Upload Profile Image
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={e => uploadImage(e)}
                                id="avatar"
                                name="avatar"
                            />
                        </Button>
                        {imgData ? (
                            <Box my={2}>
                                <img src={imgData} alt="preview of profile pic" width="100" />
                            </Box>
                        ) : null}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Typography color="red">{errorMessage}</Typography>
                        {error ? (
                            <Typography color="red">{error.message}</Typography>
                        ) : null}
                        <Grid container>
                            <Grid item>
                                <Link to="/login" variant="body2">
                                    {"Already have an account? Log in"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: `url(${SignUpImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
        </Grid>
    );
};