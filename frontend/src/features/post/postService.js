import axios from "axios"

const API_URL = "/api/posts"

const allPosts = async() => {
    const response = await axios.get(API_URL);
    return response.data.posts
}

const postCreate = async(formData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL + "/create", formData, config)
    return response.data.post
}

const postUpdate = async(editData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.patch(API_URL + "/update/" + editData.id, editData, config);
    return response.data.post
}

const postById = async(postId) => {
    const response = await axios.get(API_URL + "/" + postId);
    return response.data.post
}

const postDelete = async(postId, token) => {
    const config = {
        headers : {
            Authorization: `Bearer ${token}`
        }
    }
    console.log(postId)

    console.log(API_URL+"/delete/" + postId, config)
    const response = await axios.delete(API_URL + "/delete/"+ postId, config);
    console.log( response.data.post)
}

const postService = {
    allPosts,
    postCreate,
    postUpdate,
    postById,
    postDelete
}

export default postService;