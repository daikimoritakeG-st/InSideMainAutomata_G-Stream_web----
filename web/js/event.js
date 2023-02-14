//-------------------グローバル変数----------------------------
var globalItemMaster = {};
var globalUplodeDate = '';
//----------------------------------------------------------


//-------------------------------------クラス------------------------------------------------

class GridZaiko {
  /**
   * 
   * @param {{}} globalItemMaster 
   * @param {{}} zaikoNames name: 表示名
   */
  constructor(targetEle, globalItemMaster, zaikoNames) {
    this.targetEle = targetEle;
    this.globalItemMaster = globalItemMaster;
    this.zaikoNames = zaikoNames; //配列で格納
    this.zaikoNameIndexs = [];
    console.log('動いた')
  }

  /**
   * ロケーションの数だけ画面を調節
   */
  initGrid() { //promiseを外す

    const locationkeys = Object.keys(this.zaikoNames); //locationの配列
    // tbody要素にtr要素（行）を最後に追加
    var trElem = this.targetEle.tBodies[0].insertRow(-1);
    trElem.classList.add("sticky_item_header");
    const cellNameElem = trElem.insertCell(-1);
    cellNameElem.classList.add("item_grid_2")
    cellNameElem.innerHTML = '<div>商品名</div> '
    trElem.insertCell(-1).innerHTML = '<div id="zaikoSku_CreateInitGrid">SKU</div> '
    // .appendChild(document.createTextNode('SKU'))
    for (let i = 0; i < locationkeys.length; i++) { //ロケーションの数だけ繰り返す
      // 列を作成　// td要素を追加
      this.zaikoNameIndexs.push(locationkeys[i]); //この変数で画面の列を把握する
      const cellElem = trElem.insertCell(-1);
      cellElem.appendChild(document.createTextNode(this.zaikoNames[locationkeys[i]])); //ロケーションの名前を追加
      if (i % 2 == 0) {
        cellElem.classList.add("item_grid_2"); //偶数の時だけクラスを追加
      }
    }
    const cellElem = trElem.insertCell(-1);
    cellElem.innerHTML = '<div id="zaikoSum_CreateInitGrid">合計</div>';
    cellElem.classList.add("item_grid_3")
    // .appendChild(document.createTextNode('合計'))
  }


  /**
   * 入力値で先頭一致検索
   * @param {string} inputText 検索文字列
   */
  itemSkuSearch(inputText) {
    /**
     * まず、前回の検索内容を消去するために、一つ目の行以外を消去
     */
    while (this.targetEle.tBodies[0].rows.length > 1) { //tableの行数が1になるまで消去
      this.targetEle.tBodies[0].deleteRow(-1); //最後の行を消去
    }

    let zaikoSearchSum = 0;
    Object.keys(this.globalItemMaster).forEach(keys_sku => {
      if (keys_sku.indexOf(inputText) === 0) { //先頭一致で検索
        var trElem = this.targetEle.tBodies[0].insertRow(-1);
        trElem.classList.add("item_grid_hover"); //カーソルで色が変わる
        const cellNameElem = trElem.insertCell(-1);
        cellNameElem.classList.add("item_grid_2");
        let itemName = this.globalItemMaster[keys_sku]['name']; //商品名
        if (itemName == undefined) {
          itemName = ''; //空白
        }
        cellNameElem.appendChild(document.createTextNode(itemName)); //商品名を追加
        trElem.insertCell(-1).appendChild(document.createTextNode(keys_sku));

        let sum = 0; //合計を格納

        this.zaikoNameIndexs.forEach((zaikoName, ind) => { //ロケーションの数だけ繰り返す
          // 列を作成　// td要素を追加
          const cellElem = trElem.insertCell(-1);

          if (ind % 2 == 0) {
            cellElem.classList.add("item_grid_2"); //偶数の時だけクラスを追加
          }
          if (this.globalItemMaster[keys_sku][zaikoName] != undefined) { //データがあるかを確認
            // 在庫データがあるとき
            cellElem.appendChild(document.createTextNode(this.globalItemMaster[keys_sku][zaikoName])); //在庫数を格納
            sum += Number(this.globalItemMaster[keys_sku][zaikoName]); //合計
          } else { //在庫データがないとき
            cellElem.appendChild(document.createTextNode('0'));
          }
        })

        const cellElem = trElem.insertCell(-1);
        cellElem.appendChild(document.createTextNode(sum)); // 合計を入力
        cellElem.classList.add("item_grid_3")

        zaikoSearchSum += sum; //全体の合計

      }
    })
    const zaikoSku_CreateInitGridEle = document.getElementById('zaikoSku_CreateInitGrid'); //SKU
    const zaikoSum_CreateInitGrid = document.getElementById('zaikoSum_CreateInitGrid'); //合計
    zaikoSum_CreateInitGrid.textContent = `合計(${zaikoSearchSum})`;
    zaikoSku_CreateInitGridEle.textContent = `SKU  ( × ${this.targetEle.tBodies[0].rows.length - 1})`; //SKUの個数を表示
  }

