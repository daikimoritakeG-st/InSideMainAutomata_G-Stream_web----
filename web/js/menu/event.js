//-----------------------------------------------------------
//----htmlを読み込んだ後に実行します。----------------
//-----------------------------------------------------------

//-----------------グローバル変数初期化------------------------
/**
 * 親コード - 商品管理コード - SKU
 * @type {Promise}
 */
var globalItemMaster = '';

/**
 * SKUごとの在庫数
 */
var globalCountSkus = {}


//---------------------------------------------クラス-----------------------------------------------------

class ItemData {
    constructor() {
        /**
         * 現在登録済みのデータを取得
         * 非同期
         */
        this.data = new Promise((resolve, reject) => {
            fetch('/html/htmlCompo/zaikoSearch.html').then(res => {
                return res.json()
            }).then(res => {
                // mainContentsEle.innerHTML = res['html'];
                console.log(res['item'])
                // globalUplodeDate = res['update'];
                resolve(res['item']);
            }).catch(err => {
                reject(err);
            })
        })

    }

    /**
     * プロパティーを取得
     */
    get items() {
        this.data.then(data => {
            return data
        })
    }

    /**
     * プロパティのデータを部分消去
     * SKUを指定
     * @param {string} sku 消去するSKU
     */
    deleteSku(sku) {
        this.data.then(data => {
            /**
             * プロパティを書き換える必要がある
             */
            delete data[sku]; //指定のキーを消去
            this.data = Promise.resolve(data); //プロミスにする
        })
    }

    /**
     * ロケーションを指定して、在庫データを0に初期化
     * @param {*} location 
     */
    resetLocation(location) {
        this.data.then(data => {
            Object.keys(data).forEach(sku => {
                if (location in data[sku]) { //エラー対処：ロケーションがない場合がある
                    data[sku][location] = 0; //在庫データを消去
                }
            })
            this.data = Promise.resolve(data)
        })
    }

    /**
     * サーバーにデータを保存する
     * プロパティーを保存
     */
    serverSaveItem() {
        this.data.then(data => {
            fetch(`/json/zaikolode`, { // 送信先URL
                method: 'POST', // 通信メソッド
                headers: {
                    'Content-Type': 'application/json' // JSON形式のデータのヘッダー
                },
                body: JSON.stringify(data) // JSON形式のデータ
            })
                .then(res => res.json())
                .then(res => {
                    if (res['data'] == 'success') {
                        console.log('jsonを送信しました', res);
                        window.alert('在庫情報をサーバーに保存しました');
                    } else {
                        window.alert('データがありません。先にCSVを読み込んでください。')
                    }
                })
        })
    }

    /**
     * ロケーションを指定して、その部分のデータを上書きする
     * データは全データを指定してよい
     * @param {string} location 更新するLocation
     * @param {{[x: string]: {[x: string]: [number...]}}} datas データ
     */
    setLocationItems(location, datas) {
        this.data.then(dataProperty => {
            /**
             * 引数datasのキーの数だけ繰り返す
             */
            Object.keys(datas).forEach(sku => {
                /**
                 * 指定のLocationが、元データにあるかを確認
                 */
                if (location in datas[sku]) { //ある場合のみ処理
                    /**
                     * skuの数だけ繰り返す
                     */
                    if (sku in dataProperty) {
                        // キーがすでに存在する　→　Locationが存在するかを確認
                        if (location in dataProperty[sku]) {
                            // locationがすでに存在する　→　何もしない
                        } else {
                            // locationがない　→　数字で初期化
                            dataProperty[sku][location] = 0;
                        }
                    } else {
                        // キーが存在しない　→　Objectで初期化 →　Locationもないのでこちらも初期化
                        dataProperty[sku] = {}; //Objectで初期化
                        dataProperty[sku][location] = 0; //数値で初期化
                    }
                    // ここでは、必ず対象のキーが存在する & 0で初期化済み
                    /**
                     * 例外処理が済んでいるので、数値を上書きすれば良い
                     */
                    dataProperty[sku][location] = datas[sku][location];
                }
            })

            this.data = Promise.resolve(dataProperty); // プロパティに保存
        })
    }



}


var itemData = new ItemData();

//------------------------------関数---------------------------------
/**
 * CSVの文字コードを変換するための関数
 * @returns 
 */
