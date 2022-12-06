const express = require("express");
const postsRouter = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    allPosts,
    postCreate,
    postUpdate, 
    postDelete,
    postById
    } = require("../controllers/postsController");




postsRouter.get("/", allPosts);
postsRouter.get("/:postId", postById )
postsRouter.post("/create", protect, postCreate);
postsRouter.patch("/update/:postId", protect, postUpdate);
postsRouter.delete("/delete/:postId", protect, postDelete)

module.exports = postsRouter;