  /**
   * 入力値で全文検索
   * 正規表現でキーワードを含むかどうか
   * @param {string} inputText 検索文字列
   */
  itemNameSearch(inputText) {
    /**
     * まず、前回の検索内容を消去するために、一つ目の行以外を消去
     */
    while (this.targetEle.tBodies[0].rows.length > 1) { //tableの行数が1になるまで消去
      this.targetEle.tBodies[0].deleteRow(-1); //最後の行を消去
    }

    /**
     * 正規表現
     */
    const reg = new RegExp(inputText); //正規表現のリテラル作成

    let zaikoSearchSum = 0;
    Object.keys(this.globalItemMaster).forEach(keys_sku => {
      if (reg.test(this.globalItemMaster[keys_sku]['name'])) { //検索キーワードで全文検索
        var trElem = this.targetEle.tBodies[0].insertRow(-1);
        trElem.classList.add("item_grid_hover"); //カーソルで色が変わる
        const cellNameElem = trElem.insertCell(-1);
        cellNameElem.classList.add("item_grid_2");
        let itemName = this.globalItemMaster[keys_sku]['name']; //商品名
        if (itemName == undefined) {
          itemName = ''; //空白
        }
        cellNameElem.appendChild(document.createTextNode(itemName)); //商品名を追加
        trElem.insertCell(-1).appendChild(document.createTextNode(keys_sku));

        let sum = 0; //合計を格納

        this.zaikoNameIndexs.forEach((zaikoName, ind) => { //ロケーションの数だけ繰り返す
          // 列を作成　// td要素を追加
          const cellElem = trElem.insertCell(-1);

          if (ind % 2 == 0) {
            cellElem.classList.add("item_grid_2"); //偶数の時だけクラスを追加
          }
          if (this.globalItemMaster[keys_sku][zaikoName] != undefined) { //データがあるかを確認
            // 在庫データがあるとき
            cellElem.appendChild(document.createTextNode(this.globalItemMaster[keys_sku][zaikoName])); //在庫数を格納
            sum += Number(this.globalItemMaster[keys_sku][zaikoName]); //合計
          } else { //在庫データがないとき
            cellElem.appendChild(document.createTextNode('0'));
          }
        })

        const cellElem = trElem.insertCell(-1);
        cellElem.appendChild(document.createTextNode(sum)); // 合計を入力
        cellElem.classList.add("item_grid_3")

        zaikoSearchSum += sum; //全体の合計

      }
    })
    const zaikoSku_CreateInitGridEle = document.getElementById('zaikoSku_CreateInitGrid'); //SKU
    const zaikoSum_CreateInitGrid = document.getElementById('zaikoSum_CreateInitGrid'); //合計
    zaikoSum_CreateInitGrid.textContent = `合計(${zaikoSearchSum})`;
    zaikoSku_CreateInitGridEle.textContent = `SKU  ( × ${this.targetEle.tBodies[0].rows.length - 1})`; //SKUの個数を表示
  }
}

//-------------------------------------------------------------------------------------------




const onclick_test = () => {
  var req = new XMLHttpRequest();
  req.open('GET', 'http://localhost:8000/');
  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == 200) {
      console.log(req.responseText);
    }
  };
  req.send(null);
}
const onclick_day_access = () => {
  var req = new XMLHttpRequest();
  req.open('GET', 'http://localhost:8080/?id=dyehsu73sh');
  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == 200) {
      console.log(req.responseText);
    }
  };
  req.send(null);
}


const trigger_click_execution_python_s = document.getElementsByClassName('click_execution_python');
for (let i = 0; i < trigger_click_execution_python_s.length; i++) {
  trigger_click_execution_python_s[i].addEventListener('keydown', event => {

  })
  trigger_click_execution_python_s[i].addEventListener('click', event => {
    console.log('clickが押された')
    const targetID = trigger_click_execution_python_s[i].id; // 要素のidを取得
    window.confirm(value);
  });
}




/**
 * メイン画面のメニュー機能
 */
