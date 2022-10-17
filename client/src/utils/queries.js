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
            author {
                _id
                username
            }
            content
            createdAt
            tags {
                _id
                name
            }
            comments {
                _id
                commentBody
                user {
                    _id
                    username
                }
                createdAt
            }
            likeCount
        }
    }
`

export const QUERY_ME = gql`
        query Query {
            me {
            _id
            username
            email
            profileImage
            likes {
                _id
                activity {
                    title
                    _id
                }
            }
            comments {
                _id
                commentBody
                createdAt
                activity {
                    _id
                    title
                }
            }
            activities {
                title
                _id
                content
                createdAt
                tags {
                    _id
                    name
                }
                commentCount
                likeCount
                author {
                    _id
                    username
                }
            }
        }
    }
`;

export const QUERY_ME_LIKES = gql`
    query Query {
        me {
        likes {
            _id
            activity {
                    _id
                    title
                }
            }
        }
    }
`