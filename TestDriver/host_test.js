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
global.prompt = () => "host.js";
global.confirm = () => true;
global.alert = console.log;

// DOMの準備
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
  <div id="chat-display">
    <div id="chat-title"></div>
    <div id="chat-messages"></div>
  </div>
  <div id="question-display">
    <div id="question-title"></div>
    <div id="questions"></div>
  </div>
`;

// MockWebSocketクラスの定義
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.onopen = null;
    this.onmessage = null;
    setTimeout(() => this.onopen && this.onopen(), 0);
  }

  send(data) {
    console.log('Sent:', JSON.parse(data));
    // サーバーからの応答をシミュレート
    const parsedData = JSON.parse(data);
    switch(parsedData.type) {
      case 'host':
        this.onmessage({ data: JSON.stringify({ type: 'connection', content: 5 }) });
        break;
      case 'eventName':
        console.log('Event name set:', parsedData.content);
        break;
      case 'worksheet':
        console.log('Worksheet started:', parsedData.content);
        break;
      case 'vote':
        console.log('Vote started:', parsedData.content);
        setTimeout(() => {
          this.onmessage({ data: JSON.stringify({ 
            type: 'voteResult', 
            content: {
              ...parsedData.content,
              result: [3, 2] // サンプル結果
            }
          })});
        }, 1000);
        break;
    }
  }
}

global.WebSocket = MockWebSocket;

// host.jsの読み込みと実行
const hostJsContent = fs.readFileSync(path.resolve(__dirname, 'C:/PL2_Group8/public/host.js'), 'utf-8');
const script = dom.window.document.createElement('script');
script.textContent = hostJsContent;
dom.window.document.body.appendChild(script);

// テスト関数
function runTests() {
  console.log('=== host.jsのテスト開始 ===');

  // イベント名のテスト
  console.log('イベント名テスト:');
  document.getElementById('eventName').textContent = global.prompt();
  console.log('イベント名:', document.getElementById('eventName').textContent);

  // ワークシートボタンテスト
  console.log('\nワークシートボタンテスト:');
  document.getElementById('worksheet-btn').click();
  console.log('mainSpace内容:', document.getElementById('mainSpace').innerHTML);

  // 投票ボタンテスト
  console.log('\n投票ボタンテスト:');
  document.getElementById('vote-btn').click();
  console.log('mainSpace内容:', document.getElementById('mainSpace').innerHTML);

  // イベント終了ボタンテスト
  console.log('\nイベント終了ボタンテスト:');
  document.getElementById('end-event-btn').click();

  console.log('=== host.jsのテスト終了 ===');
}

// DOMContentLoadedイベントをシミュレート
const event = new dom.window.Event('DOMContentLoaded');
document.dispatchEvent(event);

// テストの実行
setTimeout(runTests, 1000);

// クリーンアップ
setTimeout(() => {
  process.exit(0);
}, 5000);