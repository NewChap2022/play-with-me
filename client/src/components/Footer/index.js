import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Footer () {
    return (
        <Box style={{height: "50px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#2196f3", color: "white"}}>
            <Typography fontFamily="cursive">©2022 PLAY WITH ME</Typography>
        </Box>
    )
}