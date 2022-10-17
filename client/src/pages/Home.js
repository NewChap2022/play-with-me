import React from "react";
import Box from "@mui/material/Box";
import TagMenu from "../components/TagMenu";
import ActivityList from "../components/ActivityList";
import HomeBackground from "../assets/images/homebackground.jpg"
import Hero from "../assets/images/hero.png";
import { Typography } from "@mui/material";

export default function Home () {
    return (
        <Box sx={{backgroundImage: `url(${HomeBackground})`, backgroundSize: "100vw", flex: 1 }} >
            <Box style={{display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundImage: `url(${Hero})`, backgroundPosition: "center", height: 200}} />
            <TagMenu />
            <ActivityList />
        </Box>
    )
};