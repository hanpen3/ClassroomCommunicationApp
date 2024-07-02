document.addEventListener('DOMContentLoaded', function() {
    const connectionCount = document.getElementById('connection-count');
    const worksheetBtn = document.getElementById('worksheet-btn');
    const voteBtn = document.getElementById('vote-btn');
    const endEventBtn = document.getElementById('end-event-btn');
    const chatMessages = document.getElementById('chat-messages');
    const questions = document.getElementById('questions');

    let connectedUsers = 0;

    // 接続人数の更新（デモ用）
    setInterval(() => {
        connectedUsers = Math.floor(Math.random() * 100);
        connectionCount.textContent = `接続: ${connectedUsers}人`;
    }, 5000);

    // ボタンのクリックイベント
    worksheetBtn.addEventListener('click', () => {
        window.location.href = 'worksheet.html';
    });
    
    voteBtn.addEventListener('click', () => {
        window.location.href = 'vote.html';
    });
    
    endEventBtn.addEventListener('click', () => {
        if (confirm('イベントを終了してもよろしいですか？')) {
            window.location.href = 'end-event.html';
        }
    });

    // チャットメッセージのデモ表示
    function addChatMessage(message) {
        const messageElem = document.createElement('p');
        messageElem.textContent = message;
        chatMessages.appendChild(messageElem);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 質問のデモ表示
    function addQuestion(question) {
        const questionElem = document.createElement('p');
        questionElem.textContent = question;
        questions.appendChild(questionElem);
        questions.scrollTop = questions.scrollHeight;
    }

    // デモメッセージと質問の追加
    setInterval(() => {
        addChatMessage(`ユーザー${Math.floor(Math.random() * 100)}: こんにちは！`);
        if (Math.random() > 0.7) {
            addQuestion(`質問: これはどういう意味ですか？`);
        }
    }, 3000);
});