//grab our db_server with destructiuring from the export in db_server.js

// const { client } = require("./db_server")   // grab client from db_server.js

// const { createUser, getAllUsers, updateUser, getUserById } = require("./users")
// const{ createPost, getAllPosts, updatePost, getPostsByTagName } = require("./posts")
// const { getAllTags } = require("./tags")

const {  
    client,
    createUser,
    updateUser,
    getAllUsers,
    getUserById,
    getUserByUsername,
    createPost,
    updatePost,
    getPostsById,
    getAllPosts,
    getAllTags,
    getPostsByTagName
  } = require('./db_server');



const dropTables = async() => {
    try {
        console.log("dropping tables...")
        //have to make sure to drop in correct order
        await client.query(`
            DROP TABLE IF EXISTS post_tags;
            DROP TABLE IF EXISTS tags;
            DROP TABLE IF EXISTS posts;
            DROP TABLE IF EXISTS users;
        `);
        console.log("Finished dropping");
    } catch (error) {
        console.error(error);
        
    }
}


const createTables = async() => {
    try {
        console.log("Starting to build tables...")
        //create table
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(50) NOT NULL,
                name VARCHAR(50) NOT NULL,
                location VARCHAR(50) NOT NULL,
                active boolean DEFAULT true
            );

            CREATE TABLE posts (
                id SERIAL PRIMARY KEY,
                "authorId" INTEGER REFERENCES users(id),
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                active boolean DEFAULT true
            );

            CREATE TABLE tags (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL
            );

            CREATE TABLE post_tags (
                id SERIAL PRIMARY KEY,
                "postId" INTEGER REFERENCES posts(id),
                "tagId" INTEGER REFERENCES tags(id),
                UNIQUE ("postId", "tagId")
            );
        
        `);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const createInitialUsers = async() => {
    try {
        console.log("Starting to create users...");
    
        await createUser({ username: 'albert', password: 'bertie99', name: 'Al Bert', location: 'Sidney, Australia' });
        await createUser({ username: 'sandra', password: '2sandy4me', name: 'Just Sandra', location: "Ain't telling" });
        await createUser({ username: 'glamgal', password: 'soglam', name: 'Joshua', location: 'Upper East Side' });
    
        console.log("Finished creating users!");
      } catch (error) {
        console.error("Error creating users!");
        throw error;
      }
}

const createInitialPost = async() => {
    console.log("Creating post...")
    try {
        const [albert, sandra, glamgal] = await getAllUsers();

        await createPost({
            authorId: albert.id,
            title: "First Post",
            content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
            tags: ["#happy", "#youcandoanything"]
        });

        await createPost({
            authorId: sandra.id,
            title: "How does this work",
            content: "Seriously, does this even do anything?",
            tags: ["#happy", "#worst-day-ever"]
        });

        await createPost({
            authorId: glamgal.id,
            title: "Living the Glam life",
            content: "Do you even? I swear that half of your are posing.",
            tags: ["#happy", "#youcandoanything", "#catmandoeverything"]
        });

        console.log("finished creating post...")
    } catch (error) {
        console.error(error)
        throw error
    }
}

// const createInitialTags = async() => {
//     try {
//         console.log("Starting to create tags...");
    
//         const [happy, sad, inspo, catman] = await createTag([
//           '#happy', 
//           '#worst-day-ever', 
//           '#youcandoanything',
//           '#catmandoeverything'
//         ]);
    
//         const [postOne, postTwo, postThree] = await getAllPosts();
    
//         await addTagsToPost(postOne.id, [happy, inspo]);
//         await addTagsToPost(postTwo.id, [sad, inspo]);
//         await addTagsToPost(postThree.id, [happy, catman, inspo]);
    
//         console.log("Finished creating tags!");
//       } catch (error) {
//         console.log("Error creating tags!");
//         throw error;
//       }
// }



const rebuildDB = async() => {
    try {
        //connect the database
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPost();
       // await createInitialTags();

    } catch (error) {
        console.error(error)
        throw error;
    }
}

const testdb = async() => {
    try {
        console.log("Starting to test database...")

        //Get all users
        const users = await getAllUsers();
        console.log("users list: ", users)

        //Update user
        const updateSingleUser = await updateUser(users[0].id, {
            name: "Mayank",
            location: "Manassas"
        })
        console.log("Update user", updateSingleUser);

        //Get user by Id 
        const userByTheirId = await getUserById(users[0].id)
        console.log("Get user By their Id: ", userByTheirId);

        //Get all Post
        const posts = await getAllPosts();
        console.log("Posts: ", posts)

        //Update Post
        console.log("Calling updatePost on posts[1], only updating tags");
        const updatePostTagsResult = await updatePost(posts[1].id, {
          tags: ["#youcandoanything", "#redfish", "#bluefish"]
        });
        console.log("Result:", updatePostTagsResult);

        //Get post by Id
        const postById = await getPostsById(3)
        console.log("Get Post by postId: ", postById);

        //Get user by Id
        const userById = await getUserById(users[1].id);
        console.log("User By Id: ", userById);

        //Get user by username
        const userByUsername = await getUserByUsername(users[2].username);
        console.log("User by Username: ", userByUsername);

        //get all tags
        console.log("Calling getAllTags");
        const allTags = await getAllTags();
        console.log("Result:", allTags);

        //get post by tag name
        console.log("Calling getPostsByTagName with #happy");
        const postsWithHappy = await getPostsByTagName("#happy");
        console.log("Result:", postsWithHappy);
    
        console.log("Finished database tests!");

    } catch (error) {
        console.error(error);
    } finally {
        client.end()
    }
}

rebuildDB()
    .then(testdb)
    .catch(console.error)
    .finally(() => client.end())
