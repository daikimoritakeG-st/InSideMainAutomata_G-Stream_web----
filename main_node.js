'use strict';
// nodeでwebサーバ

const http = require("http");
const url = require('url');
var request = require("request");
const { resolve } = require("path");
const { rejects } = require("assert");
const fetch = require('node-fetch');
const fs = require('fs');
const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'dhuHTRD462gedk1',
  database: 'test',
  connectionLimit: 5
});
// pool.getConnection()
//     .then(conn => {

//       conn.query("SELECT 1 as val")
//         .then((rows) => {
//           console.log(rows); //[ {val: 1}, meta: ... ]
//           return conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
//         })
//         .then((res) => {
//           console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
//           conn.end();
//         })
//         .catch(err => {
//           //handle error
//           conn.end();
//         })

//     }).catch(err => {
//       //not connected
//     });


//----------------------------------グローバル変数-------------------------------------------
const json_item_zaiko_db = JSON.parse(fs.readFileSync('./db/zaiko_db.json', 'utf8'))
var globalItemMaster = json_item_zaiko_db['data'];
var globalUplodeDate = json_item_zaiko_db['uplode'];
//------------------------------------------------------------------------------------------


// mainサーバのポート指定
const port = 82; // デフォルトのポート82を指定



// htmlファイルを読み込み
var html = fs.readFileSync('./web/html/index.html');

const server = http.createServer((request, response) => {
  const url_parts = url.parse(request.url, true);
  // console.log(url_parts.pathname, url_parts.pathname == '/js/index.js');
  const isHtmlCompo = url_parts.pathname.match(/^\/html\/htmlCompo/); //画像を読み込む
  const isJsFolder = url_parts.pathname.match(/^\/js/);
  const isCssFolder = url_parts.pathname.match(/^\/css/);
  const isNode_modulesFolder = url_parts.pathname.match(/^\/node_modules/); //node_modulesを読み込む時
  const isG_stream = url_parts.pathname.match(/^\/image\/g_stream/); //画像を読み込む
  // console.log('isCssFolder =>', isCssFolder)
  // console.log('isNode_modulesFolder=>', isNode_modulesFolder)
  // const isMenuFolder = url_parts.pathname.match(/^\/menu/);
  // console.log('folder名 => ', isMenuFolder)
  console.log(url_parts.pathname)

  if (request.method !== 'GET') { //GETではないとき →　POST
    console.log('ポート81でPOSTリクエストがきた');
    const url_parts_post = url.parse(request.url, true);
    // フロントからの通信をルーティング
    console.log(url_parts_post.pathname)
    switch (url_parts_post.pathname) {
      case '/json/zaikolode':
        response.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8'
        });
        // request.setEncoding("utf-8");
        var body = '';
        // data受信イベントの発生時に断片データ(chunk)を取得
        // body 変数に連結
        request.on('data', function (chunk) {
          body += chunk;
        });
        request.on('end', () => {
          // jsonデータを受信完了
          const json = JSON.parse(body); // POSTで受信したデータをパース
          // console.log(json);
          if (Object.keys(json).length == 0) {
            const error = JSON.stringify({ data: 'error' });
            response.end(error); //データがなかった時の対処
          } else {
            globalItemMaster = json;
            const today = new Date();
            globalUplodeDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}`
            /**
             * ※本当はここでDBに保存したいが、非同期の関係でできていない
             * db に保存できていない
             */
            const zaiko_db_json = {
              uplode: globalUplodeDate,
              data: json
            }
            fs.writeFile('./db/zaiko_db.json', JSON.stringify(zaiko_db_json, null, '\t'), (err) => {
              if (err) {
                console.log('エラー： ', err)
              } else {
                console.log('正常に保存しました。')
              }

            }); // データがあったので、DBに書き込み
            const res_data = JSON.stringify({ data: 'success' });
            response.end(res_data);
          }
        })

        break;
      default:
        response.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          "Access-Control-Allow-Origin": "*"
        });
        response.end('{data: ルーティングのURL指定ができていません}');
        break;
    }
  }

  // jsを読み込む動作
  else if (isJsFolder != null) {
    // jsフォルダにアクセスした場合はすべてアクセスを通す
    response.writeHead(200, {
      "Content-Type": "text/javascript; charset=utf-8"
    });
    // console.log('ここを確認', './web' + isJsFolder['input'])
    const js = fs.readFileSync('./web' + isJsFolder['input']);
    response.end(js);
  } else if (isCssFolder != null) { //cssを読み込む動作
    // cssフォルダにアクセスした場合は全てアクセスを通す
    response.writeHead(200, {
      "Content-Type": "text/css; charset=utf-8"
    });
    const css = fs.readFileSync('./web' + isCssFolder['input']);
    response.end(css);

  } else if (isNode_modulesFolder != null) { //jsモジュールを読み込む動作
    response.writeHead(200, {
      "Content-Type": "text/javascript; charset=utf-8"
    });
    const node_module = fs.readFileSync('./' + isNode_modulesFolder['input']); //ここではnode_modulesのフォルダしか通らない処理なので、この書き方でセキュリティはOK
    response.end(node_module);

  } else if (isG_stream != null) {
    response.writeHead(200, {
      "Content-Type": "image/png; charset=utf-8"
    });
    console.log('動いたイメージ')
    const g_stream = fs.readFileSync('./web' + isG_stream['input']);
    response.end(g_stream);

  } else if (isHtmlCompo != null) {
    response.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      // 'Access-Control-Allow-Origin': '*'
    });

    const htmlCompo = fs.readFileSync('./web' + isHtmlCompo['input']);
    const htmlText = htmlCompo.toString(); //HTMLを文字列に変換

    const res_html_item = JSON.stringify({
      html: htmlText,
      item: globalItemMaster,
      update: globalUplodeDate //データ更新日
    })
    response.end(res_html_item);


  } else { // htmlを読み込む動作

    // アクセスURLでのルーティング
    // console.log('アクセスURL => ', url_parts.pathname);
    switch (url_parts.pathname) {

      case '/test':

        response.writeHead(200, {
          "Content-Type": "text/javascript; charset=utf-8"
        });
        // const js = fs.readFileSync('./web/js/index');

        break;
      case '/developer':
        response.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8"
        });
        const html_developer = fs.readFileSync('./web/html/developer/deveIndex.html');
        response.end(html_developer);

        break;

      case '/menu': //このフォルダは全てアクセス可能とする
        response.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8"
        });
        const html_menu = fs.readFileSync('./web/html/menu/index.html');
        response.end(html_menu);

        break;

      default:
        response.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8"
        });
        // htmlファイルを読み込み
        // ここで読み込むことで、ファイルを編集したらサーバーを起動しなおさなくてもOK
        const html = fs.readFileSync('./web/html/index.html');
        // const responseMessage = "<h1>Hello World</h1>";
        response.end(html);
        // console.log(`Sent a response : ${responseMessage}`);
        break;
    }

  }


});

// サーバーを起動
server.listen(port);
console.log(`The server has started and is listening on port number: ${port}`);






