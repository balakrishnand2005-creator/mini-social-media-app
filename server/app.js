const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

const app = express();

const PORT = 5000;

const clientPath = path.resolve(
    __dirname,
    "..",
    "client"
);


// MIDDLEWARE
app.use(cors());

app.use(bodyParser.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// STATIC CLIENT
app.use(
    express.static(clientPath)
);


// API ROUTES
app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/posts",
    postRoutes
);


// HOME PAGE
app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            clientPath,
            "index.html"
        )
    );

});


// START SERVER
app.listen(PORT, () => {

    console.log("");
    console.log("================================");
    console.log("       MINI SOCIAL MEDIA APP");
    console.log("================================");
    console.log("");
    console.log("Server running at:");
    console.log(
        `http://localhost:${PORT}`
    );
    console.log("");
    console.log("================================");

});