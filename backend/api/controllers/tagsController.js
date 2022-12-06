const asyncHandler = require("express-async-handler")
const { getAllTags, getPostsByTagName } = require("../../database/db_server")

const allTags = asyncHandler(async(request, response) => {

   const tags = await getAllTags();

   if(!tags) {
    response.status(400)
    throw new Error("Tags are not found!!!")
   } else {
    response.status(200).json({
        tags
    });
   }
});

const postsByTagName = asyncHandler(async(request, response) => {
    let {tagName} = request.params;

    //decode %23happy to #happy
    tagName = decodeURIComponent(tagName)

    try {
        const allPosts = await getPostsByTagName(tagName);

        const posts = allPosts.filter(post => {
            if(post.active) {
                return true;
            }

            if (post.author.id === request.user.id) {
                return true;
            }
            return false;
        })

        response.status(200).json({
            posts
        })
        
    } catch (error) {
        console.error(error)
        throw error
    }

});

module.exports = {
    allTags,
    postsByTagName
}