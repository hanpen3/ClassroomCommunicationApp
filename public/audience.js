const chat = document.getElementById('chat');
chat.style.height = (window.innerHeight * 0.9) + "px";
chat.style.width = (window.innerWidth * 0.9) + "px";
const messageInput = document.getElementById('message');
messageInput.style.height = (window.innerHeight * 0.05) + "px";
messageInput.style.width = (window.innerWidth * 0.7) + "px";
const sendButton = document.getElementById('send');
sendButton.style.height = (window.innerHeight * 0.05) + "px";
sendButton.style.width = (window.innerWidth * 0.2) + "px";

const hostname = window.location.hostname;
const ws = new WebSocket(`ws://${hostname}:3000`);

var username = prompt("ユーザー名");

ws.onopen = () => {
    ws.send(username + " さんが参加しました");
}

window.onbeforeunload = () => {
    ws.send(username + " さんが退出しました");
};

ws.onmessage = (event) => {
    const message = document.createElement('div');
    message.textContent = event.data; // メッセージを文字列として処理
    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;
};

sendButton.onclick = () => {
    const message = messageInput.value;
    if (message) {
    ws.send(username + ": " + message); // 文字列として送信
    messageInput.value = '';
    }
};

messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
    sendButton.click();
    }
});