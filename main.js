const socket = io()
let username = ""
let connectedUserList = []
let messageContent = ""

const mainPage = document.getElementById("mainPage")
const inputText = document.getElementById("inputText")
const loginPage = document.getElementById("loginPage")
const inputName = document.getElementById("inputName")
const messagesList = document.getElementById("messages")
const userList = document.getElementById("userList")


inputName.addEventListener("keyup" , (e) => {
    if (e.code === "Enter") {
        const name = inputName.value.trim()
        if (name !== "") {
            username = name
            loginPage.style.display = "none"
            mainPage.style.display = "grid"
            document.title = `Chat ${username}`

            informationExchage.joinChat()
            informationExchage.userList()
           
            addMessage("status", null, "Conectado!")
        }
    }
})
inputText.addEventListener("keyup" , (e)  => {
    if (e.code === "Enter") {
        messageContent = ""
        messageContent = inputText.value.trim()
        if (messageContent !== "") {
          informationExchage.sendMessage()

          inputText.value = ""
        }
    }
})


const informationExchage = {
//Emit
    joinChat: () => {
        socket.emit ("join-request", username)
    },
    sendMessage: () => {
        socket.emit("send-message", messageContent)
    },
//Recive
    userList: () => {
        socket.on("user-list", (data) => {
            connectedUserList = data.list
            loadUserList()
        })
    },
    userBroadcastUpdate: () => {
        socket.on("users-update", (data) => {
            connectedUserList = data.list
            loadUserList()   
        if (data.join) {
            addMessage("msg", data.join, "Entou no chat")
        }
        else{
            if (data.left !== undefined) {
            addMessage("msg", data.left, "Saiu do chat")
            }
        }
            
        })   
    },
    messageList: () => {
        socket.on("message-list", (data) => {
            username = data.username
            message = data.message
           
            addMessage("msg", data.username, data.message)
        })
    },
    messageListBroadcastUpdate: () => {
        socket.on("messages-update", (data) => {
            addMessage('msg', data.username, data.message);
        })
    },
    disconnect: () => {
        socket.on("disconnect", () => {
            addMessage("status", null, "Você foi desconectado")
            addMessage("status", null, "Você será redirecionado para tela de login")
            setTimeout(() => {
                loginPage.style.display = "flex"
                mainPage.style.display = "none"
            }, 5000);
    })
    },
}
// call recive functions
informationExchage.userList()
informationExchage.userBroadcastUpdate()
informationExchage.messageList()
informationExchage.messageListBroadcastUpdate()
informationExchage.disconnect()
const loadUserList = () => {
    userList.innerHTML = ""

    connectedUserList.forEach(user => {
         addUser(user)
    });

    inputText.focus()
}

function addMessage(type, user, msg) {

    switch(type) {
        case 'status':
            messagesList.innerHTML += '<li class="m-status">'+msg+'</li>';
        break;
        case 'msg':
            if(username == user) {
                messagesList.innerHTML += '<li class="m-txt"><span class="me">'+user+'</span> '+msg+'</li>';
            } else {
                messagesList.innerHTML += '<li class="m-txt"><span>'+user+'</span> '+msg+'</li>';
            }
        break;
    }

    messagesList.scrollTop = messagesList.scrollHeight;
}
function addUser(user) {
    if(username == user) {
        userList.innerHTML += '<li class="m-txt" ><span class="me">'+user+' <i> - você </i></span></li>';
    } else {
        userList.innerHTML += '<li class="m-txt"><span>'+user+'</span></li>';
    }
}