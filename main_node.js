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
const port = 81; // デフォルトのポート80を指定

const pythonApiList = {
  localhost: {

    url: '127.0.0.1',

    main: {
      port: 8000,
      code: {
        rakuten: [
          {
            id: 'dcuyer74kwe23',
            name: 'RPP速報 自動通知',
            folderName: '起動コード.定時起動',
            fileName: 'rakutenAdvertisingRatio',
            targetDate: '-1', //昨日のデータ
            triggerDate: '',
            triggerHour: '',
            triggerMinute: '0', //毎時間０分に起動
            IntervalMinute: '',
          },
          {
            id: 'dyehsu73sh',
            name: '楽天商品データ更新確認',
            folderName: '起動コード.楽天.サイトの更新を確認',
            fileName: 'RMSScraping_day_access1',
          },
          {
            id: 'ideso0193jh54bw',
            name: '楽天商品分析　データ取得　RPP',
            folderName: '起動コード.楽天.RPP',
            fileName: 'RMSScraping_rpp1_1',
          },
          {
            id: 'kduyebdcy756234jd',
            name: '楽天商品分析 貼り付け　RPP',
            folderName: '起動コード.楽天.RPP',
            fileName: 'Productanalysis_rpp1',
          },
          {
            id: 'aoqmv82jhdywe5343',
            name: '楽天商品分析 貼り付け　RPP 商品別',
            folderName: '起動コード.楽天.RPP',
            fileName: 'Productanalysis_rpp_list1',
          },
          {
            id: '03846jdkdfuheua78',
            name: '楽天商品分析　データ取得 クーポンアドバンス',
            folderName: '起動コード.楽天.クーポンアドバンス',
            fileName: 'RMSScraping_cad1',
          },
          {
            id: 'djd7739djjhdwobaol',
            name: '楽天商品分析　データ貼り付け クーポンアドバンス',
            folderName: '起動コード.楽天.クーポンアドバンス',
            fileName: 'Productanalysis_cad1',
          },
          {
            id: 'nehdc65427839klsdl',
            name: '楽天商品分析　データ取得　アクセス数',
            folderName: '起動コード.楽天.アクセス数',
            fileName: 'RMSScraping_access1',
          },
          {
            id: 'djkuyheio9092784hfy6',
            name: '楽天商品分析　貼り付け　アクセス数',
            folderName: '起動コード.楽天.アクセス数',
            fileName: 'Productanalysis_access1_1',
          },
          {
            id: 'llpfiqmh11037854m',
            name: '楽天商品分析　データ貼り付けPC 参照元',
            folderName: '起動コード.楽天.参照元',
            fileName: 'Productanalysis_Mig_PC2',
          },
          {
            id: 'aaoencfioe937jfvlwe',
            name: '楽天商品分析　データ貼り付けSP 参照元',
            folderName: '起動コード.楽天.参照元',
            fileName: 'Productanalysis_Mig_SP2',
          },
          {
            id: 'jfdurnhuuebvbdtd5',
            name: '楽天商品分析　データ貼り付け クーポン',
            folderName: '起動コード.楽天.クーポン',
            fileName: 'Productanalysis_coupon1',
          },
          {
            id: 'kdffjeiuuyerhnf77fe',
            name: 'KOUGA商品分析 データ取得 在庫数',
            folderName: '起動コード.楽天.KOUGA在庫数',
            fileName: 'KougaScraping_stocklist1',
          },
          {
            id: 'kdfpppejf99h36djwjh',
            name: 'KOUGA商品分析 貼り付け 在庫数',
            folderName: '起動コード.楽天.KOUGA在庫数',
            fileName: 'Productanalysis_stock1',
          },
        ],

        aupay: [
          {
            id: 'mzkiyuhdjey237867',
            name: 'aupay商品分析 貼り付け クーポンコスト',
            folderName: '起動コード.au.クーポンコスト',
            fileName: 'Productanalysis_couponcost1',
          },
          {
            id: 'pweyrudnbgow73vzssd',
            name: 'aupay商品分析 貼り付け プラチナマッチ',
            folderName: '起動コード.au.プラチナマッチ',
            fileName: 'Productanalysis_platinum1',

          },
          {
            id: 'fjdhulsovkdfgbhd',
            name: 'aupay商品分析 データ取得 商品データベース',
            folderName: '起動コード.au.商品別データベース',
            fileName: 'aupayScraping_rep1_2_0',
          },
          {
            id: 'synhjudcue783fys',
            name: 'aupay商品分析 貼り付け 商品データベース',
            folderName: '起動コード.au.商品別データベース',
            fileName: 'Productanalysis_item1',
          },
        ],

        yahoo: [
          {
            id: 'jfurf8883dddyhue',
            name: 'yahoo商品分析 貼り付け PRオプション',
            folderName: '起動コード.yahoo.PRオプション',
            fileName: 'Productanalysis_PRoption1',
          },
          {
            id: 'dfjufwklqqpsfg2334',
            name: 'yahoo商品分析 データ取得 商品データベース',
            folderName: '起動コード.yahoo.商品別データベース',
            fileName: 'YahooScraping_item1',
          },
          {
            id: 'jduyeqpqmdaznnnzx',
            name: 'yahoo商品分析 貼り付け 商品データベース',
            folderName: '起動コード.yahoo.商品別データベース',
            fileName: 'Productanalysis_yahoo_item1',
          },
          {
            id: 'ppiudknowd0921',
            name: 'yahoo商品分析 データ取得 アイテムマッチ',
            folderName: '起動コード.yahoo.アイテムマッチ',
            fileName: 'YahooScraping_itemmatch1',
          },
          {
            id: 'pwjjhdunbxz4f78vu',
            name: 'yahoo商品分析 貼り付け アイテムマッチ',
            folderName: '起動コード.yahoo.アイテムマッチ',
            fileName: 'Productanalysis_itemmatch1',
          },
        ]
      }

    },
    subPython1: {
      port: 7000,
      code: {
        rakuten: [
          {
            id: 'ideso0193jh54bw',
            name: '楽天商品分析　データ取得　RPP',
            folderName: '起動コード.楽天',
            fileName: 'RMSScraping_rpp1_1',
          },
        ]

      }


    }
  }


}


/**
 * @type {{
 * アクセスデータ取得済: {yer: number, month: number, date: number},
 * アクセス数貼付済_商品番号: {num: number},
 * 参照元貼付済_PC: {yer: number, month: number, date: number}, 
 * 参照元貼付済_SP: {yer: number, month: number, date: number},
 * }}
 */
var mainSettingObj;

/**
 * ファイルがあるかをチェックする関数
 * @param {string} filePath 
 * @returns {boolean} true=>ファイルがある
 */
