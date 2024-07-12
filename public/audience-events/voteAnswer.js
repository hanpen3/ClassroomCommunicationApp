const voteTitle = document.getElementById('voteTitle');
const sendButton = document.getElementById('send');
const voteOptions = document.getElementsById('vote-options');

//let title, number, options, multi, time, graph;

window.addEventListener('message', (event) => {
    if (event.origin === window.location.origin) {
        //ここが上手くいってない多分
        const info = event.data;
        const title = info.title;
        const number = info.number;
        const options = info.options;
        const multi = info.multi;
        const time = info.time;
        const graph = info.graph;
        voteOptions.innerHTML="";

        /*必要な要素を画面に表示 */
        voteTitle.textContent = title;
        //◎制限時間の表示

        if(multi){ //複数選択可の場合
            const message = document.createElement('div');
            message.textContent = "複数選択可"
            for (let i = 0; i < number; i++) {
                const optionInput = document.createElement('input');
                optionInput.type = 'checkbox';
                //optionInput.name = `option${i + 1}`;
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
            message.textContent = "単一回答"
            for (let i = 0; i < number; i++) {
                const optionInput = document.createElement('input');
                optionInput.type = 'radio';
                //optionInput.name = `option${i + 1}`;
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