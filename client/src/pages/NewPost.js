import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useDispatch } from 'react-redux';
// import { UPDATE_EDIT_ACTIVITY } from '../utils/actions';
import Auth from "../utils/auth";

import PostEditor from "../components/PostEditor";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function NewPost() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!Auth.loggedIn()) {
            navigate("/login");
        }
    })

    return (
        <Box mt={3}>
            <Typography variant="h5" textAlign="center" fontWeight="bold" fontFamily="Indie Flower, cursive">Add a New Activity</Typography>
            <PostEditor />
        </Box>
    );
};
