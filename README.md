mecab-lite
==========
MeCab module for Node.js.

Tested by Mac OS X(Yosemite)/Cent OS6.6/Windows7.

## Requirements

- MeCab - http://taku910.github.io/mecab/

## Install

```
npm install macab-lite
```

## Usage

Please install Mecab command to your system.
When you install MeCab to Windows, you must choise SHIFT-JIS dictionary.


Sync method:

```
var Mecab = require('../lib/mecab-lite.js');
var mecab = new Mecab();

// parse
var text = "すもももももももものうち";
var items = mecab.parseSync(text);
console.log(items);

// wakatigaki
var items2 = mecab.wakatigakiSync(text);
console.log(items2);
```

ASync method:

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

mecab.wakatigaki(text, function (err, items) {
  console.log(items);
});
```


## Option

```
var Mecab = require('mecab-lite');
var mecab = new Mecab();
// set options
mecab.MECAB = '/usr/local/bin/mecab'; // path to MeCab command
mecab.ENCODING = 'SHIFT_JIS';         // or 'UTF-8'
mecab.TMP_DIR = process.env['HOME'] + '/tmp'; // temporary dir
```




