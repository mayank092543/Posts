import useAuthStatus from "../hooks/useAuthStatus";
import { Outlet } from "react-router";
import Login from "./Login";

const PrivateRoute = () => {
    const {loggedIn, checkInStatus} = useAuthStatus();

    if(checkInStatus) {
       return <h1>Loading...</h1>
    }

    return loggedIn ? <Outlet /> : <Login />
}

export default PrivateRoute;