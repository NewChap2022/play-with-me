const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Tag {
        _id: ID
        name: String
    }

    type Comment {
        _id: ID
        commentBody: String
        user: User
        createdAt: String
        activity: Activity
    }

    type Like {
        _id: ID
        user: User
        activity: Activity
    }

    type Activity {
        _id: ID
        title: String
        content: String
        author: User
        createdAt: String
        tags: [Tag]
        comments: [Comment]
        likes: [Like]
        commentCount: Int
        likeCount: Int
    }

    type User {
        _id: ID
        username: String
        email: String
        profile_image: String
        activities: [Activity]
        comments: [Comment]
        likes: [Like]
    }

    type Auth {
        token: ID
        user: User
    }

    type Query {
        tags: [Tag]
        user: User
        activities(tags: [ID], title: String): [Activity]
        activity(_id: ID!): Activity
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String): Auth
        addActivity(title: String!, content: String!, author: String!): Activity
        addComment(commentBody: String!, user: ID!, activity: ID!): Comment
        addLike(user: ID!, activity: ID!): Like
        updateUser(username: String, email: String, password: String): User
        updateActivity(title: String, content: String): Activity
        updateComment(commentBody: String!): Comment
        login(email: String!, password: String): Auth
        deleteActivity(_id: ID!): Activity
        deleteComment(_id: ID!): Comment
        deleteLike(_id: ID!): Like
    }
`;

module.exports = typeDefs;