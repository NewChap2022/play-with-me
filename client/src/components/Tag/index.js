import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import {
    UPDATE_TAGS,
    UPDATE_CURRENT_TAG
} from '../../utils/actions';
import { QUERY_TAGS } from '../../utils/queries';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function TagMenu() {
    const dispatch = useDispatch();
    const tags = useSelector(state => state.tags);


    const { loading, data } = useQuery(QUERY_TAGS);

    useEffect(() => {
        if (data) {
            dispatch({
                type: UPDATE_TAGS,
                tags: data.tags
            });
        }
    }, [data, loading, dispatch]);

    const handleClick = (id) => {
        dispatch({
            type: UPDATE_CURRENT_TAG,
            currentTag: id
        })
    };

    return (
        <Box
            display="flex-wrap"
            justifyContent="center"
            textAlign="center"
            m={2}
        >
            {tags.map((tag) => (
                <Button
                    color="secondary"
                    key={tag._id}
                    onClick={() => {
                        handleClick(tag._id);
                    }}
                    variant="contained"
                >
                    {tag.name}
                </Button>
            ))}
        </Box>
    )
};