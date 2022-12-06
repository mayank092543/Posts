import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logout, reset } from "../features/auth/authSlice";
import { useEffect } from "react";

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    
        dispatch(logout())
        dispatch(reset())
        navigate("/")


    return (
        <>
            <p className="logout-message">Have a Nice day!!!</p>
        </>
    )
}

export default Logout;