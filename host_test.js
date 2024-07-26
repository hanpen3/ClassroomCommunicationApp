const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// JSDOMの設定
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: "http://localhost",
  runScripts: "dangerously"
});

// グローバル変数の設定
global.window = dom.window;
global.document = dom.window.document;
global.WebSocket = class MockWebSocket {
  constructor() {
    this.onopen = null;
    this.onmessage = null;
  }
  send(data) {
    console.log('Sent:', JSON.parse(data));
  }
};

// DOM要素の準備
document.body.innerHTML = `
  <div id="eventName"></div>
  <div id="chat-messages"></div>
  <div id="questions"></div>
  <div id="mainSpace"></div>
  <button id="worksheet-btn">ワークシート</button>
  <button id="vote-btn">投票</button>
  <button id="end-event-btn">イベント終了</button>
  <button id="worksheet-ans-btn">ワークシート回答ダウンロード</button>
  <div id="chat-count"></div>
  <div id="question-count"></div>
  <div id="connection-count"></div>
`;

// host.jsの読み込みと実行
const hostJsContent = fs.readFileSync(path.resolve(__dirname, 'host.js'), 'utf-8');
const script = dom.window.document.createElement('script');
script.textContent = hostJsContent;
dom.window.document.body.appendChild(script);

// プロンプトとconfirmのモック
global.prompt = () => "テストイベント";
global.confirm = () => true;

// テスト関数
function runTests() {
  console.log('=== host.jsのテスト開始 ===');

  // イベント名のテスト
  console.log('イベント名テスト:');
  console.log('イベント名:', document.getElementById('eventName').textContent);

  // WebSocket接続テスト
  console.log('\nWebSocket接続テスト:');
  global.WebSocket.prototype.onopen();

  // メッセージ受信テスト
  console.log('\nメッセージ受信テスト:');
  const messageEvent = new dom.window.MessageEvent('message', {
    data: JSON.stringify({ type: 'comment', name: 'テストユーザー', content: { message: 'こんにちは' } })
  });
  global.WebSocket.prototype.onmessage(messageEvent);
  console.log('チャットメッセージ:', document.getElementById('chat-messages').innerHTML);

  // ワークシートボタンテスト
  console.log('\nワークシートボタンテスト:');
  document.getElementById('worksheet-btn').click();
  console.log('mainSpace内容:', document.getElementById('mainSpace').innerHTML);

  // 投票ボタンテスト
  console.log('\n投票ボタンテスト:');
  document.getElementById('vote-btn').click();
  console.log('mainSpace内容:', document.getElementById('mainSpace').innerHTML);

  console.log('=== host.jsのテスト終了 ===');
}

// テストの実行
runTests();