import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import BackButton from "../components/BackButton";
import Button from "react-bootstrap/Button"
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { editPost } from "../features/post/postSlice";

const EditPost = () => {
    const {postId} = useParams();
    
    const [editForm, setEditForm] = useState({
        id: postId,
        title: "",
        content: "",
        tags: ""
    });

    const {title, content, tags} = editForm;
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onChange = (event) => {
        setEditForm((prevState) => ({
            ...prevState,
            [event.target.id]: event.target.value
        }))
    }

    const submitHandler = (event) => {
        event.preventDefault();

        dispatch(editPost(editForm))
        navigate("/allPosts")

    }
   
    return (
        <>
             <div className="editPost-page">
                <BackButton url={"/allPosts"} />
                <span>
                    <h1 className="editPost-title">
                        <FaEdit /> Edit Post
                    </h1>
                </span>
            </div>

            <section className="createPost-form">
                <form onSubmit={submitHandler}>
                    <div className="form-group-createPost">
                        <input
                         type="text"
                         className="form-control"
                         id="title"
                         value={title}
                         placeholder="Title"
                         onChange = {onChange}
                         required
                        />
                    </div>

                    <div className="form-group-createPost">
                        <input
                         type="text"
                         className="form-control"
                         id="content"
                         value={content}
                         placeholder="Content"
                         onChange = {onChange}
                         required
                        />
                    </div>

                    <div className="form-group-createPost">
                        <input
                         type="text"
                         className="form-control"
                         id="tags"
                         value={tags}
                         placeholder="Tags"
                         onChange = {onChange}
                         required
                        />
                    </div>

                    <div className="createPost-btn">
                        <Button variant="success" type="submit">Submit</Button>
                    </div>
                </form>
           </section>
        </>
    )
}

export default EditPost;