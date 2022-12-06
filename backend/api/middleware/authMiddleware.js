const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { getUserById } = require("../../database/db_server");


const protect = asyncHandler(async(request, response, next) => {
    let token;

    if(request.headers.authorization && request.headers.authorization.startsWith("Bearer")){
        try {
            //Grab token from front-end
            token = request.headers.authorization.split(" ")[1];

            //Verify token
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            //Get Id from decodedToken --> payload (jwt.io)
            const user = await getUserById(decodedToken.id);

            //attach the user and move LoL
            request.user = user;

            next();
        } catch (error) {
            response.status(401)
            throw new Error("Not Authorized")
        }
    }

    if(!token) {
        response.status(401)
        throw new Error("Not Authorized")
    }
})

module.exports = {
    protect
}