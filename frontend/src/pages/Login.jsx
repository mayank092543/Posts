import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { login, reset } from "../features/auth/authSlice";
import {useSelector, useDispatch} from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const Login = () => {
    const[loginData, setLoginData] = useState({
        username: "",
        password: ""
    })

    const {username, password} = loginData;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {user, isError, isLoading, isSuccess, message} = useSelector((state) => state.auth)

    useEffect(() => {
        if(isError) {
            toast.error(message)
        }
        if(isSuccess) {
            toast.success(message)
        }
    }, [isError, isSuccess, message]);
    
    const onChange = (event) => {
        setLoginData((prevState) => ({
            ...prevState,
            [event.target.id]: event.target.value
        }))
    }

    const submitHandler = (event) => {
        event.preventDefault();

        const userData = {
            username: username,
            password: password
        }

        dispatch(login(userData));
        navigate("/")

    }

    return (
        <div className="container">
            <h1 className="topic">Login</h1>
            <br></br>
            <h3> Please log in to see exicting posts</h3>
            <br></br>

            <section>
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <input 
                         type="text"
                         id="username"
                         className="form-control"
                         value={username}
                         placeholder="Enter your username"
                         onChange={onChange}
                         required
                        />
                    </div>

                    <div className="form-group">
                        <input
                         type="password"
                         id="password"
                         value={password}
                         className="form-control"
                         placeholder="Enter your password"
                         onChange={onChange}
                         required
                        />
                    </div>

                    <div className="form-group">
                        <button type="submit" className="btn-block">Submit</button>
                    </div>

                    <div>
                        <Link to="/register" className="register-yourself">Does not have an account? Please register yourself</Link>
                    </div>
                    
                </form>
            </section>
        </div>
    )
}

export default Login;