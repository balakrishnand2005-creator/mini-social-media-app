const express = require("express");

const router = express.Router();

const {
    createUser,
    findUser
} = require("../user");


// ============================
// REGISTER
// ============================

router.post("/register", (req, res) => {

    const {
        name,
        email,
        password
    } = req.body;


    if (!name || !email || !password) {

        return res.status(400).json({
            message: "All fields are required"
        });

    }


    const user = createUser(
        name,
        email,
        password
    );


    if (!user) {

        return res.status(400).json({
            message: "Email already registered"
        });

    }


    res.json({

        message: "Registration successful",

        user: {

            id: user.id,

            name: user.name,

            email: user.email

        }

    });

});


// ============================
// LOGIN
// ============================

router.post("/login", (req, res) => {

    const {
        email,
        password
    } = req.body;


    if (!email || !password) {

        return res.status(400).json({
            message: "Email and password required"
        });

    }


    const user = findUser(
        email,
        password
    );


    if (!user) {

        return res.status(401).json({
            message: "Invalid email or password"
        });

    }


    res.json({

        message: "Login successful",

        user: {

            id: user.id,

            name: user.name,

            email: user.email

        }

    });

});


module.exports = router;