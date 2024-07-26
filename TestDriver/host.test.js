// host.test.js

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// host.jsの内容を読み込む
const hostJsContent = fs.readFileSync(path.resolve(__dirname, '../public/host.js'), 'utf-8');

describe('host.js tests', () => {
  let dom;
  let window;
  let document;

  beforeEach(() => {
    // 各テストの前にJSDOMを設定
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      url: "http://localhost",
      runScripts: "dangerously",
      resources: "usable"
    });
    window = dom.window;
    document = window.document;

    // グローバル変数の設定
    global.window = window;
    global.document = document;
    global.prompt = jest.fn(() => "テストイベント名");
    global.confirm = jest.fn(() => true);
    global.alert = jest.fn();

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
      }

      send(data) {
        console.log('Sent:', JSON.parse(data));
      }
    }

    global.WebSocket = MockWebSocket;

    // host.jsの内容を実行
    const script = document.createElement('script');
    script.textContent = hostJsContent;
    document.body.appendChild(script);
  });

  test('イベント名が設定されること', () => {
    expect(document.getElementById('eventName').textContent).toBe("テストイベント名");
  });

  test('ワークシートボタンがクリックされたときにフォームが表示されること', () => {
    document.getElementById('worksheet-btn').click();
    expect(document.getElementById('mainSpace').innerHTML).toContain('ワークシートを実施');
  });

  test('投票ボタンがクリックされたときにフォームが表示されること', () => {
    document.getElementById('vote-btn').click();
    expect(document.getElementById('mainSpace').innerHTML).toContain('投票を開催');
  });

  test('イベント終了ボタンがクリックされたときに確認ダイアログが表示されること', () => {
    document.getElementById('end-event-btn').click();
    expect(global.confirm).toHaveBeenCalledWith('イベントを終了してもよろしいですか？');
  });

  // WebSocket接続のテスト
  test('WebSocket接続が確立されること', (done) => {
    const ws = new global.WebSocket('ws://localhost:3000');
    ws.onopen = () => {
      expect(ws.url).toBe('ws://localhost:3000');
      done();
    };
  });

  // メッセージ送信のテスト
  test('メッセージが正しく送信されること', () => {
    const ws = new global.WebSocket('ws://localhost:3000');
    const spy = jest.spyOn(ws, 'send');
    
    // ここでメッセージ送信をトリガーするイベントをシミュレート
    // 例: document.getElementById('send-message-btn').click();

    expect(spy).toHaveBeenCalled();
    // 送信されたメッセージの内容を確認
    // expect(JSON.parse(spy.mock.calls[0][0])).toEqual(expectedMessage);
  });
});