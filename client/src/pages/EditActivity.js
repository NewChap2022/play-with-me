import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import PostEditor from "../components/PostEditor";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


export default function EditActivity() {
    const activity = useSelector(state => state.editActivity);
    const navigate = useNavigate();

    
    useEffect(() => {
        if (Object.keys(activity).length === 0) {
            navigate("/dashboard");
        }
    });

    if (Object.keys(activity).length === 0) {
        return <></>
    }

    return (
        <Box mt={3}>
            <Typography variant="h5" textAlign="center" fontWeight="bold" fontFamily="Indie Flower, cursive">Edit Activity</Typography>
            <PostEditor activity={activity}/>
        </Box>
    );
};