function checkFile(filePath) {
  let isExist = false;
  try {
    fs.statSync(filePath);
    isExist = true;
  } catch (err) {
    isExist = false;
  }
  return isExist;
}

/**
 * 日付のみの大小を比較する関数
 * 引数１　＜　引数２　＝　true
 * @param {Date} date1 
 * @param {Date} date2 
 * @returns 
 */
function lowerThanDateOnly(date1, date2) {
  var year1 = date1.getFullYear();
  var month1 = date1.getMonth() + 1;
  var day1 = date1.getDate();

  var year2 = date2.getFullYear();
  var month2 = date2.getMonth() + 1;
  var day2 = date2.getDate();

  if (year1 == year2) {
    if (month1 == month2) {
      return day1 < day2;
    }
    else {
      return month1 < month2;
    }
  } else {
    return year1 < year2;
  }
}

/**
 * 日付のみの大小を比較する関数
 * 引数１　＜＝　引数２　＝　true
 * @param {Date} date1 
 * @param {Date} date2 
 * @returns 
 */
function lowerThanDateOnlyEqual(date1, date2) {
  var year1 = date1.getFullYear();
  var month1 = date1.getMonth() + 1;
  var day1 = date1.getDate();

  var year2 = date2.getFullYear();
  var month2 = date2.getMonth() + 1;
  var day2 = date2.getDate();

  if (year1 == year2) {
    if (month1 == month2) {
      return day1 <= day2;
    }
    else {
      return month1 < month2;
    }
  } else {
    return year1 < year2;
  }
}


/**
 * pythonAPIサーバPOST通信用
 * @param {*} url
 * @param {*} txt1
 * @param {*} txt2
 */
function pythonAPI(url, txt1, txt2) {
  let pythonApi = {
    txt1: txt1,
    txt2: txt2,
  };
  var options_goo = {
    url: url,
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(pythonApi),
  };
  return new Promise((resolve, reject) => {
    request(options_goo, function (error, response, body) {
      if (!error) {
        if (response.statusCode == 200) {
          resolve(body); //ここの処理が終わらないと次の処理にいかない
        } else {
          reject(error)
        }
      } else {
        console.log("Error!!");
        reject("APIエラー");
      }
    });
  });
}


/**
 * pythonサーバのpythonコード起動と、チャットワークへメッセージ送信
 * @param {*} url
 * @param {*} txt1
 * @param {*} txt2
 */
function pythonAPI_chat_8000(id, txt1, param = { txt1: '', txt2: '' }) {
  var options_goo = {
    url: `http://127.0.0.1:8000/${id}`,
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(param),
  };
  return new Promise((resolve, reject) => {
    request(options_goo, function (error, response, body) {
      if (!error) {
        if (response.statusCode == 200) {
          resolve(body); //ここの処理が終わらないと次の処理にいかない
        } else {
          reject(error)
        }
      } else {
        console.log("Error!!");
        reject("APIエラー");
      }
    });
  });
}




/**
 * メッセージの送信する関数
 * @param {string} message メッセージの内容
 * @param {string} room_id チャットを送るルームID
 * @param {string} token チャットワークとの連携トークン
 */
function chatWork(message, room_id = '303738469', token = '4ca182854b8da03e4bb36d3031933b68') {
  const options = {
    url: "https://api.chatwork.com/v2/rooms/" + room_id + "/messages",
    headers: {
      "X-ChatWorkToken": token
    },
    form: {
      body: message
    }
  }
  function callbackFuc(error, res, body) {
    res.statusCode == 200 ? console.log(body) : console.log('error: ' + error + '\nresponseCode: ' + res.statusCode);
  }
  request.post(options, callbackFuc);
}



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



// GETリクエスト & POST を受信
const get_server = http.createServer(function (request, response) {
  console.log('動いた１')

  if (request.method === 'GET') {
    const url_parts = url.parse(request.url, true);

    // フロントからの通信をルーティング
    switch (url_parts.pathname) {
      case '/':
        response.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          "Access-Control-Allow-Origin": "*"
        });
        const query = url_parts.query
        const id = query['id'] // パラメータ「id」を取得

        switch (id) {
          case 'dyehsu73sh':
            pythonAPI(`http://127.0.0.1:8000/${id}`, '', 'test').then(data => {
              console.log('正常にリクエスト');
              console.log(data);
              response.end(`{data: ${data}}`);
            }).catch(error => {
              response.end(error);
            })

            break;
        }
        break;
      case 'test':
        response.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          "Access-Control-Allow-Origin": "*"
        });
        break
      case '/image/blue':
        response.writeHead(200, {
          'Content-Type': 'image/jpeg; charset=utf-8',
          "Access-Control-Allow-Origin": "*"
        });
        const image_blue = fs.readFileSync('./web/image/561564f4b028e61f658c7b20f46fdfd0_t.jpeg');
        response.end(image_blue);
        break
      case '/image/yellow':
        response.writeHead(200, {
          'Content-Type': 'image/png; charset=utf-8',
          "Access-Control-Allow-Origin": "*"
        });
        const image_yellow = fs.readFileSync('./web/image/smile-gaman.png');
        response.end(image_yellow);
        break
      case '/image/red':
        response.writeHead(200, {
          'Content-Type': 'image/jpg; charset=utf-8',
          "Access-Control-Allow-Origin": "*"
        });
        const image_red = fs.readFileSync('./web/image/360_F_268089534_S9eeEbibKyI0YBX2WHgrW0CwX5AxYVHq.jpg');
        response.end(image_red);
        break
      default:
        response.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          "Access-Control-Allow-Origin": "*"
        });
        response.end('予期しないリクエストです')
        break;
    }

    pythonAPI('http://127.0.0.1:8000', '', 'test').then(data => {
      console.log('正常にリクエスト');
      console.log(data);
    }).catch(error => {
      console(error)
    })

    //ここに処理を記述する

  }
  // response.end('{data:data}');

})

get_server.listen(8080); // GET APIサーバポート
console.log(`The server has started and is listening on port number: ${8080}`);

// // POSTリクエストを受信
// http.createServer(function(request, response) {
//     response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

//     if(request.method === 'POST') {

//         //ここに処理を記述する

//     }

// })








//-----------------------------------------------------------------------------------------------------------
//-----------------ここから、繰り返し処理で自動起動するトリガー--------------------------------------------------

/**
 * 一定時間で無限回実行される関数の実行回数
 * それぞれのプログラムの実行をコントロールするのに活用する
 */
var counter = 0;

var errCount = 0;