const mainContentsEle = document.getElementById('main-contents'); //メインコンテンツ
const zaikoSearchMenuEle = document.getElementById('zaikoSearchMenu'); //在庫確認のサイドバーメニュー
zaikoSearchMenuEle.addEventListener('click', () => {
  console.log('在庫確認', 'htmlの中身を入れ替え');

  /**
   * 中身を入れ替える
   * urlに「..」をいれると上手くいかない
   */
  fetch('/html/htmlCompo/zaikoSearch.html').then(res => {
    return res.json()
  }).then(res => {
    mainContentsEle.innerHTML = res['html'];
    globalItemMaster = res['item'];
    console.log(res['item'])
    globalUplodeDate = res['update'];
  })
    .then(() => {




      //-----------------------------以下は、在庫検索------------------------------------
      //   グリッドを表示するクラスを作成
      //   グローバル変数に格納したデータを取得
      //-------------------------------------------------------------------------------


      /**
       * データ更新日を表示
       */
      const globalUplodeDateEle = document.getElementById('globalUplodeDate');
      globalUplodeDateEle.innerHTML = `<p id="uplodeDate_window">&emsp;&emsp; ※発送可能な在庫数のみ表示します。 &emsp;&emsp;&emsp;データ更新日時： ${globalUplodeDate}</p>`; // データ更新日を表示

      const zaikoSearchTableEle = document.getElementById('zaikoSearchTable'); //グリッドを入力する場所


      /**
       * データCSV出力ボタンを作成
       * １、SKU - 在庫　を　CSVの文字列へ変換
       * @param {{}} setting 在庫のロケーションを設定
       * @return {string} CSVデータ
       */
      const createItemCsv = (setting) => {
        let csvData = 'SKU';
        let keys = []; //順番を間違えないため
        Object.keys(setting).forEach(key => {
          csvData += `,${setting[key]}`; //ロケーションを格納
          keys.push(key)
        })
        csvData += ',合計'
        csvData += '\n'; //改行コード

        Object.keys(globalItemMaster).forEach(key => { //SKUの数だけ繰り返し
          if (key == '') {
            return //今回の処理をスキップ
          }
          let sum = 0;
          csvData += `"${key}"`; //SKU名を追加
          for (let i = 0; i < keys.length; i++) {
            if (globalItemMaster[key][keys[i]] == undefined) {
              csvData += ',0'; //空文字
            } else {
              csvData += `,${globalItemMaster[key][keys[i]]}` //ロケーションごとに在庫数を追加
              sum += Number(globalItemMaster[key][keys[i]]); // 合計の計算
            }
          }
          csvData += `,${sum}`; //合計の追加
          csvData += '\n'
        })

        return csvData
      }

      const setting_location = {
        amazon: 'Amazon',
        kouga: 'KOUGA',
        rakuten: '楽天物流',
        yamato: 'ヤマト'
      }

      const csvData = createItemCsv(setting_location);
      var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);

      var blob = new Blob([bom, csvData], { type: "text/csv" }); //配列に上記の文字列を設定
      const export_csv_allEle = document.getElementById('export_csv_all');
      export_csv_allEle.href = URL.createObjectURL(blob);
      const getDataDay = new Date(globalUplodeDate); //データ取得日の日付Object
      export_csv_allEle.download = `all_Location_zaiko_${getDataDay.getFullYear()}-${getDataDay.getMonth() + 1}-${getDataDay.getDate()}.csv`;


      var grid = new GridZaiko(zaikoSearchTableEle, globalItemMaster, {
        amazon: 'Amazon',
        kouga: 'KOUGA',
        rakuten: '楽天物流',
        yamato: 'ヤマト'
      })

      grid.initGrid(); //画面表示を初期化


      const button_item_SearchEle = document.getElementById('button_item_Search'); // 検索ボタンのエレメント
      const input_item_searchEle = document.getElementById('input_item_search'); // 入力
      const zaikoSearchOptionEle = document.getElementById('zaikoSearchOption'); // 検索オプション
      button_item_SearchEle.addEventListener('click', () => {
        const input = input_item_searchEle.value;
        const searchOption = zaikoSearchOptionEle.value; //検索方法を取得
        if (searchOption == 'SKU') {
          grid.itemSkuSearch(input); //検索
        } else if (searchOption == '商品名') {
          // console.log('開発中： 商品名であいまい検索')
          grid.itemNameSearch(input); //商品名であいまい検索
        }
      })
      input_item_searchEle.addEventListener('keydown', (e) => {
        if (e.key == 'Enter') {
          button_item_SearchEle.click(); //クリックイベント発火
        }
      })

    })
  // window.location.href = `/html/htmlCompo/zaikoSearch.html`; // 通常の遷移

})








console.log('画面操作用のJS読み込み完了');
