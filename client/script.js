
const URL = "http://localhost:3000";
let socket = io.connect(URL);
let name = "";
socket.on("newpost", receivePost);

// Event call of SEND button on chat
function sendMessage()
{
    const textInput = document.getElementById("message");
    const message = textInput.value;
    textInput.value = "";
    textInput.focus();

    if(message != "") {
        addPost(name, message, true);
        sendPost(name, message);
    }
}

// Create the Post element
// which is the graphical representation of the message
function createPost(userName, userMessage) {
    let post = document.createElement("div");
    let user = document.createElement("div");
    let message = document.createElement("div");

    post.classList.add("post");

    user.innerText = userName;
    user.classList.add("user-name");

    message.innerText = userMessage;
    message.classList.add("user-message");

    post.appendChild(user);
    post.appendChild(message);

    return post;
}

// Add Post on users chat
function addPost(userName, userMessage, isMine) {
    const chatContent = document.getElementById("chat-content");
    const post = createPost(userName, userMessage);
    chatContent.appendChild(post);
    post.scrollIntoView();

    if(isMine)
        post.classList.add("this");
}

// Send the message to server
function sendPost(userName, userMessage) {
    socket.emit('newpost', {name: userName, message: userMessage});
}

// Receive the message from server
function receivePost(post) {
    addPost(post.name, post.message, false);
}


function submitUserName() {
    name = document.getElementById("username").value;
    document.getElementById("welcome").classList.remove("show");
}

document.addEventListener("keydown", event => {
    if(event.key == "Enter")
        sendMessage();
});

document.getElementById("welcome")
.addEventListener("keydown", event => {
    if(event.key == "Enter") {
        submitUserName();
        document.getElementById("message").focus();
    }
});