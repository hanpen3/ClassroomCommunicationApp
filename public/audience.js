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
const exitButton = document.getElementById('exit');
exitButton.style.height = (window.innerHeight * 0.04) + "px";
exitButton.style.width = (window.innerWidth * 0.2) + "px";
const eventName = document.getElementById('eventName');
const anonymous = document.getElementById('anonymous');

const hostname = window.location.hostname;
const ws = new WebSocket(`ws://${hostname}:3000`);

var username;
while(!(username = prompt("ユーザー名"))){
    ;
}

/*リアクションクリック時に実行する関数*/
function reactionClickListener(e){
    const id = e.target.getAttribute("id"); //クリックされた画像のidを得る
    const obj = {
        type: 'reaction',  
        content: id
    }
    ws.send(JSON.stringify(obj)); // JSON形式で送信
}

ws.onopen = () => {
    const message = "server: " + username + " さんが参加しました";
    const obj_log = {
        type: 'login', 
        content: message
    }
    const obj_eventNameRequest = {
        type: 'eventNameRequest', 
        content: null
    }
    ws.send(JSON.stringify(obj_log));
    ws.send(JSON.stringify(obj_eventNameRequest));
}

window.onbeforeunload = () => {
    const message = "server: " + username + " さんが退出しました";
    const obj_log = {
        type: 'logout',
        content: message
    }
    ws.send(JSON.stringify(obj_log));
};

/*イベントリスナーを紐づける */
document.querySelectorAll('.reaction').forEach((element) => {
    element.addEventListener('click', reactionClickListener);
})

ws.onmessage = (event) => {
    const obj = JSON.parse(event.data); // JSON形式からオブジェクトに
    const type = obj.type; // データのタイプ
    const name = obj.name;
    const content = obj.content; // データの内容

    const message = document.createElement('div');
    if (type === "login" || type === "logout") {
        message.textContent = content; // メッセージを文字列として処理
        chat.insertBefore(message, chat.firstChild); // メッセージをリストの最初に挿入
        chat.scrollTop = 0; // スクロール位置を最上部に設定
    } else if (type === "comment" || type === "question") {
        if (content.anonymous) { // 匿名の場合
            message.textContent = content.message;
        } else {
            message.textContent = name + ": " + content.message;
        }
        if (type === "question") {
            message.style.color = 'red';
        }
        chat.insertBefore(message, chat.firstChild); // メッセージをリストの最初に挿入
        chat.scrollTop = 0; // スクロール位置を最上部に設定
    } else if (type === "worksheet") {
        const popup = window.open("./audience-events/worksheet.html", "_blank", "top=0,left=0,width=500,height=500");
        popup.onload = () => popup.postMessage(content, window.location.origin);
    } else if (type === "vote") {
        const popup = window.open("./audience-events/voteAnswer.html", "_blank", "top=0,left=0,width=500,height=500");
        popup.onload = () => popup.postMessage(content, window.location.origin);
    } else if (type === "voteResult") {
        const popup = window.open("./audience-events/voteResult.html", "_blank", "top=0,left=0,width=500,height=500");
        popup.onload = () => popup.postMessage(content, window.location.origin);
    } else if (type === "reaction") {
        const image = document.createElement('img');
        if (content === "good") {
            image.src = "./images/clear_good.png";
        } else if (content === "bad") {
            image.src = "./images/clear_bad.png";
        } else if (content === "hatena") {
            image.src = "./images/clear_hatena.png";
        } else if (content === "bikkuri") {
            image.src = "./images/clear_bikkuri.png";
        } else if (content === "heart") {
            image.src = "./images/clear_heart.png";
        }
        image.width = 30;
        image.height = 30;
        image.classList.add('reaction-animation');
        chat.scrollTop = chat.scrollHeight;

        const chatContainer = document.getElementById('chat-container');  // チャットコンテナ要素を取得
        // ランダムな水平位置を設定
        const maxLeft = chatContainer.clientWidth - image.width;  // 最大の左位置
        const randomLeft = Math.floor(Math.random() * maxLeft);  // ランダムな左位置を計算
        image.style.left = `${randomLeft}px`;  // 画像の左位置を設定

        chatContainer.appendChild(image);  // 画像要素をチャットコンテナに追加

        // アニメーション終了後に要素を削除
        setTimeout(() => {
            image.remove();
        }, 3000);
    } else if (type === "eventNameSet") {
        eventName.textContent = obj.content;
    }
};


/* ワークシートの内容を受け取った時の処理 */
window.addEventListener('message', (event) => {
    if (event.origin === window.location.origin) { // オリジンを確認
        const obj= event.data;
        obj.name = username;
        ws.send(JSON.stringify(obj));
    }
});

/* クライアントがサーバーによって切断される場合の処理 */
ws.onclose = (event) => {
    const message = document.createElement('div');
    message.textContent = "サーバーによって接続が切断されました"; // メッセージを表示
    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;
};

commentButton.onclick = () => {
    const info = {
        message: messageInput.value,  
        anonymous: anonymous.checked
    }
    if (info.message) {
        const obj = {
            type: 'comment', 
            name: username, 
            content: info
        }
        ws.send(JSON.stringify(obj)); // JSON形式で送信
        messageInput.value = '';
    }
};

questionButton.onclick = () => {
    const info = {
        message: messageInput.value,  
        anonymous: anonymous.checked
    }
    if (info.message) {
        const obj = {
            type: 'question',
            name: username, 
            content: info
        }
        ws.send(JSON.stringify(obj)); // JSON形式で送信
    messageInput.value = '';
    }
};

exitButton.onclick = () => {
    if(confirm("本当に退出しますか？")){
        // const message = "server: " + username + " さんが退出しました";
        // const obj_log = {
        //     type: 'logout', 
        //     content: message
        // }
        window.close();
    }
};

messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
    commentButton.click();
    }
});


