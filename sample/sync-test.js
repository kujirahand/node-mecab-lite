// mecab test sync
var Mecab = require('../lib/mecab-lite.js');
var mecab = new Mecab();

// parse
var text = "すもももももももものうち";
var items = mecab.parseSync(text);
console.log(items);

// wakatigaki
var items2 = mecab.wakatigakiSync(text);
console.log(items2);

