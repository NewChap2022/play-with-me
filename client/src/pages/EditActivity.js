import React, { useState } from "react";
import ReactQuill from "react-quill";
import Auth from "../utils/auth";
import { QUERY_TAGS } from "../utils/queries";
import { UPDATE_ACTIVITY } from "../utils/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";

import EditorToolbar, { modules, formats } from "../components/EditorToolBar";
import "react-quill/dist/quill.snow.css";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function EditActivity() {
    const activity = useSelector(state => state.editActivity);
    console.log(activity);
    const [contentState, setContentState] = useState({ value: activity.content });
    const [tagsInfo, setTagsInfo] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [updateActivity] = useMutation(UPDATE_ACTIVITY);

    const tagsData = useSelector(state => state.tags);;
    const skip = tagsData.length !== 0;
    const { data } = useQuery(QUERY_TAGS, {
        skip: skip
    });

    const tags = data?.tags || tagsData;

    const handleChange = value => {
        setContentState({ value });
    };

    const handleTagsChange = (e) => {
        const { value, checked } = e.target;

        if (checked) {
            setTagsInfo(
                [...tagsInfo, value]
            );
        } else {
            setTagsInfo([tags.Info.filter((e) => e !== value)])
        }
    };

    if (!Auth.loggedIn()) {
        window.location.assign("/login")
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        if (!contentState.value) {
            setErrorMessage("Please enter the content of your activity.");
            return;
        }

        if (tagsInfo.length === 0) {
            setErrorMessage("Please choose tags suit your activity");
            return;
        }

        try {
            await updateActivity({
                variables: { id: activity._id, title: formData.get("title"), content: contentState.value, tags: tagsInfo }
            })
            window.location.assign('/dashboard');
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <Box component="form" className="text-editor" my={2} mx={5} style={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit}>
            <Typography variant="h5" textAlign="center" fontWeight="bold" fontFamily="Indie Flower, cursive">Add a New Activity</Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Activity Title"
                name="title"
            />
            <EditorToolbar />
            <ReactQuill
                theme="snow"
                value={contentState.value}
                onChange={handleChange}
                placeholder={"Let's play ..."}
                modules={modules}
                formats={formats}
                style={{ height: "300px" }}
            />
            <FormGroup style={{ display: "inline-block", marginTop: 10, textAlign: "center" }}>
                <Typography fontWeight="bold">Tags fit your activity</Typography>
                {tags.map(tag => (
                    <FormControlLabel control={<Checkbox />} key={tag._id} label={tag.name} value={tag._id} onChange={handleTagsChange} />
                ))}
            </FormGroup>
            <Typography color="red">{errorMessage}</Typography>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, maxWidth: "200px" }}
                style={{ alignSelf: "center" }}
            >
                Post Activity
            </Button>
        </Box>
    );
};
