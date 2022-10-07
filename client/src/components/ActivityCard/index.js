import React from "react";
import { Link } from "react-router-dom";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import "./style.css"

function ActivityCard(prop) {
    let tags = ""
    prop.activity.tags.forEach(tag => tags += `• ${tag.name}  `)

    return (
        <Card>
            <CardContent>
            <Link to={`/activities/${prop.activity._id}`} className="activityCardLink">
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {tags}
                </Typography>
                <Typography variant="h5" component="div">
                    {prop.activity.title}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {prop.activity.author.username}
                </Typography>
                <Typography variant="body2">
                    {prop.activity.content}
                </Typography>
            </Link>
            </CardContent>
        </Card>
    );
}

export default ActivityCard