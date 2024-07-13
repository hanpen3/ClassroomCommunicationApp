const sendButton = document.getElementById('send');
const Input = document.getElementById('textbox');
const timer = document.getElementById('timer');

let time;

window.addEventListener('message', (event) => {
    if (event.origin === window.location.origin) {
        const info = event.data;
        document.getElementById("title").textContent = info.title;
        time = info.time * 60;

        /*投票終了までのカウントダウンを表示*/
        const countDownLabel1 = document.createElement('span');
        countDownLabel1.textContent = `終了まで残り `;
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