//--------------定時実行プログラムの動作確認--------------------
// 時間のわずかなズレで実行されない場合があるため、変数を確認して
// 実行されていない場合は、実行する
var is_dcuyer74kwe23 = true; // 実行したかを確認
var is_herugv83o42jefdkd = true; // 実行したかを確認
var is_iejf73kcmod = true; // 実行したかを確認
var is_dnhjjfow673jdfv = true; // 実行したかを確認
var is_ideso0193jh54bw = true;
var is_03846jdkdfuheua78 = true;
var is_kdffjeiuuyerhnf77fe = true;
var is_kdfpppejf99h36djwjh = false; // データ取得を確認
var is_fjdhulsovkdfgbhd = true;


// 一定間隔で無限回実行される
function intervalFunc() {
  //----------------------定時起動-----------------------------
  // 制御方法　毎回時間を確認し、一致したら動作する
  const date = new Date();
  const hour = date.getHours();
  const minut = date.getMinutes();
  // console.log(date.getHours(), date.getMinutes()) //時間, 分

  /**
   * RPP速報
   */
  if ((0 < minut && minut < 5 && is_dcuyer74kwe23) || (hour == 23 && 53 < minut && minut < 58 && is_dcuyer74kwe23)) {   // 0分～5分に実行
    is_dcuyer74kwe23 = false;

    console.log(date)
    console.log('RPP速報のエラーは ', errCount, ' 回です');
    // RPP速報　自動通知
    pythonAPI('http://127.0.0.1:8000/dcuyer74kwe23', '', 'test').then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
      errCount++; //エラーをカウント
      // エラーが起こった場合にもう一度実行
      pythonAPI('http://127.0.0.1:8000/dcuyer74kwe23', '', 'test').then(data => {
        console.log(data);
      }).catch(error => {
        console.log(error);
      })
    })
  } else if (10 < minut) { // リセットも時間を指定して、同じ時間に複数回起動しないようにする
    is_dcuyer74kwe23 = true; //次の時間に起動できるように初期化
  }


  /**
   * ジェネシス品目マスタ取得
   */
  if (hour == 2 && 0 < minut && minut < 10 && is_herugv83o42jefdkd) { //2:00 ~ 2:10 に実行
    is_herugv83o42jefdkd = false;
    // カワダオンラインの商品在庫データ取得
    pythonAPI('http://127.0.0.1:9000/herugv83o42jefdkd', '', '').then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
      pythonAPI('http://127.0.0.1:9000/herugv83o42jefdkd', '', '').then(data => {
        console.log(data);
      }).catch(error => {
        console.log(error);
      })
    })
  } else if (20 < minut) {
    is_herugv83o42jefdkd = true;
  }


  /**
   * カワダオンライン商品分析
   */
  if (hour == 11 && 0 < minut && minut < 10 && is_iejf73kcmod) { //11:00 ~ 11:10 に実行
    is_iejf73kcmod = false;
    // カワダオンラインの商品在庫データ取得
    pythonAPI('http://127.0.0.1:8000/iejf73kcmod', '', 'test').then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
      pythonAPI('http://127.0.0.1:8000/iejf73kcmod', '', 'test').then(data => {
        console.log(data);
      }).catch(error => {
        console.log(error);
      })
    })
  } else if (20 < minut) {
    is_iejf73kcmod = true;
  }


  /**
   * 各商品分析の在庫を更新
   */
  if (hour == 12 && 0 < minut && minut < 10 && is_dnhjjfow673jdfv) { //12:00 ~ 12:10 に実行
    is_dnhjjfow673jdfv = false;
    // カワダオンラインの商品在庫データ取得
    pythonAPI('http://127.0.0.1:8000/dnhjjfow673jdfv', '', 'test').then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
      pythonAPI('http://127.0.0.1:8000/dnhjjfow673jdfv', '', 'test').then(data => {
        console.log(data);
      }).catch(error => {
        console.log(error);
      })
    })
  } else if (20 < minut) {
    is_dnhjjfow673jdfv = true;
  }




  // 前の環境で動かす場合にfalseにして無効にする
  if (true) {
    /**
     * RPP 商品分析
     */
    if (hour == 8 && 5 < minut && minut < 10 && is_ideso0193jh54bw) { //8:05 ~ 8:10 に実行
      is_ideso0193jh54bw = false;
      // RMS商品分析データ取得_RPP
      const res = pythonAPI('http://127.0.0.1:8000/ideso0193jh54bw', '', '').then(data => {
        console.log(data);
        return 'success';
      }).catch(error => {
        console.log(error);
        pythonAPI('http://127.0.0.1:8000/ideso0193jh54bw', '', '').then(data => {
          console.log(data);
          return 'success';
        }).catch(error => {
          console.log(error);
          return 'err';
        })
      })
      res.then(res => {
        if (res == 'success') {
          // データ取得が成功した場合 →　RPP貼り付け
          pythonAPI('http://127.0.0.1:8000/kduyebdcy756234jd', '', '').then(data => {
            console.log(data);
            return 'success';
          }).catch(error => {
            console.log(error);
            return 'err';
          })
          // 各種商品貼り付け (旧コードで実行)
          pythonAPI('http://127.0.0.1:7000/aoqmv82jhdywe5343', '', '').then(data => {
            console.log(data);
            return 'success';
          }).catch(error => {
            console.log(error);
            return 'err';
          })
        }
      }).catch(err => {
        console.log('RPPデータ取得でAPIエラー');
      })
    } else if (0 < minut && minut < 5) {
      is_ideso0193jh54bw = true;
    }

    /**
     * クーポンアドバンス
     */
    if (hour == 10 && 30 < minut && minut < 35 && is_03846jdkdfuheua78) { //10:30 ~ 10:35 に実行
      is_03846jdkdfuheua78 = false;
      // RMS商品分析データ取得_クーポンアドバンス
      const res = pythonAPI('http://127.0.0.1:8000/03846jdkdfuheua78', '', '').then(data => {
        console.log(data);
        return 'success';
      }).catch(error => {
        console.log(error);
        pythonAPI('http://127.0.0.1:8000/03846jdkdfuheua78', '', '').then(data => {
          console.log(data);
          return 'success';
        }).catch(error => {
          console.log(error);
          return 'err'
        })
      })
      res.then(res => {
        if (res == 'success') {
          //楽天クーポンアドバンス貼り付け
          pythonAPI('http://127.0.0.1:8000/djd7739djjhdwobaol', '269', 'test').then(data => {
            console.log(data);
          }).catch(error => {
            console.log(error);
          })
        }
      }).catch(err => {
        console.log('クーポンアドバンスデータ取得でAPIエラー')
      })
    } else if (45 < minut) {
      is_03846jdkdfuheua78 = true;
    }


    // /**
    //  * KOUGA在庫数 データ取得
    //  */
    // if (hour == 23 && 10 < minut && minut < 15 && is_kdffjeiuuyerhnf77fe) { //23:10 ~ 23:15 に実行
    //   is_kdffjeiuuyerhnf77fe = false;
    //   // KOUGA商品分析データ取得_在庫数
    //   const res = pythonAPI('http://127.0.0.1:8000/kdffjeiuuyerhnf77fe', '', 'test').then(data => {
    //     console.log(data);
    //     return 'success';
    //   }).catch(error => {
    //     console.log(error);
    //     const res = pythonAPI('http://127.0.0.1:8000/kdffjeiuuyerhnf77fe', '', 'test').then(data => {
    //       console.log(data);
    //       return 'success'
    //     }).catch(error => {
    //       console.log(error);
    //       return 'err'
    //     })
    //     return res;
    //   })
    //   res.then(res => {
    //     if (res == 'success') {
    //       // データ取得が成功
    //       is_kdfpppejf99h36djwjh = true;
    //     }
    //   }).catch(err => {
    //     console.log('KOUGA在庫数取得でAPIエラー')
    //   })
    // } else if (25 < minut) {
    //   is_kdffjeiuuyerhnf77fe = true;
    // }
    // /**
    //  * KOUGA在庫数　貼り付け
    //  */
    // if (is_kdfpppejf99h36djwjh && hour == 2 && 0 < minut && minut < 10) { //02:00 ~ 02:10 に実行
    //   is_kdfpppejf99h36djwjh = false;
    //   const res = pythonAPI('http://127.0.0.1:7000/kdfpppejf99h36djwjh', '', 'test').then(data => {
    //     console.log(data);
    //     return 'success';
    //   }).catch(error => {
    //     console.log(error);
    //     const res = pythonAPI('http://127.0.0.1:7000/kdfpppejf99h36djwjh', '', 'test').then(data => {
    //       console.log(data);
    //       return 'success'
    //     }).catch(error => {
    //       console.log(error);
    //       return 'err'
    //     })
    //     return res;
    //   })
    // }
  }



  //----------aupay----------------------

  if (hour == 9 && 15 < minut && minut < 20 && is_fjdhulsovkdfgbhd) { //9:15 ~ 9:20 に実行
    is_fjdhulsovkdfgbhd = false;
    // aupay商品別データ取得 商品データベース
    const res = pythonAPI('http://127.0.0.1:8000/fjdhulsovkdfgbhd', '', 'test').then(data => {
      console.log(data);
      return 'success';
    })
    res.then(res => {
      if (res == 'success') {
        // データ取得が成功
      }
    }).catch(err => {
      chatWork('aupay商品別データ取得でエラーが発生しました。再度実行してください。', '251884445');
    })
  } else if (30 < minut) {
    is_fjdhulsovkdfgbhd = true;
  }




  //---------------制御---------------------
  if (counter == 0) {
    // 初回起動時のみ動く処理

  } else if (counter == 999999999999999) {
    counter = 0; // カウンターのリセット
  }
  counter++; //カウント
  //---------------------------------------

  if (counter % 15 == 0) { //15分に一度起動
    console.log(date)
    // 楽天商品データ更新確認
    pythonAPI('http://127.0.0.1:8000/dyehsu73sh', '', '').then(data => {
      console.log(data);
      const res_data = JSON.parse(data);
      let todayObj = new Date(); //現在の日付
      let resDate = new Date(res_data['score']); //取得した日付

      // 昨日の日付と、取得した日付が一致しているかを確認
      // jsonファイルを確認して、何日のデータまで処理が終わっているかを確認
      mainSettingObj = JSON.parse(fs.readFileSync('./setting/nodeServer/mainSetting.json', 'utf8')); //設定ファイルを読み込む
      // console.log("json",mainSettingObj);
      const jsonDateObj = new Date(`${mainSettingObj['アクセスデータ取得済']['yer']}-${mainSettingObj['アクセスデータ取得済']['month']}-${mainSettingObj['アクセスデータ取得済']['date']}`)

      if (lowerThanDateOnly(jsonDateObj, resDate) && lowerThanDateOnly(resDate, todayObj)) {
        //日付を指定する　フォーマット 2022-1-12 デフォルトだと、今日の日付で動作するため昨日データ更新されなかったことを考慮して、取得した値で動作させる
        const resDateCopy = new Date(`${resDate.getFullYear()}/${resDate.getMonth() + 1}/${resDate.getDate()}`); //ここだけで使うDateオブジェクト
        resDateCopy.setDate(resDateCopy.getDate() + 1); //取得した日付は1日ずれているため、＋１
        // 繰り返し処理で日数差を求める　差がなくなるまで繰り返し
        let loopCount = 0;
        while (lowerThanDateOnly(resDateCopy, todayObj)) {
          resDateCopy.setDate(resDateCopy.getDate() + 1)
          loopCount++; //カウント
        }
        chatWork('データが更新されましたので、楽天アクセスデータ取得を起動します。', '251884445');
        pythonAPI(`http://127.0.0.1:7000/nehdc65427839klsdl`, loopCount, '').then(data => {
          const res_data = JSON.parse(data);
          if (res_data['score'] == 'success') {
            // Jsonファイルの処理済みの日付を更新
            mainSettingObj['アクセスデータ取得済']['yer'] = resDate.getFullYear();
            mainSettingObj['アクセスデータ取得済']['month'] = resDate.getMonth() + 1; //月は０から始まるので＋１で補正
            mainSettingObj['アクセスデータ取得済']['date'] = resDate.getDate();
            fs.writeFileSync('./setting/nodeServer/mainSetting.json', JSON.stringify(mainSettingObj, null, '\t'));
            chatWork('楽天アクセスデータ取得が完了しましたので、アクセス数貼り付けを起動します。', '251884445');
            pythonAPI(`http://127.0.0.1:7000/djkuyheio9092784hfy6`, '', loopCount).then(data => {
              const res_data_2 = JSON.parse(data);
              if (res_data_2['score'] == 'success') {
                // chatWork('アクセス数貼り付けが完了しました。' ,'251884445');
                mainSettingObj = JSON.parse(fs.readFileSync('./setting/nodeServer/mainSetting.json', 'utf8')); //設定ファイルを読み込む
                mainSettingObj['アクセス数貼付済_商品番号']['num'] = -1; // 初期化
                fs.writeFileSync('./setting/nodeServer/mainSetting.json', JSON.stringify(mainSettingObj, null, '\t'));
              } else if (Array.isArray(res_data_2['score'])) {
                mainSettingObj = JSON.parse(fs.readFileSync('./setting/nodeServer/mainSetting.json', 'utf8')); //設定ファイルを読み込む
                mainSettingObj['アクセス数貼付済_商品番号']['num'] = Number(res_data_2['score'][0]); //途中の商品番号を、設定ファイルのオブジェクトへ格納
                fs.writeFileSync('./setting/nodeServer/mainSetting.json', JSON.stringify(mainSettingObj, null, '\t'));
                chatWork('各種商品シートへの貼り付け途中で処理が止まりました');

              } else {
                chatWork('アクセス数貼り付けのpythonコード内でエラーが発生しました。', '251884445');
              }
            }).catch(error => {
              console.log(error);
              chatWork('アクセス数貼り付けで何かしらのエラーが発生しました。', '251884445');
            })


          } else {
            chatWork('楽天アクセスデータ取得のpythonコード内でエラーが発生しました。', '251884445');
          }
        }).catch(error => {
          console.log(error);
          chatWork('楽天アクセスデータ取得が何かしらのエラーで起動できませんでした。', '251884445');
        })
      }
    }).catch(error => {
      console.log(error);
    })
  }


  console.log('Cant stop me now!', counter);
}

