import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const CreateBook = () => {
    const [userPrompt, setUserPrompt] = useState("");
    const [artStyle, setArtStyle] = useState("");

    const navigate = useNavigate();

    const [userPromptError, setUserPromptError] = useState("Must ask a question");
    const [isSubmitted, setIsSubmitted] = useState(false)

    const formHandler = (e) => {
        e.preventDefault();
        setIsSubmitted(true)
        if(userPromptError == ""){
            const storyDetails = {
                userPrompt: userPrompt,
                artStyle: artStyle,
                userId: sessionStorage.getItem("userId")
            }
            createStory(storyDetails);
            navigate("/");
        }
    }

    const handleUserPrompt = (e) => {
        setUserPrompt(e.target.value)
        if (e.target.value.length < 1) {
            setUserPromptError("A question is required");
        }
        else {
            setUserPromptError("");
        }
    }

    const handleArtStyle = (e) => {
        setArtStyle(e.target.value)
    }


    const createStory = (storyDetails) => {
        axios.post("http://localhost:8000/book/generate", storyDetails)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    return (
        <div>
            <div id="header">
                <h1>Lets make a story</h1>
                <Link to="/">Go Back Home</Link>
            </div>
            <form id="create_form" onSubmit={formHandler}>
                <div className="form_element">
                    What do you want to know:<input type="text" value={userPrompt} onChange={e => handleUserPrompt(e)}/>
                    {userPromptError && isSubmitted ? <p className="errors">{userPromptError}</p>:<p className="errors"></p>}
                </div>
                <div className="form_element">
                    Do you like a certain style of art:<input type="text" value={artStyle} onChange={e => handleArtStyle(e)}/>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default CreateBook;