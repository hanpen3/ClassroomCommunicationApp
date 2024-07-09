window.addEventListener('message', (event) => {
    if (event.origin === window.location.origin && event.data.id) {
        document.getElementById("title").textContent = event.data;
    }
});

worksheetBtn.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
        const obj = {
            type: 'worksheetSend', 
            name: username, 
            content: message
        }
        ws.send(JSON.stringify(obj)); // JSON形式で送信
    messageInput.value = '';
    }
    const textContent = document.getElementById("textbox").value;
    window.close(); 
});