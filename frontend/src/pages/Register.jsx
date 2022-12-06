import {FaUser} from "react-icons/fa";
import { useState, useEffect } from "react";
import {toast } from "react-toastify";
import { register, reset } from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        name: "",
        location: ""
    })
    const{ username, password, confirmPassword, name, location} = formData;


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

    useEffect(() => {
        if(isError) {
            toast.error(message)
        } 

        if(isSuccess) {
            toast.success(message)
            navigate("/")
        }
    }, [isError, isSuccess, message, navigate, dispatch])

    const onChange = (event) => {
        setFormData((prevState) => ({
            ...prevState,
            [event.target.id]: event.target.value
        }))
    }

    const submitHandler = (event) => {
        event.preventDefault();
        
        if(password !== confirmPassword) {
            toast.error ("Password do not match")
        } else {
            const userData = {
                username: username,
                password: password,
                name: name,
                location: location
            }
            dispatch(register(userData))
        }

    }
    return (
        <div className="container">
            <h1 className="topic"><FaUser />Register</h1>
            <br></br>
            <h3>Please create an account</h3>
            <br></br>

            <section>
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <input 
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        placeholder="Enter your username"
                        onChange = {onChange}
                        required
                        />
                    </div>

                    <div className="form-group">
                        <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        placeholder="Enter your password"
                        onChange={onChange}
                        required
                        />
                    </div>

                    <div className="form-group">
                        <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={confirmPassword}
                        placeholder="Confirm password"
                        onChange={onChange}
                        required
                        />
                    </div>

                    <div className="form-group">
                        <input
                         type="name"
                         className="form-control"
                         id="name"
                         value={name}
                         placeholder="Enter your name"
                         onChange={onChange}
                         required
                        />
                    </div>

                    <div className="form-group">
                        <input
                         type="location"
                         className="form-control"
                         id="location"
                         value={location}
                         placeholder="Enter your location"
                         onChange={onChange}
                         required
                        />
                    </div>

                    <div className="form-group">
                        <button type="submit" className="btn-block">Submit</button>
                    </div>
                     
                </form>
            </section>
        </div>
    )
}

export default Register;