import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import Posts from "./pages/Posts";
import PrivateRoute from "./pages/PrivateRoute";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import AllTags from "./pages/AllTags";
import PostById from "./pages/PostById";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AllUsers from "./pages/AllUsers";

function App() {
  return (
    <>
      <Router>
        <div>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/allUsers" element={<PrivateRoute />}>
              <Route path="/allUsers" element={<AllUsers />} />
            </Route>
            <Route path="/allPosts" element={<Posts />} />
            <Route path="/createPost" element={<PrivateRoute />}>
                <Route path="/createPost" element={<CreatePost />} />
            </Route>
            <Route path="/edit/:postId" element={<PrivateRoute />}>
                <Route path="/edit/:postId" element={<EditPost />} />
            </Route>
            <Route path="/post/:postId" element={<PostById />} />
            <Route path="/allTags" element={<AllTags />} />
          </Routes>
        </div>
      </Router>

      <ToastContainer />
    </>
  )
}

export default App;
