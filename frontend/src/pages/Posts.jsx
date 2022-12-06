import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {toast } from "react-toastify";
import { reset } from "../features/post/postSlice";
import { getAllPosts } from "../features/post/postSlice";
import PostItems from "../components/PostItems";
import BackButton from "../components/BackButton";
import { FaBattleNet, FaSearch } from "react-icons/fa";

const Posts = () => {
    const [searchItem, setSearchItem] = useState("");
    const {posts, isError, isSuccess, message} = useSelector((state) => state.posts);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllPosts())
    }, [dispatch]);

    useEffect(() => {
      return() => {
        if(isSuccess){
            dispatch(reset())
        }
      }
    }, [isSuccess, reset, dispatch]);

    const postMatches = (post, searchItem) => {
        if(post.title.toLowerCase().includes(searchItem.toLowerCase())) {
            return true;
        }
    }

    const filterPosts = posts.filter(post => postMatches(post, searchItem))
    const postsToDisplay = searchItem.length ? filterPosts : posts
    return (
        <>
            <div className="post-page">
                <BackButton url={"/"} />
                <span>
                    <h1 className="post-title">
                        <FaBattleNet /> Posts
                    </h1>
                </span>
            </div>

            <div className="search-bar">
                <div className="searchForm-group">
                    <input
                    type="text"
                    id="searchItem"
                    value={searchItem}
                    placeholder="Search..."
                    onChange={(event) => setSearchItem(event.target.value)}
                    />
                </div>
            </div>

            {postsToDisplay.map((post) => (
                <PostItems key={post.id} post={post} />
            ))}

        </>
        
    )
}

export default Posts;