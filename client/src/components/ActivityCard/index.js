import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { DELETE_ACTIVITY } from "../../utils/mutations";
import { useDispatch } from 'react-redux';
import { REMOVE_USER_ACTIVITY, UPDATE_EDIT_ACTIVITY } from '../../utils/actions';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from "@mui/material/CardMedia";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function ActivityCard({ activity, onDelete }) {
    const [display] = useState(useLocation().pathname === "/dashboard" ? true : false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteActivity] = useMutation(DELETE_ACTIVITY);

    let tags = ""
    activity.tags.forEach(tag => tags += `• ${tag.name}  `);

    const extractContent = (html) => {
        const showPreviewContent = (content) => {
            const lengthOfText = content.split(' ').length;
            if (lengthOfText > 50) {
                return content.split(' ').slice(0, 51).join(' ');
            }
            return content;
        };

        const text = new DOMParser()
            .parseFromString(html, "text/html")
            .documentElement.textContent;
        var ele = document.createElement("div");
        ele.innerHTML = html;
        var image = ele.querySelector("img");
        if (image) {
            return <CardMedia
            component="img"
            height="194"
            image={image.src}
            alt="activity image"
          />
        }
        return <Typography variant="body2">
        {showPreviewContent(text)}
        </Typography>;
    };

    const deleteHandle = async (e) => {
        e.preventDefault();
        const id = e.currentTarget.id;
        try {
            await deleteActivity({
                variables: { id: id }
            });
            dispatch({
                type: REMOVE_USER_ACTIVITY,
                _id: id
            });
            onDelete(id);
        } catch (error) {
            console.log(error);
        }
    };

    const editHandle = async (e) => {
        e.preventDefault();
        dispatch({
            type: UPDATE_EDIT_ACTIVITY,
            activity: activity
        });
        navigate('/edit');

    }

    return (
        <Card sx={{height: "100%"}}>
            <CardContent>
                <Link to={`/activities/${activity._id}`} style={{ textDecoration: "none", color: "black" }} >
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {tags}
                    </Typography>
                    <Typography variant="h5" component="div">
                        {activity.title}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {activity.author.username}
                    </Typography>
                    {extractContent(activity.content)}
                    {/* <Typography variant="body2">
                        {extractContent(activity.content)}
                    </Typography> */}
                </Link>
                {display ?
                    <>
                        <Button sx={{ mt: 1, mx: 1 }} variant="contained" size="small" onClick={editHandle}>Edit</Button>
                        <Button sx={{ mt: 1, mx: 1 }} variant="contained" size="small" id={activity._id} onClick={(e) => deleteHandle(e)}>Delete</Button>
                    </> : null}

            </CardContent>
        </Card>
    );
};
