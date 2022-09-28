const { AuthenticationError } = require('apollo-server-express');
const { User, Activity, Comment, Like, Tag } = require('../models');
const { populate } = require('../models/User');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        tags: async () => {
            return await Tag.find();
        },
        user: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findById(context.user._id)
                    .select('-__v -password')
                    .populate('activities')
                    .populate({ 
                        path: 'comments',
                        populate: {
                          path: 'activity'
                        } 
                    })
                    .populate({ 
                        path: 'likes',
                        populate: {
                          path: 'activity'
                        } 
                    })

                return userData
            }
            throw new AuthenticationError('Not logged in');
        },
        activities: async (parent, { tags, title }) => {
            const params = {};
            if (tags) {
                params.tags = tags;
            }

            if (title) {
                params.title = {
                    $regex: title
                };
            }
            
            return await Activity.find(params)
                            .populate('author')
                            .populate('tags');
        },
        activity: async (parent, { _id }) => {
            return await Activity.findById(_id)
                            .populate('author')
                            .populate('tags')
                            .populate({ 
                                path: 'comments',
                                populate: {
                                  path: 'user'
                                } 
                            })
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        addActivity: async (parent, args, context) => {
            if (context.user) {
                const activity = await Activity.create(args);
                
                await User.findByIdAndUpdate(
                    {_id: context.user._id}, 
                    { $push: { activities: activity._id }},
                    { new: true }
                );
                return activity;
            }
            throw new AuthenticationError('Not logged in!');
        },
        addComment: async (parent, args, context) => {
            if (context.user) {
                const comment = await Comment.create(args);

                await User.findByIdAndUpdate(
                    {_id: context.user._id}, 
                    { $push: { comments: comment._id }},
                    { new: true }
                );

                return comment;
            }
            throw new AuthenticationError('Not logged in!');
        },
        addLike: async ( parent, args, context ) => {
            if (context.user) {
                const like = await Like.create(args);

                await User.findByIdAndUpdate(
                    {_id: context.user._id}, 
                    { $push: { likes: like._id }},
                    { new: true }
                );

                return like;
            }
            throw new AuthenticationError('Not logged in!');
        },
        updateUser: async (parent, args, context) => {
            if (context.user) {
                return await User.findByIdAndUpdate(context.user._id, args, { new: true});
            }

            throw new AuthenticationError('Not logged in!');
        },
        updateActivity: async (parent, args, context) => {
            if (context.user) {
                const { _id, ...updateContent } = args;
                return await Activity.findByIdAndUpdate(_id, updateContent, { new: true });
            }

            throw new AuthenticationError('Not logged in!')
        },
        updateComment: async (parent, args, context) => {
            if (context.user) {
                const { _id, ...updateContent} = args;
                return await Comment.findByIdAndUpdate(_id, updateContent, { new: true });
            }
            throw new AuthenticationError('Not logged in!')
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect email');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect password');
            }

            const token = signToken(user);

            return { token, user };
        },
        deleteActivity: async (parent, {_id}, context) => {
            if (context.user) {
                await Activity.findByIdAndDelete(_id);
                return await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    { $pull: { activities: _id }},
                    { new: true }
                )
            }
            throw new AuthenticationError('Not logged in!');
        },
        deleteComment: async (parent, {_id}, context) => {
            if (context.user) {
                await Comment.findByIdAndDelete(_id);
                return await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    { $pull: { comments: _id }},
                    { new: true }
                )
            }
            throw new AuthenticationError('Not logged in!');
        },
        deleteLike: async (parent, {_id}, context) => {
            if (context.user) {
                await Like.findByIdAndDelete(_id);
                return await User.findByIdAndDelete(
                    {_id: context.user._id},
                    { $pull: { likes: _id }},
                    { new: true }
                )
            }
            throw new AuthenticationError('Not logged in!');
        }
    }
};

module.exports = resolvers;