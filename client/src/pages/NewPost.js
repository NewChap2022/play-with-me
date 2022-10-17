import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "../utils/auth";

import PostEditor from "../components/PostEditor";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import NewPostBackground from "../assets/images/newpost1.webp";

export default function NewPost() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!Auth.loggedIn()) {
            navigate("/login");
        }
    })

    return (
        <Box p={2} sx={{
            flex: 1, 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center", 
            alignItems: "center",
            backgroundImage: `url(${NewPostBackground})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
            }}>
            <Typography variant="h5" textAlign="center" fontWeight="bold" fontFamily="Indie Flower, cursive">Add a New Activity</Typography>
            <PostEditor />
        </Box>
    );
};