function isFileUpload() {
    var isCompatible = false;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        isCompatible = true;
    }
    return isCompatible;
}

/**
 * CSVの文字コードを変換するための関数
 * @param {*} str 
 * @returns 
 */
function str2Array(str) {
    var array = [], i, il = str.length;
    for (i = 0; i < il; i++) array.push(str.charCodeAt(i));
    return array;
}



//-----------------------------------------------------------
/**
 * 選択されたファイルを取得します。
 */
const input = document.getElementById("file-input_saleCount");
input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    /**
     * JavaScriptで、FileReaderオブジェクトを使用して、ファイルを読み込みます。
     */
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        const csvData = reader.result;
        /**
         * CSVデータを使用するために、JavaScriptのライブラリ（例えば PapaParse）を使用して、CSVデータを配列に変換します。
         */
        const data = Papa.parse(csvData, { header: false }).data; //二次元配列

        // console.log(data)
        /**
         * 変換されたデータを使用して、必要な処理を実行します。
         * ※注意 : CSVファイルのインポートには、ブラウザのセキュリティ制限があるため、通常はWebサーバー上で処理を行うことを推奨します。
         * 
         * しかし、今回はブラウザから、直接スプレッドシートへAPIリクエストを行います。
         */

        /**
         * 特攻店長のデータは、[[SKU, 売上個数], ...]
         * なので、この先の処理をしやすいように、SKUをキーとしたObjectにする
         * @type {{}}
         */
        var getCsvDatas = {}
        let is_error = false; //forEachは途中で中止できないので、エラーは終わってから確認する
        data.forEach((value, ind) => {
            if (ind == 0) {
                return; //最初はラベルのため、　今回の処理をスキップ
            }
            /**
             * 同じSKUがある場合は、データが上書きされるので、想定外のデータということになる
             */
            if (value[0] in getCsvDatas) {
                is_error = true; //エラーの可能性
            }
            getCsvDatas[value[0]] = value[1]; //SKUは重複することがないので、ここはそのまま代入している

        })
        if (is_error) { //エラーの可能性を画面表示
            const is_yes = window.confirm('入力したCSVは、SKUが重複しており正常に動作しないおそれがあります。\nこのまま処理を続けますか？');
            if (is_yes == false) {
                return false; //キャンセルを押すと処理を中止
            }
        }

        // console.log('ここにCSVのデータが入っている => ', getCsvDatas);

        if (globalItemMaster == '') {
            window.alert('商品マスタの読み込みがまだです。商品マスタのデータを読み込んでください。');
            return false; // ここで処理を止める
        }
        globalItemMaster.then(itemMaster => {
            // このスコープでは商品マスタがあります。
            /**
             * ここでは、親コードは必要なく、商品管理コード毎に処理が必要になるので、
             * まずは、商品管理コードの一覧を作成
             */
            var itemAdminCode = {};
            Object.keys(itemMaster).forEach(key => {
                Object.keys(itemMaster[key]).forEach(key2 => {
                    //二次元目（商品管理コード）を出力
                    if (key2 in itemAdminCode) {
                        //キーがある　→　何もしない
                    } else {
                        // キーがない　→　新しいキー　配列で初期化
                        itemAdminCode[key2] = []; // 初期化
                    }
                    itemMaster[key][key2].forEach(value => {
                        itemAdminCode[key2].push(value)
                    })
                })
            })

            // console.log(itemAdminCode);


            var resDate = {};
            /**
             * ここから、マスタと特攻店長のデータを合わせて計算する
             * まずは、マスタの商品コード単位でループ処理
             */
            Object.keys(itemAdminCode).forEach(keyItemCode => {
                // 今回ループの商品のSKUを取得
                /**
                 * @type {Array}
                 */
                const skus = itemAdminCode[keyItemCode]; // SKUの一次元配列で取得
                /**
                 * SKUに対して個数のデータが入った変数
                 * @type {{*: Array{}}}
                 */
                let res_sku_coun_s = {};
                let sku_coun_sum = 0;
                skus.forEach(sku => {
                    /**
                     * SKUの数だけループ処理で、特攻店長から取得したCSVの販売個数を取得
                     * データがない場合は、0とする
                     */
                    let saleCount;
                    if (sku in getCsvDatas) {
                        // キーがある
                        saleCount = Number(getCsvDatas[sku]); //数字にする
                    } else {
                        // キーがない
                        saleCount = 0;
                    }
                    res_sku_coun_s[sku] = [saleCount]; //この後、比率を格納するので配列で入れておく
                    sku_coun_sum += saleCount; //比率の計算に使うため、合計も計算
                })

                /**
                 * それぞれのSKUの売上個数の比率を計算
                 */
                Object.keys(res_sku_coun_s).forEach(res_sku_key => {
                    if (sku_coun_sum == 0) {
                        res_sku_coun_s[res_sku_key].push(0); //合計が0の場合は、0にする
                    } else {
                        res_sku_coun_s[res_sku_key].push(res_sku_coun_s[res_sku_key][0] / sku_coun_sum); //配列に格納する
                    }
                })

                // console.log('計算が正しいか確認するため、合計を表示 => ', sku_coun_sum);
                // console.log(res_sku_coun_s);

                resDate[keyItemCode] = res_sku_coun_s; //出力用の変数へ格納


            })
            console.log(resDate);

            /**
             * このデータをスプレッドシートのマスタ用に送る
             * スプレッドシートのdoPostにリクエストを送る方法
             * クロスオリジンの回避と、コンテンツタイプがカギ
             * スプレッドシートのアドレス
             * https://docs.google.com/spreadsheets/d/1diQPf3NB49ADYVDD3TH0QKqkTgNV_pBR0FCZK4uoAQA
             */
            fetch('https://script.google.com/macros/s/AKfycbyT6nhjmUaDKOo0uvI4YIL_WVuboq6uRWI1hMjJVM-xN3DxCwZtr7dcNX8rr4zmYx3m/exec', {
                "method": 'POST',
                "mode": "no-cors",
                "Content-Type": "application/x-www-form-urlencoded",
                // headers: {
                //     "mode": "no-cors",
                //     "Content-Type": "application/x-www-form-urlencoded",
                // },
                "body": JSON.stringify(resDate) //送信するデータ
            }).then(() => {
                window.alert('正常\nスプレッドシートへ売上比率を書き込みました \nhttps://docs.google.com/spreadsheets/d/1diQPf3NB49ADYVDD3TH0QKqkTgNV_pBR0FCZK4uoAQA')
            })

        })

    };

});










