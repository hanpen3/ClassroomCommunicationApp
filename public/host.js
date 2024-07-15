document.addEventListener('DOMContentLoaded', function() {
const worksheetBtn = document.getElementById('worksheet-btn');
const voteBtn = document.getElementById('vote-btn');
const endEventBtn = document.getElementById('end-event-btn');
const worksheet_ans_Btn = document.getElementById('worksheet-ans-btn'); // ワークシートの回答ダウンロード処理のテスト用ボタン
const chatMessages = document.getElementById('chat-messages');
const questions = document.getElementById('questions');
const mainSpace = document.getElementById('mainSpace');
const event = document.getElementById('eventName');


const hostname = window.location.hostname;
const ws = new WebSocket(`ws://${hostname}:3000`);
    
const worksheet_ans = []; // 回答保存用配列

var num_of_connection = 0;

var eventName = prompt("イベント名を入力");
event.textContent = eventName;

    let chatCount = 0;  //コメントの数
    let questionCount = 0;  //質問の数

    /*自分が主催者であることをサーバに送信 */
ws.onopen = () => {
    const obj = {
        type: 'host',
        name: 'host',
        content: ''
    }
    ws.send(JSON.stringify(obj)); // JSON形式で送信
    const obj_name = {
        type: 'eventName',
        name: 'host',
        content: eventName
    }
    ws.send(JSON.stringify(obj_name)); // JSON形式で送信
}

    // チャットメッセージの高さ調整
function adjustChatHeight() {
    const chatDisplay = document.getElementById('chat-display');
    const chatTitle = document.getElementById('chat-title');
    const chatMessages = document.getElementById('chat-messages');
  
    const chatDisplayHeight = chatDisplay.clientHeight;
    const chatTitleHeight = chatTitle.clientHeight;
  
    chatMessages.style.height = `${chatDisplayHeight - chatTitleHeight - 20}px`; // 20pxはpaddingの分
  }
  
  // 質問の高さ調整
  function adjustQuestionHeight() {
    const questionDisplay = document.getElementById('question-display');
    const questionTitle = document.getElementById('question-title');
    const questions = document.getElementById('questions');
  
    const questionDisplayHeight = questionDisplay.clientHeight;
    const questionTitleHeight = questionTitle.clientHeight;
  
    questions.style.height = `${questionDisplayHeight - questionTitleHeight - 20}px`; // 20pxはpaddingの分
  }
  
  // 初期化時に高さ調整
  adjustChatHeight();
  adjustQuestionHeight();
  
  // ウィンドウサイズ変更時に高さ調整
  window.addEventListener('resize', adjustChatHeight);
  window.addEventListener('resize', adjustQuestionHeight);
    
    //◎主催者はユーザ名の入力、入退出のログ必要ない？？

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
            if(content.anonymous){ //匿名の場合
                message.textContent = content.message;
            }else{
                message.textContent = name+": "+content.message;
            }
            chatMessages.appendChild(message);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }else if(type==="question"){
            /*質問の処理*/
            const message = document.createElement('div');
            if(content.anonymous){ //匿名の場合
                message.textContent = content.message;
            }else{
                message.textContent = name+": "+content.message;
            }
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
            connectionCount.textContent = `${num_of_connection}人`; // 文字列として処理 : 主催者も含まれるので、-1 する
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
            image.width=30;
            image.height=30;
            image.classList.add('reaction-animation');
            // chat.scrollTop = chat.scrollHeight;

            const chatContainer = document.getElementById('versatile-space');  // チャットコンテナ要素を取得
            // ランダムな水平位置を設定
            const maxLeft = chatContainer.clientWidth - image.width;  // 最大の左位置
            const randomLeft = Math.floor(Math.random() * maxLeft);  // ランダムな左位置を計算
            image.style.left = `${randomLeft}px`;  // 画像の左位置を設定

            chatContainer.appendChild(image);  // 画像要素をチャットコンテナに追加

           // アニメーション終了後に要素を削除
            setTimeout(() => {
                image.remove();
            }, 3000);
        }else if(type==="voteResult"){
            /*グラフの作成 */
            const title = content.title;
            const number = content.number;
            const options = content.options;
            const multi = content.multi;
            const graph = content.graph;
            const result = content.result;
            mainSpace.innerHTML="";

            const voteTitle = document.createElement('h1');
            voteTitle.id="voteTitle";
            mainSpace.appendChild(voteTitle);
            const myChart = document.createElement('canvas');
            myChart.id="myChart";
            mainSpace.appendChild(myChart);
            const closeButton = document.createElement('button');
            closeButton.id="close";
            closeButton.type="button";
            closeButton.textContent="投票結果を閉じる"
            mainSpace.appendChild(closeButton);
            myChart.style.margin="auto";
            myChart.style.width='350px'; //意味がない？
            myChart.style.height='350px';
    
            const backgroundColors = [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(201, 203, 207, 0.2)',
                'rgba(100, 181, 246, 0.2)' 
            ];
            const borderColors = [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(201, 203, 207, 1)',
                'rgba(100, 181, 246, 1)'
            ];
    
            const selectBackgroundColor = backgroundColors.slice(0, number);
            const selectBorderColor = borderColors.slice(0, number);
            
            if(multi){
                voteTitle.textContent = "投票のお題: "+title +"（複数選択可）";  
            }else{
                voteTitle.textContent = "投票のお題: "+title + "（単一選択）";  
            }
            const ctx = myChart.getContext('2d');
            const chartData ={
                labels: options, 
                datasets:[{
                    data: result, 
                    backgroundColor: selectBackgroundColor,  
                    borderColor: selectBorderColor,
                    borderWidth: 1
                }]
            };

            switch(graph){
                case "円グラフ":
                    const piechartOptions = {
                        responsive: true, 
                        plugins:{
                            legend: {
                                position: 'top',
                            },
                            datalabels: {
                                formatter: (value, ctx) => {
                                    if (value === 0) {
                                        return ''; // 0人のラベルは表示しない
                                    }
                                    const dataset = ctx.chart.data.datasets[0];
                                    const total = dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(2); //小数点以下二桁
                                    return `${value}人\n(${percentage}%)`;
                                },
                                color: '#000',
                                font: {
                                    weight: 'bold'
                                }
                            }
                        }
                    }
                    const mypieChart = new Chart(ctx, {
                        type: 'pie', 
                        data: chartData, 
                        options: piechartOptions, 
                        plugins: [ChartDataLabels]
                    });       
                    break;
                case "棒グラフ":
                    const barchartOptions = {
                        responsive: true, 
                        plugins:{
                            legend: {
                                display: false,
                            },
                            datalabels: {
                                anchor: 'end',
                                align: 'start',
                                formatter: (value) => {
                                    if(value === 0){
                                        return ``;
                                    }
                                    return `${value}人`;
                                },
                                color: '#000',
                                font: {
                                    weight: 'bold'
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 10
                                }
                            }
                        }
                    };
                    const mybarChart = new Chart(ctx, {
                        type: 'bar', 
                        data: chartData, 
                        options: barchartOptions, 
                        plugins: [ChartDataLabels]
                    });       
                    break;
            }
           
            /*コメントに投票結果を流す */
            let total = result.reduce(function(sum, elem){
                return sum + elem;
            }, 0);
            var vresult;
            if(multi){
                vresult = `【投票結果】 お題: ${title}（複数選択可）`
            }else{
                vresult = `【投票結果】 お題: ${title}（単一選択）`
            }
           
            for(let i=0;i<number;i++){
                const p = ((result[i] / total) * 100).toFixed(2); 
                vresult += `, ${options[i]}: ${result[i]}人（${p}％）`
            }

            const obj = {
                type: 'log', 
                name: 'host', 
                content: vresult
            }
            ws.send(JSON.stringify(obj)); // JSON形式で送信
            voteBtn.disabled = false; //投票・ワークシートボタンを有効化
            worksheetBtn.disabled = false;

            closeButton.addEventListener('click', () => {
                /*投票を閉じますか？の確認＋ダウンロード +mainSpaceのクリア*/
                var conf = confirm("投票結果を本当に閉じますか？")
                if(conf){
                    mainSpace.innerHTML="";
                    /*投票結果のダウンロード（不要かも？）*/
                    let voteContent=vresult;
                    const blob = new Blob([voteContent], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'vote_result.txt';
                    a.click();
                    URL.revokeObjectURL(url);
                }
            });
        }else if(type==="worksheetSend"){
            worksheet_ans.push(name + ": " + content + "\n");
        }else if(type=="updateCounts"){
            chatCount = obj.chatCount;
            questionCount = obj.questionCount;
            updateCountDisplay();
        }
    };

    function updateCountDisplay() {
        const chatCountElement = document.getElementById('chat-count');
        const questionCountElement = document.getElementById('question-count');
        
        if (chatCountElement) {
          chatCountElement.textContent = `${chatCount}`;
        }
        
        if (questionCountElement) {
          questionCountElement.textContent = `${questionCount}`;
        }
      }
    
    /* ホストがサーバーによって切断される場合の処理 */
    ws.onclose = (event) => {
        const message = document.createElement('div');
        message.textContent = "サーバーによって接続が切断されました"; // メッセージを表示
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    var wsFlag = true; //ワークシートボタン押せるかどうか
    // ワークシートボタンのクリックイベント
    var remainTime;
    worksheetBtn.addEventListener('click', () => {
        if(wsFlag){
            mainSpace.innerHTML=''; //mainSpaceを空にする
            const form=document.createElement('form');
    
            const titleLabel=document.createElement('label');
            titleLabel.textContent = 'お題を入力: ';
            const titleInput = document.createElement('input');
            titleInput.type = 'text';
            titleInput.id = 'worksheetTitle';
            
            form.appendChild(titleLabel);
            form.appendChild(titleInput);
            form.appendChild(document.createElement('br'));
    
            const timeLimit=document.createElement('limit');
            timeLimit.textContent = '制限時間: ';
            const timeLimitSelect = document.createElement('select');
            timeLimitSelect.id = 'timeLimit';
            const timeLimits = [1, 2, 3, 4, 5];
            timeLimits.forEach(time => {
                const option = document.createElement('option');
                option.value = time;
                option.textContent = `${time}`;
                timeLimitSelect.appendChild(option);
            });
            const timeUnitLabel = document.createElement('label');
            timeUnitLabel.textContent = '分';
            form.appendChild(timeLimit);
            form.appendChild(timeLimitSelect);
            form.appendChild(timeUnitLabel);
            form.appendChild(document.createElement('br'));
    
            const startButton = document.createElement('button');
            startButton.type = 'button';
            startButton.textContent = 'ワークシートを実施';
            startButton.id = 'startWorkSheetButton';
            form.appendChild(startButton);
    
            const quitButton = document.createElement('button');
            quitButton.type = 'button';
            quitButton.textContent = 'やめる';
            quitButton.id = 'quitWorkSheetButton';
            form.appendChild(quitButton);
    
            mainSpace.appendChild(form);
            mainSpace.scrollTop = mainSpace.scrollHeight;
            //window.location.href = './events/worksheet.html';
    
            startButton.onclick = () => {
                const info = {
                    title: titleInput.value, //お題
                    time: timeLimitSelect.value //制限時間
                }
                if (info.title) {
                    const obj = {
                        type: 'worksheet', 
                        name: 'server',
                        content: info
                    }
                    ws.send(JSON.stringify(obj)); // JSON形式で送信
                    mainSpace.innerHTML=''; //汎用スペースをクリア
                    wsFlag=false;
                    alert('ワークシートの内容が送信されました！');
    
                    /* 再度ワークシートボタンが押せるようになるまでの時間を計る*/
                    let countdownInterval;
                    const secondsCountdown = () => { //秒をカウントダウンする
                        if(countdownInterval){ //前回のカウントダウンが残っている場合
                            clearInterval(countdownInterval);
                        }  
                        const timeLimit = parseInt(info.time) * 60;
                        remainTime = timeLimit;
    
                        //カウントダウンのセットアップ
                        countdownInterval = setInterval(()=>{
                            remainTime--;
            
                            if(remainTime <= 0){
                                clearInterval(countdownInterval);
                                wsFlag=true;
                            }
                        }, 1000);
                    };
            
                    secondsCountdown(); //カウントダウンを開始
    
                }else {
                    alert('ワークシートの内容が空です。');
                }
            };
    
            quitButton.onclick = () => {
                mainSpace.innerHTML=''; //汎用スペースをクリア
                alert('ワークシートの作成をやめました！');
            };
        }else{ //ワークシート実施中の場合
            alert(`ワークシート実施中です。あと ${remainTime} 秒お待ちください。`);
        }
        

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
        multipleLabel.textContent = '複数選択(可ならチェック): ';
        const multipleCheckbox = document.createElement('input');
        multipleCheckbox.type = 'checkbox';
        multipleCheckbox.id = 'multipleSelection';
        multipleLabel.htmlFor = 'multipleSelection';
        form.appendChild(multipleLabel);
        form.appendChild(multipleCheckbox);
        form.appendChild(document.createElement('br'));

        const timeLimitLabel = document.createElement('label');
        timeLimitLabel.textContent = '制限時間: ';
        const timeLimitSelect = document.createElement('select');
        timeLimitSelect.id = 'timeLimit';
        const timeLimits = [10, 30, 60, 90, 120];
        timeLimits.forEach(time => {
            const option = document.createElement('option');
            option.value = time;
            option.textContent = `${time}`;
            timeLimitSelect.appendChild(option);
        });
        const timeUnitLabel = document.createElement('label');
        timeUnitLabel.textContent = '秒';
        form.appendChild(timeLimitLabel);
        form.appendChild(timeLimitSelect);
        form.appendChild(timeUnitLabel);
        form.appendChild(document.createElement('br'));

        const graphLabel = document.createElement('label');
        graphLabel.textContent = '投票結果の表示方法: ';
        const graphSelect = document.createElement('select');
        graphSelect.id = 'graph';
        const graphs = ['円グラフ', '棒グラフ'];
        graphs.forEach(graph => {
            const option = document.createElement('option');
            option.value = graph;
            option.textContent = graph;
            graphSelect.appendChild(option);
        });
        form.appendChild(graphLabel);
        form.appendChild(graphSelect);
        form.appendChild(document.createElement('br'));
        
        const startVoteButton = document.createElement('button');
        startVoteButton.type = 'button';
        startVoteButton.textContent = '投票を開催';
        startVoteButton.id = 'startVoteButton';
        form.appendChild(startVoteButton);

        const quitVoteButton = document.createElement('button');
        quitVoteButton.type = 'button';
        quitVoteButton.textContent = 'やめる';
        quitVoteButton.id = 'quitVoteButton';
        form.appendChild(quitVoteButton);

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
                optionInput.classList.add('optionInput');
                optionsContainer.appendChild(optionLabel);
                optionsContainer.appendChild(optionInput);
                optionsContainer.appendChild(document.createElement('br'));
            }
        }
        updateOptions();
        optionsSelect.addEventListener('change', updateOptions);
        mainSpace.scrollTop = mainSpace.scrollHeight;

        /*投票についての情報をサーバに送信*/
        startVoteButton.onclick = () => {
            const voteTitle = titleInput.value; //投票のタイトル
            const optionInputs = document.querySelectorAll('.optionInput');
            const options = Array.from(optionInputs).map(input => input.value); //選択肢の配列を作成

            /*入力が空の場合は警告*/
            if(!voteTitle){
                alert('必要な項目を入力してください。');
                return;
            }

            for (let i = 0; i < options.length; i++) {
                if (!options[i]) {
                    alert(`選択肢を入力してください。`);
                    return;
                }
            }
            voteBtn.disabled = true; //投票・ワークシートボタンを無効化
            worksheetBtn.disabled = true;

            const info = { //投票に関する情報
                title: titleInput.value,  
                number: optionsSelect.value,
                options: options,
                multi: multipleCheckbox.checked,
                time: timeLimitSelect.value, 
                graph: graphSelect.value
            }

            if (info) {
                const obj = {
                    type: 'vote', 
                    name: 'host',
                    content: info
                }
                ws.send(JSON.stringify(obj)); // JSON形式で送信
                titleInput.value = '';
                //alert('投票が開催されました！');
                mainSpace.innerHTML='';

                /*投票終了までのカウントダウンを表示*/
                const countDownLabel1 = document.createElement('span');
                countDownLabel1.textContent = `投票終了まで残り `;
                mainSpace.appendChild(countDownLabel1);
                const count = document.createElement('span');
                mainSpace.appendChild(count);
                const countDownLabel2 = document.createElement('span');
                countDownLabel2.textContent = ` 秒`;
                mainSpace.appendChild(countDownLabel2);

                let countdownInterval;
                const secondsCountdown = () => { //秒をカウントダウンする
                    
                  if(countdownInterval){ //前回のカウントダウンが残っている場合
                        clearInterval(countdownInterval);
                  }  

                  const timeLimit = info.time;
                  let remainTime = timeLimit;

                  count.textContent = `${remainTime}`;

                  //カウントダウンのセットアップ
                  countdownInterval = setInterval(()=>{
                        remainTime--;
                        count.textContent = `${remainTime} `;

                        if(remainTime <= 0){
                            clearInterval(countdownInterval);
                            count.textContent = '0';
                            const obj2 = {
                                type: 'voteResult', 
                                name: 'host',
                                content: info
                            }
                            ws.send(JSON.stringify(obj2)); // JSON形式で送信
                        }
                  }, 1000);
                };

                secondsCountdown(); //カウントダウンを開始            

            }else {
                alert('投票が開催できませんでした。');
                mainSpace.innerHTML='';
            }
        };

        quitVoteButton.onclick = () => {
            mainSpace.innerHTML=''; //汎用スペースをクリア
            alert('投票の作成をやめました！');
        };
        
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

                    window.location.href = "./events/end-event.html";
                })
                .catch(error => console.error('Error:', error));
        }
    });

    worksheet_ans_Btn.addEventListener('click', () => {
        /*ワークシートの回答のダウンロード*/
        const blob = new Blob([worksheet_ans], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'worksheet_result.txt';
        a.click();
        URL.revokeObjectURL(url);
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




















