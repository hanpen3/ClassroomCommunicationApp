// audienceDriver.test.js
const { JSDOM } = require('jsdom');
const fs = require('fs');
const vm = require('vm');

// テスト用のHTML
const html = `
<!DOCTYPE html>
<html>
<head></head>
<body>
  <div id="chat-container">
    <div id="chat"></div>
  </div>
  <input type="text" id="message">
  <button id="comment">コメント</button>
  <button id="question">質問</button>
  <button id="exit">退出</button>
  <div id="eventName"></div>
  <input type="checkbox" id="anonymous">
  <img class="reaction" id="good" src="../images/clear_good.png">
</body>
</html>
`;

describe('audience.js テスト', () => {
  let mockWebSocket;
  let context;
  let mockPopup;

  beforeAll(() => {
    const dom = new JSDOM(html);
    global.window = dom.window;
    global.document = dom.window.document;

    // window.openのモック
    global.window.open = jest.fn().mockImplementation(() => {
      mockPopup.location.href = url;
      return mockPopup;
    });

    mockPopup = {
      postMessage: jest.fn(),
      close: jest.fn(),
      location: {
        href: '',
        origin: 'http://localhost:3000'
      },
      onload: null,
      triggerOnLoad: function () {
        if (this.onload) {
          this.onload();
        }
      }
    };
  });

  beforeEach(() => {
    global.KeyboardEvent = global.window.KeyboardEvent;

    mockWebSocket = {
      send: jest.fn(),
      onopen: jest.fn(),
      onmessage: jest.fn(),
      onclose: jest.fn(),
    };

    document.getElementById('chat').innerHTML = ''; 

    // グローバル変数のモック
    global.WebSocket = jest.fn(() => mockWebSocket);

    const mockUrl = new URL('http://localhost:3000');
    const locationProperties = {
      ancestorOrigins: mockUrl.ancestorOrigins,
      assign: jest.fn(),
      hash: mockUrl.hash,
      host: mockUrl.host,
      hostname: mockUrl.hostname,
      href: mockUrl.href,
      origin: mockUrl.origin,
      pathname: mockUrl.pathname,
      port: mockUrl.port,
      protocol: mockUrl.protocol,
      reload: jest.fn(),
      replace: jest.fn(),
      search: mockUrl.search,
      toString: jest.fn(() => mockUrl.href),
    };

    // locationオブジェクトのプロパティを個別に設定
    for (const prop in locationProperties) {
      global.window.location[prop] = locationProperties[prop];
    }

    // URLコンストラクタのモック
    global.URL = jest.fn().mockImplementation((url) => ({
      href: url,
      origin: 'http://localhost:3000',
      // 他の必要なプロパティも追加
    }));

    // その他のグローバル変数 (audience.js で使用されているもの)
    context = {
      window: global.window,
      document: global.window.document,
      prompt: jest.fn(() => 'testuser'),
      WebSocket: global.WebSocket,
      setTimeout: jest.fn(),
      clearTimeout: jest.fn(),
      setInterval: jest.fn(),
      clearInterval: jest.fn(),
      alert: jest.fn(),
      console: {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn(),
      },
      username: null,
      ws: mockWebSocket,
      eventName: document.getElementById('eventName'),
      anonymous: document.getElementById('anonymous'),
      chat: document.getElementById('chat'),
      messageInput: document.getElementById('message'),
      commentButton: document.getElementById('comment'),
      questionButton: document.getElementById('question'),
      exitButton: document.getElementById('exit'),
    };

    // テスト対象のコードを文字列として読み込む
    const code = fs.readFileSync('../public/audience.js', 'utf8');

    // テスト対象のコードを実行
    vm.runInNewContext(code, context);
  });

  it('コメントボタンクリック時の動作', () => {
    // テストデータ
    const testMessage = "これはテストコメントです";
    const expectedMessage = {
      type: 'comment',
      name: 'testuser',
      content: { message: testMessage, anonymous: false }
    };

    // 入力欄にテストメッセージを入力
    document.getElementById('message').value = testMessage;

    // コメントボタンをクリック
    document.getElementById('comment').click();

    // WebSocket.sendが期待通りの値で呼び出されたか確認
    expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify(expectedMessage));

    // 入力欄がクリアされているか確認
    expect(document.getElementById('message').value).toBe('');

    console.log('コメントボタンクリック時の動作: 成功');
  });

  it('質問ボタンクリック時の動作', () => {
    // テストデータ
    const testMessage = "これはテスト質問です";
    const expectedMessage = {
      type: 'question',
      name: 'testuser',
      content: { message: testMessage, anonymous: false }
    };

    // 入力欄にテストメッセージを入力
    document.getElementById('message').value = testMessage;

    // 質問ボタンをクリック
    document.getElementById('question').click();

    // WebSocket.sendが期待通りの値で呼び出されたか確認
    expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify(expectedMessage));

    // 入力欄がクリアされているか確認
    expect(document.getElementById('message').value).toBe('');

    console.log('質問ボタンクリック時の動作: 成功');
  });

  it('リアクションクリック時の動作', () => {
    // リアクション要素をクリックするイベントをシミュレート
    const clickEvent = new window.MouseEvent('click');
    document.getElementById('good').dispatchEvent(clickEvent);

    // WebSocket.sendが期待通りの値で呼び出されたか確認
    expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify({ type: 'reaction', content: 'good' }));

    console.log('リアクションクリック時の動作: 成功');
  });

  it('eventNameSetメッセージ受信時の動作', () => {
    const eventNameElement = document.getElementById('eventName');
    const message = { type: 'eventNameSet', content: 'テストイベント名' };

    mockWebSocket.onmessage({ data: JSON.stringify(message) });

    expect(eventNameElement.textContent).toBe('テストイベント名');
    console.log('eventNameSetメッセージ受信時の動作: 成功');
  });

  it('reactionメッセージ受信時の動作', () => {
    const chatContainer = document.getElementById('chat-container');
    const message = { type: 'reaction', content: 'good' };

    mockWebSocket.onmessage({ data: JSON.stringify(message) });

    // リアクション画像が追加されているか確認
    expect(chatContainer.querySelectorAll('img.reaction-animation').length).toBe(1); // 元々1つ + 追加された1つ

    // 追加された画像のsrc属性が正しいか確認
    const addedImage = chatContainer.querySelectorAll('img.reaction-animation')[0];
    expect(addedImage.src).toBe('./images/clear_good.png'); // URLは環境に合わせて修正

    console.log('reactionメッセージ受信時の動作: 成功');
  });

  it('commentメッセージ受信時の動作（匿名）', () => {
    const chat = document.getElementById('chat');
    const message = { type: 'comment', name: 'testuser2', content: { message: 'テストコメント', anonymous: true } };

    mockWebSocket.onmessage({ data: JSON.stringify(message) });

    // コメントが匿名で表示されているか確認
    expect(chat.children.length).toBe(1);
    expect(chat.children[0].textContent).toBe(message.content.message);
    expect(chat.children[0].textContent).not.toContain(message.name);

    console.log('commentメッセージ受信時の動作（匿名）: 成功');
  });

  it('commentメッセージ受信時の動作（実名）', () => {
    const chat = document.getElementById('chat');
    const message = { type: 'comment', name: 'testuser2', content: { message: 'テストコメント', anonymous: false } };

    mockWebSocket.onmessage({ data: JSON.stringify(message) });

    // コメントが実名で表示されているか確認
    expect(chat.children.length).toBe(1);
    expect(chat.children[0].textContent).toBe(`${message.name}: ${message.content.message}`);

    console.log('commentメッセージ受信時の動作（実名）: 成功');
  });

  it('questionメッセージ受信時の動作', () => {
    const chat = document.getElementById('chat');
    const message = { type: 'question', name: 'testuser2', content: { message: 'テスト質問', anonymous: false } };

    mockWebSocket.onmessage({ data: JSON.stringify(message) });

    // 質問が実名で表示されているか確認
    expect(chat.children.length).toBe(1);
    expect(chat.children[0].textContent).toBe(`${message.name}: ${message.content.message}`);

    // 質問のスタイル（赤色）が適用されているか確認
    expect(chat.children[0].style.color).toBe('red'); 

    console.log('questionメッセージ受信時の動作: 成功');
  });

  it('logメッセージ受信時の動作', () => {
    const chat = document.getElementById('chat');
    const message = { type: 'log', content: 'テストログメッセージ' };

    mockWebSocket.onmessage({ data: JSON.stringify(message) });

    // ログメッセージがchat要素に追加されているか確認
    expect(chat.children.length).toBe(1);
    expect(chat.children[0].textContent).toBe(message.content);

    console.log('logメッセージ受信時の動作: 成功');
  });

  it('ウィンドウを閉じる際の動作', () => {
    // window.onbeforeunloadイベントをシミュレート
    window.dispatchEvent(new window.Event('beforeunload'));

    // logoutメッセージが送信されたか確認
    expect(mockWebSocket.send).toHaveBeenCalledWith(
      JSON.stringify({ type: 'logout', content: 'server: testuser さんが退出しました' })
    );

    console.log('ウィンドウを閉じる際の動作: 成功');
  });

  it('Enterキー押下時の動作', () => {
    const messageInput = document.getElementById('message');
    messageInput.value = 'テストコメント';

    // Enterキー押下イベントをシミュレート
    messageInput.dispatchEvent(new window.KeyboardEvent('keypress', { key: 'Enter' }));

    // commentメッセージが送信されたか確認
    expect(mockWebSocket.send).toHaveBeenCalledWith(
      JSON.stringify({
        type: 'comment',
        name: 'testuser',
        content: { message: 'テストコメント', anonymous: false },
      })
    );

    // 入力欄がクリアされているか確認
    expect(messageInput.value).toBe('');

    console.log('Enterキー押下時の動作: 成功');
  });


  it('window.postMessageイベント受信時の動作', () => {
    const mockEvent = {
      origin: window.location.origin,
      data: {
        type: 'worksheet',
        name: 'testuser',
        content: 'テストワークシート回答',
      },
    };

    // window.addEventListener('message', ...) に登録されたイベントハンドラを呼び出す
    window.dispatchEvent(new window.MessageEvent('message', mockEvent));

    // ws.sendが期待通りの値で呼び出されたか確認
    expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify(mockEvent.data));

    console.log('window.postMessageイベント受信時の動作: 成功');
  });

});
