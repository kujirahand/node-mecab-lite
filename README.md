node-mecab-lite
==========

## Requirements

- MeCab - http://taku910.github.io/mecab/

##Install

```
npm install macab-lite
```

##Usage

```
var Mecab = require('mecab-lite');
var mecab = new Mecab();

var text = "すもももももももものうち";

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
```

## Option

```
var Mecab = require('mecab-lite');
var mecab = new Mecab();
// set options
mecab.MECAB = '/usr/local/bin/mecab'; // path to MeCab command
mecab.ENCODING = 'SHIFT_JIS';         // or 'UTF-8'
mecab.BUFFER_SIZE = 1024 * 1024 * 8; // 8MB
```




