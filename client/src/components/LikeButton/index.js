import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME_LIKES } from '../../utils/queries';
import { ADD_LIKE, DELETE_LIKE } from '../../utils/mutations';
import { pluralize } from "../../utils/helpers";

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GreyHeart from '../../assets/images/grey_heart.png';
import RedHeart from '../../assets/images/red_heart.png';

export default function LikeButton({ id, likeCount }) {
    const [likeStatus, setLikeStatus] = useState();
    const [likeId, setLikeId] = useState();
    const [numberOfLikes, setNumberOfLikes] = useState(likeCount);

    const checkLikeStatus = (id, likes) => {
        const index = likes.findIndex(like => like.activity._id === id);
        if (index === -1) {
            return false;
        } else {
            setLikeId(likes[index]._id);
            return true;
        }
    };
    const { data } = useQuery(QUERY_ME_LIKES, {
        onCompleted: (data) => {
            setLikeStatus(checkLikeStatus(id, data.me.likes));
        }
    });

    const [addLike, { addError }] = useMutation(ADD_LIKE);
    const [deleteLike, { deleteError }] = useMutation(DELETE_LIKE);

    const handleLike = async () => {
        try {
            const like = await addLike({
                variables: {
                    activity: id
                }
            });
            setLikeId(like.data.addLike._id);
            setNumberOfLikes(numberOfLikes + 1);
            setLikeStatus(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleUnlike = async () => {
        try {
            await deleteLike({
                variables: {
                    id: likeId
                }
            });
            setLikeStatus(false);
            setNumberOfLikes(numberOfLikes - 1);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {data ? (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography py={2} px={5}>
                        {numberOfLikes} {pluralize("like", likeCount)}
                    </Typography>
                    {likeStatus ? (
                        <Button sx={{ py: 2, px: 5 }} onClick={handleUnlike}>
                            <img src={RedHeart} alt="red heart" style={{width: "30px", marginLeft: "10px"}} />
                        </Button>
                    ) : (
                        <Button sx={{ py: 2, px: 5 }} onClick={handleLike}>
                            <img src={GreyHeart} alt="grey heart" style={{width: "30px", marginLeft: "10px"}} />
                        </Button>
                    )}
                </Box>

            ) : null
            }
            {
                addError || deleteError ? (
                    <p className="error-text">Something Went Wrong</p>
                ) : null
            }
        </div >
    )
};