const chat = document.getElementById('chat');
chat.style.height = (window.innerHeight * 0.9) + "px";
chat.style.width = (window.innerWidth * 0.9) + "px";
const messageInput = document.getElementById('message');
messageInput.style.height = (window.innerHeight * 0.05) + "px";
messageInput.style.width = (window.innerWidth * 0.7) + "px";
const commentButton = document.getElementById('comment');
commentButton.style.height = (window.innerHeight * 0.05) + "px";
commentButton.style.width = (window.innerWidth * 0.3) + "px";
const questionButton = document.getElementById('question');
questionButton.style.height = (window.innerHeight * 0.05) + "px";
questionButton.style.width = (window.innerWidth * 0.3) + "px";


const hostname = window.location.hostname;
const ws = new WebSocket(`ws://${hostname}:3000`);

var username = prompt("ユーザー名");

/*リアクションクリック時に実行する関数*/
function reactionClickListener(e){
    const id = e.target.getAttribute("id"); //クリックされた画像のidを得る
    const obj = {
        type: 'reaction',  
        content: id
    }
    ws.send(JSON.stringify(obj)); // JSON形式で送信
}

/*イベントリスナーを紐づける */
document.querySelectorAll('.reaction').forEach((element) => {
    element.addEventListener('click', reactionClickListener);
})

ws.onopen = () => {
    const message = username + " さんが参加しました";
    const obj = {
        type: 'log', 
        content: message
    }
    ws.send(JSON.stringify(obj));
};

window.onbeforeunload = () => {
    const message = username + " さんが退出しました";
    const obj = {
        type: 'log',
        content: message
    }
    ws.send(JSON.stringify(obj));
};

ws.onmessage = (event) => {
    const obj=JSON.parse(event.data); //JSON形式からオブジェクトに
    const type = obj.type; //データのタイプ
    const name = obj.name;
    const content = obj.content; //データの内容

    if(type==="log"){
        const message = document.createElement('div');
        message.textContent = content; // メッセージを文字列として処理
        chat.appendChild(message);
        chat.scrollTop = chat.scrollHeight;
    }else if(type==="comment"){
        const message = document.createElement('div');
        message.textContent = name+": "+content; // メッセージを文字列として処理
        chat.appendChild(message);
        chat.scrollTop = chat.scrollHeight;
    }else if(type==="question"){
        const message = document.createElement('div');
        message.textContent = name+": "+content; // メッセージを文字列として処理
        message.style.color = 'red';
        chat.appendChild(message);
        chat.scrollTop = chat.scrollHeight;
    }else if(type==="reaction"){
       /*リアクションを動かすのができないです */
       const image = document.createElement('img');
       if(content==="good"){
            image.src="./images/clear_good.png";
       }else if(content==="bad"){
            image.src="./images/clear_bad.png";
       }else if(content==="hatena"){
            image.src="./images/clear_hatena.png";
       }else if(content==="bikkuri"){
            image.src="./images/clear_bikkuri.png";
       }else if(content==="heart"){
            image.src="./images/clear_heart.png";
       }
       image.width=30;
       image.height=30;
       chat.appendChild(image);
    }
};

/* クライアントがサーバーによって切断される場合の処理 */
ws.onclose = (event) => {
    const message = document.createElement('div');
    message.textContent = "サーバーによって接続が切断されました"; // メッセージを表示
    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;
};

commentButton.onclick = () => {
    const message = messageInput.value;
    if (message) {
        const obj = {
            type: 'comment', 
            name: username, 
            content: message
        }
        ws.send(JSON.stringify(obj)); // JSON形式で送信
    messageInput.value = '';
    }
};

questionButton.onclick = () => {
    const message = messageInput.value;
    if (message) {
        const obj = {
            type: 'question', 
            name: username, 
            content: message
        }
        ws.send(JSON.stringify(obj)); // JSON形式で送信
    messageInput.value = '';
    }
};

messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
    commentButton.click();
    }
});

