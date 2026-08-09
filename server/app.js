const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const dbPath = path.join(__dirname, "database.json");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client")));

function initDB() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(
      dbPath,
      JSON.stringify({ users: [], posts: [] }, null, 2)
    );
  }
}

function readDB() {
  initDB();
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function getUserById(id) {
  const db = readDB();
  return db.users.find((user) => user.id === id) || null;
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const db = readDB();
  if (db.users.some((user) => user.email === email)) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const user = {
    id: Date.now().toString(),
    name,
    email,
    password,
    bio: "Hey! I am using MiniSocial.",
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  writeDB(db);

  res.json({
    message: "Registration successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

app.get("/api/posts", (req, res) => {
  const db = readDB();
  const posts = db.posts.map((post) => ({
    ...post,
    userName: getUserById(post.userId)?.name || "User",
    comments: post.comments.map((comment) => ({
      ...comment,
      userName: getUserById(comment.userId)?.name || "User",
    })),
  }));
  res.json(posts);
});

app.post("/api/posts", (req, res) => {
  const { userId, content } = req.body;
  if (!userId || !content) {
    return res.status(400).json({ message: "Post content required" });
  }

  const db = readDB();
  const post = {
    id: Date.now().toString(),
    userId,
    content,
    likes: [],
    comments: [],
    createdAt: new Date().toISOString(),
  };

  db.posts.unshift(post);
  writeDB(db);
  res.json(post);
});

app.post("/api/posts/:id/like", (req, res) => {
  const { userId } = req.body;
  const db = readDB();
  const post = db.posts.find((p) => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (!userId) {
    return res.status(400).json({ message: "User ID required" });
  }

  if (post.likes.includes(userId)) {
    post.likes = post.likes.filter((id) => id !== userId);
  } else {
    post.likes.push(userId);
  }

  writeDB(db);
  res.json(post);
});

app.post("/api/posts/:id/comment", (req, res) => {
  const { userId, text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Comment required" });
  }

  const db = readDB();
  const post = db.posts.find((p) => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const comment = {
    id: Date.now().toString(),
    userId,
    text,
    createdAt: new Date().toISOString(),
  };

  post.comments.push(comment);
  writeDB(db);
  res.json(post);
});

app.delete("/api/posts/:id", (req, res) => {
  const { userId } = req.body;
  const db = readDB();
  const index = db.posts.findIndex(
    (p) => p.id === req.params.id && p.userId === userId
  );

  if (index === -1) {
    return res.status(403).json({ message: "Cannot delete this post" });
  }

  db.posts.splice(index, 1);
  writeDB(db);
  res.json({ message: "Post deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});