//-----------------------------------------------------------
/**
 * Amazon CSV
 * 選択されたファイルを取得します。
 */
const input_amazon = document.getElementById("file-input_zaiko_amazon");
input_amazon.addEventListener("change", (evt) => {
    if (!isFileUpload()) {
        console.log('お使いのブラウザはファイルAPIがサポートされていません');
    } else {
        var data = null;
        var file = evt.target.files[0];
        reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function (event) {
            var result = event.target.result;
            var sjisArray = str2Array(result);
            var uniArray = Encoding.convert(sjisArray, 'UNICODE', 'SJIS');
            var result = Encoding.codeToString(uniArray);
            // console.log(result); //csvデータ(string)
            data = Papa.parse(result, { header: false }).data; //二次元配列
            // console.log(data);

            const column_amazon = ['出品者SKU', 'FNSKU', 'ASIN', '商品名', 'コンディション', '価格', '出品者出荷在庫',
                '出品者出荷在庫(出荷可)', 'Amazon出荷在庫', 'Amazon出荷在庫(配送センター内)', 'Amazon出荷在庫(出荷可)',
                'Amazon出荷在庫(販売不可)', 'Amazon出荷在庫(引当済み)', 'Amazon出荷在庫(合計)', '容積', 'Amazon納品数(準備中)',
                'Amazon納品数(発送済み)', 'Amazon納品数(受領中)', 'afn-researching-qty', 'afn-reserved-future-supply', 'afn-future-supply-buyable'];

            /**
             * エラーを判断する変数
             */
            let is_CsvErr_amazon = false;
            data.forEach((value, ind) => {
                if (ind == 0) {
                    // 最初の行のみスキップ　＆　良品以外はスキップ
                    /**
                     * ここで、CSVが間違っていないかカラム確認
                     */
                    for (let i = 0; i < value.length; i++) {
                        if (value[i] != column_amazon[i]) {
                            // 一致しない場合はエラー
                            is_CsvErr_amazon = true; //エラーフラグ
                        }
                    }
                    return;
                }

                // Objectの中に、Objectで複数のキーを格納するので、→　キーの存在チェックで条件分岐
                if (value[0] in globalCountSkus) {
                    // キーが存在する場合 →　何もしない
                } else {
                    // キーが存在しない　→　二次元目の変数の初期化
                    globalCountSkus[value[0]] = {}; //Objectを代入
                }
                // SKUが複数ある場合の対応
                if ('amazon' in globalCountSkus[value[0]]) {
                    // キーが存在する場合　→　何もしない
                } else {
                    // キーが存在しない場合　→　0で初期化
                    globalCountSkus[value[0]]['amazon'] = 0; // 初期化
                }
                globalCountSkus[value[0]]['amazon'] += Number(value[10]); //在庫数を代入
            })
            if (is_CsvErr_amazon) {
                window.alert('amazonのCSVが間違っているようです。カラムが違います。')
                Object.keys(globalCountSkus).forEach(key => {
                    const values = Object.keys(globalCountSkus[key]);
                    const valuesLen = values.length; //キーの数を確認
                    if (valuesLen == 1 && values[0] == 'amazon') {
                        // SKUのキーごと消去
                        delete globalCountSkus[key]
                    } else {
                        values.forEach(key2 => {
                            if (key2 == 'amazon') {
                                globalCountSkus[key][key2] = undefined; //amazonの入力をリセットする
                            }
                        })
                    }
                })
            }
            // console.log(globalCountSkus)
        };
        reader.onerror = function () {
            console.log('ファイルが読み込めませんでした。 ' + file.fileName);
        };
    }

}, false);







