import dotenv from 'dotenv';
dotenv.config()

let oldKey = process.env.AWS_ACCESS_KEY_ID;

import S3Upload2 from "./S3Upload.js";

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer " + oldKey);

let story = "";
let bookTitle = "";
let storyArr = [];
let visionList = [];
let imageList = [];
let artStyle;
let imageObj = {};

const s3BucketName = 'story-book-ai';

const getStory = async (storyInfo) => {
    story = "";
    storyArr = [];
    visionList = [];
    imageList = [];
    artStyle;


    console.log("getting story.. prompt was: " + storyInfo.userPrompt)
    let prompt = "You are a childrens book author. Children will ask you questions, and you should respond with responses tailored to an eight year old. Maximum of 5 paragraphs long. Include imagery and descriptions. Do not mention yourself. Here is the childs question, " + storyInfo.userPrompt
    let messages = [{
        "role": "user",
        "content": prompt
    }]
    let raw = JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": messages,
        "temperature": 0.7
    });
    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    await fetch("https://api.openai.com/v1/chat/completions", requestOptions)
        .then(response => response.json())
        .then(result => {
            story = result.choices[0].message.content;
        })
        .catch(error => console.log('error', error));
}

const getTitle = async () => {
    console.log("getting title")
    let messages = [{
        "role": "user",
        "content": `Create a short title for this childrens story book, here is the story. ${story}`
    }]
    let raw = JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": messages,
        "temperature": 0.7
    });
    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    await fetch("https://api.openai.com/v1/chat/completions", requestOptions)
        .then(response => response.json())
        .then(result => {
            bookTitle = result.choices[0].message.content;
            console.log(bookTitle);
        })
        .catch(error => console.log('error', error));
}

const getArtStyle = async () => {
    console.log("getting style")
    let messages = [{
        "role": "user",
        "content": 'Choose a random art style, only a few words'
    }]
    let raw = JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": messages,
        "temperature": 0.7
    });
    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    await fetch("https://api.openai.com/v1/chat/completions", requestOptions)
        .then(response => response.json())
        .then(result => {
            artStyle = result.choices[0].message.content;
            console.log(artStyle);
        })
        .catch(error => console.log('error', error));
}

const applyStyle = async (storyInfo) => {
    if (storyInfo.artStyle == "") {
        await getArtStyle();
    } else {
        artStyle = storyInfo.artStyle
    }
}

const makeParagraphList = () => {
    storyArr = story.split('\n');
    for (let i in storyArr) {
        if (storyArr[i] == "") {
            storyArr.splice(i, 1);
        }
        imageList[i]=""
    }
}

const generateVision = (currentIndex, requestOptions) => {
    return new Promise((resolve, reject) => {
        fetch("https://api.openai.com/v1/chat/completions", requestOptions)
            .then(response => response.json())
            .then(result => {
                let visual = result.choices[0].message.content;
                visionList[currentIndex] = visual;
                resolve(visionList[currentIndex], currentIndex)
            })
    })
}

const getVisualDescriptions = async () => {
    console.log("getting visions");
    return new Promise((resolve, reject) => {
        let gotBack = 0;
        let i = 0;
        for (let paragraph of storyArr) {
            console.log(paragraph)
            let messages = [{
                "role": "user",
                "content": `Im making a childrens book, Im going to give you the text from a single page. Come up with a description for an image that would help convey the idea of the text. The art style is ${artStyle}. Try to limit the response to 4 sentences. Here is the text, "${paragraph}" `
            }]
            console.log(artStyle)
            let raw = JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": messages,
                "temperature": 0.7
            });
            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            // await fetch("https://api.openai.com/v1/chat/completions", requestOptions)
            //     .then(response => response.json())
            //     .then(result => {
            //         let visual = result.choices[0].message.content;
            //         visionList.push(visual);
            //     })
            generateVision(i, requestOptions)
                .then(() => {
                    // console.log("checking "+visionList.length+" against " + storyArr.length)
                    gotBack++
                })
                .then(() => {
                    if (gotBack == storyArr.length) {
                        resolve()
                    }
                })
                .catch(error => console.log('error', error));
            i++
        }
    });
}

const breakParagraphs = () => {
    for (let i in storyArr) {
        storyArr[i] = storyArr[i].match(/[^.!?]+[.!?]+/g)
    }
}

