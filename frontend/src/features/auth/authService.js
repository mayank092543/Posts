import axios from "axios"

const API_URL = "/api/users"

//Register user
const register = async(registrationData) => {
     const response = await axios.post(API_URL + "/register", registrationData);

    if(response.data) {
        localStorage.setItem("user", JSON.stringify(response.data))
    }
    return response.data; 
}

//Login User
const loginUser = async(loginData) => {
    const response = await axios.post(API_URL + "/login", loginData);

    if(response.data) {
        localStorage.setItem("user", JSON.stringify(response.data))
    }
    return response.data;
}

//Logout user
const logoutUser = async() => {
    localStorage.removeItem("user")
} 

//Display all users
const displayUsers = async(token) => {
    const config = {
        headers : {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL, config)
    return response.data.usersList
}

const authService = {
    register,
    loginUser,
    logoutUser,
    displayUsers
}

export default authService;