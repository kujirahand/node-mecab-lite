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
  var t =
    process.env['TEMP']   ||      // for windows
    process.env['HOME']   ||      // for linux / mac os x
    './';
  if (t.substr(t.length-1,1) == '/') t = t.substr(0, t.length-1);
  this.TMP_DIR = t + '/tmp';
  
  // Set mecab command path
  this.MECAB = 'mecab';
  this.ENCODING = (platform.substr(0,3) == 'win')
                ? 'SHIFT_JIS' : 'UTF-8';
  
  // setup
  var setup = function () {
    // setup dir
    if (!fs.existsSync(self.TMP_DIR)) {
      fs.mkdirSync(self.TMP_DIR);
    }
    self.ENCODING = self.ENCODING.toUpperCase();
  };
  var cleanup = function (file_in, file_out) {
    if (fs.existsSync(file_in )) fs.unlinkSync(file_in);
    if (fs.existsSync(file_out)) fs.unlinkSync(file_out);
  };
  var saveText = function (path, text) {
    text += "\n"; // important to mecab
    if (self.ENCODING != 'UTF-8') {
      var buf = iconv.encode(text, self.ENCODING);
      fs.writeFileSync(path, buf, 'binary');
    } else {
      fs.writeFileSync(path, text, 'UTF-8');
    }
  };
  var loadText = function (path) {
    var result;
    if (!fs.existsSync(path)) return null;
    if (self.ENCODING != 'UTF-8') {
      var buf = fs.readFileSync(path, 'binary');
      iconv.skipDecodeWarning = true;
      result = iconv.decode(buf, self.ENCODING);
    } else {
      result = fs.readFileSync(path, 'UTF-8');
    }
    return result;
  };
  // Mecabから来た結果をパースする
  var parseMecabResult = function (inp) {
    inp = inp.replace(/\r/g, "");
    inp = inp.replace(/\s+$/, "");
    var lines = inp.split("\n");
    var res = lines.map(function(line) {
      return line.replace('\t', ',').split(',');
    });
    return res;
  };
  
  // 形態素解析を実行する関数
  this.parse = function (text, callback) {
    this.parse_(text, callback, false);
  };
  this.parseSync = function (text) {
    return this.parse_(text, null, true);
  };
  this.parse_ = function (text, callback, isSync) {
    setup();

    // setup temp file
    var tm = (new Date()).getTime(), rnd = Math.random();
    var file_in  = self.TMP_DIR + '/__mecab_tmp-in__' + tm + '_' + rnd;
    var file_out = self.TMP_DIR + '/__mecab_tmp-out_' + tm + '_' + rnd; 
    
    //
    saveText(file_in, text);
    
    // コマンドを組み立てる
    var cmd = [
      this.MECAB,
      '"' + file_in + '"',
      '--output="' + file_out + '"'
    ].join(" ");
    
    // コマンドを実行
    var opt = {};
    if (!isSync) {
      exec(cmd, opt,
        function (err, stdout, stderr) {
          var inp = loadText(file_out);
          cleanup(file_in, file_out);
          if (err) return callback(err);
          var res = parseMecabResult(inp);
          callback(err, res);
      });
    } else {
      var res = [], r = null;
      try {
        var r = execSync(cmd, opt);
        var inp = loadText(file_out);
        res = parseMecabResult(inp);
        cleanup(file_in, file_out);
      } catch(e) {
        cleanup(file_in, file_out);
        throw e;
      }
      return res;
    }
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




