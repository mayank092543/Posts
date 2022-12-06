const { response } = require("express");
const { Client } = require("pg")    //imports the pg module

//database name and location of the database
const client = new Client("postgres://localhost:5432/practice_box");

/**
 * USER Methods
 */
 const createUser = async({ username, password, name, location }) => {
    try {
        const { rows: [user] } = await client.query(`
            INSERT INTO users (username, password, name, location)
            VALUES($1, $2, $3, $4)
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
        `, [username, password, name, location]);

        return user;
    } catch (error) {
        console.error(error)
        throw error;
    }
}

const getAllUsers = async() => {
    try {
        const { rows } = await client.query(`
            SELECT id, username, name, location, active
            FROM users;
        `);
        return rows;
    } catch (error) {
        console.error(error)
        throw error;
    }
}

const updateUser = async(id, field = {}) => {
    const setString = Object.keys(field).map((key, index) => 
        `"${key}" = $${index + 1}`).join(', ');
    
    if (setString.length === 0) {
        return;
    }

    try {
       const {rows: [update]} = await client.query(`
            UPDATE users
            SET ${setString}
            WHERE id = ${id}
            RETURNING *;
       `, Object.values(field)
       );
       return update 
    } catch (error) { 
  }
}

const getUserById = async(userId) => {
    try {
        const { rows: [user] } = await client.query(`
            SELECT id, username, name, location, active
            FROM users
            WHERE id=${userId}
        `);
        
        if(user.length === 0) {
            return null;
        }

        user.posts = await getPostsByUserId(user.id)

        return user;
    } catch (error) {
        console.error(error)
        throw error
    }
}

const getUserByUsername = async(username) => {
    try {
        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE username=$1;
        `, [username]);

        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * POST Methods
 */
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

        if(!posts) {
            response.status(400)
            throw new Error ("Could not find a post with that postId");
        }

        const { rows: tags } = await client.query(`
            SELECT * 
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


/**
 * TAG Methods
 */
 const createTags = async(tagList) => {

    if(tagList.length === 0) {
        return;
    }

    // we need $1), ($2), ($3
    const insertValue = tagList.map((tag, index) => `$${index + 1}`).join('), (');

    //we need $1, $2, $3
    const selectValue = tagList.map((tag, index) => `$${index + 1}`).join(', ');

    try {
        //insert all
        await client.query(`
        INSERT INTO tags (name)
        VALUES (${insertValue})
        ON CONFLICT (name) DO NOTHING;
        `, tagList);

        //grab all and return 
        const { rows } = await client.query(`
        SELECT * FROM tags
        WHERE name 
        IN (${selectValue})
    `, tagList)

    return rows;
    } catch (error) {
      console.error(error)
      throw error
    }   
}

const getAllTags = async() => {
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM tags;
        `);

        return rows;
    } catch (error) {
        console.error(error)
        throw error
    }
}


/**
 * POST_TAG Methods
 */
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
    client,
    createUser,
    getAllUsers,
    updateUser, 
    getUserById,
    getUserByUsername,
    createPost,
    getAllPosts,
    updatePost, 
    getPostsByUserId, 
    getPostsById,
    getPostsByTagName,
    createTags,
    getAllTags,
    createPostTag,
    addTagsToPost
}