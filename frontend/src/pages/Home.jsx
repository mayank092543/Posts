import { FaBattleNet, FaUsers, FaScrewdriver, FaTags} from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="container">
            <h1 className="topic">Welcome to the JuiceBox Blogger</h1>
            <br></br>
            <h3>Please choose from an option below</h3>
            <br></br>

            <div className="option-list">
                <Link to="/allPosts" className="btn" >
                    <FaBattleNet /> View all posts
                </Link>

                <Link to="/createPost" className="btn">
                    <FaScrewdriver /> Create post
                </Link>

                <Link to="/allUsers" className="btn">
                    <FaUsers /> Friends list
                </Link>

                <Link to="/allTags" className="btn">
                    <FaTags /> Tags
                </Link>
            </div>

        </div>
    )
}

export default Home;
