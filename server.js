/* 各モジュールの読み込み */
const { Socket } = require('dgram');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let chatCount = 0;  // チャットの数
let questionCount = 0;  // 質問の数
let connectionCount = 0; // 同時接続数


 
var os = require('os');
var ifaces = os.networkInterfaces();
var ipAddress;
 
Object.keys(ifaces).forEach(function (ifname) {
  ifaces[ifname].forEach(function (iface) {
 
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    ipAddress = iface.address;
 
  });
});


app.use(express.static('public')); // 提供ディレクトリを'public'に設定

let clients = [];
var oneTimePass;
let host = 0;
let eventName;

function setOnetimePass() {
    oneTimePass = Math.floor(1000 + Math.random() * 9000);
    console.log(`Generated one-time-password : ${oneTimePass}`);
}

var counter=[]; //投票数

/* クライアント接続時の動作 */
wss.on('connection', (ws) => {
    console.log('Client connected');
    clients.push(ws);

    ws.on('message', (message) => {
        const data=JSON.parse(message); //JSON形式で解析
        const type = data.type;
        const name = data.name;
        const content = data.content;
        var sobj; //送信するオブジェクト

        console.log(`MessageReceived type:${type}, name:${name}, "${content}"`);

        if (type === "comment") {
            chatCount++;
            broadcastCounts();
        } else if (type === "question") {
            questionCount++;
            broadcastCounts();
        }

        switch(type) {
        case 'host': /*ホストの登録*/
            host=ws;
            console.log("ホストが登録されました");
            /* 最初からオーディエンスがいた場合も同時接続を取得する */
            const obj_init_connection = {
                type: 'connection',
                name: '',
                content: connectionCount
            }
            if (host.readyState === WebSocket.OPEN) {
                host.send(JSON.stringify(obj_init_connection)); // JSON形式で送信
            }
            break;
        
        case 'vote': //主催者から投票の開催を受信
            counter = new Array(parseInt(content.number));
            counter.fill(0);
            console.log(`voteContent: title:${content.title}, number:${content.number}, options:${content.options}, multi:${content.multi}, time:${content.time}, graph:${content.graph}`);
                //投票の開催を全クライアントに送信
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'vote',
                            name: 'server',
                            content: content
                        }));
                    }
                });
            break;
        case 'voteAnswer': //オーディエンスから投票の回答を受信して集計
            console.log(`voteAnswerContent: title:${content.title}, number:${content.number}, options:${content.options}, multi:${content.multi}, graph:${content.graph}, ans:${content.ans}`);
            var answer = content.ans;
            if(content.multi){
                for(let i =0; i < content.ans.length; i++){
                    counter[answer[i]]++;
                }
            }else{
                counter[answer]++;
            }
            break;
        case 'voteResult' : //主催者から投票の集計結果の要求を受信
            console.log(`voteResult: counter:${counter}`);
            //投票結果を全クライアントに送信
            content.result = counter;
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'voteResult',
                        name: 'server',
                        content: content
                    }));
                }
            });
            break;
        case 'eventName':
            eventName = content;
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'eventNameSet',
                        name: 'server',
                        content: eventName
                    }));
                }
            });
            break;
        case 'eventNameRequest':
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'eventNameSet',
                        name: 'server',
                        content: eventName
                    }));
                }
            });
            console.log(eventName);
            break;
        // case 'vote': //ホストのみに送るものはここに書く(投票、ワークシート)
        //     if (host.readyState === WebSocket.OPEN) {
        //         host.send(JSON.stringify(data)); // JSON形式で送信
        //     }
        //     console.log("voteを送信しました");
        //     break;
        case 'worksheet': //ワークシートの内容を受信
        console.log(`worksheetContent: title:${content.title}, time:${content.time}`);
            // ワークシートの内容を全クライアントに送信
            wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'worksheet',
                    name: 'server',
                    content: content
                }));
            }
            });
            break;
        case 'worksheetSend': //ワークシートの回答を受信
            // ワークシートの内容を主催者に送信
            if (host.readyState === WebSocket.OPEN) {
                host.send(JSON.stringify(data)); // JSON形式で送信
            }
            break;
        case 'passCheck':
            sobj = {
                type: 'passSend',
                name: 'server',
                content: oneTimePass
            }
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(sobj)); // JSON形式で送信
                }
            });
            break;
        case 'passDemand':
            setOnetimePass();
            break;
        case 'login':
            connectionCount++;
            console.log("login : " + connectionCount);
            /* ログイン通知を全体に送信 */
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data)); // JSON形式で送信
                }
            });
            /* 同時接続数を主催者へ送信 */
            const obj_connection = {
                type: 'connection',
                name: '',
                content: connectionCount
            }
            if (host.readyState === WebSocket.OPEN) {
                host.send(JSON.stringify(obj_connection)); // JSON形式で送信
            }
            break;
        case 'logout':
            connectionCount--;
            console.log("logout : " + connectionCount);
            /* ログアウト通知を全体に送信 */
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data)); // JSON形式で送信
                }
            });
            /* 同時接続数を主催者へ送信 */
            const obj_disconnection = {
                type: 'connection',
                name: '',
                content: connectionCount
            }
            if (host != 0) {
                if (host.readyState === WebSocket.OPEN) {
                    host.send(JSON.stringify(obj_disconnection)); // JSON形式で送信
                }   
            }
            break;
        default: //コメント・質問など全クライアントとホストに送るもの
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data)); // JSON形式で送信
                }
            });
        }
    });

    function broadcastCounts() {
        const countsData = JSON.stringify({
          type: 'updateCounts',
          chatCount: chatCount,
          questionCount: questionCount
        });
        
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(countsData);
          }
        });
      }

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
    console.log(`Server is running on http://${ipAddress}:3000`);
});