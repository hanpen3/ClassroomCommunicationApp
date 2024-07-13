const voteTitle = document.getElementById('voteTitle');
const sendButton = document.getElementById('send');
const voteOptions = document.getElementById('vote-options');
const timer = document.getElementById('timer');

let title, number, options, multi, time, graph;

window.addEventListener('message', (event) => {
    if (event.origin === window.location.origin) {
        const info = event.data;
        title = info.title;
        number = info.number;
        options = info.options;
        multi = info.multi;
        time = info.time;
        graph = info.graph;
        voteOptions.innerHTML="";

        /*必要な要素を画面に表示 */
        voteTitle.textContent = "投票のお題: "+title;        

        if(multi){ //複数選択可の場合
            const message = document.createElement('div');
            message.textContent = "(複数選択可)"
            voteTitle.appendChild(message);
            voteTitle.appendChild(document.createElement('br'));

            for (let i = 0; i < number; i++) {
                const optionInput = document.createElement('input');
                optionInput.type = 'checkbox';
                optionInput.name = `multiSelect`;
                optionInput.value= i ; //0から7
                //optionInput.classList.add('optionInput');
                const optionLabel = document.createElement('label');
                optionLabel.for=`option${i + 1}`;
                optionLabel.textContent = `${options[i]}`;
                voteOptions.appendChild(optionInput);
                voteOptions.appendChild(optionLabel);
                voteOptions.appendChild(document.createElement('br'));
            }

        }else{ //単一選択の場合
            const message = document.createElement('div');
            message.textContent = "(単一回答)"
            voteTitle.appendChild(message);
            voteTitle.appendChild(document.createElement('br'));

            for (let i = 0; i < number; i++) {
                const optionInput = document.createElement('input');
                optionInput.type = 'radio';
                optionInput.name = `oneSelect`; //一つしか選べないようにする
                optionInput.value= i ; //0から7
                //optionInput.classList.add('optionInput');
                const optionLabel = document.createElement('label');
                optionLabel.for=`option${i + 1}`;
                optionLabel.textContent = `${options[i]}`;
                voteOptions.appendChild(optionInput);
                voteOptions.appendChild(optionLabel);
                voteOptions.appendChild(document.createElement('br'));
            }

        }

        /*投票終了までのカウントダウンを表示*/
        const countDownLabel1 = document.createElement('span');
        countDownLabel1.textContent = `投票終了まで残り `;
        timer.appendChild(countDownLabel1);
        const count = document.createElement('span');
        timer.appendChild(count);
        const countDownLabel2 = document.createElement('span');
        countDownLabel2.textContent = ` 秒`;
        timer.appendChild(countDownLabel2);

        let countdownInterval;
        const secondsCountdown = () => { //秒をカウントダウンする
            
            if(countdownInterval){ //前回のカウントダウンが残っている場合
                clearInterval(countdownInterval);
            }  

            const timeLimit = time;
            let remainTime = timeLimit;

            count.textContent = `${remainTime}`;

            //カウントダウンのセットアップ
            countdownInterval = setInterval(()=>{
                remainTime--;
                count.textContent = `${remainTime} `;

                if(remainTime <= 0){
                    clearInterval(countdownInterval);
                    window.close();
                }
            }, 1000);
        };

        secondsCountdown(); //カウントダウンを開始

    }
});

//送信ボタンが押されたとき
sendButton.addEventListener('click', () => {
    let selects=''; //ここに選択した値を得る
    let noSelect=false;
    if(multi){ //複数選択可の場合
        const opts = document.querySelectorAll('input[name="multiSelect"]:checked');
        selects = Array.from(opts).map(opt => opt.value);
        if(selects.length<=0){ //何も選択されていない場合
           noSelect=true;
        }
    }else{ //単一選択の場合
        const opts = document.getElementsByName('oneSelect');
        noSelect=true;
        for (let i = 0; i < opts.length; i++) {
            if (opts[i].checked) {
                selects = opts[i].value;
                noSelect=false;
                break;
            }
        }
    }

    if(noSelect){ //何も選択されていない場合
        alert('選択肢を選んでください.');
    }else{
        const info={ //timeは不要なので省略
            title: title, 
            number: number, 
            options: options, 
            multi: multi,
            graph: graph, 
            ans: selects  //投票の回答
        }

        const obj={
            type: 'voteAnswer',
            name: 'popUp', 
            content: info
        }

        /*投票画面の初期化 */
        timer.innerHTML='';
        voteTitle.innerHTML='';
        voteOptions.innerHTML='';

        // 元のウィンドウにメッセージを送信
        if (window.opener) { // 元のウィンドウが存在するか確認
            window.opener.postMessage(obj, window.location.origin); 
        }

        window.close();
    }
    
});