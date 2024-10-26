// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getDatabase, onValue, onChildAdded, ref, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1rZcY5a-ZVCSkx8OHZfUjiap9m9HORfc",
  authDomain: "wedding-asset.firebaseapp.com",
  databaseURL: "https://wedding-asset-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wedding-asset",
  storageBucket: "wedding-asset.appspot.com",
  messagingSenderId: "326774812708",
  appId: "1:326774812708:web:0ae902bbddba303a3d28b1",
  measurementId: "G-7YZGCJP12D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();
const messagesForCouple = ref(db, "messages-for-couple");
let messageCount = 0;

function generateUUID() {
    const timestamp = Date.now().toString(16);
    const randomPart = Math.random().toString(16).substring(2, 10);
    return `${timestamp}-${randomPart}`;
}

export function sendMessage() {
    const userName = document.getElementById("name").value.trim();
    const userMessage = document.getElementById("message").value.trim();
    const reference = ref(db, "messages-for-couple/" + generateUUID());

    set(reference, {
        name: userName,
        message: userMessage,
        dtime: new Intl.DateTimeFormat("id-ID", {
            timeZone: "Asia/Makassar",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).format(new Date()).replace(",", "")
    });
    document.getElementById("name").value = "";
    document.getElementById("message").value = "";
}

onChildAdded(messagesForCouple, (msg) => {
    const chatBox = document.getElementById("chat-box");
    var kname = "";
    var kmsg = "";
    var kdtime = "";
    msg.forEach(element => {
        const messageObj = element.val();
        if (element.key == "dtime") {
            kdtime = element.val();
        } else if (element.key == "message") {
            kmsg = element.val();
        } else if (element.key == "name") {
            kname = element.val();
        }
    });
    console.log("name: " + kname + " message: " + kmsg + " time: " + kdtime);
    if (kname != "" && kmsg != "" && kdtime != ""){
        messageCount++;
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.innerHTML = `
            <h4>${kname}</h4>
            <p>${kmsg}</p>
            <time>${kdtime}</time>
        `;
        chatBox.appendChild(messageElement);
        const mcount = document.getElementById("message-count");
        mcount.innerText = messageCount + " Pesan & Doa";
    }
}, {
    onlyOnce: false
});

document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector("#sendButton");
    button.addEventListener("click", sendMessage);
});