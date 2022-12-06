import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postService from "./postService";

const initialState = {
    posts: [],
    post: {},
    updatedPost: {},
    postID: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ""
}

//const userInfo = JSON.parse(localStorage.getItem("user"))

//All Posts
export const getAllPosts = createAsyncThunk("posts/allPosts", async(_, thunkAPI) => {
    try {
        return await postService.allPosts();
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) ||
                         error.message || error.toString();

                    return thunkAPI.rejectWithValue(message);
    }
})

//Create Post
export const createPost = createAsyncThunk("posts/createPost", async(createPostData, thunkAPI) => {
    try {
         const token = thunkAPI.getState().auth.user.token; 
         //const token = userInfo.token
         return await postService.postCreate(createPostData, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) ||
                         error.message || error.toString();

                    return thunkAPI.rejectWithValue(message);
    }
})

//Update Post
export const editPost = createAsyncThunk("update/post", async(updateData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        //const token = userInfo.token;
        return await postService.postUpdate(updateData, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) ||
                         error.message || error.toString()

                    return thunkAPI.rejectWithValue(message);
    }
})

//Get post by ID
export const postById = createAsyncThunk("getPost/postId", async(postId, thunkAPI) => {
    try {
        return await postService.postById(postId);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) ||
                         error.message || error.toString();
                    
                    return thunkAPI.rejectWithValue(message);
    }
})

//Delete post by ID
export const deletePostById = createAsyncThunk("delete/postId", async(postId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await postService.postDelete(postId, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) ||
                         error.message || error.toString();
                    return thunkAPI.rejectWithValue(message);
    }
})

export const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllPosts.pending, (state) => {
            state.isLoading = true
        })

        .addCase(getAllPosts.fulfilled, (state, action) => {
            state.isError = false
            state.isLoading = false
            state.isSuccess = true
            state.posts = action.payload
        })

        .addCase(getAllPosts.rejected, (state, action) => {
            state.isError = true
            state.isLoading = false
            state.message = action.payload
        })

        .addCase(createPost.pending, (state) => {
            state.isLoading = true
        })

        .addCase(createPost.fulfilled, (state, action) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = true
            state.post = action.payload
        })

        .addCase(createPost.rejected, (state) => {
            state.isLoading = false
            state.isError = true
            state.message = "User is not register"

        })

        .addCase(editPost.pending, (state) => {
            state.isLoading = true
        })

        .addCase(editPost.fulfilled, (state, action) => {
            state.isError = false
            state.isSuccess = true
            state.updatedPost = action.payload
        })

        .addCase(editPost.rejected, (state, action) => {
            state.isError = true
            state.isLoading = false
            state.message = action.payload
        })

        .addCase(postById.pending, (state) => {
            state.isLoading = true
        })

        .addCase(postById.fulfilled, (state, action) => {
            state.isError = false
            state.isSuccess = true
            state.postID = action.payload
        })

        .addCase(postById.rejected, (state, action) => {
            state.isSuccess = false
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
    }
})

export const {reset} = postSlice.actions;
export default postSlice.reducer;

