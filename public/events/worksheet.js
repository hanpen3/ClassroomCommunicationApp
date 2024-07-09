document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.getElementById('back-btn');
    const saveBtn = document.getElementById('save-btn');
    const worksheetText = document.getElementById('worksheet-text');
    
    backBtn.addEventListener('click', () => {
        window.location.href = '../host.html';
    });

    // WebSocket接続を確立
    const ws = new WebSocket('ws://' + window.location.hostname + ':3000');
    
    saveBtn.addEventListener('click', () => {
        const worksheetContent = worksheetText.value;
        if (worksheetContent) {
            const obj = {
                type: 'worksheet',
                content: worksheetContent
            };
            ws.send(JSON.stringify(obj));
            alert('ワークシートの内容が送信されました！');
        } else {
            alert('ワークシートの内容が空です。');
        }
    });
    
    // 保存されたワークシートの内容を読み込む（例としてローカルストレージを使用）
    const savedWorksheet = localStorage.getItem('worksheetContent');
    if (savedWorksheet) {
        worksheetText.value = savedWorksheet;
    }

    // ワークシートの内容をserverに送信
    send.onclick = () => {
        const message = messageInput.value;
        if (message) {
            const obj = {
                type: 'worksheet', 
                name: 'server',
                content: message
            }
            ws.send(JSON.stringify(obj)); // JSON形式で送信
        messageInput.value = '';
        }
    };
    
});

