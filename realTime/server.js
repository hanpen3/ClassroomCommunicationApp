const express = require('express'); // Expressフレームワークをインポートし、アプリケーションを作成するための変数を定義
const http = require('http'); // HTTPサーバーを作成するためのNode.jsの標準モジュールをインポート
const socketIo = require('socket.io'); // Socket.IOをインポートし、リアルタイム通信を実現するための変数を定義

const app = express(); // Expressアプリケーションを作成
const server = http.createServer(app); // Expressアプリケーションを使用してHTTPサーバーを作成
const io = socketIo(server); // HTTPサーバーにSocket.IOを取り付け、WebSocketサーバーを作成

const PORT = process.env.PORT || 3000; // 環境変数PORTが設定されている場合はそれを使用し、設定されていない場合はポート3000を使用

app.use(express.static('public')); // 'public'フォルダを静的ファイルの提供元として設定

io.on('connection', (socket) => { // クライアントがSocket.IOサーバーに接続すると発生するイベントをリッスン
    console.log('A user connected'); // ユーザーが接続したことを示すメッセージをコンソールに出力

    socket.on('chat message', (msg) => { // クライアントから 'chat message' イベントを受信したときの処理を定義
        io.emit('chat message', msg); // 受信したメッセージをすべての接続されたクライアントにブロードキャスト
    });

    socket.on('disconnect', () => { // クライアントが切断したときのイベントをリッスン
        console.log('A user disconnected'); // ユーザーが切断したことを示すメッセージをコンソールに出力
    });
});

server.listen(PORT, () => { // サーバーを指定したポートでリッスンさせ、リッスンが開始されたときに実行するコールバックを指定
    console.log(`Server is running on port ${PORT}`); // サーバーが起動したことを示すメッセージをコンソールに出力
});
