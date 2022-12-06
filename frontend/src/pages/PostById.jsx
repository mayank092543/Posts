import { useEffect } from "react";
import { useParams } from "react-router";
import { FaBattleNet } from "react-icons/fa";
import BackButton from "../components/BackButton";
import { useDispatch, useSelector } from "react-redux";
import { postById, reset } from "../features/post/postSlice";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";

const PostById = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const dispatch = useDispatch();
    const {postId} = useParams();

    const {isSuccess} = useSelector((state) => state.posts)


    useEffect(() => {
        dispatch(postById(postId))
    }, [dispatch]);

    useEffect(() => {
        return() => {
          if(isSuccess){
              dispatch(reset())
          }
        }
    },[isSuccess, reset, dispatch]);

    const {postID, message} = useSelector((state) => state.posts)

    return (
        <>
            <div className="post-page">
                <BackButton url={"/allPosts"} />
                <span>
                    <h1 className="post-title">
                        <FaBattleNet /> Post
                    </h1>
                </span>
            </div>

            {/* Check in postman: - backend gives result in object. Object.keys convert object into the array */}
            <div className="posts">
                {Object.keys(postID).length ? (<div className="title">
                        <p>{postID.title}</p>
                        <h2>{postID.content}</h2>
                        {postID.tags.map((tag) => (
                            <h3 key={tag.id}>{tag.name}</h3>
                        ))}
                        <h4>Username: {postID.author.username}</h4>
                    </div>) : (<div>
                        <h1 className="error-message">{message}</h1>
                    </div>)}

                <div>
                    {(user && user.id === postID.id) ? (<div>
                        <Link to={`/edit/${postID.id}`}><Button variant="outline-primary" disabled={postID.author.id === user.id ? false : true}>Edit</Button></Link>
                        <Button variant="outline-danger" disabled={postID.author.id === user.id ? false : true}>Delete</Button>
                    </div>):(<></>)}
                </div>
          </div>          
        </>
    )
}

export default PostById