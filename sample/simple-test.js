// test for mecab

var Mecab = require('../lib/mecab-lite.js');
var mecab = new Mecab();

var text = "すもももももももものうち";

// MeCabを実行する
mecab.parse(text, function (err, items) {
  console.log(items);
});

/* 出力結果
[ [ 'すもも', '名詞', '一般', '*', '*', '*', '*', 'すもも', 'スモモ', 'スモモ' ],
  [ 'も', '助詞', '係助詞', '*', '*', '*', '*', 'も', 'モ', 'モ' ],
  [ 'もも', '名詞', '一般', '*', '*', '*', '*', 'もも', 'モモ', 'モモ' ],
  [ 'も', '助詞', '係助詞', '*', '*', '*', '*', 'も', 'モ', 'モ' ],
  [ 'もも', '名詞', '一般', '*', '*', '*', '*', 'もも', 'モモ', 'モモ' ],
  [ 'の', '助詞', '連体化', '*', '*', '*', '*', 'の', 'ノ', 'ノ' ],
  [ 'うち', '名詞', '非自立', '副詞可能', '*', '*', '*', 'うち', 'ウチ', 'ウチ' ],
  [ 'EOS' ] ]
*/

// わかちがきの例
mecab.wakatigaki(text, function (err, items) {
  console.log(items);
});

