import { Link } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";

const Header = () => {
    //const user = JSON.parse(localStorage.getItem("user"))
    const {user} = useSelector((state) => state.auth)
    //console.log(user)
    return (
        <header className="header">
            <div>
                <Link to="/" className="logo">JuiceBox Blogger</Link>
            </div>

            <ul className="header-ul">
                {user ? (
                    <li>
                        <Link to="/logout" className="header-li-logout">
                            <FaSignOutAlt /> Logout
                        </Link>
                    </li>) : (
                    <>
                        <li>
                            <Link to="/login" className="header-li-login">
                                <FaSignInAlt /> Login
                            </Link>
                        </li>

                        <li>
                            <Link to="/register" className="header-li-register">
                                <FaUser /> Register
                            </Link>
                        </li>
                    </>
                    )}
                
            </ul>
        </header>
    )
}

export default Header;