const { client } = require("./db_server")
const { getPostsById } = require("./posts")


const createPostTag = async(postId, tagId) => {
    try {
        await client.query(`
            INSERT INTO post_tags("postId", "tagId")
            VALUES ($1, $2)
            ON CONFLICT ("postId", "tagId") DO NOTHING
        `, [postId, tagId])
    } catch (error) {
        console.error(error)
        throw error
    }
}

const addTagsToPost = async(postId, tagList) => {
    try {
        const createPostTagPromises = tagList.map(tag => createPostTag(postId, tag.id))

        await Promise.all(createPostTagPromises);

        return await getPostsById(postId);
    } catch (error) {
        console.error(error)
        throw error
    }
}   

module.exports = {
    createPostTag,
    addTagsToPost
}