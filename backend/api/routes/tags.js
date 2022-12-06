const express = require("express");
const tagsRouter = express.Router();

const {protect} = require("../middleware/authMiddleware")
const {allTags, postsByTagName} = require("../controllers/tagsController");

tagsRouter.get("/", allTags);
tagsRouter.get("/:tagName/posts", postsByTagName)

module.exports = tagsRouter;