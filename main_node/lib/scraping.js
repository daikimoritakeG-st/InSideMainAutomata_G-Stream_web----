'use strict';

const playwright = require('playwright');

const vgmUrl = 'https://glogin.rms.rakuten.co.jp/?sp_id=1';

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  await page.goto(vgmUrl);
  await page.getByPlaceholder('R-Login IDを入力').fill('tetsunavi'); //IDを入力
  await page.screenshot({ path: "../screenshot/example.png" });
  await page.getByPlaceholder('パスワードを入力').fill('f3RgXA6F'); //パスワード
  await page.getByRole('button', { name: '次へ' }).click();
  await page.screenshot({ path: "../screenshot/example.png" });
  await page.getByPlaceholder('ユーザIDを入力').fill('matsuoka@g-stream.jp');
  await page.getByPlaceholder('パスワードを入力').fill('Shun0730');
  await page.getByRole('button', { name: 'ログイン' }).click();
  await page.screenshot({ path: "../screenshot/example.png" });
  await page.getByRole('button', { name: '次へ' }).click();
  await page.screenshot({ path: "../screenshot/example.png" });
  await page.getByRole('button', { name: '上記を遵守していることを確認の上、 RMSを利用します' }).click();
  await page.goto('https://ad.rms.rakuten.co.jp/rpp/reports');
  await page.getByRole('cell', { name: 'すべての広告 キャンペーン 商品別 キーワード別' }).getByText('商品別').click();

  await page.screenshot({ path: "../screenshot/example.png" });


//   const links = await page.$$eval('a', elements => elements.filter(element => {
//     const parensRegex = /^((?!\().)*$/;
//     return element.href.includes('.mid') && parensRegex.test(element.textContent);
//   }).map(element => element.href));

//   links.forEach(link => console.log(link));

  await browser.close();
})();