import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import tagService from "./tagService";

const initialState = {
    postByTag: [],
    isError: false,
    isSuccess: false,
    isLoading: false
}

//Get Post by Tag Name
export const getPostByTag = createAsyncThunk("posts/ByTagName", async(tagName, thunkAPI) => {
    try {
        return await tagService.postByTag(tagName)
    } catch (error) {
        const message = (error.response && error.response.data && error.reponse.data.message) ||
                         error.message || error.toString();

                return thunkAPI.rejectWithValue(message);
    }
})

export const tagSlice = createSlice({
    name: "tag",
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPostByTag.pending, (state) => {
                state.isLoading = true
            })

            .addCase(getPostByTag.fulfilled, (state, action) => {
                state.isError = false
                state.isSuccess = true
                state.isLoading = false
                state.postByTag = action.payload
            })

            .addCase(getPostByTag.rejected, (state) => {
                state.isError = true
                state.isSuccess = false
            })
    }
})

export const {reset} = tagSlice.actions;
export default tagSlice.reducer;