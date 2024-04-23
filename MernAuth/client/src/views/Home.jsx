import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Home = () => {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const [username, setUsername] = useState("");
    const [books, setBooks] = useState([]);
    const [user, setUser] = useState({})
    useEffect(() => {
        const verifyCookie = async () => {
            if (!cookies.token) {
                navigate("/login");
            }
            const { data } = await axios.post(
                "http://localhost:8000/user",
                {},
                { withCredentials: true }
            );
            const { status, user, id } = data;
            setUsername(user);
            sessionStorage.setItem("userId", id)
            axios.get(`http://localhost:8000/user/${id}`)
                .then(({ data }) => {
                    setUser(data)
                    setBooks(data.books)
                })
                .catch(err => console.log(err));
                return status
                ? toast(`Hello ${user}`, {
                    position: "top-right",
                })
                : (removeCookie("token"), navigate("/login"));
        };
        verifyCookie();
    }, [cookies, navigate, removeCookie]);
    const Logout = () => {
        removeCookie("token");
        navigate("/signup");
    };
    const CreateStory = () =>{
        navigate("/new")
    }
    return (
        <>
            <div className="home_page">
                <h4>
                    Welcome <span>{username}</span>
                </h4>
                <button onClick={CreateStory}>Make a story</button>
                <button onClick={Logout}>LOGOUT</button>
                <h2>Here are your books!</h2>
                {books.map((book,key) =>
                <div  key={key}>
                    <p>Title:{book.title}</p>
                    <p>Page Count: {book.pages.length}</p>
                    <Link to={`/book/${book._id}`}>Read book</Link>
                </div>

            )}
            </div>
            <ToastContainer />
        </>
    );
};

export default Home;