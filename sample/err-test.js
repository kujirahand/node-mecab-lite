// Error Test for mecab-lite

var Mecab = require('../lib/mecab-lite.js');
var mecab = new Mecab();

var text = "すもももももももものうち";

// MeCabのパスとして、あり得ないパスを指定
// これにより必ずエラーを発生させる
mecab.MECAB = "/bin/hoge/hoge/mecab";

console.log("エラーを発生させるテスト");

// sync
var items = mecab.parseSync(text);
console.log(items);

// async
mecab.parse(text, function (err, items) {
  if (err) {
    console.log("[ERROR]");
    console.log(err);
  }
  console.log(items);
});

mecab.wakatigaki(text, function (err, items) {
  if (err) {
    console.log("[ERROR]");
    console.log(err);
  }
  console.log(items);
});


