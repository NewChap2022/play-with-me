import React, { useEffect } from 'react';
import ActivityCard from '../ActivityCard';
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_ACTIVITIES } from '../../utils/actions';
import { useQuery } from '@apollo/client';
import { QUERY_ACTIVITIES } from '../../utils/queries';

import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';

export default function ActivityList() {
    const currentTag = useSelector(state => state.currentTag);
    const activities = useSelector(state => state.activities);
    const dispatch = useDispatch();

    const { loading, data } = useQuery(QUERY_ACTIVITIES);

    useEffect(() => {
        if (data) {
            dispatch({
                type: UPDATE_ACTIVITIES,
                activities: data.activities
            });
        }
    }, [data, loading, dispatch]);

    function filterActivities() {
        if (!currentTag) {
            return activities;
        }

        let result = [];
        activities.forEach(activity => {
            if (activity.tags.some(tag => tag._id === currentTag)) {
                result.push(activity)
            }
        });
        return result;
    }

    return (
        <div>
            <Typography variant="h2" textAlign="center" fontFamily="Indie Flower">ACTIVITIES</Typography>
            {activities.length ? (
                <Grid container spacing={2}>
                    {filterActivities().map(activity => (
                        <Grid item key={activity._id} xs={12} md={6} lg={3}>
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
        </div>
    );
};