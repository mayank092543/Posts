import BackButton from "../components/BackButton";
import Button from "react-bootstrap/Button"
import { FaScrewdriver } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { createPost } from "../features/post/postSlice";
import { reset } from "../features/post/postSlice";
import { toast } from "react-toastify";

const CreatePost = () => {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        tags: ""
    });

    const {title, content, tags} = formData;

    const {isSuccess, isError, message} = useSelector((state) => state.posts);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if(isSuccess) {
            toast.success("Post Created")
            navigate("/")
        }
        dispatch(reset())
    }, [isSuccess, isError, message, reset, dispatch])

    const onChange = (event) => {
        setFormData((prevState) => ({
            ...prevState,
            [event.target.id]: event.target.value
        }))
    }

    const submitHandler = (event) => {
        event.preventDefault();

        dispatch(createPost(formData))
    }

    return (
        <>
            <div className="createPost-page">
                <BackButton url={"/"} />
                <span>
                    <h1 className="createPost-title">
                        <FaScrewdriver /> Create Post
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

export default CreatePost;