const {client} = require("./db_server");
const { addTagsToPost } = require("./post_tag.js");
const { createTags } = require("./tags");

const createPost = async({ authorId, title, content, tags = [] }) => {

    try {
        const { rows: [ post ] } = await client.query(`
        INSERT INTO posts("authorId", title, content) 
        VALUES($1, $2, $3)
        RETURNING *;
      `, [authorId, title, content]);
  
      const tagList = await createTags(tags);
  
      return await addTagsToPost(post.id, tagList);
    } catch (error) {
        console.error(error)
        throw error;
    }
}

const getAllPosts = async() => {
    try {
        const { rows: postsIds } = await client.query(`
            SELECT id
            FROM posts;
        `);

        const posts = await Promise.all(postsIds.map(post => getPostsById(post.id)))
       
        return(posts)
    } catch (error) {
        console.error(error)
        throw error
    }
}

const updatePost = async(postId, field = {}) => {
    const { tags } = field;
    delete field.tags;

    const setString = Object.keys(field).map((key, index) => 
        `"${key}" = $${index + 1}`).join(', ')
  try {
    if(setString.length > 0) {
        await client.query(`
        UPDATE posts
        SET ${setString}
        WHERE id = ${postId}
        RETURNING *;
    `, Object.values(field));
    }
    if(tags === undefined) {
        return await getPostsById(postId)
    }

    const tagList = await createTags(tags);
    const tagListIdString = tagList.map(tag => `${ tag.id }`).join(', ');

    await client.query(`
        DELETE FROM post_tags
        WHERE "tagId"
        NOT IN (${tagListIdString})
        AND "postId"=$1;
    `, [postId]);

    await addTagsToPost(postId, tagList);

    return await getPostsById(postId);
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getPostsByUserId = async(userId) => {
    try {
        const { rows: postsIds } = await client.query(`
            SELECT id
            FROM posts
            WHERE "authorId"=${userId};
        `,);

    const posts = await Promise.all(postsIds.map(post => getPostsById(post.id)));

    return posts;
    } catch (error) {
        console.error(error)
        throw error
    }
}

const getPostsById = async(postId) => {
    try {
        const { rows: [posts] } = await client.query(`
            SELECT * 
            FROM posts
            WHERE id=$1;
        `, [postId]);

        const { rows: tags } = await client.query(`
            SELECT tags.* 
            FROM tags
            JOIN post_tags ON tags.id=post_tags."tagId"
            WHERE post_tags."postId"=$1;
        `, [postId]);

        const { rows: [author] } = await client.query(`
            SELECT id, username, name, location
            FROM users
            WHERE id=$1;
        `, [posts.authorId]);

        posts.tags = tags;
        posts.author = author;

        delete posts.authorId;

        return posts;
    } catch (error) {
        console.error(error)
        throw error;
    }
}

const getPostsByTagName = async(tagName) => {
    try {
        const { rows: postIds } = await client.query(`
        SELECT posts.id
        FROM posts
        JOIN post_tags ON posts.id=post_tags."postId"
        JOIN tags ON tags.id=post_tags."tagId"
        WHERE tags.name=$1;
      `, [tagName]);
  
      return await Promise.all(postIds.map(
        post => getPostsById(post.id)
      ));
    } catch (error) {
        console.error(error)
        throw error;
    }
}

module.exports = {
    createPost,
    getAllPosts,
    updatePost, 
    getPostsByUserId, 
    getPostsById,
    getPostsByTagName
}