//-----------------------------------------------------------
/**
 * KOUGA CSV
 * 選択されたファイルを取得します。
 */
const input_kouga = document.getElementById("file-input_zaiko_kouga");
input_kouga.addEventListener("change", (evt) => {
    if (!isFileUpload()) {
        console.log('お使いのブラウザはファイルAPIがサポートされていません');
    } else {
        var data = null;
        var file = evt.target.files[0];
        reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function (event) {
            var result = event.target.result;
            var sjisArray = str2Array(result);
            var uniArray = Encoding.convert(sjisArray, 'UNICODE', 'SJIS');
            var result = Encoding.codeToString(uniArray);
            // console.log(result); //csvデータ(string)
            data = Papa.parse(result, { header: false }).data; //二次元配列
            // console.log(data);

            const column_kouga = ['倉庫', '商品コード', 'JANコード', '商品名称', 'サイズ', 'ロケーション', '在庫状態', '在庫数', '出荷後在庫数'];
            /**
             * エラーを判断する変数
             */
            let is_CsvErr_kouga = false;

            data.forEach((value, ind) => {
                if (ind == 0) {
                    /**
                     * ここで、CSVが間違っていないかカラム確認
                     */
                    for (let i = 0; i < value.length; i++) {
                        if (value[i] != column_kouga[i]) {
                            // 一致しない場合はエラー
                            is_CsvErr_kouga = true; //エラーフラグ
                        }
                    }
                    return;
                }
                if (value[6] == '不良品' || value[6] == '箱不良') {
                    // 最初の行のみスキップ　＆　良品以外はスキップ
                    // console.log(value[6])
                    return;
                }

                // Objectの中に、Objectで複数のキーを格納するので、→　キーの存在チェックで条件分岐
                if (value[1] in globalCountSkus) {
                    // キーが存在する場合 →　何もしない
                } else {
                    // キーが存在しない　→　二次元目の変数の初期化
                    globalCountSkus[value[1]] = {}; //Objectを代入
                }
                // SKUが複数ある場合の対応
                if ('kouga' in globalCountSkus[value[1]]) {
                    // キーが存在する場合　→　何もしない
                } else {
                    // キーが存在しない場合　→　0で初期化
                    globalCountSkus[value[1]]['kouga'] = 0; // 初期化
                }
                globalCountSkus[value[1]]['kouga'] += Number(value[8]); //在庫数を代入
            })
            if (is_CsvErr_kouga) {
                window.alert('kougaのCSVが間違っているようです。カラムが違います。')
                Object.keys(globalCountSkus).forEach(key => {
                    const values = Object.keys(globalCountSkus[key]);
                    const valuesLen = values.length; //キーの数を確認
                    if (valuesLen == 1 && values[0] == 'kouga') {
                        // SKUのキーごと消去
                        delete globalCountSkus[key]
                    } else {
                        values.forEach(key2 => {
                            if (key2 == 'kouga') {
                                globalCountSkus[key][key2] = undefined; //kougaの入力をリセットする
                            }
                        })
                    }
                })
            }
            // console.log(globalCountSkus)
        };
        reader.onerror = function () {
            console.log('ファイルが読み込めませんでした。 ' + file.fileName);
        };
    }

}, false);









