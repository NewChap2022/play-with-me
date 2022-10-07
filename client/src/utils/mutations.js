import { gql } from '@apollo/client';

export const LOGIN = gql`
    mutation Mutation($email: String!, $password: String) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
                email
            }
        }
    }
`;

export const ADD_USER = gql`
    mutation Mutation($username: String!, $email: String!, $password: String!, $profileImage: String) {
        addUser(username: $username, email: $email, password: $password, profileImage: $profileImage) {
            token
            user {
                _id
                username
                email
                profileImage
            }
        }
    }
`;

export const ADD_COMMENT = gql`
    mutation Mutation($commentBody: String!, $user: ID!, $activity: ID!) {
        addComment(commentBody: $commentBody, user: $user, activity: $activity) {
            _id
            commentBody
            user {
                _id
            }
            createdAt
        }
    }
`;

export const ADD_LIKE = gql`
    mutation Mutation($user: ID!, $activity: ID!) {
        addLike(user: $user, activity: $activity) {
            _id
            user {
                _id
            }
            activity {
                _id
            }
        }
    }
`