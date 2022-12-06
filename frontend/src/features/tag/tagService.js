import axios from "axios";

const API_URL = "/api/tags/";

const postByTag = async(tagName) => {
    const response = await axios.get(API_URL + "%23" + tagName + "/posts");
    return response.data.posts;
}

const tagService = {
    postByTag
}

export default tagService;