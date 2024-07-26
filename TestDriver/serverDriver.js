const WebSocket = require('ws');

const wsUrl = 'ws://localhost:3000'; // サーバーのURL

function testWebSocketServer() {
    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
        console.log('Connected to WebSocket server');

        // テストケース1: コメント送信
        ws.send(JSON.stringify({ type: 'comment', name: 'Alice', content: 'Hello' }));

        // テストケース2: 質問送信
        ws.send(JSON.stringify({ type: 'question', name: 'Bob', content: 'How are you?' }));

        // テストケース3: 投票開始
        ws.send(JSON.stringify({ type: 'vote', name: 'Server', content: { title: 'Test Vote', number: 2, options: ['Option A', 'Option B'], multi: false, time: 30, graph: 'bar' } }));

        // テストケース4: 投票回答
        ws.send(JSON.stringify({ type: 'voteAnswer', name: 'Alice', content: { title: 'Test Vote', number: 2, options: ['Option A', 'Option B'], multi: false, graph: 'bar', ans: 0 } }));

        // テストケース5: 投票結果要求
        ws.send(JSON.stringify({ type: 'voteResult', name: 'Server', content: { title: 'Test Vote', number: 2, options: ['Option A', 'Option B'], multi: false, graph: 'bar' } }));

        // ... (他のテストケースを追加)

        // 一定時間後に接続を閉じる
        setTimeout(() => {
            ws.close();
            console.log('WebSocket connection closed');
        }, 5000); // 5秒後に閉じる
    });

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Received message:', data);

        // 受信したメッセージを検証する処理を追加
        // 例: data.type が 'updateCounts' の場合、chatCount と questionCount が増加しているか確認する
    });

    ws.on('close', () => {
        console.log('Disconnected from WebSocket server');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
}

testWebSocketServer();