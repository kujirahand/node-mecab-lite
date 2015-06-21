// test for mecab

var Mecab = require('../lib/mecab-lite.js');
var mecab = new Mecab();

var text = "すもももももももものうち";

mecab.wakatigaki(text, function (err, items) {
  console.log(items);
});

