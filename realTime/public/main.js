const socket = io();

const selectionContainer = document.getElementById('selection-container');
const usernameContainer = document.getElementById('username-container');
const chatContainer = document.getElementById('chat-container');

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const saveButton = document.getElementById('save');
const setUserButton = document.getElementById('set-username');
const usernameInput = document.getElementById('username-input');
let username = '';

document.querySelectorAll('.selection-btn').forEach(button => {
    button.addEventListener('click', () => {
        selectionContainer.style.display = 'none';
        usernameContainer.style.display = 'flex';
    });
});

setUserButton.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username) {
        usernameContainer.style.display = 'none';
        chatContainer.style.display = 'flex';
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        const msg = `${username}: ${input.value}`;
        socket.emit('chat message', msg);
        input.value = '';
    }
});

socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight; // 自動スクロール
});

saveButton.addEventListener('click', () => {
    const messageItems = messages.querySelectorAll('li');
    let chatContent = '';
    messageItems.forEach(item => {
        chatContent += item.textContent + '\n';
    });
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat_log.txt';
    a.click();
    URL.revokeObjectURL(url);
});

// 初期表示設定
selectionContainer.style.display = 'flex';
