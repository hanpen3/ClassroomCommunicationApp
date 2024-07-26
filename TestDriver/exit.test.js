// eventEndDriver.test.js
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('イベント終了後の処理テスト', () => {
  let window;
  let document;

  beforeAll(() => {
    // テスト用のHTMLをロード (ここでは、eventEnd.htmlと仮定)
    const htmlContent = fs.readFileSync(path.resolve(__dirname, '../public/audience-events/exit.html'), 'utf-8');
    const dom = new JSDOM(htmlContent, {
      url: "http://localhost",
      runScripts: "dangerously" // スクリプトを実行
    });
    window = dom.window;
    document = dom.window.document;

    // テスト対象のコードを文字列として読み込む
    const code = fs.readFileSync(path.resolve(__dirname, '../public/audience-events/exit.js'), 'utf-8'); // eventEnd.jsのパスを指定

    // スクリプトを実行
    const scriptEl = document.createElement('script');
    scriptEl.textContent = code;
    document.body.appendChild(scriptEl);
  });

  it('backBtnクリック時の動作', () => {
    // window.locationのモック
    delete window.location;
    window.location = { href: '' };

    // backBtn要素を取得
    const backBtn = document.getElementById('back-btn');

    // backBtnをクリック
    backBtn.click();

    // window.location.hrefが期待通りの値に変更されたか確認
    expect(window.location.href).toBe('http://localhost/');
  });
});
