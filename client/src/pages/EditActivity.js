import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Auth from "../utils/auth";

import PostEditor from "../components/PostEditor";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import EditPostBackground from "../assets/images/editpost1.webp";

export default function EditActivity() {
    const activity = useSelector(state => state.editActivity);
    const navigate = useNavigate();

    
    useEffect(() => {
        if (!Auth.loggedIn()) {
            navigate("/login")
        }
        if (Object.keys(activity).length === 0) {
            navigate("/dashboard");
        }
    });

    if (Object.keys(activity).length === 0) {
        return <></>
    }

    return (
        <Box p={2} sx={{
            flex: 1, 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center", 
            alignItems: "center",
            backgroundImage: `url(${EditPostBackground})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
        }}>
            <Typography variant="h5" textAlign="center" fontWeight="bold" fontFamily="Indie Flower, cursive">Edit Activity</Typography>
            <PostEditor activity={activity}/>
        </Box>
    );
};
