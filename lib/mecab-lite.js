// Node.js Module for MeCab
module.exports = function () {
  // modules
  var exec = require('child_process').exec;
  var execSync = require('child_process').execSync; // v0.11-
  var iconv = require('iconv-lite');
  var fs = require('fs');
  var platform = require('os').platform();
  
  var self = this;
  
  // Temp file for mecab command
  var tm = (new Date()).getTime(), rnd = Math.random();
  this.TMP_DIR = process.env['HOME'] + '/tmp';
  this.TMP_FILE_IN  = this.TMP_DIR + '/__mecab_tmp-in__' + tm + '_' + rnd;
  this.TMP_FILE_OUT = this.TMP_DIR + '/__mecab_tmp-out_' + tm + '_' + rnd; 
  
  // Set mecab command path
  this.MECAB = 'mecab';
  this.ENCODING = (platform.substr(0,3) == 'win')
                ? 'SHIFT_JIS' : 'UTF-8';
  
  // setup
  this.setup = function () {
    if (!fs.existsSync(this.TMP_DIR)) {
      fs.mkdirSync(this.TMP_DIR);
    }
    this.ENCODING = this.ENCODING.toUpperCase();
  };
  this.cleanup = function () {
    if (fs.existsSync(self.TMP_FILE_IN)) fs.unlink(self.TMP_FILE_IN);
    if (fs.existsSync(self.TMP_FILE_OUT)) fs.unlink(self.TMP_FILE_OUT);
  };
  this.saveText = function (text) {
    text += "\n"; // important to mecab
    if (this.ENCODING != 'UTF-8') {
      var buf = iconv.encode(text, this.ENCODING);
      fs.writeFileSync(this.TMP_FILE_IN, buf, 'binary');
    } else {
      fs.writeFileSync(this.TMP_FILE_IN, text, 'UTF-8');
    }
  };
  this.loadText = function () {
    var result;
    if (self.ENCODING != 'UTF-8') {
      var buf = fs.readFileSync(self.TMP_FILE_OUT, 'binary');
      iconv.skipDecodeWarning = true;
      result = iconv.decode(buf, encoding);
    } else {
      result = fs.readFileSync(self.TMP_FILE_OUT, 'UTF-8');
    }
    return result;
  };
  
  // 形態素解析を実行する関数
  this.parse = function (text, callback) {
    this.parse_(text, callback, false);
  };
  this.parseSync = function (text) {
    return this.parse_(text, null, true);
  };
  this.parse_ = function (text, callback, isSync) {
    this.setup();
    this.saveText(text);
    
    // コマンドを組み立てる
    var cmd = [
      this.MECAB,
      '"' + this.TMP_FILE_IN + '"',
      '--output="' + this.TMP_FILE_OUT + '"'
    ].join(" ");
    // コマンドを実行
    var opt = {};
    if (!isSync) {
      exec(cmd, opt,
        function (err, stdout, stderr) {
          var inp = self.loadText();
          self.cleanup();
          if (err) return callback(err);
          var res = self.parseMecabResult(inp);
          callback(err, res);
      });
    } else {
      var r = execSync(cmd, opt);
      var inp = this.loadText();
      this.cleanup();
      var res = this.parseMecabResult(inp);
      return res;
    }
  };
  // Mecabから来た結果をパースする
  this.parseMecabResult = function (inp) {
    inp = inp.replace(/\r/g, "");
    inp = inp.replace(/\s+$/, "");
    var lines = inp.split("\n");
    var res = lines.map(function(line) {
      return line.replace('\t', ',').split(',');
    });
    return res;
  };
  // わかちがきする
  this.wakatigaki = function (text, callback) {
    this.parse(text, function (err, items) {
      if (err) { callback(err, []); }
      var res = [];
      for (var i in items) {
        var w = items[i];
        if (w[0] == 'EOS' && w[1] === undefined) continue;
        res.push(w[0]);
      }
      items = undefined;
      callback(err, res);
    });
  };
  this.wakatigakiSync = function (text) {
    var items = this.parseSync(text);
    var res = [];
    for (var i in items) {
      var w = items[i];
      if (w[0] == 'EOS' && w[1] === undefined) continue;
      res.push(w[0]);
    }
    return res;
  };
};




