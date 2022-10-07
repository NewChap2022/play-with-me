import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from '@apollo/client';
import { QUERY_USER } from '../../utils/queries';

import Auth from '../utils/auth';

export default function Dashboard () {
    if (!Auth.loggedIn()) {
        window.location.assign("/login");
        return;
    };


}