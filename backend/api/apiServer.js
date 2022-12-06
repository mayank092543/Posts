const express = require("express");
const apiRouter = express.Router();

const usersRoute = require("./routes/users");
const postsRoute = require("./routes/posts"); 
const tagsRoute = require("./routes/tags");

apiRouter.use("/users", usersRoute);
apiRouter.use("/posts", postsRoute);
apiRouter.use("/tags", tagsRoute);

module.exports = apiRouter;