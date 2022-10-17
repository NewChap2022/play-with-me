const { AuthenticationError } = require('apollo-server-express');
const { User, Activity, Comment, Like, Tag } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        tags: async () => {
            return await Tag.find();
        },
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findById(context.user._id)
                    .select('-__v -password')
                    .populate({
                        path: 'activities',
                        populate: {
                            path: 'tags author comments likes'
                        }
                    })
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
        user: async (parent, { _id }, context) => {
            if (context.user) {
                const userData = await User.findById(_id)
                    .select('-__v -password')
                    .populate({
                        path: 'activities',
                        populate: {
                            path: 'tags'
                        }
                    });
                return userData
            }
            throw new AuthenticationError('Not logged in');
        },
        activities: async (parent, { tag, title }) => {
            const params = {};
            if (tag) {
                params.tag = tag;
            }

            if (title) {
                params.title = {
                    $regex: title
                };
            }

            return await Activity.find(params)
                .populate('author')
                .populate('tags')
                .sort({ createdAt: -1 })
        },
        activity: async (parent, { _id }) => {
            return await Activity.findById(_id)
                .populate('author')
                .populate('tags')
                .populate('likes')
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
                const activity = await Activity.create({ ...args, author: context.user._id });

                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { activities: activity._id } },
                    { new: true }
                );
                return activity;
            }
            throw new AuthenticationError('Not logged in!');
        },
        addComment: async (parent, args, context) => {
            if (context.user) {
                const comment = await (await Comment.create({ ...args, user: context.user._id })).populate("user");

                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { comments: comment._id } },
                    { new: true }
                );

                await Activity.findByIdAndUpdate(
                    { _id: args.activity },
                    { $push: { comments: comment._id } },
                    { new: true }
                );

                return comment;
            }
            throw new AuthenticationError('Not logged in!');
        },
        addLike: async (parent, args, context) => {
            if (context.user) {
                const like = await Like.create({ ...args, user: context.user._id });

                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { likes: like._id } },
                    { new: true }
                );

                await Activity.findByIdAndUpdate(
                    { _id: args.activity },
                    { $push: { likes: like._id } },
                    { new: true }
                );

                return like;
            }
            throw new AuthenticationError('Not logged in!');
        },
        updateUser: async (parent, args, context) => {
            if (context.user) {
                return await User.findByIdAndUpdate(context.user._id, args, { new: true });
            }

            throw new AuthenticationError('Not logged in!');
        },
        updateActivity: async (parent, args, context) => {
            if (context.user) {
                const { _id, ...updateContent } = args;
                const activity = await Activity.findById(_id);

                if (activity.author._id.equals(context.user._id)) {
                    return await Activity.findByIdAndUpdate(_id, updateContent, { new: true });
                };

                throw new AuthenticationError('You have no authentication to update this activity.')
            }

            throw new AuthenticationError('Not logged in!')
        },
        updateComment: async (parent, args, context) => {
            if (context.user) {
                const { _id, ...updateContent } = args;
                const comment = await Comment.findById(_id);

                if (comment.user._id.equals(context.user._id)) {
                    return await Comment.findByIdAndUpdate(_id, updateContent, { new: true });
                };

                throw new AuthenticationError('You have no authentication to update this comment.')
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
        deleteActivity: async (parent, { _id }, context) => {
            if (context.user) {
                const activity = await Activity.findById(_id);

                if (activity.author._id.equals(context.user._id)) {
                    await Activity.findByIdAndDelete(_id);
                    return await User.findByIdAndUpdate(
                        { _id: context.user._id },
                        { $pull: { activities: { _id: _id } } },
                        { new: true }
                    )
                }

                throw new AuthenticationError('You have no authentication to delete this activity.')

            }
            throw new AuthenticationError('Not logged in!');
        },
        deleteComment: async (parent, { _id }, context) => {
            if (context.user) {
                const comment = await Comment.findById(_id);

                if (comment.user.equals(context.user._id)) {
                    await User.findByIdAndUpdate(
                        { _id: context.user._id },
                        { $pull: { comments: { _id: _id } } },
                        { new: true }
                    )
                    await Activity.findByIdAndUpdate(
                        { _id: comment.activity },
                        { $pull: { comments: { _id: _id } } },
                        { new: true }

                    )
                    return await Comment.findByIdAndDelete(_id);
                }
                throw new AuthenticationError('You have no authentication to delete this comment.')
            }
            throw new AuthenticationError('Not logged in!');
        },
        deleteLike: async (parent, { _id }, context) => {
            if (context.user) {
                const like = await Like.findById(_id);
                console.log(like);

                if (like.user.equals(context.user._id)) {
                    await User.findByIdAndUpdate(
                        { _id: context.user._id },
                        { $pull: { likes: { _id: _id } } },
                        { new: true }
                    );
                    await Activity.findByIdAndUpdate(
                        { _id: like.activity._id },
                        { $pull: { likes: { _id: _id } } },
                        { new: true }
                    );
                    return await Like.findByIdAndDelete(_id);
                };
                throw new AuthenticationError('You have no authentication to undo the like.')
            }
            throw new AuthenticationError('Not logged in!');
        }
    }
};

module.exports = resolvers;