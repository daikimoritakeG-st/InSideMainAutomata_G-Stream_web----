
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
      url: 'http://127.0.0.1:8000/dcuyer74kwe23',
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(pythonApi),
    };
    return new Promise((resolve) => {
      request(options_goo, function (error, response, body) {
        if (!error) {
          resolve(body); //ここの処理が終わらないと次の処理にいかない
        } else {
          console.log("Error!!");
          resolve("APIエラー");
        }
      });
    });
  }