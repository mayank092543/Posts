import Button from "react-bootstrap/Button"
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deletePostById, reset } from "../features/post/postSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

const PostItems = ({post}) => {
//const {user} = useSelector((state) => state.auth)
const user = JSON.parse(localStorage.getItem("user"));

const dispatch = useDispatch();
const navigate = useNavigate();
const {isSuccess, message} = useSelector((state) => state.posts)

const deleteHandler = (postId) => {
    dispatch(deletePostById(postId))
    toast.success("Delete Post")
    navigate("/")
}

    return (
        
        <div>
            {String(post.active) === "true" ? (<div className="posts">
            <p className="title">{post.title}</p>
            <h2>{post.content}</h2>
            {post.tags.map((tag) => (
                <h3 key={tag.id}>{tag.name}</h3>
            ))}
            <h4>Username: {post.author.username}</h4>

            <div>
                {(user && user.id === post.author.id) ? (<div>
                    <Link to={`/edit/${post.id}`}><Button variant="outline-primary" disabled={post.author.id === user.id ? false : true}>Edit</Button></Link>
                    <Button variant="outline-danger" disabled={post.author.id === user.id ? false : true} onClick={() =>deleteHandler(post.id)}>Delete</Button>
                </div>):(<></>)}
            </div>

        </div>) : (<></>)}
        </div>
        
    )
}

export default PostItems;