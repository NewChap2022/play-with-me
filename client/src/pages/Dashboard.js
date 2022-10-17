import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { useDispatch } from 'react-redux';
import { UPDATE_USER_ACTIVITIES } from '../utils/actions';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from "@mui/material/Avatar";
import ActivityCard from "../components/ActivityCard";
import CommentsTable from "../components/CommentsTable";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Auth from '../utils/auth';
import DashboardHeader from '../assets/images/dashboard_header.jpg';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function Dashboard() {
    const [value, setValue] = useState('activities');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const { loading, data } = useQuery(QUERY_ME, {
        fetchPolicy: "network-only"
    });

    const dispatch = useDispatch();
    const [userActivities, setUserActivities] = useState([]);

    useEffect(() => {
        if (data) {
            dispatch({
                type: UPDATE_USER_ACTIVITIES,
                userActivities: data.me.activities
            });
            setUserActivities(data.me.activities);
        }
    }, [data, loading, dispatch]);

    if (!Auth.loggedIn()) {
        window.location.assign("/login");
        return;
    };

    const onDelete = (id) => {
        setUserActivities((userActivities) => {
            const foundActivityIndex = userActivities.findIndex(entry => entry._id === id);

            // If we find the blog post with matching ID, remove it
            if (foundActivityIndex !== -1) {
                const newUserActivities = [...userActivities];
                newUserActivities.splice(foundActivityIndex, 1);
                return newUserActivities;
            }

        })
    };

    const username = Auth.getProfile().data.username;
    const imgUrl = window.location.protocol + "//" + window.location.host + "\\" + Auth.getProfile().data.profileImage;
    return (
        <Box>
            <Box
                height={100}
                sx={{
                    backgroundImage: `url(${DashboardHeader})`,
                    backgroundSize: 'contain',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Typography
                    fontSize={40}
                    color="white"
                    fontStyle="italic"
                    fontWeight="bold"
                    textAlign="center"
                    px={2}
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                    Dashboard
                </Typography>
            </Box>
            <Box
                mt={2}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <Avatar
                    alt={username}
                    src={imgUrl}
                    sx={{ width: 100, height: 100 }}
                />
                <Typography fontFamily="cursive" fontSize={20}>Hello, {username}</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="dashboard tabs"
                    centered
                >
                    <Tab value="activities" label="Activities" />
                    <Tab value="comments" label="Comments" />
                    <Tab value="likes" label="Likes" />
                </Tabs>
            </Box>
            <TabPanel value={value} index="activities">
                {userActivities.length ? (
                    <Grid container spacing={2} justifyContent="center">
                        {userActivities.map(activity => (
                            <Grid item key={activity._id} xs={12} sm={4} lg={3}>
                                <ActivityCard
                                    activity={activity} onDelete={onDelete}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : <Typography>You have not posted any activities yet</Typography>}
            </TabPanel>
            <TabPanel value={value} index="comments">
                {data ? (
                    <Box>
                        {data.me.comments.length ? (
                            <CommentsTable comments={data.me.comments} />
                        ) : <Typography>You have not posted any comments yet</Typography>}
                    </Box>
                ) : null}
            </TabPanel>
            <TabPanel value={value} index="likes">
                {data ?
                    <Box>
                        {data.me.likes.length ?
                            <Grid container>
                                {data.me.likes.map(like => (
                                    <Grid item mt={2} xs={4} md={2} lg={1} key={like._id}>
                                        <Button variant="contained"><Link style={{ textDecoration: "none", color: "white" }} to={`/activities/${like.activity._id}`}>{like.activity.title}</Link></Button>
                                    </Grid>
                                ))}
                            </Grid> : <Typography>You have not liked any activities yet</Typography>}
                    </Box> : null
                }
            </TabPanel>


            {loading ? <CircularProgress /> : null}
        </Box >
    )
}