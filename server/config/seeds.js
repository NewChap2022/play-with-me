const db = require('./connection');
const { User, Activity, Tag, Comment, Like } = require('../models');

db.once('open', async () => {
    await Tag.deleteMany();

    const tags = await Tag.insertMany([
        { name: 'Social' },
        { name: 'Language' },
        { name: 'Emotional' },
        { name: 'Cognitive' },
        { name: 'Gross Motor' },
        { name: 'Fine Motor' }
    ]);

    console.log('Tags seeded');

    await User.deleteMany();

    const user = await User.create({
        username: 'test',
        email: 'test@test.com',
        password: 'test123',
        profileImage: 'uploads\\avatars\\avatar-1665152477648.jpeg'
    })

    console.log('User seeded');

    await Activity.deleteMany();

    const activity = await Activity.create({
        title: "Example 1",
        content: "Lorem ipsum dolor sit amet. Vel eius molestiae sed dolores itaque aut sint sunt. Ea quibusdam dolorem ut officiis alias ut aspernatur iusto et delectus minima nam quisquam illum. Id soluta voluptas a voluptatum aliquam ex architecto illum et voluptatem deserunt cum molestias quasi.",
        author: user._id,
        tags: [tags[0]._id, tags[1]._id]
    });

    await User.findByIdAndUpdate(
        { _id: user._id },
        { $push: { activities: activity._id } },
        { new: true }
    );

    console.log('Activity seeded');

    await Comment.deleteMany();

    const comment = await Comment.create({
        commentBody: "test",
        user: user._id,
        activity: activity._id
    });


    await User.findByIdAndUpdate(
        { _id: user._id },
        { $push: { comments: comment._id } },
        { new: true }
    );

    await Activity.findByIdAndUpdate(
        { _id: activity._id },
        { $push: { comments: comment._id } },
        { new: true }
    );

    console.log('Comment seeded');

    await Like.deleteMany();

    const like = await Like.create({
        user: user._id,
        activity: activity._id
    });

    await User.findByIdAndUpdate(
        { _id: user._id },
        { $push: { likes: like._id } },
        { new: true }
    );

    await Activity.findByIdAndUpdate(
        { _id: activity._id },
        { $push: { likes: like._id } },
        { new: true }
    );

    console.log('Like seeded');

    process.exit();
})