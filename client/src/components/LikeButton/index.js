import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER } from '../../utils/queries';
import { ADD_LIKE } from '../../utils/mutations';
import Auth from "../../utils/auth";

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import GreyHeart from '../../assets/images/grey_heart.png';
import './style.css';

export default function LikeButton(props) {
    const [likeStatus, setLikeStatus] = useState()
    const checkLikeStatus = (id, likes) => {
        return likes.some(like => like.activity._id === id)
    };
    const { id } = props;
    const { data } = useQuery(QUERY_USER, {
        onCompleted: () => {
            setLikeStatus(checkLikeStatus(id, data.user.likes))
        }
    });

    const [addLike, { error }] = useMutation(ADD_LIKE);

    const handleLike = async () => {
        try {
            await addLike({
                variables: {
                    user: Auth.getProfile().data._id,
                    activity: id
                }
            });
            setLikeStatus(true);
        } catch (error) {
            console.log(error);
        }
    }
    // useEffect(() => {
    //     if (data) {
    //         if (data.user.likes.some(like => like.activity._id)) {
    //             console.log("true")
    //         } else {
    //             console.log("false")
    //         }
    //     }
    // }, [data, loading])
    // checkLikeStatus(id, data.user.likes)
    return (
        <div>
            {data ? (
                <div>
                    {likeStatus ? (
                        <Typography py={2} px={5}>❤️</Typography>
                    ) : (
                        <Button sx={{ py: 2, px: 5 }} onClick={handleLike}><img src={GreyHeart} alt="grey heart" className='heart' /></Button>
                    )}
                </div>
            ) : null}
            {error ? (
                <p className="error-text">Something Went Wrong</p>
            ) : null}
        </div>
    )
};