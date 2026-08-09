let users = [];


// Create user
function createUser(name, email, password) {

    const existingUser = users.find(
        user => user.email === email
    );

    if (existingUser) {
        return null;
    }

    const user = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password
    };

    users.push(user);

    return user;
}


// Find user
function findUser(email, password) {

    return users.find(
        user =>
            user.email === email &&
            user.password === password
    );

}


module.exports = {
    createUser,
    findUser
};