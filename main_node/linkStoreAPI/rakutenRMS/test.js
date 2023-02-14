const fetch = require('node-fetch');
var request = require("request");


// const url = 'https://api.rms.rakuten.co.jp/es/2.0/categories/shop-category-set-lists';
const url = 'https://api.rms.rakuten.co.jp/es/1.0/categoryapi/shop/categories/get';

// シークレッドキーの作成
const serviceSecretLicenseKey = 'ESA ' + Buffer.from('SP233043_05HjB18g8Tmiv3RH:SL233043_Tu5EX1lFYeECJrhe').toString('base64');

console.log(serviceSecretLicenseKey);

// const options = {
//     method: 'GET',
//     headers: {
//        'Authorization': serviceSecretLicenseKey,
//        'Content-Type': 'application/json; charset=utf-8'
//     //    'Content-Type': 'application/xml; charset=utf-8'
//     },
//     // credentials: 'include'
// }
// fetch(url, options)
//   .then(res => {
//     console.log(res);
//     if (!res.ok) {
//       // 200 系以外のレスポンスはエラーとして処理
//       throw new Error(`${res.status} ${res.statusText}`);
//     }
//     return res.text();
//   })
//   // これがレスポンス本文のテキスト
//   .then(text => console.log(text))
//   // エラーはここでまとめて処理
//   .catch(err => console.error(err));



    var options_2 = {
      url: url,
      headers: { 
        // "Content-Type": "application/json",
        "Content-Type": "application/xml",
        "Authorization": serviceSecretLicenseKey,
        },
      method: "GET",
    };
    request(options_2, function (error, response, body) {
        // console.log(response)
        // console.log(response.statusCode)
        if (!error) {
            if (response.statusCode == 200) {
                console.log(response.headers)
                console.log(body); //ここの処理が終わらないと次の処理にいかない
            } else {
            console.log(error)
            }
        } else {
            console.log("Error!!");
            console.log("APIエラー");
        }
    })





// const manageNumber = 'name-noniron'; //商品管理番号
// const variantId = 'name-noniron'; //SKU管理番号　商品番号
// const url = `https://api.rms.rakuten.co.jp/es/2.0/inventories/manage-numbers/${manageNumber}/variants/${variantId}`;

// // シークレッドキーの作成
// const serviceSecretLicenseKey = Buffer.from('SP233043_05HjB18g8Tmiv3RH:SL233043_Tu5EX1lFYeECJrhe').toString('base64');

// console.log(serviceSecretLicenseKey);

// const options = {
//     method: 'GET',
//     headers: {
//        'Authorization': `ESA ${serviceSecretLicenseKey}`,
//     //    'Content-Type': 'application/json; charset=utf-8'
//        'Content-Type': 'application/xml; charset=utf-8'
//     },
//     credentials: 'include'

// }
// fetch(url, options)
//   .then(res => {
//     console.log(res);
//     if (!res.ok) {
//       // 200 系以外のレスポンスはエラーとして処理
//       throw new Error(`${res.status} ${res.statusText}`);
//     }
//     return res.text();
//   })
//   // これがレスポンス本文のテキスト
//   .then(text => console.log(text))
//   // エラーはここでまとめて処理
//   .catch(err => console.error(err));