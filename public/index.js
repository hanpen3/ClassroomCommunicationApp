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
    var oneTimePass = prompt("ワンタイムパスワードを入力してください");
    if(true/* サーバのワンタイムパスワードと一致したら開くようにしたい...! */) window.open("host.html", null, "top=0,left=" + (screen.width - 500) + ",width=" + "500" + ",height=" + screen.availHeight);
};

messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});