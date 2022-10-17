import React from 'react';
import ActivityCard from '../ActivityCard';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import { QUERY_ACTIVITIES } from '../../utils/queries';

import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box'

export default function ActivityList() {
    const currentTag = useSelector(state => state.currentTag);

    const { loading, data } = useQuery(QUERY_ACTIVITIES);

    function filterActivities() {
        if (!currentTag) {
            return data.activities;
        }

        let result = [];
        data.activities.forEach(activity => {
            if (activity.tags.some(tag => tag._id === currentTag)) {
                result.push(activity)
            }
        });
        return result;
    }

    return (
        <Box p={2}>
            <Typography variant="h2" textAlign="center" fontFamily="Indie Flower">ACTIVITIES</Typography>
            {data && data.activities.length ? (
                <Grid container spacing={2} sx={{display: "flex", alignItems: "stretch"}}>
                    {filterActivities().map(activity => (
                        <Grid item key={activity._id} xs={12} md={6} lg={3} >
                            <ActivityCard
                                activity={activity}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <h3>There aren't any activities yet!</h3>
            )}
            {loading ? <CircularProgress /> : null}
        </Box>
    );
};