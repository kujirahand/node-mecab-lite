// Node.js Module for MeCab
module.exports = function () {
  // modules
  var exec = require('child_process').exec;
  var iconv = require('iconv-lite');
  var fs = require('fs');
  var platform = require('os').platform();

  // モジュール変数の定義
  // 一時ファイル
  var tm = (new Date()).getTime();
  this.TMP_FILE = __dirname + '/__mecab_tmpfile_' + tm;
  // MeCabのコマンドライン
  this.MECAB = 'mecab';
  this.ENCODING = (platform.substr(0,3) == 'win')
                ? 'SHIFT_JIS' : 'UTF-8';

  // 形態素解析を実行する関数
  this.parse = function (text, callback) {
    var encoding = this.ENCODING;
    text += "\n";
    // 変換元テキストを一時ファイルに保存
    if (encoding != 'UTF-8') {
      var buf = iconv.encode(text, encoding);
      fs.writeFileSync(this.TMP_FILE, buf, "binary");
    } else {
      fs.writeFileSync(this.TMP_FILE, text, "UTF-8");
    }
    // コマンドを組み立てる
    var cmd = [
      this.MECAB,
      '"' + this.TMP_FILE + '"'
    ].join(" ");
    // コマンドを実行
    var opt = {
      encoding: 'UTF-8',
      maxBuffer: 1024 * 1024 * 8 // 8MB
    };
    if (encoding != 'UTF-8') opt.encoding = 'binary';
    var tmp_file = this.TMP_FILE;
    exec(cmd, opt,
      function (err, stdout, stderr) {
        fs.unlink(tmp_file); // 一時ファイルを削除
        if (err) return callback(err);
        var inp;
        // 結果出力ファイルを元に戻す
        if (encoding != 'UTF-8') {
          iconv.skipDecodeWarning = true;
          inp = iconv.decode(stdout, encoding);
        } else {
          inp = stdout;
        }
        // 結果をパースする
        inp = inp.replace(/\r/g, "");
        inp = inp.replace(/\s+$/, "");
        var lines = inp.split("\n");
        var res = lines.map(function(line) {
          return line.replace('\t', ',').split(',');
        });
        callback(err, res);
    });
  };
};




