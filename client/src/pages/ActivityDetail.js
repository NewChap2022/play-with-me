import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { pluralize } from "../utils/helpers";
import Auth from '../utils/auth';

import { useMutation, useQuery } from '@apollo/client';
import { QUERY_ACTIVITY } from '../utils/queries';
import { ADD_COMMENT } from '../utils/mutations';

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import LikeButton from '../components/LikeButton';


export default function ActivityDetail() {
    const { id } = useParams();
    const { loading, data: activityData } = useQuery(QUERY_ACTIVITY, {
        variables: { id: id }
    });

    const [addComment] = useMutation(ADD_COMMENT);

    const [errorMessage, setErrorMessage] = useState("");

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        try {
            await addComment({
                variables: {
                    commentBody: data.get("commentBody"), 
                    user: Auth.getProfile().data._id,
                    activity: id
                }
            })
            window.location.reload();
        } catch (error) {
            setErrorMessage(error.message)
        }
    }
    return (
        <Box m={2}>
            {activityData ? (
                <Paper elevation={3}>
                    <Typography fontFamily="indie flower" pt={2} textAlign="center" variant="h4">
                        {activityData.activity.title}
                    </Typography>
                    <Typography fontStyle="italic" fontWeight="bold" fontSize={20} textAlign="center">
                        {activityData.activity.author.username}
                    </Typography>
                    <Typography px={2} textAlign="right" fontStyle="italic">
                        {activityData.activity.createdAt}
                    </Typography>
                    <Typography p={2} fontSize={20}>
                        {activityData.activity.content}
                    </Typography>
                    {Auth.loggedIn() ? (
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography py={2} px={5}>
                                {activityData.activity.likeCount} {pluralize("like", activityData.activity.likeCount)}
                            </Typography>
                            <LikeButton id={id}/>
                        </Box>
                    ) : null}
                    {Auth.loggedIn() ? (
                        <Box 
                            component="form" 
                            noValidate 
                            onSubmit={handleFormSubmit}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            <TextareaAutosize
                                aria-label="minimum height"
                                required
                                id="commentBody"
                                name="commentBody"
                                minRows={3}
                                placeholder="Leave Your Comment"
                                style={{ width: 250 }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 3, mb: 2, maxWidth: 200 }}
                            >
                                Leave a Comment
                            </Button>
                            <Typography color="red">{errorMessage}</Typography>
                        </Box>
                    ) : null}
                    {Auth.loggedIn() ? (
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            <Typography variant='h5' px={2} bgcolor="lightblue">Comments</Typography>
                            {activityData.activity.comments.map((comment, index) => (
                                <ListItem key={index} alignItems="flex-start">
                                    <ListItemText sx={{ px: 2 }}
                                        key={comment._id}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {comment.user.username}
                                                </Typography>
                                                {` —  ${comment.commentBody}`}
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (<Typography fontSize={20} textAlign="center">Please <a href="/login">log in</a> to view the comments</Typography>)}
                </Paper>
            ) : (<h3>Something went wrong</h3>)}
            {loading ? <CircularProgress /> : null}
        </Box>
    )
};