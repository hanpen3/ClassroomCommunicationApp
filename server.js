/* 各モジュールの読み込み */
const { Socket } = require('dgram');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public')); // 提供ディレクトリを'public'に設定

let clients = [];

// 30s毎に４桁の乱数を出力
setInterval(() => {
    const oneTimePass = Math.floor(1000 + Math.random() * 9000);
    console.log(`Generated one-time-password : ${oneTimePass}`);
}, 30000);

/* クライアント接続時の動作 */
wss.on('connection', (ws) => {
    console.log('Client connected');
    clients.push(ws);

    ws.on('message', (message) => {
        const data=JSON.parse(message); //JSON形式で解析
        console.log(`Received: ${data}`);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data)); // JSON形式で送信
            }
        });
    });

    /* クライアント切断時の動作 */
    ws.on('close', () => {
        console.log('Client disconnected');
        clients = clients.filter(client => client !== ws);
    });
});

/* 主催者のボタンクリックから全クライアントとの接続を切断 */
app.get('/disconnectAll', (req, res) => {
    clients.forEach(ws => {
        ws.close();
    });
    clients = [];
    res.send('All clients disconnected');
});

/* HTTPサーバーをポート3000で起動 */
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});