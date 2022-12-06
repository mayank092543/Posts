const express = require("express");
const usersRouter = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {users, userLogin, registration} = require("../controllers/usersController")

usersRouter.get("/", users);
usersRouter.post("/login", userLogin);
usersRouter.post("/register", registration)


module.exports = usersRouter;