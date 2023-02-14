var request = require("request");
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const { resolve } = require("path");
const { rejects } = require("assert");
const fs = require('fs');
const mariadb = require('mariadb');

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

// let todayObj = new Date(); //現在の日付
// const res = new Date('2022/12/21');

// res.setDate(res.getDate() + 1); //取得した日付
// console.log(res.getFullYear())
// // console.log(resDate.getFullYear());
// // 繰り返し処理で日数差を求める　差がなくなるまで繰り返し
// let loopCount = 0;
// const resDateLoop = new Date(`${res.getFullYear()}/${res.getMonth()+1}/${res.getDate()}`);
// while (lowerThanDateOnly(resDateLoop, todayObj)) {
//   resDateLoop.setDate(resDateLoop.getDate() + 1)
//   loopCount ++; //カウント
// }
// console.log(loopCount)
// console.log(res.getDate())
// console.log(resDateLoop.getDate())



const promise = new Promise(resolve => {
  resolve('data');
})

promise.then(d => {
  console.log(d)
})

const text = Promise.resolve('data2');
const text2 = Promise.resolve('data3');

text.then(d => {
  console.log(d)
})

text2.then(d => {
  console.log(d)
})


