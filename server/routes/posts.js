const express = require("express");

const router = express.Router();

const {
    createPost,
    getPosts,
    likePost,
    deletePost
} = require("../post");


// GET POSTS
router.get("/", (req, res) => {

    res.json(getPosts());

});


// CREATE POST
router.post("/", (req, res) => {

    const {
        userId,
        userName,
        content
    } = req.body;

    if (!userId || !userName || !content) {

        return res.status(400).json({
            message: "Post content is required"
        });

    }

    const post = createPost(
        userId,
        userName,
        content
    );

    res.status(201).json(post);

});


// LIKE POST
router.post("/:id/like", (req, res) => {

    const post = likePost(req.params.id);

    if (!post) {

        return res.status(404).json({
            message: "Post not found"
        });

    }

    res.json(post);

});


// DELETE POST
router.delete("/:id", (req, res) => {

    const { userId } = req.body;

    const deleted = deletePost(
        req.params.id,
        userId
    );

    if (!deleted) {

        return res.status(404).json({
            message: "Post not found or not your post"
        });

    }

    res.json({
        message: "Post deleted"
    });

});


module.exports = router;