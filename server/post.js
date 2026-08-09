let posts = [];

function createPost(userId, userName, content) {

    const post = {
        id: Date.now().toString(),
        userId,
        userName,
        content,
        likes: 0,
        createdAt: new Date()
    };

    posts.unshift(post);

    return post;
}

function getPosts() {
    return posts;
}

function likePost(id) {

    const post = posts.find(
        post => post.id === id
    );

    if (!post) {
        return null;
    }

    post.likes++;

    return post;
}

function deletePost(id, userId) {

    const index = posts.findIndex(
        post =>
            post.id === id &&
            post.userId === userId
    );

    if (index === -1) {
        return false;
    }

    posts.splice(index, 1);

    return true;
}

module.exports = {
    createPost,
    getPosts,
    likePost,
    deletePost
};