//定時起動関数
setInterval(intervalFunc, 60000); //1分間隔の実行 (フレームレート: 1分)








//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
// InSideMainAutomata操作用　2秒間隔で確認　メインのチャットワークをトリガーにするプログラム
if (true) {
  //-----------------------
  // ISMA操作用チャットで使えるコマンド
  const commandList = [
    ['CSVから取得した在庫を各シートへ貼付', 'dnhjjfow673jdfv', [1, '貼り付けを途中から開始することができます\n完了している商品の番号を半角数字で送信してください'], 8000],
    ['楽天商品データ更新確認', 'dyehsu73sh', [0], 8000],
    ['RPP速報', 'dcuyer74kwe23', [0], 8000],
    ['カワダオンライン在庫データ取得', 'iejf73kcmod', [0], 8000],
    ['RSM_RPPデータ取得', 'ideso0193jh54bw', [1, '処理する日付を変更することができます。\n前日の処理をするときは、「1」\n一昨日の処理をするときは、「2」、5日前の処理をするときは、「5」のように、ずらす分の日数を送信してください。'], 8000],
    ['RSM_RPPデータ貼付', 'kduyebdcy756234jd', [0], 8000],
    ['RSM_RPPデータ貼付_各種商品別 (Ver旧)', 'aoqmv82jhdywe5343', [
      2,
      '貼り付けを途中から開始することができます\n完了している商品の番号を半角数字で送信してください\nその番号まで処理をスキップします。',
      '処理する日付を変更することができます。\n前日の処理をするときは、「1」\n一昨日の処理をするときは、「2」、5日前の処理をするときは、「5」のように、ずらす分の日数を送信してください。'
    ], 7000],
    ['RSM_クーポンアドバンスデータ取得', '03846jdkdfuheua78', [
      2,
      '処理する日付を変更することができます。\n前日の処理をするときは、「1」\n一昨日の処理をするときは、「2」、5日前の処理をするときは、「5」のように、ずらす分の日数を送信してください。',
      'スクレイピングのみ省略するには、no以外を送信してください。',
    ], 8000],
    ['RSM_クーポンアドバンスデータ貼付', 'djd7739djjhdwobaol', [1, '処理する日付を変更することができます。\n前日の処理をするときは、「1」\n一昨日の処理をするときは、「2」、5日前の処理をするときは、「5」のように、ずらす分の日数を送信してください。',], 8000],
    ['RSM_アクセス数_取得 (Ver旧)', 'nehdc65427839klsdl', [1, '処理する日付を変更することができます。\n前日の処理をするときは、「1」\n一昨日の処理をするときは、「2」、5日前の処理をするときは、「5」のように、ずらす分の日数を送信してください。'], 7000],
    ['RSM_アクセス数_貼付 (Ver旧)', 'djkuyheio9092784hfy6', [
      2,
      '貼り付けを途中から開始することができます\n完了している商品の番号を半角数字で送信してください\nその番号まで処理をスキップします。',
      '処理する日付を変更することができます。\n前日の処理をするときは、「1」\n一昨日の処理をするときは、「2」、5日前の処理をするときは、「5」のように、ずらす分の日数を送信してください。'
    ], 7000],
    ['RSM_参照元_貼付_PC (Ver旧)', 'llpfiqmh11037854m', [
      2,
      '貼り付けを途中から開始することができます\n完了している商品の番号を半角数字で送信してください\nその番号まで処理をスキップします。',
      '処理する日付を変更することができます。\n前日の処理をするときは、「1」\n一昨日の処理をするときは、「2」、5日前の処理をするときは、「5」のように、ずらす分の日数を送信してください。'
    ], 7000],
    ['RSM_参照元_貼付_SP (Ver旧)', 'aaoencfioe937jfvlwe', [
      2,
      '貼り付けを途中から開始することができます\n完了している商品の番号を半角数字で送信してください\nその番号まで処理をスキップします。',
      '処理する日付を変更することができます。\n前日の処理をするときは、「1」\n一昨日の処理をするときは、「2」、5日前の処理をするときは、「5」のように、ずらす分の日数を送信してください。'
    ], 7000],
    ['RSM_クーポン_貼付', 'jfdurnhuuebvbdtd5', [1, '半角数字(n):  対象日 = 今日 - n'], 8000],
    // ['KOUGA_在庫数_取得', 'kdffjeiuuyerhnf77fe', [0], 8000],
    // ['KOUGA_在庫数_貼付 (Ver旧)', 'kdfpppejf99h36djwjh', [1, '貼り付けを途中から開始することができます\n完了している商品の番号を半角数字で送信してください\nその番号まで処理をスキップします。'], 7000],
    ['aupay_クーポンコスト_貼付', 'mzkiyuhdjey237867', [0], 8000],
    ['aupay_プラチナマッチ_貼付', 'pweyrudnbgow73vzssd', [1, '処理する日付を変更することができます。\n前日の処理をするときは、「1」\n一昨日の処理をするときは、「2」、5日前の処理をするときは、「5」のように、ずらす分の日数を送信してください。'], 8000],
    ['aupay_商品データベース_取得', 'fjdhulsovkdfgbhd', [1, '処理する日付を変更することができます。\n前日の処理をするときは、「1」\n一昨日の処理をするときは、「2」、5日前の処理をするときは、「5」のように、ずらす分の日数を送信してください。'], 8000],
    ['aupay_商品データベース_貼付', 'synhjudcue783fys', [1, '処理する日付を変更することができます。\n前日の処理をするときは、「1」\n一昨日の処理をするときは、「2」、5日前の処理をするときは、「5」のように、ずらす分の日数を送信してください。'], 8000],
    ['yahoo_商品データベース_取得', 'dfjufwklqqpsfg2334', [1, '処理する日付を変更することができます。\n前日の処理をするときは、「1」\n一昨日の処理をするときは、「2」、5日前の処理をするときは、「5」のように、ずらす分の日数を送信してください。'], 8000],
    ['yahoo_商品データベース_貼付', 'jduyeqpqmdaznnnzx', [1, '処理する日付を変更することができます。\n前日の処理をするときは、「1」\n一昨日の処理をするときは、「2」、5日前の処理をするときは、「5」のように、ずらす分の日数を送信してください。'], 8000],
    ['yahoo_アイテムマッチ_取得', 'ppiudknowd0921', [1, '処理する日付を変更することができます。\n前日の処理をするときは、「1」\n一昨日の処理をするときは、「2」、5日前の処理をするときは、「5」のように、ずらす分の日数を送信してください。'], 8000],
    ['yahoo_アイテムマッチ_貼付', 'pwjjhdunbxz4f78vu', [1, '処理する日付を変更することができます。\n前日の処理をするときは、「1」\n一昨日の処理をするときは、「2」、5日前の処理をするときは、「5」のように、ずらす分の日数を送信してください。'], 8000],
    ['yahoo_PRオプション_貼付', 'jfurf8883dddyhue', [1, '読み込む日付の開始日を変更できます\n前日より前のデータを処理したい場合は次のように送信してください\n(例)2022-12-11\n'], 8000],
    ['ジェネシス品目コードダウンロード', 'herugv83o42jefdkd', [0], 9000]
  ]

  //コマンド選択メッセージを作成
  let option = '';
  let option_2 = '';
  let counter_InSideMainAutomata = 0;
  let is_commLine = false;
  let command_time_count = 0;
  let is_YESorNO = false;
  let select_command = null;
  let count_YESorNO = 0;
  let is_commLin_option = false;
  let is_commLin_option_2 = false;
  let fastMess = `コマンドラインを起動\nコマンド「1」を実行する場合は 1 を半角で送信してください。\n\n 終了するには「end」と送信してください。\n\n----使えるコマンド一覧----`;
  commandList.forEach((val, ind) => {
    fastMess = fastMess + `\n コマンド「 ${ind} 」 は、 ${val[0]} を起動`;
  })


  function chatWorkTrigger() {
    counter_InSideMainAutomata++;
    if (counter_InSideMainAutomata > 99999999999) {
      counter_InSideMainAutomata = 0; //エラーを防ぐために初期化
    }
    const token = '4ca182854b8da03e4bb36d3031933b68';
    const room_id = '303738469';
    const url = `https://api.chatwork.com/v2/rooms/${room_id}/messages?force=0`;
    const options = { method: 'GET', headers: { accept: 'application/json', 'x-chatworktoken': token } };


    //メッセージの送信する関数
    function sendToMychat(message) {
      const options = {
        url: "https://api.chatwork.com/v2/rooms/" + room_id + "/messages",
        headers: {
          "X-ChatWorkToken": token
        },
        form: {
          body: message
        }
      }
      function callbackFuc(error, res, body) {
        res.statusCode == 200 ? console.log(body) : console.log('error: ' + error + '\nresponseCode: ' + res.statusCode);
      }
      request.post(options, callbackFuc);
    }

    if (command_time_count > 300) { //コマンドラインの起動時間を制御
      // 全ての変数を初期化
      option = '';
      option_2 = '';
      is_commLine = false;
      command_time_count = 0;
      is_YESorNO = false;
      select_command = null;
      count_YESorNO = 0;
      is_commLin_option = false;
      is_commLin_option_2 = false;
      sendToMychat('10分間操作がなかったのでコマンドラインを終了しました。')
      return // ここで処理を止める
    }
    // メインルームを確認してメッセージ内容を確認
    fetch(url, options)
      .then(res => res.json())
      .then(json => {
        console.log(json)
        if (!Array.isArray(json)) {
          // 配列ではないときは、ここで処理を止める
          return;
        }
        let is_trigger_coupon = false;
        json.forEach(element => {
          if (element.body == 'hello isma' || element.body == 'Hello Isma' || element.body == 'helloisma') {
            // コマンドラインを起動する
            is_trigger_coupon = true;
          }
          if (is_trigger_coupon) {
            is_commLine = true; //コマンドラインを有効にする
            sendToMychat(fastMess);
          }

          if (is_commLine) {//ここでコマンドの一致を確認する
            command_time_count++; //コマンドラインの起動時間を保存
            if (element.body == 'end') {
              // ここでコマンドラインを終了する]
              // 全ての変数を初期化
              option = '';
              option_2 = '';
              is_commLine = false;
              command_time_count = 0;
              is_YESorNO = false;
              select_command = null;
              count_YESorNO = 0;
              is_commLin_option = false;
              is_commLin_option_2 = false;
              sendToMychat('コマンドライン終了');
              return false; //ループ処理をとめる
            }
            let is_hit = false;
            commandList.forEach((val, ind) => {
              if (element.body == ind) { //取得したメッセージがコマンド一覧のインデックスと一致した場合
                is_hit = true;
                is_commLine = false; //コマンドラインを無効にします
                is_YESorNO = true; //Y　or nを確認する条件分岐を有効にする
                sendToMychat(`${val[0]}を起動しますか？\n「y」 「n」で送信してください`);
                select_command = ind; //選択したコマンド番号を格納
              }
            })
            if (is_hit) {
              // 何もしない
            } else if (counter_InSideMainAutomata % 5 == 0) {
              sendToMychat('コマンドに一致しませんでした。　もう一度入力してください。\n終了するには「end」と入力してください。');
            }
          }

          if (is_YESorNO) {

            if (element.body == 'y' || is_commLin_option || is_commLin_option_2 > 0) {

              if (commandList[select_command][2][0] == 1 && !is_commLin_option) { //オプションの指定あり
                is_commLin_option = true;
                //この場合は、もう一度入力を受け付ける
                sendToMychat(`${commandList[select_command][2][1]}\nオプションを指定しない場合は「no」と送信してください`);
                return false; //ここで処理を止める
              } else if (commandList[select_command][2][0] == 2 && is_commLin_option_2 == false) { //オプションの指定が二つある
                is_commLin_option_2 = 1;
                sendToMychat(`${commandList[select_command][2][1]}\nオプションを指定しない場合は「no」と送信してください`);
                return false; //ここで処理を止める
              }

              if (is_commLin_option) {
                if (element.body == `${commandList[select_command][2][1]}\nオプションを指定しない場合は「no」と送信してください`) {
                  // 自分が送信した内容が入るので、条件式では自身の内容を指定
                  return false; // 入力がない場合はここで処理を止める
                } else {
                  if (element.body != 'no') {
                    option = element.body; //オプションパラメータを指定
                  } else {
                    option = '';
                  }
                  // noの場合は、オプションなしで処理を続ける
                  is_commLin_option = false;
                }
              }
              if (is_commLin_option_2 == 1) {
                if (element.body == `${commandList[select_command][2][1]}\nオプションを指定しない場合は「no」と送信してください`) {
                  // 自分が送信した内容が入るので、条件式では自身の内容を指定
                  return false; // 入力がない場合はここで処理を止める
                } else {
                  if (element.body != 'no') {
                    sendToMychat(`オプションに「${element.body}」を指定しました。\n続けて二つ目のオプションを指定してください。\n\n${commandList[select_command][2][2]}\nオプションを指定しない場合は「no」と送信してください`)
                    option = element.body; //オプションパラメータを指定
                  } else {
                    option = '';
                    sendToMychat(`オプションを指定しませんでした。\n二つ目のオプションを指定してください。\n\n${commandList[select_command][2][2]}\nオプションを指定しない場合は「no」と送信してください`)
                  }
                  // noの場合は、オプションなしで処理を続ける
                  is_commLin_option_2 = 2;
                  return false; //ここで処理を止める
                }
              } else if (is_commLin_option_2 == 2) {
                const regOption1 = new RegExp(`オプションに「${option}」を指定しました`); // 正規表現オブジェクト
                const regOption2 = new RegExp('二つ目のオプションを指定してください。'); // 正規表現オブジェクト
                if (regOption1.test(element.body) || regOption2.test(element.body)) {
                  // 自分が送信した内容が入るので、条件式では自身の内容を指定
                  return false; // 入力がない場合はここで処理を止める
                } else {
                  if (element.body != 'no') {
                    sendToMychat(`二つ目のオプションに「${element.body}」を指定しました。`)
                    option_2 = element.body; //オプションパラメータを指定
                  }
                  // noの場合は、オプションなしで処理を続ける
                  is_commLin_option_2 = false;
                }
              }
              is_YESorNO = false; //初期化
              sendToMychat(`${commandList[select_command][0]} を実行\nコマンドライン終了`);
              pythonAPI(`http://127.0.0.1:${commandList[select_command][3]}/${commandList[select_command][1]}`, option, option_2).then(data => {
                console.log('正常にリクエスト');
                console.log(data);
              }).catch(error => {
                console.log(error);
                sendToMychat('pythonAPIサーバへリクエスト時にエラーが発生しました。');
              })
              // 全ての変数を初期化
              option = '';
              option_2 = '';
              is_commLine = false;
              command_time_count = 0;
              is_YESorNO = false;
              select_command = null;
              count_YESorNO = 0;

            } else if (element.body == 'n') {
              // 全ての変数を初期化
              option = '';
              option_2 = '';
              is_commLine = false;
              command_time_count = 0;
              is_YESorNO = false;
              select_command = null;
              count_YESorNO = 0;
              sendToMychat('コマンドラインを終了しました。')
            } else {
              if (count_YESorNO > 300) { // 10分経過すると自動的に、yornの
                // 全ての変数を初期化
                option = '';
                option_2 = '';
                is_commLine = false;
                command_time_count = 0;
                is_YESorNO = false;
                select_command = null;
                count_YESorNO = 0;
                is_commLin_option = false;
                is_commLin_option_2 = false;
                sendToMychat('10分間操作がなかったのでコマンドラインを終了しました。')
              } else if (counter_InSideMainAutomata % 5 == 0) {
                sendToMychat('無効なコマンドです。終了するには「end」と入力してください。')
              }
              count_YESorNO++;
            }
          }

        });

      })
      .catch(err => {
        // console.error('error:' + err)
      });
  }


  //メインのチャットワークのトークを確認しトリガーを実装
  setInterval(chatWorkTrigger, 2000); // 2秒間隔
}









