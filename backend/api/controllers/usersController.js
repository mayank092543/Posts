const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { getAllUsers, getUserByUsername, createUser } = require("../../database/db_server");

const users = asyncHandler(async(request, response) => {
    const usersList = await getAllUsers()

    if(!usersList) {
        response.status(404)
        throw new Error("There is no users List")
    } else {
        response.status(200).json({
            usersList
        })
    }
})

const userLogin = asyncHandler(async(request, response) => {
    const {username, password} = request.body;
    const user = await getUserByUsername(username)

    if(!username || !password) {
        response.status(400)
        throw new Error("Please fill all fields")
    }

    if(user && user.password === password) {
        response.status(200).json({
            id: user.id,
            username: user.username,
            location: user.location,
            token: generateToken(user.id, user.username),
            message: "You are logged in"
        })
    } else {
        response.status(401)
            throw new Error("You are unauthorized person to Login. Please register yourself")
    }
})

const registration = asyncHandler(async(request, response) => {
    const { username, password, name, location } = request.body;

    console.log("username: ", username)

    if(!username || !password || !name || !location) {
        response.status(400)
        throw new Error("Please filled all fields")
    }

    const userExist = await getUserByUsername(username);

    if(userExist) {
        response.status(400)
        throw new Error("User already exists")
    }

    const userCreate = await createUser({
        username: username,
        password: password,
        name: name,
        location: location
    })

    if(userCreate) {
        response.status(200).json({
            id: userCreate.id,
            username: userCreate.username,
            name: userCreate.password,
            location: userCreate.location,
            token: generateToken(userCreate.id),
            message: "You have been register in our system"
        })
    } else {
        response.status(400)
        throw new Error("Invalid user data")
    }
})

const generateToken = (id, username) => {
    return jwt.sign({id, username}, process.env.JWT_SECRET, {
        expiresIn : "30d"
    })
}

module.exports = {
    users,
    userLogin,
    registration
}