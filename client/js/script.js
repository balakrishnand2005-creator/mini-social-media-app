const API = "/api";


// Get logged user
function getUser() {
    return JSON.parse(
        localStorage.getItem("user")
    );
}


// Logout
function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}


// Protect pages
function checkLogin() {

    const user = getUser();

    if (!user) {
        window.location.href = "login.html";
    }
}


// REGISTER
async function registerUser(event) {

    event.preventDefault();

    const name =
        document.getElementById("name").value;

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;


    const response = await fetch(
        `${API}/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        }
    );

    const data = await response.json();

    alert(data.message);

    if (response.ok) {
        window.location.href = "login.html";
    }
}


// LOGIN
async function loginUser(event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;


    const response = await fetch(
        `${API}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        alert(data.message);
        return;
    }

    localStorage.setItem(
        "user",
        JSON.stringify(data.user)
    );

    window.location.href = "index.html";
}


// CREATE POST
async function createPost() {

    const user = getUser();

    const content =
        document.getElementById("postContent").value.trim();

    if (!content) {
        alert("Write something first!");
        return;
    }

    await fetch(`${API}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId: user.id,
            content
        })
    });

    document.getElementById(
        "postContent"
    ).value = "";

    loadPosts();
}


// LOAD POSTS
async function loadPosts() {

    const response =
        await fetch(`${API}/posts`);

    const posts =
        await response.json();

    const feed =
        document.getElementById("feed");

    if (!feed) return;

    feed.innerHTML = "";

    posts.forEach(post => {

        const user =
            getUser();

        const liked =
            post.likes.includes(user?.id);

        const comments =
            post.comments.map(comment => `
                <div class="comment">
                    <b>${escapeHTML(comment.userName)}</b>:
                    ${escapeHTML(comment.text)}
                </div>
            `).join("");

        const deleteButton =
            post.userId === user?.id
                ? `<button class="delete-btn"
                    onclick="deletePost('${post.id}')">
                    🗑 Delete
                   </button>`
                : "";

        feed.innerHTML += `

            <div class="post">

                <div class="post-header">

                    <span class="username">
                        👤 ${escapeHTML(post.userName)}
                    </span>

                    <span class="date">
                        ${new Date(post.createdAt)
                            .toLocaleString()}
                    </span>

                </div>

                <div class="post-content">
                    ${escapeHTML(post.content)}
                </div>

                <div class="actions">

                    <button
                        onclick="likePost('${post.id}')">
                        ${liked ? "❤️" : "🤍"}
                        ${post.likes.length}
                    </button>

                    ${deleteButton}

                </div>

                <div class="comment-box">

                    <input
                        id="comment-${post.id}"
                        placeholder="Write a comment..."
                    >

                    <button
                        class="btn"
                        onclick="commentPost('${post.id}')">
                        Comment
                    </button>

                </div>

                ${comments}

            </div>
        `;
    });
}


// LIKE
async function likePost(id) {

    const user = getUser();

    await fetch(
        `${API}/posts/${id}/like`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: user.id
            })
        }
    );

    loadPosts();
}


// COMMENT
async function commentPost(id) {

    const user = getUser();

    const input =
        document.getElementById(
            `comment-${id}`
        );

    const text =
        input.value.trim();

    if (!text) return;

    await fetch(
        `${API}/posts/${id}/comment`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: user.id,
                text
            })
        }
    );

    input.value = "";

    loadPosts();
}


// DELETE
async function deletePost(id) {

    const user = getUser();

    if (!confirm("Delete this post?")) {
        return;
    }

    await fetch(
        `${API}/posts/${id}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: user.id
            })
        }
    );

    loadPosts();
}


// PROFILE
function loadProfile() {

    const user = getUser();

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const name =
        document.getElementById("profileName");

    const email =
        document.getElementById("profileEmail");

    const avatar =
        document.getElementById("avatar");

    if (name) {
        name.innerText = user.name;
    }

    if (email) {
        email.innerText = user.email;
    }

    if (avatar) {
        avatar.innerText =
            user.name.charAt(0).toUpperCase();
    }
}


// SECURITY
function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.innerText = text;

    return div.innerHTML;
}


// Auto load
document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            document.getElementById("feed")
        ) {
            checkLogin();
            loadPosts();
        }

        if (
            document.getElementById("profileName")
        ) {
            loadProfile();
        }

    }
);