const generateImage = (currentIndex, requestOptions) => {
    return new Promise((resolve, reject) => {
        fetch("https://api.openai.com/v1/images/generations", requestOptions)
            .then((result) => (result.json())
            )
            .then((result) => {
                try{
                    if(result.data[0].url){
                        imageList[currentIndex] = result.data[0].url;
                    }else{
                        imageList[currentIndex] = "";
                    }
                }catch(err){
                    reject(err)
                    return
                }
                resolve(imageList[currentIndex], currentIndex);
            })
            .catch((error)=>{
                console.log(error)
            })
    });
};

const makeImages = async () => {
    return new Promise((resolve, reject) => {
        console.log(`Getting ${storyArr.length} pics`);
        let gotBack = 0;
        let i = 0;
        for (let vision of visionList) {
            console.log(`Getting image ${i + 1} of ${storyArr.length}`)
            let prompt = `Make an illustration for a childrens book. The art style is ${artStyle}. ${vision}`
            let raw = JSON.stringify({
                "model": "dall-e-3",
                "prompt": prompt
            });
            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            // fetch("https://api.openai.com/v1/images/generations", requestOptions)
            //     .then(response => response.json())
            //     .then(result => {
            //         console.log()
            //         let image = result.data[0].url;
            //         imageList.push(image)
            //     })
            generateImage(i, requestOptions)
                .then(() => {
                    gotBack++
                    console.log("Recieved img " + gotBack)
                })
                .then(() => {
                    if (gotBack == visionList.length) {
                        resolve()
                    }
                })
                .catch(error => {
                    console.log('error', error);
                    imageList[i]='https://i.imgur.com/E0dhzSR.jpeg';
                })
            i++
        };
    });
};

const sleeper = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
    });
}

const buildStoryBook = () => {
    pageLeftTextTop.innerText = "";
    pageLeftTextBottom.innerText = "";
    let i = currentPage - 1;
    for (let j in storyArr[i]) {
        if (j < Math.floor(storyArr[i].length / 2)) {
            pageLeftTextTop.innerText += storyArr[i][j];
            continue
        }
        pageLeftTextBottom.innerText += storyArr[i][j];
    }
    pageLeftImg.src = imageList[i];

    pageRightTextTop.innerText = "";
    pageRightTextBottom.innerText = "";
    let k = currentPage;
    if (storyArr[k]) {
        for (let j in storyArr[k]) {
            if (j < Math.floor(storyArr[k].length / 2)) {
                pageRightTextTop.innerText += storyArr[k][j];
                continue
            }
            pageRightTextBottom.innerText += storyArr[k][j];
        }
        pageRightImg.src = imageList[k];
    } else {
        pageRightTextTop.innerText = "The End";
        pageRightImg.src = "";

    }
}

const pageDown = () => {
    currentPage -= 2
    let index = currentPage - 1;
    if (index < 0) {
        currentPage = 1
    }
    console.log(currentPage)
    buildStoryBook();
}

const pageUp = () => {
    currentPage += 2
    let index = currentPage - 1;
    if (index > storyArr.length - 1) {
        currentPage = storyArr.length;
    }
    console.log(currentPage)
    buildStoryBook();
}

const generateBook = async (storyInfo) => {
    console.log()
    await getStory(storyInfo);
    await getTitle()
    makeParagraphList();
    await applyStyle(storyInfo);
    await getVisualDescriptions();
    await sleeper(500);
    // breakParagraphs();
    await makeImages();
    // buildStoryBook();
    
    let pages = []
    for (let i in storyArr) {
        let s3ObjectKey = `story-book-ai/Images/${bookTitle}/${i}.jpg`;
        let page = {
            text: storyArr[i],
            imgUrl: `https://${s3BucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3ObjectKey}`
        }
        pages.push(page);
        S3Upload2(imageList[i], bookTitle, i)
    }
    let newBook = {
        title: bookTitle,
        pages: pages,
        userId: storyInfo.userId
    }
    console.log(newBook)
    return newBook
};

function convertToBase64(url) {

    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const reader = new FileReader();

            reader.onload = function () {
                const base64Url = reader.result;
                return base64Url;
            };

            reader.readAsDataURL(blob);
        })
        .catch(error => console.error('Error fetching image:', error));
}

export default generateBook;

