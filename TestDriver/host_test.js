const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

// 接続テスト
wss.on('connection', (ws) => {
  console.log('接続されました');

  // メッセージ送信テスト
  ws.on('message', (message) => {
    console.log(`メッセージを受信しました: ${message}`);
    ws.send(`サーバーから返信: ${message}`);
  });

  // 切断テスト
  ws.on('close', () => {
    console.log('切断されました');
  });

  // エラー発生テスト
  ws.on('error', (error) => {
    console.log(`エラーが発生しました: ${error}`);
  });
});

// ワークシート実施テスト
const worksheetTest = () => {
  const ws = new WebSocket('ws://localhost:3000');
  ws.on('open', () => {
    const worksheetInfo = {
      type: 'worksheet',
      name: 'server',
      content: {
        title: 'テストワークシート',
        time: 5,
      },
    };
    ws.send(JSON.stringify(worksheetInfo));
  });
};

// 投票実施テスト
const voteTest = () => {
  const ws = new WebSocket('ws://localhost:3000');
  ws.on('open', () => {
    const voteInfo = {
      type: 'vote',
      name: 'server',
      content: {
        title: 'テスト投票',
        options: ['選択肢1', '選択肢2', '選択肢3'],
        multi: false,
        time: 10,
      },
    };
    ws.send(JSON.stringify(voteInfo));
  });
};

// テスト実行
worksheetTest();
voteTest();