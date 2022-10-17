import { gql } from '@apollo/client';

export const LOGIN = gql`
    mutation Mutation($email: String!, $password: String!) {
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

export const ADD_ACTIVITY = gql `
mutation Mutation($title: String!, $content: String!, $tags: [ID]!) {
    addActivity(title: $title, content: $content, tags: $tags) {
      _id
      title
      content
      author {
        _id
        username
      }
      createdAt
      tags {
        _id
        name
      }
    }
  }
`;

export const ADD_COMMENT = gql`
    mutation Mutation($commentBody: String!, $activity: ID!) {
        addComment(commentBody: $commentBody, activity: $activity) {
            _id
            commentBody
            user {
                _id
                username
            }
            createdAt
        }
    }
`;

export const ADD_LIKE = gql`
    mutation Mutation($activity: ID!) {
        addLike(activity: $activity) {
            _id
            user {
                _id
            }
            activity {
                _id
            }
        }
    }
`;

export const DELETE_LIKE = gql`
    mutation Mutation($id: ID!) {
        deleteLike(_id: $id) {
            _id
        }
    }
`;

export const DELETE_COMMENT = gql`
    mutation DeleteComment($id: ID!) {
        deleteComment(_id: $id) {
            _id
        }
    }
`;

export const DELETE_ACTIVITY = gql`
    mutation Mutation($id: ID!) {
        deleteActivity(_id: $id) {
            _id
        }
    }
`;

export const UPDATE_ACTIVITY = gql`
    mutation UpdateActivity($id: ID!, $title: String, $content: String, $tags: [ID]) {
        updateActivity(_id: $id, title: $title, content: $content, tags: $tags) {
            _id
            title
            content
            author {
                _id
                username
            }
            createdAt
            tags {
                _id
                name
            }
        }
    }
`