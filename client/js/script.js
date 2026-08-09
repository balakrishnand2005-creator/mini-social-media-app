const API = "/api";


// ==========================
// GET LOGGED USER
// ==========================

function getUser() {

    return JSON.parse(
        localStorage.getItem("user")
    );

}


// ==========================
// REGISTER
// ==========================

async function registerUser(event) {

    event.preventDefault();

    const name =
        document.getElementById("name").value;

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;


    try {

        const response = await fetch(
            `${API}/auth/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );


        const data =
            await response.json();


        alert(data.message);


        if (response.ok) {

            window.location.href =
                "login.html";

        }


    } catch (error) {

        alert("Server connection error");

        console.error(error);

    }

}


// ==========================
// LOGIN
// ==========================

async function loginUser(event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;


    try {

        const response = await fetch(
            `${API}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            alert(data.message);

            return;

        }


        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );


        alert("Login successful!");


        window.location.href =
            "index.html";


    } catch (error) {

        alert("Server connection error");

        console.error(error);

    }

}


// ==========================
// LOGOUT
// ==========================

function logout() {

    localStorage.removeItem("user");

    window.location.href =
        "login.html";

}


// ==========================
// CREATE POST
// ==========================

async function createPost() {

    const user = getUser();

    if (!user) {

        window.location.href =
            "login.html";

        return;

    }


    const content =
        document.getElementById(
            "postContent"
        ).value.trim();


    if (!content) {

        alert("Write something first!");

        return;

    }


    try {

        const response = await fetch(
            `${API}/posts`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    userId: user.id,

                    userName: user.name,

                    content: content

                })
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            alert(data.message);

            return;

        }


        document.getElementById(
            "postContent"
        ).value = "";


        loadPosts();


    } catch (error) {

        console.error(error);

        alert("Unable to create post");

    }

}


// ==========================
// LOAD POSTS
// ==========================

async function loadPosts() {

    const feed =
        document.getElementById("feed");


    if (!feed) {
        return;
    }


    try {

        const response =
            await fetch(`${API}/posts`);


        const posts =
            await response.json();


        feed.innerHTML = "";


        if (posts.length === 0) {

            feed.innerHTML =
                "<p>No posts yet. Create the first post!</p>";

            return;

        }


        const user = getUser();


        posts.forEach(post => {

            const div =
                document.createElement("div");

            div.className = "post";


            div.innerHTML = `

                <div class="post-header">

                    <strong>
                        ${escapeHTML(post.userName)}
                    </strong>

                </div>

                <p>
                    ${escapeHTML(post.content)}
                </p>

                <div class="post-actions">

                    <button
                        onclick="likePost('${post.id}')">
                        ❤️ ${post.likes}
                    </button>

                    ${
                        user &&
                        user.id === post.userId
                        ?
                        `
                        <button
                            onclick="deletePost('${post.id}')">
                            🗑 Delete
                        </button>
                        `
                        :
                        ""
                    }

                </div>

            `;


            feed.appendChild(div);

        });


    } catch (error) {

        console.error(error);

    }

}


// ==========================
// LIKE
// ==========================

async function likePost(id) {

    await fetch(
        `${API}/posts/${id}/like`,
        {
            method: "POST"
        }
    );


    loadPosts();

}


// ==========================
// DELETE
// ==========================

async function deletePost(id) {

    const user = getUser();


    if (!user) {
        return;
    }


    const confirmDelete =
        confirm("Delete this post?");


    if (!confirmDelete) {
        return;
    }


    await fetch(
        `${API}/posts/${id}`,
        {
            method: "DELETE",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                userId: user.id
            })
        }
    );


    loadPosts();

}


// ==========================
// HTML SECURITY
// ==========================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ==========================
// PAGE LOAD
// ==========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadPosts();

        loadProfile();

    }
);


// ==========================
// PROFILE
// ==========================

function loadProfile() {

    const user = getUser();


    const name =
        document.getElementById(
            "profileName"
        );


    const email =
        document.getElementById(
            "profileEmail"
        );


    if (!name || !email) {
        return;
    }


    if (!user) {

        name.innerText =
            "Guest";

        email.innerText =
            "Not logged in";

        return;

    }


    name.innerText =
        user.name;


    email.innerText =
        user.email;

}