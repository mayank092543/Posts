import BackButton from "../components/BackButton";
import { FaTags } from "react-icons/fa";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getPostByTag, reset } from "../features/tag/tagSlice";
import { toast } from "react-toastify";

const AllTags = () => {
    const [searchTag, setSearchTag] = useState("");
    const dispatch = useDispatch();

    const { postByTag } = useSelector((state) => state.tag)

    const submitHandler = (event) => {
        event.preventDefault();

        dispatch(getPostByTag(searchTag))
        setSearchTag("");
        dispatch(reset());
    }

    return (
        <>
            <div className="tag-page">
                <BackButton url={"/"} />
                <span>
                    <h1 className="tag-title">
                        <FaTags /> Search Post By Tag
                    </h1>
                </span>
            </div>

            <form className="search-bar-btn" onSubmit={submitHandler}>
                <div className="search-input-field">
                    <input
                    type="text"
                    id="searchTag"
                    value={searchTag}
                    placeholder="Search..."
                    onChange={(event) => setSearchTag(event.target.value)}
                    />
                </div>
    
                <div className="search-btn">
                    <Button type="submit" variant="outline-primary">
                        <FaSearch />
                    </Button>
                </div>
            </form>

            <div className="tag-info">
                {postByTag.map((post) => (
                    <div key={post.id}>
                        <p className="title">{post.title}</p>
                        <h2>{post.content}</h2>
                        {post.tags.map((tag) => (
                            <h3 key={tag.id}>{tag.name}</h3>
                        ))}
                        <h4>Username: {post.author.username}</h4> <br></br>
                    </div>
                ))}
                <hr />
            </div>
        </>
    )
}

export default AllTags;