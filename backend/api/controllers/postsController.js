const asyncHandler = require("express-async-handler");
const { getAllPosts, createPost, getPostsById, updatePost } = require("../../database/db_server");

//Get All posts
const allPosts = asyncHandler(async(request, response) => {
  const posts = await getAllPosts();

  if(!posts) {
    response.status(400)
    throw new Error("There are no posts!!!")
  } else {
    response.status(200).json({
        posts
    })
  }
})

//Create post
const postCreate = asyncHandler(async(request, response) => {
  const {title, content, tags} = request.body;

  //tags = " #believe #stayStrong"
  const tagsArr = tags.trim().split(/\s+/); // /\s+/ means whitespace
  const postData = {};

  if(tagsArr.length) {
    postData.tags = tagsArr;
  }

  try {
    postData.authorId = request.user.id;
    postData.title = title;
    postData.content = content;

    const post = await createPost(postData);

    if(post) {
      response.status(200).json({
        post
      })
    } else {
      response.status(400)
      throw new Error ("Rendering Post and their tags are not working")
    }
  } catch (error) {
    console.error(error)
    throw error;
  }

})

//Update Post
const postUpdate = asyncHandler(async(request, response) => {
  const { postId } = request.params;
  const { title, content, tags } = request.body;

  updateField = {}

  if(tags && tags.length > 0) {
    const tagsArr = tags.trim().split(" ");
    updateField.tags = tagsArr
  }

  if(title) {
    updateField.title = title;
  }

  if(content) {
    updateField.content = content;
  }

  try {
    const originalPost = await getPostsById(postId)

    if(originalPost.author.id === request.user.id) {
      const updatedPost = await updatePost(postId, updateField);

      response.status(200).json({
        post: updatedPost
      })
    } else {
      response.status(400)
      throw new Error ("You canot update a post that is not yours")
    }
  } catch (error) {
    console.error(error)
    throw error;
  }
})

//Delete Post
const postDelete = asyncHandler(async(request, response) => {
  const {postId} = request.params;

try {
  const originalPost = await getPostsById(postId);

  if(originalPost && originalPost.author.id === request.user.id) {
      const updatedPost = await updatePost(originalPost.id, {active: false})

      response.status(200).json({
        post: updatedPost
      })
  } else if (originalPost) {
    response.status(400)
    throw new Error ("You cannot delete post which is not yours");
  } else {
    response.status(400)
    throw new Error ("That post does not exist");
  }
} catch (error) {
  console.error(error)
  throw error;
}
})

//Get post by ID
const postById = asyncHandler(async(request, response) => {
  const {postId} = request.params

  try {
    const post = await getPostsById(postId)
    if(post) {
      response.status(200).json({
        post: post
      })
    } else {
      response.status(400)
      throw new Error ("Post not found")
    }
  } catch (error) {
    console.error(error)
    throw error;
  }
})

module.exports = {
    allPosts,
    postCreate,
    postUpdate,
    postDelete,
    postById
}