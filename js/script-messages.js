let messageCount = 0;
let accessToken = "";

async function login() {
    const url = "https://103.165.135.133:4433/getAccessToken";
    const credentials = {
        username: "pmsv-developer",
        password: "pmsv-developer-me"
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials),
            mode: 'cors',
            credentials: 'include'
        });
        const result = await response.json();
        
        if (result.status === "success") {
            accessToken = result.token;
            console.log("Login successful. Token:", accessToken);
            loadMessages();
        } else {
            console.error("Login failed:", result);
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
}

async function sendMessage(name, message) {
    const url = "https://103.165.135.133:4433/insertJson?srjy_msg";
    const data = {
        name: name,
        message: message,
        dtime: new Date().toISOString().slice(0, 19).replace("T", " "),
        secret: "none"
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": accessToken
            },
            body: JSON.stringify(data),
            mode: 'cors',
            credentials: 'include'
        });
        const result = await response.json();

        if (result.status === "success") {
            console.log("Message sent successfully:", result);
            loadMessages();
        } else {
            console.error("Failed to send message:", result);
        }
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

document.getElementById("message-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const message = document.getElementById("message").value.trim();

    if (name && message) {
        sendMessage(name, message);
        document.getElementById("name").value = "";
        document.getElementById("message").value = "";
    }
});

async function loadMessages() {
    const url = "https://103.165.135.133:4433/queryJsonDatabase?srjy_msg";
    const requestData = {
        secret: "none"
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": accessToken
            },
            body: JSON.stringify(requestData),
            mode: 'cors',
            credentials: 'include'
        });
        const result = await response.json();

        if (result.status === "success") {
            const chatBox = document.getElementById("chat-box");
            chatBox.innerHTML = "";

            result.data.forEach(msg => {
                const messageElement = document.createElement("div");
                messageElement.classList.add("message");

                messageElement.innerHTML = `
                    <h4>${msg.name}</h4>
                    <p>${msg.message}</p>
                    <time>${msg.dtime}</time>
                `;

                chatBox.appendChild(messageElement);
            });
            console.log("Messages loaded successfully.");
        } else {
            console.error("Failed to load messages:", result);
        }
    } catch (error) {
        console.error("Error loading messages:", error);
    }
}

login();