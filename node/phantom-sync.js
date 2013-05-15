var phantom = require('phantom');
var cheerio = require('cheerio');

phantom.create(function(ph) {
	ph.createPage(function(page) {

// ページが読み込まれたら page.onCallback を呼ぶ
page.set('onInitialized', function() {
	page.evaluate(function() {
		document.addEventListener('DOMContentLoaded', function() {
			window.callPhantom('DOMContentLoaded');
		}, false);
	});
});

// ページが読み込まれたら登録した関数の配列を順次実行してくれるクラス
var funcs = function(funcs) {
	this.funcs = funcs;
	this.init();
};
funcs.prototype = {
	// ページが読み込まれたら next() を呼ぶ
	init: function() {
		var self = this;
		page.set('onCallback', function(data) {
			if (data === 'DOMContentLoaded') self.next();
		});
	},
	// 登録した関数の配列から１個取り出して実行
	next: function() {
		var func = this.funcs.shift();
		if (func !== undefined) {
			func();
		} else {
			page.set('onCallback', undefined);
		}
	}
};

// 順次実行する関数
new funcs([
	function() {
		console.log('ログイン処理');
		page.open('https://www.hatena.ne.jp/login'); // 次ページヘ
	},
	function() {
		console.log('ログイン画面');
		page.evaluate(function() {
			document.getElementById('login-name').value = 'nyula';
			document.querySelector('.password').value   = 'kannibal0a';
			document.querySelector('form').submit(); // 次ページヘ
		});
	},
	function() {
		console.log('ログイン後画面');
		setTimeout(function() {
			page.open('http://www.hatena.ne.jp/my');
		}, 2000);
	},
	function() {
		console.log('iframe 内');

		// iframe 内の HTML を取得
		page.evaluate(function() {
			return document.getElementsByTagName('html')[0].innerHTML;
		}, function(html) {
			// cheerio でパースしてユーザ名とポイントを取得
			var $ = cheerio.load(html);
			var point = $('.hatena-module').eq(0).find('.count').text();
			console.log('ポイントは後', point, 'point だよ！');

			// お忘れなきよう (-人-)
			ph.exit();
		});
	}
]).next();

	});
});

wget http://phantomjs.googlecode.com/files/phantomjs-1.8.2-macosx.tar.bz2
tar jxvf phantomjs-1.8.2-macosx.tar.bz2
mv phantomjs-1.8.2-macosx phantomjs