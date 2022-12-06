import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

//Get user from local storage
const userInfo = JSON.parse(localStorage.getItem("user"))
//console.log(userInfo)

const initialState = {
    user: userInfo ? userInfo : null,
    userLists: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: ""
}

//Register new user
export const register = createAsyncThunk("auth/register", async(user, thunkAPI) => {
    try {
        return await authService.register(user)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) ||
                         error.message || error.toString()

                         return thunkAPI.rejectWithValue(message)
    }
})

//Login user
export const login = createAsyncThunk("auth/user", async(user, thunkAPI) => {
    try {
        return await authService.loginUser(user);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) ||
                         error.message || error.toString()

                         return thunkAPI.rejectWithValue(message)
    }
})

//Logout user
export const logout = createAsyncThunk("auth/logout", async() => {
    await authService.logoutUser();
})

//Display all users
export const allUsers = createAsyncThunk("all/users", async(_, thunkAPI) => {
    try {
        const token = userInfo.token
        return await authService.displayUsers(token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) ||
                         error.message || error.toString();
                         
                    return thunkAPI.rejectWithValue(message)
    }
})

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })

            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.isSuccess = true
                state.user = action.payload
                state.message = action.payload.message
            })

            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.user = null
                state.message = action.payload
            })

            .addCase(login.pending, (state) => {
                state.isLoading = true
            })

            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.isSuccess = true
                state.user = action.payload
                state.message = action.payload.message
            })

            .addCase(login.rejected, (state, action) => {
                state.isSuccess = false
                state.isError = true
                state.user = null
                state.message = action.payload
            })

            .addCase(logout.fulfilled, (state) => {
                state.user = null
            })

            .addCase(allUsers.pending, (state) => {
                state.isLoading = true
            })

            .addCase(allUsers.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isError = false
                state.userLists = action.payload
            })

            .addCase(allUsers.rejected, (state) => {
                state.isError = true
                state.isLoading = false
                state.isSuccess = false
            })
    }
})

export const {reset} = authSlice.actions
export default authSlice.reducer