const hostButton = document.getElementById('host');
hostButton.style.height = (window.innerHeight * 0.2) + "px";
hostButton.style.width = (window.innerWidth * 0.2) + "px";
const audienceButton = document.getElementById('audience');
audienceButton.style.height = (window.innerHeight * 0.2) + "px";
audienceButton.style.width = (window.innerWidth * 0.2) + "px";

/* 「オーディエンス」ボタンを押したときの処理 */
audienceButton.onclick = () => {
    window.open("audience.html", null, "top=0,left=" + (screen.width - 500) + ",width=" + "500" + ",height=" + screen.availHeight);
};

/* 「主催者」ボタンを押したときの処理 */
hostButton.onclick = () => {
    var passInput = prompt("ワンタイムパスワードを入力してください");
    alert("input = " + passInput);
    
    const obj = {
        type: 'passCheck', 
        name: username, 
        content: message
    }
    ws.send(JSON.stringify(obj)); // JSON形式で送信

    // if(false) {
    //     window.open("host.html", null, "top=0,left=" + (screen.width - 500) + ",width=" + "500" + ",height=" + screen.availHeight);
    // } else {
    //     alert("パスワードが違います");
    // }
};

//？
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});