//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
// 商品分析通知用　チャットワークをトリガーにするプログラム
if (true) {

  let count_minut_is_trigger_coupon = 0; // 自動起動を１０分待機させてキャンセルを行うかを確認する
  let count_minut_is_trigger_access = 0;
  let count_minut_is_trigger_au_item = 0;
  let is_start_coupon = false;
  let is_start_access = false;
  let is_start_au_item = false;

  function chatWorkTrigger_item() {
    //----------------------カウントを制御---------------------------
    count_minut_is_trigger_coupon++;
    count_minut_is_trigger_access++;
    count_minut_is_trigger_au_item++;
    //-------------------------------------------------------------

    const token = '4ca182854b8da03e4bb36d3031933b68';
    const room_id = '251884445'; // 本番のグループ
    // const room_id ='303738469'; // テストのグループ
    const url = `https://api.chatwork.com/v2/rooms/${room_id}/messages?force=0`;
    const options = { method: 'GET', headers: { accept: 'application/json', 'x-chatworktoken': token } };


    //メッセージの送信する関数
    function sendToMychat(message) {
      const options = {
        url: "https://api.chatwork.com/v2/rooms/" + room_id + "/messages",
        headers: {
          "X-ChatWorkToken": token
        },
        form: {
          body: message
        }
      }
      function callbackFuc(error, res, body) {
        res.statusCode == 200 ? console.log(body) : console.log('error: ' + error + '\nresponseCode: ' + res.statusCode);
      }
      request.post(options, callbackFuc);
    }

    // 商品分析ルームを確認してメッセージ内容を確認
    (() => {
      return new Promise((resolve, reject) => {
        const res = fetch(url, options)
          .then(res => res.json())
          .then(json => {
            console.log(json)
            let is_trigger_coupon = false;
            let is_trigger_access = false;
            let is_trigger_au_item = false;
            if (!Array.isArray(json)) {
              resolve(); //配列ではないときは処理しない
            }

            json.forEach(element => {
              if (/★クーポン金額CSVの作成が完了しました/.test(element.body)) {
                // コマンドラインを起動する
                count_minut_is_trigger_coupon = 0;
                is_trigger_coupon = true;
              } else if (/「RMSアクセスデータ」の貼付に失敗しました/.test(element.body)) {
                // アクセス数貼り付け失敗をトリガー
                count_minut_is_trigger_access = 0;
                is_trigger_access = true;
              } else if (/「RMSアクセスデータ」の貼付が完了しました/.test(element.body)) {

              } else if (/Wowma商品別データベースのデータ取得が完了しました/.test(element.body)) {
                count_minut_is_trigger_au_item = 0;
                is_trigger_au_item = true;
              }

              //------------------------自動起動キャンセルの設定------------------------------------
              if (element.body == 'キャンセルapp1') {
                is_start_coupon = false; //初期化
                count_minut_is_trigger_coupon = 0; //カウントをリセット
                sendToMychat('クーポン貼り付けの自動起動はキャンセルされました')
              } else if (element.body == 'キャンセルapp2') {
                is_start_access = false; //初期化
                count_minut_is_trigger_access = 0; //カウントをリセット
                sendToMychat('楽天アクセス数貼り付け再開はキャンセルされました')
              } else if (element.body == 'キャンセルapp3') {
                is_start_au_item = false; //初期化
                count_minut_is_trigger_au_item = 0; //カウントをリセット
                sendToMychat('aupay商品データ貼り付け自動起動はキャンセルされました')
              }

              //-----------------------------------triggerで起動　キャンセル確認------------------------------------------------
              if (is_trigger_coupon) {
                sendToMychat('楽天クーポン取得を確認しました。10分後にクーポン情報を貼り付けプログラムを自動起動します。\n貼り付けをキャンセルする場合は「キャンセルapp1」とメッセージを送信してください。');
                // ここから１０分後に貼り付けプログラムを起動するが、キャンセルがあれば起動しない
                is_start_coupon = true;
              }

              if (is_trigger_access) {
                mainSettingObj = JSON.parse(fs.readFileSync('./setting/nodeServer/mainSetting.json', 'utf8')); //設定ファイルを読み込む
                sendToMychat(`アクセス数貼り付けの途中停止を確認しました。\n${mainSettingObj['アクセス数貼付済_商品番号']['num']} 番目まで処理が終わっていますので、その次の商品から貼り付けを再開します。\n貼り付けをキャンセルする場合は「キャンセルapp2」とメッセージを送信してください。`);
                // ここから１０分後に貼り付けプログラムを起動するが、キャンセルがあれば起動しない
                is_start_access = true;
              }

              if (is_trigger_au_item) {
                sendToMychat('aupay商品別データ取得を確認しました。10分後に貼り付けプログラムを自動起動します。\n貼り付けをキャンセルする場合は「キャンセルapp3」とメッセージを送信してください。');
                is_start_au_item = true;
              }


              //---------------------------------------------------------------------------------------------------

            });
            return json;
          })
          .catch(err => {
            // console.error('error:' + err)
            return 'err';
          });

        if (res == 'err') {
          // エラーの時
          reject();
        } else {
          resolve(res);
        }

      })
    })()

    // メッセージデータ取得処理が終わってから処理される
    if (is_start_coupon) {
      if (count_minut_is_trigger_coupon % 5 == 0) {
        sendToMychat(`楽天クーポン貼り付け自動起動まであと ${10 - count_minut_is_trigger_coupon}分`)
      }

      if (count_minut_is_trigger_coupon >= 10) {
        is_start_coupon = false; //初期化
        count_minut_is_trigger_coupon = 0; //カウントをリセット
        sendToMychat('クーポン情報貼り付けを自動起動しました。')
        //---------------------------------------------------------
        const res = pythonAPI('http://127.0.0.1:8000/jfdurnhuuebvbdtd5', '', 'test').then(data => {
          console.log(data);
          return 'success';
        }).catch(error => {
          console.log(error);
          pythonAPI('http://127.0.0.1:8000/jfdurnhuuebvbdtd5', '', 'test').then(data => {
            console.log(data);
            return 'success';
          }).catch(error => {
            console.log(error);
            return 'err'
          })
        })
        //---------------------------------------------------------

      }
    }

    if (is_start_access) {
      if (count_minut_is_trigger_access % 5 == 0) {
        sendToMychat(`楽天アクセス数貼り付け、途中から再開まであと ${10 - count_minut_is_trigger_access}分`)
      }

      if (count_minut_is_trigger_access >= 10) {
        is_start_access = false; //初期化
        count_minut_is_trigger_access = 0; //カウントをリセット
        sendToMychat(`楽天アクセス数貼り付けを ${mainSettingObj['アクセス数貼付済_商品番号']['num']} から再開しました。`)
        //-----------------------------------------------------------------------------

        mainSettingObj = JSON.parse(fs.readFileSync('./setting/nodeServer/mainSetting.json', 'utf8')); //設定ファイルを読み込む
        pythonAPI(`http://127.0.0.1:7000/djkuyheio9092784hfy6`, Number(mainSettingObj['アクセス数貼付済_商品番号']['num']), '').then(data => {
          const res_data_2 = JSON.parse(data);
          if (res_data_2['score'] == 'success') {
            // chatWork('アクセス数貼り付けが完了しました。' ,'251884445');
            // Jsonに保存したデータを初期化
            mainSettingObj = JSON.parse(fs.readFileSync('./setting/nodeServer/mainSetting.json', 'utf8')); //設定ファイルを読み込む
            mainSettingObj['アクセス数貼付済_商品番号']['num'] = -1; // 初期化
            fs.writeFileSync('./setting/nodeServer/mainSetting.json', JSON.stringify(mainSettingObj, null, '\t'));

          } else if (Array.isArray(res_data_2['score'])) {
            mainSettingObj = JSON.parse(fs.readFileSync('./setting/nodeServer/mainSetting.json', 'utf8')); //設定ファイルを読み込む
            mainSettingObj['アクセス数貼付済_商品番号']['num'] = Number(res_data_2['score'][0]); //途中の商品番号を、設定ファイルのオブジェクトへ格納
            fs.writeFileSync('./setting/nodeServer/mainSetting.json', JSON.stringify(mainSettingObj, null, '\t'));
            chatWork('各種商品シートへの貼り付け途中で処理が止まりました');

          } else {
            chatWork('アクセス数貼り付けのpythonコード内でエラーが発生しました。', '251884445');
          }
        }).catch(error => {
          console.log(error);
          chatWork('アクセス数貼り付けで何かしらのエラーが発生しました。', '251884445');
        })
        //-----------------------------------------------------------------------------
      }

    }


    if (is_start_au_item) {
      if (count_minut_is_trigger_au_item % 5 == 0) {
        sendToMychat(`aupay商品データ貼り付け、自動起動まであと ${10 - count_minut_is_trigger_au_item}分`)
      }

      if (count_minut_is_trigger_au_item >= 10) {
        is_start_au_item = false; //初期化
        count_minut_is_trigger_au_item = 0; //カウントをリセット
        sendToMychat('aupay商品データ貼り付けを自動起動しました。')
        //---------------------------------------------------------
        pythonAPI('http://127.0.0.1:8000/synhjudcue783fys', '', 'test').then(data => {
          console.log(data);

        }).catch(error => {
          console.log(error);
        })
        //---------------------------------------------------------
      }
    }



  }

  //メインのチャットワークのトークを確認しトリガーを実装
  setInterval(chatWorkTrigger_item, 60000); // 1分間隔 本番
  // setInterval(chatWorkTrigger_item,2000); // 2秒間隔  テスト
}
