const postModel = require("../models/post.model")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")
const jwt = require("jsonwebtoken")
const likeModel = require("../models/like.model")

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})


async function createPostController(req, res) {

    const file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: "Test",
        folder: "cohort-2-insta-clone-posts"
    })

    const post = await postModel.create({
        caption: req.body.caption,
        imgUrl: file.url,
        user: req.user.id
    })

    res.status(201).json({
        message: "Post created successfully.",
        post
    })
}

async function getPostController(req, res) {



    const userId = req.user.id

    const posts = await postModel.find({
        user: userId
    })

    res.status(200)
        .json({
            message: "Posts fetched successfully.",
            posts
        })

}

async function getPostDetailsController(req, res) {


    const userId = req.user.id
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({
            message: "Post not found."
        })
    }

    const isValidUser = post.user.toString() === userId

    if (!isValidUser) {
        return res.status(403).json({
            message: "Forbidden Content."
        })
    }

    return res.status(200).json({
        message: "Post fetched  successfully.",
        post
    })

}

async function likePostController(req, res) {

    const username = req.user.username
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({
            message: "Post not found."
        })
    }

    const like = await likeModel.create({
        post: postId,
        user: username
    })

    res.status(200).json({
        message: "Post liked successfully.",
        like
    })

}


async function unLikePostController(req, res) {
    const postId = req.params.postId
    const username = req.user.username

    const isLiked = await likeModel.findOne({
        post: postId,
        user: username
    })

    if (!isLiked) {
        return res.status(400).json({
            message: "Post didn't like"
        })
    }

    await likeModel.findOneAndDelete({ _id: isLiked._id })

    return res.status(200).json({
        message: "post un liked successfully."
    })
}

async function getFeedController(req, res) {

    const user = req.user
//using populate method we can get whole details of user instead of getting only user id
/**
 .populate("user")
What it does: Replaces a referenced ID with the actual document data from another collection.
Why it's used here: In your database, a post document likely only stores the creator's ID (e.g., user: "6a3699..."). .populate("user") tells Mongoose to automatically look into the Users collection and swap that ID out for the actual user's object (name, profile picture, etc.) so the frontend can display it.

.lean()
What it does: Tells Mongoose to return plain, raw JavaScript objects instead of heavy, complex Mongoose Documents.
Why it's used here: By default, Mongoose documents come with a lot of built-in internal methods (like .save()). You cannot easily add custom new properties to them. .lean() makes the data lightweight and lets you freely modify the object—which is exactly what happens later when adding the isLiked property.

.map() with async
What it does: .map() loops through the array of posts. Because we need to look up something in the database for every single post (checking if it's liked), the function inside the loop must be marked as async.
The Catch: When you use async inside a .map(), it doesn't return the post immediately. Instead, it returns an array of Promises (pending operations).


Promise.all()
What it does: It takes an array of Promises and waits for all of them to finish successfully before moving forward.
Why it's used here: Since .map() generated an array of pending database checks for the likes, Promise.all() pauses the code (await) until every single post has been checked. Once done, it unfolds them into a clean array of finished post objects.


[Post 1, Post 2, Post 3]
       │
       ▼  (.map with async)
[Promise 1, Promise 2, Promise 3]  <-- The array of promises you just described
       │
       ▼  (Promise.all waits for all DB queries to finish)
[Post 1 + isLiked, Post 2 + isLiked, Post 3 + isLiked]

The main reason this code is written this way comes down to a fundamental rule of web development: The database shouldn't just serve data; it needs to serve context customized for the user looking at it.

If you just sent raw posts from the database to the frontend, your InstaClone app wouldn't feel like a real app. This specific structure solves three major real-world problems:

1. The "Personalized Feed" Problem (The isLiked logic)
When you open Instagram, the app needs to know if you have already liked a post so it can paint the heart icon red.

If you just fetch posts, the database doesn't automatically know who is looking at them. By using .map() and looping through each post, the backend dynamically calculates the isLiked status right before sending the data over.

Without this step, every post would load with an empty heart, and your frontend would have to make dozens of separate API calls just to check which posts are liked—which would crash your app's performance.

2. The "N+1 Query" Problem (The Promise.all logic)
Imagine you have 10 posts. If your code waited for Post 1 to check the database for a like, then waited for Post 2, then Post 3, it would take a long time. This is called sequential blocking.

By creating an array of promises and wrapping them in Promise.all(), you tell Node.js: "Fire off all 10 database checks to the likes collection at the exact same time."

Instead of taking 10 posts × 20ms = 200ms, it takes roughly 20ms total because they all run concurrently. It's the difference between a single waiter bringing out 10 dishes one by one, versus 10 waiters bringing them all out at once.

3. Overcoming Mongoose Restrictions (The .lean() logic)
Normally, documents returned by Mongoose are locked down. They are special objects wrapped in Mongoose configurations. If you tried to type:

JavaScript
post.isLiked = true; 
Mongoose would simply ignore it or throw an error because isLiked isn't an official field in your postSchema.

By adding .lean(), you strip away all that Mongoose overhead and convert the data into standard, flexible JavaScript objects. This grants you the freedom to inject the custom isLiked property on the fly.

 */
    const posts = await Promise.all((await postModel.find({}).populate("user").lean())
        .map(async (post) => {
            //is post ka type hota hai mongooseObject. ab bina lean() lagaye ham is mongoose object me nayi property add nahi kr skte jaise isLiked 
            const isLiked = await likeModel.findOne({
                user: user.username,
                post: post._id
            })
//ab isLiked boht sara data return krdega but we need only true and false returned so we use Boolean
            post.isLiked = Boolean(isLiked)

            return post
        }))

    res.status(200).json({
        message: "posts fetched successfully.",
        posts
    })
}

module.exports = {
    createPostController,
    getPostController,
    getPostDetailsController,
    likePostController,
    getFeedController,
    unLikePostController
}