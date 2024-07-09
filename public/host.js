document.addEventListener('DOMContentLoaded', function() {
    const worksheetBtn = document.getElementById('worksheet-btn');
    const voteBtn = document.getElementById('vote-btn');
    const endEventBtn = document.getElementById('end-event-btn');
    const chatMessages = document.getElementById('chat-messages');
    const questions = document.getElementById('questions');

    const hostname = window.location.hostname;
    const ws = new WebSocket(`ws://${hostname}:3000`);

    var num_of_connection = 0;

    /*自分が主催者であることをサーバに送信 */
    ws.onopen = () => {
        const obj = {
            type: 'host'
        }
        ws.send(JSON.stringify(obj)); // JSON形式で送信
    }
    
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
            /*コメントの処理*/
            const message = document.createElement('div');
            message.textContent = name+": "+content; // メッセージを文字列として処理
            chatMessages.appendChild(message);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }else if(type==="question"){
            /*質問の処理*/
            const message = document.createElement('div');
            message.textContent = name+": "+content; // メッセージを文字列として処理
            questions.appendChild(message);
            questions.scrollTop = questions.scrollHeight;
        }else if(type==="connection"){
            /*同時接続数の更新( + )*/
            num_of_connection++;
            const connectionCount = document.getElementById('connection-count');
            connectionCount.textContent = `接続: ${num_of_connection}人`; // 文字列として処理 : 主催者も含まれるので、-1 する
        }else if(type==="disconnection"){
            /*同時接続数の更新( - )*/
            num_of_connection--;
            const connectionCount = document.getElementById('connection-count');
            connectionCount.textContent = `接続: ${num_of_connection}人`; // 文字列として処理 : 主催者も含まれるので、-1 する
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

    // ボタンのクリックイベント
    worksheetBtn.addEventListener('click', () => {
        mainSpace.innerHTML=''; //mainSpaceを空にする
        const form=document.createElement('form');

        const titleLabel=document.createElement('label');
        titleLabel.textContent = 'お題を入力: ';
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.id = 'worksheetTitle';
        form.appendChild(titleLabel);
        form.appendChild(titleInput);
        form.appendChild(document.createElement('br')); //改行

        const startButton = document.createElement('button');
        startButton.type = 'button';
        startButton.textContent = 'ワークシートを実施';
        startButton.id = 'startWorkSheetButton';
        form.appendChild(startButton);

        mainSpace.appendChild(form);
        mainSpace.scrollTop = mainSpace.scrollHeight;
        //window.location.href = './events/worksheet.html';

        startButton.onclick = () => {
            const message = titleInput.value;
            if (message) {
                const obj = {
                    type: 'worksheet', 
                    name: 'server',
                    content: message
                }
                ws.send(JSON.stringify(obj)); // JSON形式で送信
                titleInput.value = '';
                alert('ワークシートの内容が送信されました！');
            }else {
                alert('ワークシートの内容が空です。');
            }
        };

    });

    
    
    //投票ボタンが押された場合(汎用スペースに投票の設定を表示できるようにする)
    voteBtn.addEventListener('click', () => {
        mainSpace.innerHTML=''; //mainSpaceを空にする
        const form=document.createElement('form');

        const titleLabel=document.createElement('label');
        titleLabel.textContent = '投票のお題: ';
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.id = 'voteTitle';
        form.appendChild(titleLabel);
        form.appendChild(titleInput);
        form.appendChild(document.createElement('br')); //改行
        
        const optionsLabel = document.createElement('label');
        optionsLabel.textContent = '択数: ';
        const optionsSelect = document.createElement('select');
        optionsSelect.id = 'optionsNumber';
        for (let i = 2; i <= 8; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            optionsSelect.appendChild(option);
        }
        form.appendChild(optionsLabel);
        form.appendChild(optionsSelect);
        form.appendChild(document.createElement('br'));

        const optionsContainer = document.createElement('div');
        optionsContainer.id = 'optionsContainer';
        form.appendChild(optionsContainer);
        form.appendChild(document.createElement('br'));

        const multipleLabel = document.createElement('label');
        multipleLabel.textContent = '複数選択可: ';
        const multipleCheckbox = document.createElement('input');
        multipleCheckbox.type = 'checkbox';
        multipleCheckbox.id = 'multipleSelection';
        form.appendChild(multipleLabel);
        form.appendChild(multipleCheckbox);
        form.appendChild(document.createElement('br'));

        const startButton = document.createElement('button');
        startButton.type = 'button';
        startButton.textContent = '投票を開催';
        startButton.id = 'startVoteButton';
        form.appendChild(startButton);

        mainSpace.appendChild(form);

        /*選択肢の個数の更新（択数の変化に応じて）*/
        function updateOptions() {
            const optionsNumber = parseInt(optionsSelect.value);
            optionsContainer.innerHTML = '';
            for (let i = 0; i < optionsNumber; i++) {
                const optionLabel = document.createElement('label');
                optionLabel.textContent = `選択肢${i + 1}: `;
                const optionInput = document.createElement('input');
                optionInput.type = 'text';
                optionInput.name = `option${i + 1}`;
                optionsContainer.appendChild(optionLabel);
                optionsContainer.appendChild(optionInput);
                optionsContainer.appendChild(document.createElement('br'));
            }
        }
        updateOptions();
        optionsSelect.addEventListener('change', updateOptions);

        mainSpace.scrollTop = mainSpace.scrollHeight;
        
        //window.location.href = './events/vote.html';
    });
    
    /* イベント終了ボタンで全クライアントの接続を切断 */
    endEventBtn.addEventListener('click', () => {
        if (confirm('イベントを終了してもよろしいですか？')) {
            fetch('/disconnectAll')
                .then(response => response.text())
                .then(data => {
                    console.log(data);

                    /*コメントと質問のログを取得する処理を追加*/
                    var Items = chatMessages.querySelectorAll('div');
                    let chatContent='';
                    chatContent+='【コメント】\n'
                    Items.forEach(item => {
                        chatContent += item.textContent+'\n'
                    });
                    chatContent+='\n【質問】\n'
                    Items = questions.querySelectorAll('div');
                    Items.forEach(item => {
                        chatContent += item.textContent+'\n'
                    });
                    const blob = new Blob([chatContent], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'comments_questions_log.txt';
                    a.click();
                    URL.revokeObjectURL(url);

                    

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




















