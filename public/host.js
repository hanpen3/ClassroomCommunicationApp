document.addEventListener('DOMContentLoaded', function() {
    const connectionCount = document.getElementById('connection-count');
    const worksheetBtn = document.getElementById('worksheet-btn');
    const voteBtn = document.getElementById('vote-btn');
    const endEventBtn = document.getElementById('end-event-btn');
    const chatMessages = document.getElementById('chat-messages');
    const questions = document.getElementById('questions');

    let connectedUsers = 0;

    const hostname = window.location.hostname;
    const ws = new WebSocket(`ws://${hostname}:3000`);

    //◎主催者はユーザ名の入力、入退出のログ必要？？

    // var username = prompt("ユーザー名");

    // ws.onopen = () => {
    //     const message = username + " さんが参加しました";
    //     const obj = {
    //         type: 'log', 
    //         content: message
    //     }
    //     ws.send(JSON.stringify(obj));
    // };

    // window.onbeforeunload = () => {
    //     const message = username + " さんが退出しました";
    //     const obj = {
    //         type: 'log',
    //         content: message
    //     }
    //     ws.send(JSON.stringify(obj));
    // };

    //メッセージを受信
    ws.onmessage = (event) => {
        const obj=JSON.parse(event.data); //JSON形式からオブジェクトに
        const type = obj.type; //データのタイプ
        const name = obj.name;
        const content = obj.content; //データの内容
    
        if(type==="log"){
            const message = document.createElement('div');
            message.textContent = content; // メッセージを文字列として処理
            chatMessages.appendChild(message);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }else if(type==="comment"){
            const message = document.createElement('div');
            message.textContent = name+": "+content; // メッセージを文字列として処理
            chatMessages.appendChild(message);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }else if(type==="question"){
            const message = document.createElement('div');
            message.textContent = name+": "+content; // メッセージを文字列として処理
            questions.appendChild(message);
            questions.scrollTop = questions.scrollHeight;
        }else if(type==="reaction"){
           /*リアクションを表示する */
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
            mainSpace.appendChild(image);
            mainSpace.scrollTop = mainSpace.scrollHeight;
        }
       
    };
    
    /* ホストがサーバーによって切断される場合の処理 */
    ws.onclose = (event) => {
        const message = document.createElement('div');
        message.textContent = "サーバーによって接続が切断されました"; // メッセージを表示
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };
    
    // 接続人数の更新（デモ用）
    setInterval(() => {
        connectedUsers = Math.floor(Math.random() * 100);
        connectionCount.textContent = `接続: ${connectedUsers}人`;
    }, 5000);

    // ボタンのクリックイベント
    worksheetBtn.addEventListener('click', () => {
        window.location.href = './events/worksheet.html';
    });
    
    voteBtn.addEventListener('click', () => {
        window.location.href = './events/vote.html';
    });
    
    /* イベント終了ボタンで全クライアントの接続を切断 */
    endEventBtn.addEventListener('click', () => {
        if (confirm('イベントを終了してもよろしいですか？')) {
            fetch('/disconnectAll')
                .then(response => response.text())
                .then(data => {
                    console.log(data);
                    window.location.href = './events/end-event.html';
                })
                .catch(error => console.error('Error:', error));
        }
    });

    // // チャットメッセージのデモ表示
    // function addChatMessage(message) {
    //     const messageElem = document.createElement('p');
    //     messageElem.textContent = message;
    //     chatMessages.appendChild(messageElem);
    //     chatMessages.scrollTop = chatMessages.scrollHeight;
    // }

    // // 質問のデモ表示
    // function addQuestion(question) {
    //     const questionElem = document.createElement('p');
    //     questionElem.textContent = question;
    //     questions.appendChild(questionElem);
    //     questions.scrollTop = questions.scrollHeight;
    // }

    // // デモメッセージと質問の追加
    // setInterval(() => {
    //     addChatMessage(`ユーザー${Math.floor(Math.random() * 100)}: こんにちは！`);
    //     if (Math.random() > 0.7) {
    //         addQuestion(`質問: これはどういう意味ですか？`);
    //     }
    // }, 3000);
});




