//-----------------------------------------------------------
/**
 * 楽天 CSV
 * 選択されたファイルを取得します。
 */
const input_rakuten = document.getElementById("file-input_zaiko_rakuten");
input_rakuten.addEventListener("change", (evt) => {
    if (!isFileUpload()) {
        console.log('お使いのブラウザはファイルAPIがサポートされていません');
    } else {
        var data = null;
        var file = evt.target.files[0];
        reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function (event) {
            var result = event.target.result;
            var sjisArray = str2Array(result);
            var uniArray = Encoding.convert(sjisArray, 'UNICODE', 'SJIS');
            var result = Encoding.codeToString(uniArray);
            // console.log(result); //csvデータ(string)
            data = Papa.parse(result, { header: false }).data; //二次元配列
            // console.log(data);

            const column_rakuten = ['商品ID', '商品名', '在庫しきい値', 'カテゴリー名', '販売可能数', '引当済 (全倉庫)', '安全在庫数', '未引当', '安全在庫設定値', '実在庫数', '倉庫ID', '倉庫', '実在庫 (倉庫毎)', '引当済 (倉庫毎)', 'SKUコード', 'セット区分', 'セット構成品商品ID', 'セット構成品名', '構成品数'];
            /**
             * エラーを判断する変数
             */
            let is_CsvErr_rakuten = false;

            data.forEach((value, ind) => {
                if (ind == 0) {
                    /**
                     * ここで、CSVが間違っていないかカラム確認
                     */
                    for (let i = 0; i < value.length; i++) {
                        if (value[i] != column_rakuten[i]) {
                            // 一致しない場合はエラー
                            is_CsvErr_rakuten = true; //エラーフラグ
                        }
                    }
                    return;
                }

                // Objectの中に、Objectで複数のキーを格納するので、→　キーの存在チェックで条件分岐
                if (value[14] in globalCountSkus) {
                    // キーが存在する場合 →　何もしない
                } else {
                    // キーが存在しない　→　二次元目の変数の初期化
                    globalCountSkus[value[14]] = {}; //Objectを代入
                }
                // SKUが複数ある場合の対応
                if ('rakuten' in globalCountSkus[value[14]]) {
                    // キーが存在する場合　→　何もしない
                } else {
                    // キーが存在しない場合　→　0で初期化
                    globalCountSkus[value[14]]['rakuten'] = 0; // 初期化
                }
                globalCountSkus[value[14]]['rakuten'] += Number(value[4]); //在庫数を代入
            })
            if (is_CsvErr_rakuten) {
                window.alert('rakutenのCSVが間違っているようです。カラムが違います。')
                Object.keys(globalCountSkus).forEach(key => {
                    const values = Object.keys(globalCountSkus[key]);
                    const valuesLen = values.length; //キーの数を確認
                    if (valuesLen == 1 && values[0] == 'rakuten') {
                        // SKUのキーごと消去
                        delete globalCountSkus[key]
                    } else {
                        values.forEach(key2 => {
                            if (key2 == 'rakuten') {
                                globalCountSkus[key][key2] = undefined; //rakutenの入力をリセットする
                            }
                        })
                    }
                })
            }
            // console.log(globalCountSkus)
        };
        reader.onerror = function () {
            console.log('ファイルが読み込めませんでした。 ' + file.fileName);
        };
    }

}, false);







//-----------------------------------------------------------
/**
 * ヤマト CSV
 * 選択されたファイルを取得します。
 */
