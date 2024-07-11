const sendButton = document.getElementById('send');
const Input = document.getElementById('textbox');

window.addEventListener('message', (event) => {
    if (event.origin === window.location.origin) {
        document.getElementById("title").textContent = event.data;
    }
});

sendButton.addEventListener('click', () => {
    const message = Input.value;
    if (message) {
        const obj = {
            type: 'worksheetSend', 
            name: "popUp", 
            content: message
        };
        Input.value = '';

        // 元のウィンドウにメッセージを送信
        if (window.opener) { // 元のウィンドウが存在するか確認
            window.opener.postMessage(obj, window.location.origin); 
        }

        window.close();
    }
});