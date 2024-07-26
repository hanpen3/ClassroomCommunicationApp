const hostButton = document.getElementById('host');
hostButton.style.height = (window.innerHeight * 0.2) + "px";
hostButton.style.width = (window.innerWidth * 0.2) + "px";
const audienceButton = document.getElementById('audience');
audienceButton.style.height = (window.innerHeight * 0.2) + "px";
audienceButton.style.width = (window.innerWidth * 0.2) + "px";

const hostname = window.location.hostname;
const ws = new WebSocket(`ws://${hostname}:3000`);

var passInput

/* 「オーディエンス」ボタンを押したときの処理 */
audienceButton.onclick = () => {
    window.open("audience.html", "_blank", "top=0,left=" + (screen.width - 500) + ",width=" + "500" + ",height=" + screen.availHeight);
    // window.resizeTo(500, screen.availHeight);
    // window.moveTo(0, 0); 
};

/* 「主催者」ボタンを押したときの処理 */
hostButton.onclick = () => {
    window.close();
    const demandObj = {
        type: 'passDemand', 
        name: 'index', 
        content: 'demand'
    }
    ws.send(JSON.stringify(demandObj)); // JSON形式で送信

    passInput = prompt("ワンタイムパスワードを入力してください");
    
    const obj = {
        type: 'passCheck', 
        name: 'index', 
        content: passInput
    }
    ws.send(JSON.stringify(obj)); // JSON形式で送信
};

ws.onmessage = (event) => {
    const obj=JSON.parse(event.data); //JSON形式からオブジェクトに
    const type = obj.type; //データのタイプ
    const name = obj.name;
    const content = obj.content; //データの内容
    
    if((type==='passSend' && content == passInput)){
        window.open("host.html", null, "top=0,left=0, width=" + screen.availWidth + ",height=" + screen.availHeight);
    }
}

messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});

