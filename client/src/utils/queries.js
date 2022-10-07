import { gql } from '@apollo/client';

export const QUERY_TAGS = gql`
    query Tags {
        tags {
        _id
        name
        }
    }
`

export const QUERY_ACTIVITIES = gql`
    query Query {
        activities {
        _id
        title
        content
        createdAt
        tags {
            _id
            name
        }
        commentCount
        likeCount
        author {
            username
            _id
        }
        }
    }
`

export const QUERY_ACTIVITY = gql`
    query Activity($id: ID!) {
        activity(_id: $id) {
        _id
        title
        content
        author {
            username
            _id
        }
        createdAt
        tags {
            _id
            name
        }
        comments {
            commentBody
            user {
            username
            _id
            }
            createdAt
        }
        likeCount
        }
    }
`

export const QUERY_USER = gql`
    query User {
        user {
        _id
        username
        email
        activities {
            title
            _id
            content
        }
        comments {
            commentBody
            createdAt
            activity {
            _id
            title
            }
        }
        likes {
            activity {
            _id
            title
            }
        }
        }
    }
`