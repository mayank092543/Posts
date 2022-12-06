const {client} = require("./db_server")

// tagList = ["#hello", "#bye", "#GoodDay"]
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
        const { rows } = client.query(`
            SELECT *
            FROM tags;
        `);

        return rows;
    } catch (error) {
        console.error(error)
        throw error
    }
}


module.exports = {
    createTags,
    getAllTags
}