const input_yamato = document.getElementById("file-input_zaiko_yamato");
input_yamato.addEventListener("change", (evt) => {
    if (!isFileUpload()) {
        console.log('お使いのブラウザはファイルAPIがサポートされていません');
    } else {
        var data = null;
        var file = evt.target.files[0];
        reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function (event) {
            var result = event.target.result;
            var sjisArray = str2Array(result);
            var uniArray = Encoding.convert(sjisArray, 'UNICODE', 'SJIS');
            var result = Encoding.codeToString(uniArray);
            // console.log(result); //csvデータ(string)
            data = Papa.parse(result, { header: false }).data; //二次元配列
            // console.log(data);

            const column_yamato = ['商品コード', '商品名称', '商品カテゴリ', 'ブランドコード', 'ブランド名', 'サイズ名', 'カラー名', '仕入れ先コード', '仕入れ先名', '測定サイズ', '状態名', '有効期限', '実在庫数', '引当数', '可能在庫数'];
            /**
             * エラーを判断する変数
             */
            let is_CsvErr_yamato = false;

            data.forEach((value, ind) => {
                if (ind == 0) {
                    /**
                     * ここで、CSVが間違っていないかカラム確認
                     */
                    for (let i = 0; i < value.length; i++) {
                        if (value[i] != column_yamato[i]) {
                            // 一致しない場合はエラー
                            is_CsvErr_yamato = true; //エラーフラグ
                        }
                    }
                    return;
                }
                if (value[10] != '良品') {
                    // 最初の行のみスキップ　＆　良品以外はスキップ
                    return;
                }

                // Objectの中に、Objectで複数のキーを格納するので、→　キーの存在チェックで条件分岐
                if (value[0] in globalCountSkus) {
                    // キーが存在する場合 →　何もしない
                } else {
                    // キーが存在しない　→　二次元目の変数の初期化
                    globalCountSkus[value[0]] = {}; //Objectを代入
                }
                // SKUが複数ある場合の対応
                if ('yamato' in globalCountSkus[value[0]]) {
                    // キーが存在する場合　→　何もしない
                } else {
                    // キーが存在しない場合　→　0で初期化
                    globalCountSkus[value[0]]['yamato'] = 0; // 初期化
                }
                globalCountSkus[value[0]]['yamato'] += Number(value[14]); //在庫数を代入
            })
            if (is_CsvErr_yamato) {
                window.alert('yamatoのCSVが間違っているようです。カラムが違います。')
                Object.keys(globalCountSkus).forEach(key => {
                    const values = Object.keys(globalCountSkus[key]);
                    const valuesLen = values.length; //キーの数を確認
                    if (valuesLen == 1 && values[0] == 'yamato') {
                        // SKUのキーごと消去
                        delete globalCountSkus[key]
                    } else {
                        values.forEach(key2 => {
                            if (key2 == 'yamato') {
                                globalCountSkus[key][key2] = undefined; //yamatoの入力をリセットする
                            }
                        })
                    }
                })
            }

            // console.log(globalCountSkus)

        };
        reader.onerror = function () {
            console.log('ファイルが読み込めませんでした。 ' + file.fileName);
        };
    }

}, false);





















/**
 * 在庫読取実行のボタン
 */
const button_push_zaiko = document.getElementById("button_push_zaiko");
button_push_zaiko.addEventListener('click', () => {
    console.log(globalCountSkus)
    fetch(`/json/zaikolode`, { // 送信先URL
        method: 'POST', // 通信メソッド
        headers: {
            'Content-Type': 'application/json' // JSON形式のデータのヘッダー
        },
        body: JSON.stringify(globalCountSkus) // JSON形式のデータ
    })
        .then(res => res.json())
        .then(data => {
            if (data['data'] == 'success') {
                console.log('jsonを送信しました', data);
                window.alert('在庫情報をサーバーに保存しました');
            } else {
                window.alert('データがありません。先にCSVを読み込んでください。')
            }
        })

})




/**
 * スプレッドシートの親子マスタ読み込み
 */
const loadItemMaster = document.getElementById("loadItemMaster");
loadItemMaster.addEventListener('click', () => {
    console.log('テストclick')
    // 最終的な戻り値をグローバル変数に格納
    globalItemMaster = fetch('https://script.google.com/macros/s/AKfycbxsOCXdfP1aApfj5Sz-h_jmFDeYhMwZntAJweYvnl6IZJdNc96uXaeD1Xhvv3Em_nte/exec')
        .then((response) => response.json())
        .then((data) => {
            //取得したデータを読み込み完了した後で使う必要があるので、プロミスを利用して、
            // console.log(data)
            return new Promise((resolve, reject) => {
                delete data['親コード']
                resolve(data)
            })
        })
    globalItemMaster.then(data => {
        console.log(data)

    })
})








