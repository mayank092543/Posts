const { client } = require("./db_server.js");
const { getPostsByUserId } = require("./posts.js");

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

module.exports = {
    createUser,
    getAllUsers,
    updateUser, 
    getUserById
}