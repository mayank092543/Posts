import { FaUsers } from "react-icons/fa";
import BackButton from "../components/BackButton";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { allUsers } from "../features/auth/authSlice";

const AllUsers = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {userLists, isSuccess} = useSelector((state) => state.auth)

    useEffect(() => {
       dispatch(allUsers())
    }, [dispatch])
    return (
        <>
            <div className="users-page">
                <BackButton url={"/"} />
                <span>
                    <h2 className="users-title">
                        <FaUsers /> Friends List
                    </h2>
                </span>
            </div>

            {userLists.map((user)=> (
                <div className="user-list" key={user.id}>
                    <h1>Username: {user.username}</h1>
                    <h2>Name: {user.name}</h2>
                    <h2>Location: {user.location}</h2>
                    <hr />
                </div>
            ))}
        </>
    )
}

export default AllUsers;