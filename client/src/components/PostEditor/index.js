import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import { QUERY_TAGS } from "../../utils/queries";
import { UPDATE_ACTIVITY, ADD_ACTIVITY } from "../../utils/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";

import EditorToolbar, { modules, formats } from "../EditorToolBar";
import "react-quill/dist/quill.snow.css";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function PostEditor({ activity }) {
    const [contentState, setContentState] = useState({ value: activity?.content || null });
    
    let activityTagsInfo = [];
    if (activity) {
        activity.tags.map(tag => activityTagsInfo.push(tag._id));
    }
    const [tagsInfo, setTagsInfo] = useState(activityTagsInfo);
    const [errorMessage, setErrorMessage] = useState("");

    const [updateActivity] = useMutation(UPDATE_ACTIVITY);
    const [addActivity] = useMutation(ADD_ACTIVITY);

    const navigate = useNavigate();
    const location = useLocation();

    const tagsData = useSelector(state => state.tags);;
    const skip = tagsData.length !== 0;
    const { data } = useQuery(QUERY_TAGS, {
        skip: skip
    });

    const tags = data?.tags || tagsData;

    const handleChange = value => {
        setContentState({ value });
    };

    const checkTags = (id) => {
        if (activity) {
            return activity.tags.some(tag => tag._id === id);
        } 
    };

    const handleTagsChange = (e) => {
        const { value, checked } = e.target;

        if (checked) {
            setTagsInfo(
                [...tagsInfo, value]
            );
        } else {
            setTagsInfo([tagsInfo.filter((e) => e !== value)])
        }
    };



    const handleSubmit = async (event) => {
        event.preventDefault();
        const action = event.currentTarget.querySelector(".submitButton").id;
        const formData = new FormData(event.currentTarget);

        if (!contentState.value) {
            setErrorMessage("Please enter the content of your activity.");
            return;
        }

        if (tagsInfo.length === 0) {
            setErrorMessage("Please choose tags suit your activity");
            return;
        }

        if (action === "postActivity") {
            try {
                await addActivity({
                    variables: { title: formData.get("title"), content: contentState.value, tags: tagsInfo }
                })
                navigate('/dashboard');
            } catch (error) {
                setErrorMessage(error.message);
            }
        } else {
            try {
                await updateActivity({
                    variables: { id: activity._id, title: formData.get("title"), content: contentState.value, tags: tagsInfo }
                })
                navigate('/dashboard');
            } catch (error) {
                setErrorMessage(error.message);
                console.log(JSON.stringify(error, null, 2))
            }
        };
    };

    return (
        <Box component="form" className="text-editor" my={2} mx={5} p={2} style={{ display: "flex", flexDirection: "column", backgroundColor: "rgba(255, 255, 255, 0.5)" }} onSubmit={handleSubmit}>
            {/* <Typography variant="h5" textAlign="center" fontWeight="bold" fontFamily="Indie Flower, cursive">Add a New Activity</Typography> */}
            <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Activity Title"
                name="title"
                defaultValue = {activity && activity.title}
            />
            <EditorToolbar />
            <ReactQuill
                theme="snow"
                value={contentState.value}
                onChange={handleChange}
                placeholder={"Let's play ..."}
                modules={modules}
                formats={formats}
                style={{ height: 200 }}
            />
            <FormGroup style={{ display: "inline-block", marginTop: 10, textAlign: "center" }}>
                <Typography fontWeight="bold">Tags fit your activity</Typography>
                {tags.map(tag => (
                    <FormControlLabel control={<Checkbox defaultChecked={checkTags(tag._id)}/>} key={tag._id} label={tag.name} value={tag._id}  onChange={handleTagsChange} />
                ))}
            </FormGroup>
            <Typography color="red">{errorMessage}</Typography>
            {location.pathname === "/newpost" ?
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, maxWidth: "200px" }}
                    style={{ alignSelf: "center" }}
                    className="submitButton"
                    id="postActivity"
                >
                    Post Activity
                </Button>
                : <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, maxWidth: "200px" }}
                    style={{ alignSelf: "center" }}
                    className="submitButton"
                    id="editActivity"
                >
                    Edit Activity
                </Button>}
        </Box>
    );
};
