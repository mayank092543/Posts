import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const useAuthStatus = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [checkInStatus, setCheckInStatus] = useState(true);

    //const {user} = useSelector((state) => state.auth)
    const user = JSON.parse(localStorage.getItem("user"))

    useEffect(() => {
        if(user) {
            setLoggedIn(true)
        } else {
            setLoggedIn(false)
        }
        setCheckInStatus(false)
    }, [user])

   return {loggedIn, checkInStatus}
}

export default useAuthStatus;