import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams, Link } from 'react-router-dom'


const ShowBook = ({ }) => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        axios.get(`http://localhost:8000/book/${id}`)
            .then(({ data }) => {
                console.log(data)
                setTitle(data.title);
                setPages(data.pages);
            })
            .catch((err) => console.log(err))
    }, [])


    return (
        <div>
            <div id="header">
                <Link to="/"><h1>Go home</h1></Link>
                <h1>{title}</h1>
            </div>
            {
                pages.map((page, key) =>
                    <div key={key}>
                        <p>{page.text}</p>
                        <img src={page.imgUrl}></img>
                    </div>
                )
            }
        </div>
    )
}

export default ShowBook;