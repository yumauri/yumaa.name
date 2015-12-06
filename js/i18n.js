/*
 * Multilingual strings base
 */
/* jshint strict: true, browser: true, jquery: true, smarttabs: true, undef: true, unused: true, bitwise: true, curly: true, quotmark: single, trailing: true */
;(function(window) {
	'use strict';

	// value for 'dig' string, too long for paste 3 times...
	var dig_value = [
		'{{ip}}{{txt}}',
		'{{#pri}}{{pri}} {{/pri}}{{#weight}}{{weight}} {{/weight}}{{target}}{{#port}} {{port}}{{/port}}',
		'{{#cpu}}{{cpu}} {{os}}{{/cpu}}',
		'{{#mname}}{{mname}} {{rname}} {{serial}} {{refresh}} {{retry}} {{expire}} {{minimum-ttl}}{{/mname}}',
		'{{#masklen}}{{masklen}} {{/masklen}}{{ipv6}}{{#chain}} {{chain}}{{/chain}}',
		'{{#order}}{{order}} {{pref}} {{flags}} {{services}} {{regex}} {{replacement}}{{/order}}'
	].join('');

	// strings base
	// string key -> language -> string
	var strings = {
		flag: {
			en: '<img class="flag" src="img/ru.png" width="16" height="9"/>',
			ru: '<img class="flag" src="img/gb.png" width="16" height="9"/>'
		},

		welcome: {
			en: [
				'Using username &quot;{{user.login}}&quot;.',
				'Authenticating with public key &quot;{{user.login}}@{{browser}}&quot;',
				'{{userAgent}}',
				'',
				'Welcome to the Yumaa home page!',
				'',
				'Type &quot;<span class="command">help</span>&quot; to see available commands.',
				'Чтобы сменить язык на {{&flag}}русский, введите &quot;<span class="command">язык русский</span>&quot;.',
				'',
				'{{#lastLogin.date}}Last login: {{lastLogin.date}}{{#lastIP}} from {{lastIP}}{{/lastIP}}{{/lastLogin.date}}{{^lastLogin.date}}Never logged in.{{/lastLogin.date}}'
			],
			ru: [
				'Пользователь &quot;{{user.login}}&quot;.',
				'Аутентификация публичным ключём &quot;{{user.login}}@{{browser}}&quot;',
				'{{userAgent}}',
				'',
				'Добро пожаловать на личную страничку Yumaa!',
				'',
				'Введите &quot;<span class="command">помощь</span>&quot; чтобы увидеть доступные команды.',
				'In order to change language to {{&flag}}english, type &quot;<span class="command">language en</span>&quot;',
				'',
				'{{#lastLogin.date}}Последний визит: {{lastLogin.date}}{{#lastIP}} с {{lastIP}}{{/lastIP}}{{/lastLogin.date}}{{^lastLogin.date}}Первый визит.{{/lastLogin.date}}'
			]
		},

		ie8: {
			en: [
				'<div class="boxed">Hey!',
				'Your Internet Explorer was released in {{years.year}}, it was {{years.diff}} years ago,',
				'don\'t you think it is time to upgrade it or change it to smth else?',
				'There are plenty of good modern browsers, for example,',
				'<a href="https://www.google.com/chrome" target="_blank">Chrome</a>, <a href="http://mozilla.org/firefox" target="_blank">Firefox</a>, <a href="http://www.opera.com/" target="_blank">Opera</a>, <a href="https://vivaldi.com" target="_blank">Vivaldi</a>, even <a href="http://microsoft.com/ie" target="_blank">latest IE</a> is not so bad.',
				'Even mobile browsers nowadays are better than yours.',
				'So, do smth with that, say goodbye to the past, let it go!',
				'And after that hope to see you here again ;)</div><br clear="both">'
			]
		},

		prompt: {
			en: '{{#E}}{{#user.isGuest}}\\E[1;32m{{/user.isGuest}}{{^user.isGuest}}\\E[1;33m{{/user.isGuest}}{{user.login}}\\E[1;32m@{{hostname}} \\E[1;34m{{^isMobile}}/home/yumaa {{/isMobile}}${{/E}}'
		},

		rootprompt: {
			en: '{{#E}}\\E[1;31m{{hostname}} \\E[1;34m{{^isMobile}}/home/yumaa {{/isMobile}}#{{/E}}'
		},

		README: {
			en: [
				'So, you are curious one :) I like it.',
				'And it seems that you know smth about linux console.',
				'Of course, this is not a shell emulator, and even not an imitator. I just tried to imitate outward appearance within reasonable limits, and not tried to write another "linux in browser". This is simply my home page, just for fun.',
				'By the way, if you want JavaScript emulator, check out this <a href="https://gist.github.com/ysangkok/5606032" target="_blank">links list</a>. And also this nice <a href="http://cb.vu/" target="_blank">unix-like interface</a>.',
				'Wow, and definitely look at <a href="https://cmd.fm/" target="_blank">cmd.fm</a>, it is really cool online command line radio!',
				'Hope you like my page and have fun playing with it, because I definitely had fun creating it ;)'
			],
			ru: [
				'Ну здравствуй, любопытный :) Ты мне нравишься.',
				'Похоже, ты немного знаком с линуксом. Не знаю, зачем я вообще это для тебя перевожу :)',
				'Конечно, это не эмулятор консоли и даже не имитатор оной. Я просто попытался повторить поведение, в разумных пределах, а не пытался написать ещё один "линукс в браузере". Это просто моя страничка, сделанная забавы ради.',
				'Но, кстати, если ты хочешь посмотреть эмуляторы на JavaScript, посмотри этот <a href="https://gist.github.com/ysangkok/5606032" target="_blank">список ссылок</a>. А ещё этот симпатичный <a href="http://cb.vu/" target="_blank">unix-подобный интерфейс</a>.',
				'А, и ещё обязательно зайдите на <a href="https://cmd.fm/" target="_blank">cmd.fm</a>, это очень крутое онлайн радио!',
				'Надеюсь, тебе нравится моя страничка и тебе весело. Потому что мне-то точно было весело, когда я её делал ;)'
			]
		},

		about: {
			en: [
				'{{greetings}}!<br>',
				'My name is Victor Didenko, also known as <i>yumaa</i>.<br>',
				'I\'m developer, I know Java, JavaScript, and I am used to Pascal, PHP, Perl, and C/C++ a little.',
				'Also I\'m quite familiar with HTML and CSS.',
				'',
				'I do love traveling and learn new places! I like watch anime, mountains hiking, bicycles rides, and I\'m fond of megalopolises!',
				'My favorite book genres are fantasy, fiction and science fiction.',
				'',
				'If you want to contact me, type &quot;<span class="command">contacts</span>&quot;.',
				'I\'m russian, but feel free to write to me in english as well.'
			],
			ru: [
				'{{greetings}}!<br>',
				'Я Виктор Диденко, также известный как <i>yumaa</i>.<br>',
				'Я программист, знаю Java, JavaScript, а также знаком с Pascal, PHP, Perl и немного с C/C++.',
				'Ещё я неплохо могу в HTML и CSS.',
				'',
				'Мне очень нравится путешествовать и открывать для себя новые места! Я люблю аниме, туризм в целом и горный туризм в частном, поездки на велосипедах, и просто обожаю мегаполисы!',
				'Любимые жанры книг фэнтези и фантастика, в основном научная.',
				'',
				'Если вы хотите связаться со мной, введите &quot;<span class="command">контакты</span>&quot;.'
			]
		},

		permanent_greetings: {
			en: ['Greetings', 'Greetings to you', 'Hi'],
			ru: ['Приветствую', 'Приветствую вас', 'Привет']
		},

		timebased_greetings: {
			en: ['Good morning', 'Good afternoon', 'Good evening', 'Good night'],
			ru: ['Доброе утро', 'Добрый день', 'Добрый вечер', 'Доброй ночи']
		},

		contacts: {
			en: [
				'<span class="socialicon twitter"><a href="https://twitter.com/yumaa" target="_blank" title="Twitter">&#xe602;</a></span>',
				// '<span class="socialicon juick"><a href="https://juick.com/yumaa/" target="_blank" title="Juick">ju</a></span>',
				'<span class="socialicon tumblr bit"><a href="http://luz.yumaa.name/" target="_blank" title="Tumblr">&#xe60c;</a></span>',
				'<span class="socialicon blogspot bit hidden"><a href="http://blog.yumaa.name/" target="_blank" title="Blog">&#xe62f;</a></span>',
				// '<span class="socialicon livejournal bit"><a href="http://yumaa.livejournal.com/" target="_blank" title="LiveJournal">&#xe603;</a></span>',
				'<span class="socialicon facebook bit"><a href="https://www.facebook.com/yumauri" target="_blank" title="Facebook">&#xe605;</a></span>',
				'<span class="socialicon vk hidden"><a href="https://vk.com/yumaa" target="_blank" title="ВКонтакте">&#xe606;</a></span>',
				'<span class="socialicon google bit hidden"><a href="https://www.google.com/+YumaaVerdin" target="_blank" title="Google+">&#xe607;</a></span>',
				'<span class="socialicon couchsurfing bit hidden"><a href="https://www.couchsurfing.org/people/yumaa/" target="_blank" title="CouchSurfing">&#xe619;</a></span>',
				'<span class="socialicon youtube hidden"><a href="https://www.youtube.com/user/yumaaverdin" target="_blank" title="YouTube">&#xe609;</a></span>',
				'<span class="socialicon lastfm bit hidden"><a href="http://www.lastfm.ru/user/yumauri" target="_blank" title="Last.fm">&#xe62a;</a></span>',
				'<span class="socialicon goodreads bit hidden"><a href="https://www.goodreads.com/user/show/10176740-yumaa" target="_blank" title="Goodreads">&#xe60a;</a></span>',
				'<span class="socialicon myanimelist hidden"><a href="http://myanimelist.net/profile/yumaa" target="_blank" title="MyAnimeList">&#xe616;</a></span>',
				'<span class="socialicon steam bit hidden"><a href="http://steamcommunity.com/id/yumaa/" target="_blank" title="Steam">&#xe62b;</a></span>',
				'<span class="socialicon github hidden"><a href="https://github.com/yumauri" target="_blank" title="GitHub">&#xe60f;</a></span>',
				// '<span class="socialicon stackoverflow bit hidden"><a href="http://stackoverflow.com/users/1114686/yumaa" target="_blank" title="StackOverflow">&#xe61f;</a></span>',
				'<span class="socialicon linkedin bit hidden"><a href="http://www.linkedin.com/in/yumauri" target="_blank" title="LinkedIn">&#xe611;</a></span>',
				// '<span class="socialicon jabber"><a href="jabber:yumaa@jabber.ru" title="Jabber">j</a></span>',
				'<span class="socialicon skype bit"><a href="skype:yumauri" title="Skype">&#xe612;</a></span>',
				'<span class="socialicon email bit"><a href="mailto:yumaa.verdin@ma.il" title="e-mail">&#xe614;</a></span>',
				'<span class="socialicon more"><a href="#" title="more...">&#xe601;</a></span>'
			].join('')
		},

		projects: {
			en: [
				'<dl>',
				'<dt>{{#E}}\\E[1;37m<a href="https://github.com/yumauri/XMttr" target="_blank">XMttr</a> &ndash; Universal framework for emitting messages/events{{/E}}</dt>',
					'<dd>',
						'Universal tool or framework for emitting different, but similar, messages or events, usually for testing purposes.',
					'</dd>',
				'<br>',
				'<dt>{{#E}}\\E[1;37m<a href="https://code.google.com/p/chromelogger4j/" target="_blank">chromelogger4j</a> &ndash; Server Side ChromeLogger4J debugger class{{/E}}</dt>',
					'<dd>',
						'Class for debugging and logging Java variables to the chrome console.<br>',
						'It is server side library for Chrome Logger extension, developed by <a href="http://craig.is/" target="_blank">Craig Campbell</a>.<br>',
						'You can find it (and installation instructions) here &rarr; <a href="http://www.chromelogger.com" target="_blank">http://www.chromelogger.com</a>.',
					'</dd>',
				'<br>',
				'<dt>{{#E}}\\E[1;37m<a href="https://code.google.com/p/jqpivot/" target="_blank">jqpivot</a> &ndash; jQuery PivotTable plugin{{/E}}</dt>',
					'<dd>',
						'Plugin for jQuery to summarize data like pivot table in MS Excel, or OO Calc, or OLAP tables.',
					'</dd>',
				'<br>',
				'<dt>{{#E}}\\E[1;37m<a href="https://github.com/yumauri/yulaunch" target="_blank">yulaunch</a> &ndash; URL launcher for Opera{{/E}}</dt>',
					'<dd>',
						'Tool, which allows you to start external program by clicking on the link with non standard protocol.<br>',
						'For example, start Putty or console SSH client after clicking on link <a href="ssh://127.0.0.1">ssh://127.0.0.1</a>, or start VNC viewer after clicking on link <a href="vnc://127.0.0.1">vnc://127.0.0.1</a>.',
					'</dd>',
				'<br>',
				'<dt>{{#E}}\\E[1;37m<a href="https://github.com/yumauri/yumaa.name" target="_blank">yumaa.name</a> &ndash; this site source{{/E}}</dt>',
					'<dd>',
						'Source code of this site, take a look if you like it :)',
					'</dd>',
				'</dl>'
			].join(''),
			ru: [
				'<dl>',
				'<dt>{{#E}}\\E[1;37m<a href="https://github.com/yumauri/XMttr" target="_blank">XMttr</a> &ndash; Универсальный фреймворк для генерирования сообщений/событий{{/E}}</dt>',
					'<dd>',
						'Универсальный инструмент или фреймворк для генерирования различных, но похожих между собой, сообщений или событий, обычно в целях тестирования.',
					'</dd>',
				'<br>',
				'<dt>{{#E}}\\E[1;37m<a href="https://code.google.com/p/chromelogger4j/" target="_blank">chromelogger4j</a> &ndash; Класс для отладки серверной части ChromeLogger4J{{/E}}</dt>',
					'<dd>',
						'Класс для логгирования Java переменных в консоль браузера Хром.<br>',
						'Это серверная часть расширения Chrome Logger, созданного <a href="http://craig.is/" target="_blank">Craig\'м Campbell\'м</a>.<br>',
						'Вы можете найти это расширение (и инструкцию по установке) здесь &rarr; <a href="http://www.chromelogger.com" target="_blank">http://www.chromelogger.com</a>.',
					'</dd>',
				'<br>',
				'<dt>{{#E}}\\E[1;37m<a href="https://code.google.com/p/jqpivot/" target="_blank">jqpivot</a> &ndash; плагин сводной таблицы для jQuery{{/E}}</dt>',
					'<dd>',
						'Плагин к jQuery для анализа и группировки данных, похожий на сводную таблицу в MS Excel, или OO Calc, или OLAP.',
					'</dd>',
				'<br>',
				'<dt>{{#E}}\\E[1;37m<a href="https://github.com/yumauri/yulaunch" target="_blank">yulaunch</a> &ndash; лончер для URL в браузере Опера{{/E}}</dt>',
					'<dd>',
						'Утилита, позволяющая запустить внешнюю программу при клике по ссылке с нестандартным протоколом.<br>',
						'Например, запустить Putty или консольный SSH клиент при клике по ссылке <a href="ssh://127.0.0.1">ssh://127.0.0.1</a>, или запустить VNC клиент при клике по ссылке <a href="vnc://127.0.0.1">vnc://127.0.0.1</a>.',
					'</dd>',
				'<br>',
				'<dt>{{#E}}\\E[1;37m<a href="https://github.com/yumauri/yumaa.name" target="_blank">yumaa.name</a> &ndash; этот сайт{{/E}}</dt>',
					'<dd>',
						'Исходный код этого сайта, посмотрите, если он вам нравится :)',
					'</dd>',
				'</dl>'
			].join('')
		},

		help: {
			en: [
				'You can use following commands to get information:',
				'<table class="help">',
				'<tr><td>&quot;<span class="command">about</span>&quot;</td><td>&ndash; about me</td></tr>',
				'<tr><td>&quot;<span class="command">projects</span>&quot;</td><td>&ndash; my projects</td></tr>',
				// '<tr><td>&quot;<span class="command">cv</span>&quot;</td><td>&ndash; resume</td></tr>',
				'<tr><td>&quot;<span class="command">contacts</span>&quot;</td><td>&ndash; ways to contact me</td></tr>',
				'<tr><td>&quot;<span class="command">language ru</span>&quot;</td><td>&ndash; сменить язык на {{&flag}}русский</td></tr>',
				'<tr><td>&quot;<span class="command">info</span>&quot;</td><td>&ndash; information about this page</td></tr>',
				'<tr><td>&quot;<span class="command">help</span>&quot;</td><td>&ndash; this help</td></tr>',
				'</table>',
				'{{^isMobile}}Autocomplete should work, so you can type part of command and hit &#8633;Tab button.<br>{{/isMobile}}',
				'{{^isMobile}}Or you{{/isMobile}}{{#isMobile}}You{{/isMobile}} can {{^isMobile}}click{{/isMobile}}{{#isMobile}}tap{{/isMobile}} on command name above.<br>',
				'Every command can be bookmarked with the # sign (look at the address bar).'
			].join(''),
			ru: [
				'Вы можете использовать следующие команды для получения информации:',
				'<table class="help">',
				'<tr><td>&quot;<span class="command">о</span>&quot;</td><td>&ndash; обо мне</td></tr>',
				'<tr><td>&quot;<span class="command">проекты</span>&quot;</td><td>&ndash; о моих проектах</td></tr>',
				// '<tr><td>&quot;<span class="command">резюме</span>&quot;</td><td>&ndash; резюме</td></tr>',
				'<tr><td>&quot;<span class="command">контакты</span>&quot;</td><td>&ndash; мои контакты</td></tr>',
				'<tr><td>&quot;<span class="command">язык английский</span>&quot;</td><td>&ndash; change language to {{&flag}}english</td></tr>',
				'<tr><td>&quot;<span class="command">инфо</span>&quot;</td><td>&ndash; об этой страничке</td></tr>',
				'<tr><td>&quot;<span class="command">помощь</span>&quot;</td><td>&ndash; эта помощь</td></tr>',
				'</table>',
				'{{^isMobile}}Должно работать автодополнение, т.е. вы можете набрать часть команды и нажать клавишу &#8633;Tab.<br>{{/isMobile}}',
				'{{^isMobile}}Или вы{{/isMobile}}{{#isMobile}}Вы{{/isMobile}} можете просто {{^isMobile}}кликнуть{{/isMobile}}{{#isMobile}}нажать{{/isMobile}} на имени команды выше.<br>',
				'На любую команду можно сослаться через символ # в адресной строке.'
			].join('')
		},

		info: {
			en: [
				'Yumaa home page<br>',
				'Version {{version}}<br>',
				'&copy; 2014-2015 Victor Didenko<br><br>',
				'<b>&lt;&gt;</b> with <b>&hearts;</b> and following libraries and resources:<br><br>',
				'<dl>',
				'<dt>{{#E}}\\E[1;37m<a href="http://jquery.com/" target="_blank">jQuery</a>{{/E}}</dt>',
					'<dd>',
						'Fast, small, and feature-rich JavaScript library. It makes things like HTML document traversal and manipulation, event handling, animation, and Ajax much simpler with an easy-to-use API that works across a multitude of browsers.',
					'</dd>',
				'<br>',
				'<dt>{{#E}}\\E[1;37m<a href="http://craig.is/killing/mice" target="_blank">Mousetrap</a>{{/E}} by <a href="http://craig.is/" target="_blank">Craig Campbell</a></dt>',
					'<dd>',
						'A simple library for handling keyboard shortcuts in JavaScript.',
					'</dd>',
				'<br>',
				'<dt>{{#E}}\\E[1;37m<a href="https://github.com/janl/mustache.js" target="_blank">mustache.js</a>{{/E}}</dt>',
					'<dd>',
						'Logic-less &#123;&#123;mustache&#125;&#125; templates with JavaScript.',
					'</dd>',
				'<br>',
				'<dt>{{#E}}\\E[1;37m<a href="http://lesscss.org/" target="_blank">Less</a>{{/E}}</dt>',
					'<dd>',
						'CSS pre-processor, meaning that it extends the CSS language, adding features that allow variables, mixins, functions and many other techniques that allow you to make CSS that is more maintainable, themable and extendable.',
					'</dd>',
				'<br>',
				'<dt>{{#E}}\\E[1;37m<a href="http://gulpjs.com/" target="_blank">gulp</a>{{/E}}</dt>',
					'<dd>',
						'Fast, simple and efficient streaming build system.',
					'</dd>',
				'<br>',
				'<dt>{{#E}}\\E[1;37m<a href="http://icomoon.io/" target="_blank">IcoMoon icon font</a>{{/E}}</dt>',
					'<dd>',
						'Custom font with the set of social icons.',
					'</dd>',
				'<br>',
				'<dt>{{#E}}\\E[1;37m<a href="http://www.marksimonson.com/fonts/view/anonymous-pro" target="_blank">Anonymous Pro font</a>{{/E}} by <a href="http://www.marksimonson.com/" target="_blank">Mark Simonson</a></dt>',
					'<dd>',
						'Family of four monospased fixed-width fonts designed especially with coding in mind. Characters that could be mistaken for one another (O, 0, I, l, 1, etc.) have distinct shapes to make them easier to tell apart in the context of source code.',
					'</dd>',
				'<br>',
				'<dt>Login feature powered by {{#E}}\\E[1;37m<a href="https://ulogin.ru/" target="_blank">uLogin</a>{{/E}}</dt>',
					'<dd>',
						'Service allows users to login using their accounts at many different social networks.',
					'</dd>',
				'</dl>'
			].join(''),
			ru: [
				'Личная страничка Yumaa<br>',
				'Версия {{version}}<br>',
				'&copy; 2014-2015 Виктор Диденко<br><br>',
				'<b>&lt;&gt;</b> с <b>&hearts;</b> и следующими библиотеками и ресурсами:<br><br>',
				'<dl>',
				'<dt>{{#E}}\\E[1;37m<a href="http://jquery.com/" target="_blank">jQuery</a>{{/E}}</dt>',
					'<dd>',
						'Быстрая, небольшая и богатая на возможности JavaScript библиотека. Позволяет делает вещи, такие как обход и манипуляция документом, обработка событий, анимация, Ajax, гораздо проще, благодоря простому кроссбраузерному API.',
					'</dd>',
				'<br>',
				'<dt>{{#E}}\\E[1;37m<a href="http://craig.is/killing/mice" target="_blank">Mousetrap</a>{{/E}} от <a href="http://craig.is/" target="_blank">Craig\'а Campbell\'а</a></dt>',
					'<dd>',
						'Простая JavaScript библиотека для обработки клавиатурных событий и сочетаний клавиш.',
					'</dd>',
				'<br>',
				'<dt>{{#E}}\\E[1;37m<a href="https://github.com/janl/mustache.js" target="_blank">mustache.js</a>{{/E}}</dt>',
					'<dd>',
						'Реализация шаблонной системы &#123;&#123;mustache&#125;&#125; на JavaScript.',
					'</dd>',
				'<br>',
				'<dt>{{#E}}\\E[1;37m<a href="http://lesscss.org/" target="_blank">Less</a>{{/E}}</dt>',
					'<dd>',
						'Пре-процессор, расширяющий возможности CSS, добавляя переменные, примеси, функции и другие технологии, позволяющие делать CSS более поддерживаемым, изменяемым и расширяемым.',
					'</dd>',
				'<br>',
				'<dt>{{#E}}\\E[1;37m<a href="http://gulpjs.com/" target="_blank">gulp</a>{{/E}}</dt>',
					'<dd>',
						'Быстрая, простая и эффективная потоковая система для сборки проектов.',
					'</dd>',
				'<br>',
				'<dt>{{#E}}\\E[1;37m<a href="http://icomoon.io/" target="_blank">Шрифт IcoMoon</a>{{/E}}</dt>',
					'<dd>',
						'Кастомный шрифт с набором социальных значков.',
					'</dd>',
				'<br>',
				'<dt>{{#E}}\\E[1;37m<a href="http://www.marksimonson.com/fonts/view/anonymous-pro" target="_blank">Шрифт Anonymous Pro</a>{{/E}} от <a href="http://www.marksimonson.com/" target="_blank">Mark\'а Simonson\'а</a></dt>',
					'<dd>',
						'Четыре моноширинных шрифта, спроектированных специально для программирования. Символы, которые можно спутать (O, 0, I, l, 1, и т.д.) имеют различные формы, позволяя проще их различать в коде.',
					'</dd>',
				'<br>',
				'<dt>Возможность логина работает с помощью {{#E}}\\E[1;37m<a href="https://ulogin.ru/" target="_blank">uLogin</a>{{/E}}</dt>',
					'<dd>',
						'Сервис, позволяющий пользователям получить доступ к сайту используя аккаунты в различных социальных сетях.',
					'</dd>',
				'</dl>'
			].join('')
		},

		userlogin: {
			en: 'guest',
			ru: 'гость'
		},

		months: {
			en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			ru: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
		},

		days: {
			en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
		},

		commandnotfound: {
			en: 'command not found',
			ru: 'команда не найдена'
		},

		filenotfound: {
			en: 'No such file',
			ru: 'Файл не найден'
		},

		missingfile: {
			en: 'missing file',
			ru: 'файл не указан'
		},

		wrongarguments: {
			en: 'wrong arguments',
			ru: 'ошибка в параметрах'
		},

		baddomain: {
			en: 'this doesn\'t look like domain name or ip address',
			ru: 'это не выглядит как домен или ip адрес'
		},

		loginusage: {
			en: [
				'usage:',
				'    login &lt;social network name&gt;',
				'',
				'available networks:'
			]
		},

		logined: {
			en: '{{#network}}Authenticating with &quot;{{network}}&quot;' +
				'{{#profile}} using profile <a href="{{profile}}" target="_blank">{{profile}}</a>{{/profile}}<br>{{/network}}' +
				'Hello, {{user.login}}!',
			ru: '{{#network}}Аутентификация через &quot;{{network}}&quot;' +
				'{{#profile}}, используя профиль <a href="{{profile}}" target="_blank">{{profile}}</a>{{/profile}}<br>{{/network}}' +
				'Добро пожаловать, {{user.login}}!'
		},

		loggedout: {
			en: 'logged out',
			ru: 'выход выполнен'
		},

		notimplemented: {
			en: 'not implemented',
			ru: 'не реализован'
		},

		_nicetry: {
			en: 'yeah, got it. nice try :)',
			ru: 'шутку оценил, хорошая попытка :)'
		},

		_cheater: {
			en: 'you are a cheater! shame on you!',
			ru: 'да ты читер! как не стыдно!'
		},

		_rm1: {
			en: 'Do not try to remove something. That\'s impossible. Instead... only try to realize the truth.<br>' +
				'There is nothing here.<br>' +
				'Then you\'ll see, that it is not the something is removed, it is only yourself.',
			ru: 'Не пытайся удалить ничего. Это невозможно. Вместо этого... просто попробуй осознать истину.<br>' +
				'Ничего нет.<br>' +
				'Тогда ты увидишь, что это не что-то удаляется, а только ты сам.'
		},

		_rm2: {
			en: 'Oh, I\'ve almost forgot... Follow the white rabbit.',
			ru: 'Ах да, чуть не забыл... Следуй за белым кроликом.'
		},

		_rm3: {
			en: 'Wow, such a perverted way!',
			ru: 'Ого, какой извращённый способ!'
		},

		_godmode: {
			en: 'WOW GOD MODE',
			ru: 'Я БОГ!'
		},

		ip: {
			en: '{{#local}}{{local}}<br> {{^isMobile}}&#10551;{{/isMobile}}{{#isMobile}}&#8627;{{/isMobile}} {{/local}}' +
			    '{{#ip}}{{ip}}{{/ip}}' +
			    '{{#error}}<span class="error">{{error}}</span>{{/error}}'
		},

		geoip: {
			en: [
				'Service provided by <a href="{{service.name}}" target="_blank">{{service.name}}</a>',
				'',
				'ip: {{ip}}',
				'country: {{country}}{{#countryCode}} / {{countryCode}}{{/countryCode}}',
				'city: {{city}}{{#region}} / {{region}}{{/region}}' +
				'{{#latitude}}{{#longitude}}<br>lat. {{latitude}}, long. {{longitude}} (<a href="http://maps.google.com/maps?ll={{latitude}},{{longitude}}&q=loc:{{latitude}},{{longitude}}&hl=en&t=m&z=9" target="_blank">google maps</a>){{/longitude}}{{/latitude}}' +
				'{{#timezone}}<br>timezone: {{timezone}}{{/timezone}}' +
				'{{#provider}}<br>provider: {{provider}}{{/provider}}'
			],
			ru: [
				'Сервис предоставлен сайтом <a href="{{service.name}}" target="_blank">{{service.name}}</a>',
				'',
				'ip: {{ip}}',
				'страна: {{country}}{{#countryCode}} / {{countryCode}}{{/countryCode}}',
				'город: {{city}}{{#region}} / {{region}}{{/region}}' +
				'{{#latitude}}{{#longitude}}<br>ш. {{latitude}}, д. {{longitude}} (<a href="http://maps.google.com/maps?ll={{latitude}},{{longitude}}&q=loc:{{latitude}},{{longitude}}&hl=en&t=m&z=9" target="_blank">карта google</a>){{/longitude}}{{/latitude}}' +
				'{{#timezone}}<br>часовой пояс: {{timezone}}{{/timezone}}' +
				'{{#provider}}<br>провайдер: {{provider}}{{/provider}}'
			]
		},

		easyprivacy: {
			en: 'It seems, you have <a href="https://easylist.adblockplus.org/" target="_blank">AdBlock EasyPrivacy</a> list enabled, it can block requests to GeoIP services',
			ru: 'Похоже, у вас включен <a href="https://easylist.adblockplus.org/" target="_blank">AdBlock EasyPrivacy</a> список, он может блокировать запросы к GeoIP сервисам'
		},

		w: {
			en: '<table class="wtable"><tr>' +
			     '<td>USER</td><td>FROM</td><td>LOGIN@</td>' +
			    '</tr><tr>' +
			     '<td>{{user.login}}</td><td>{{user.ip}}</td><td>{{lastLogin.currtime}}</td>' +
			    '</tr></table>'
		},

		who: {
			en: '{{user.login}}    {{lastLogin.currshort}} {{#user.ip}}({{user.ip}}){{/user.ip}}'
		},

		virus: {
			en: [
				'In case you don\'t know, viruses are harmful. Don\'t run viruses!',
				'Don\'t do it again.',
				'Really, man, don\'t do it.',
				'Did nobody teach you to draw attention to warnings?',
				'Ok, did nobody teach you to listen others\' prayers?',
				'Please!',
				'You think this is funny?',
				'I don\'t think so.',
				'You are persistent one.',
				'DO NOT DO IT!',
				'STOP!',
				'You are making me angry.',
				'Ok, calm down, I don\'t want troubles, you don\'t want troubles, nobody wants troubles. Just stop.',
				'Please, stop.',
				'I think I will just ignore you.',
				'',
				'',
				'',
				'It\'s getting annoying.',
				'Ok, if you insist, this is last warning!',
				'No, this is last warning!',
				'Kidding. But this is really last warning!',
				'Will you change your mind? No?',
				'I wash my hands off.',
				'Wait, I haven\'t hands!',
				'OKAY OKAY FINE, I will run it!',
				'OH CRAP  WHAT    HA\n                   VE      OU DON\n                          Y    E'
			]
		},

		dig: {
			en: [
				'<table class="digtable">',
				 '<tr><td colspan="5">;; QUESTION SECTION:</td></tr>',
				 '<tr><td colspan="2">;{{question.host}}</td><td>{{question.class}}</td><td>{{question.type}}</td><td></td></tr>',
				 '{{#answer?}}',
				   '<tr><td colspan="5">&nbsp;</td></tr>',
				   '<tr><td colspan="5">;; ANSWER SECTION:</td></tr>',
				   '{{#answer}}',
				     '<tr><td>{{host}}.</td><td>{{ttl}}</td><td>{{class}}</td><td>{{type}}</td><td>' + dig_value + '</td></tr>',
				   '{{/answer}}{{/answer?}}',
				 '{{#authns?}}',
				   '<tr><td colspan="5">&nbsp;</td></tr>',
				   '<tr><td colspan="5">;; AUTHORITY SECTION:</td></tr>',
				   '{{#authns}}',
				     '<tr><td>{{host}}.</td><td>{{ttl}}</td><td>{{class}}</td><td>{{type}}</td><td>' + dig_value + '</td></tr>',
				   '{{/authns}}{{/authns?}}',
				 '{{#addtl?}}',
				   '<tr><td colspan="5">&nbsp;</td></tr>',
				   '<tr><td colspan="5">;; ADDITIONAL SECTION:</td></tr>',
				   '{{#addtl}}',
				     '<tr><td>{{host}}.</td><td>{{ttl}}</td><td>{{class}}</td><td>{{type}}</td><td>' + dig_value + '</td></tr>',
				   '{{/addtl}}{{/addtl?}}',
				'</table>'
			].join('')
		},

		palette: {
			en: [
				'          30 31 32 33 34 35 36 37       41      42      43      44      45      46      47',
				'{{#E}}   \\E[40mnormal  \\E[30ma  \\E[31ma  \\E[32ma  \\E[33ma  \\E[34ma  \\E[35ma  \\E[36ma  \\E[37ma\\E[0m ' +
				          '\\E[41m\\E[30ma\\E[31ma\\E[32ma\\E[33ma\\E[34ma\\E[35ma\\E[36ma\\E[37ma\\E[0m' +
				          '\\E[42m\\E[30ma\\E[31ma\\E[32ma\\E[33ma\\E[34ma\\E[35ma\\E[36ma\\E[37ma\\E[0m' +
				          '\\E[43m\\E[30ma\\E[31ma\\E[32ma\\E[33ma\\E[34ma\\E[35ma\\E[36ma\\E[37ma\\E[0m' +
				          '\\E[44m\\E[30ma\\E[31ma\\E[32ma\\E[33ma\\E[34ma\\E[35ma\\E[36ma\\E[37ma\\E[0m' +
				          '\\E[45m\\E[30ma\\E[31ma\\E[32ma\\E[33ma\\E[34ma\\E[35ma\\E[36ma\\E[37ma\\E[0m' +
				          '\\E[46m\\E[30ma\\E[31ma\\E[32ma\\E[33ma\\E[34ma\\E[35ma\\E[36ma\\E[37ma\\E[0m' +
				          '\\E[47m\\E[30ma\\E[31ma\\E[32ma\\E[33ma\\E[34ma\\E[35ma\\E[36ma\\E[37ma\\E[0m 0',
				'     \\E[1;40mbold  \\E[1;30ma  \\E[1;31ma  \\E[1;32ma  \\E[1;33ma  \\E[1;34ma  \\E[1;35ma  \\E[1;36ma  \\E[1;37ma\\E[0m ' +
				          '\\E[1;41m\\E[1;30ma\\E[1;31ma\\E[1;32ma\\E[1;33ma\\E[1;34ma\\E[1;35ma\\E[1;36ma\\E[1;37ma\\E[0m' +
				          '\\E[1;42m\\E[1;30ma\\E[1;31ma\\E[1;32ma\\E[1;33ma\\E[1;34ma\\E[1;35ma\\E[1;36ma\\E[1;37ma\\E[0m' +
				          '\\E[1;43m\\E[1;30ma\\E[1;31ma\\E[1;32ma\\E[1;33ma\\E[1;34ma\\E[1;35ma\\E[1;36ma\\E[1;37ma\\E[0m' +
				          '\\E[1;44m\\E[1;30ma\\E[1;31ma\\E[1;32ma\\E[1;33ma\\E[1;34ma\\E[1;35ma\\E[1;36ma\\E[1;37ma\\E[0m' +
				          '\\E[1;45m\\E[1;30ma\\E[1;31ma\\E[1;32ma\\E[1;33ma\\E[1;34ma\\E[1;35ma\\E[1;36ma\\E[1;37ma\\E[0m' +
				          '\\E[1;46m\\E[1;30ma\\E[1;31ma\\E[1;32ma\\E[1;33ma\\E[1;34ma\\E[1;35ma\\E[1;36ma\\E[1;37ma\\E[0m' +
				          '\\E[1;47m\\E[1;30ma\\E[1;31ma\\E[1;32ma\\E[1;33ma\\E[1;34ma\\E[1;35ma\\E[1;36ma\\E[1;37ma\\E[0m 1',
				'   \\E[3;40mitalic  \\E[3;30ma  \\E[3;31ma  \\E[3;32ma  \\E[3;33ma  \\E[3;34ma  \\E[3;35ma  \\E[3;36ma  \\E[3;37ma\\E[0m ' +
				          '\\E[3;41m\\E[3;30ma\\E[3;31ma\\E[3;32ma\\E[3;33ma\\E[3;34ma\\E[3;35ma\\E[3;36ma\\E[3;37ma\\E[0m' +
				          '\\E[3;42m\\E[3;30ma\\E[3;31ma\\E[3;32ma\\E[3;33ma\\E[3;34ma\\E[3;35ma\\E[3;36ma\\E[3;37ma\\E[0m' +
				          '\\E[3;43m\\E[3;30ma\\E[3;31ma\\E[3;32ma\\E[3;33ma\\E[3;34ma\\E[3;35ma\\E[3;36ma\\E[3;37ma\\E[0m' +
				          '\\E[3;44m\\E[3;30ma\\E[3;31ma\\E[3;32ma\\E[3;33ma\\E[3;34ma\\E[3;35ma\\E[3;36ma\\E[3;37ma\\E[0m' +
				          '\\E[3;45m\\E[3;30ma\\E[3;31ma\\E[3;32ma\\E[3;33ma\\E[3;34ma\\E[3;35ma\\E[3;36ma\\E[3;37ma\\E[0m' +
				          '\\E[3;46m\\E[3;30ma\\E[3;31ma\\E[3;32ma\\E[3;33ma\\E[3;34ma\\E[3;35ma\\E[3;36ma\\E[3;37ma\\E[0m' +
				          '\\E[3;47m\\E[3;30ma\\E[3;31ma\\E[3;32ma\\E[3;33ma\\E[3;34ma\\E[3;35ma\\E[3;36ma\\E[3;37ma\\E[0m 3',
				'\\E[4;40munderline\\E[0m  \\E[4;30ma\\E[0m  \\E[4;31ma\\E[0m  \\E[4;32ma\\E[0m  \\E[4;33ma\\E[0m  \\E[4;34ma\\E[0m  \\E[4;35ma\\E[0m  \\E[4;36ma\\E[0m  \\E[4;37ma\\E[0m ' +
				          '\\E[4;41m\\E[4;30ma\\E[4;31ma\\E[4;32ma\\E[4;33ma\\E[4;34ma\\E[4;35ma\\E[4;36ma\\E[4;37ma\\E[0m' +
				          '\\E[4;42m\\E[4;30ma\\E[4;31ma\\E[4;32ma\\E[4;33ma\\E[4;34ma\\E[4;35ma\\E[4;36ma\\E[4;37ma\\E[0m' +
				          '\\E[4;43m\\E[4;30ma\\E[4;31ma\\E[4;32ma\\E[4;33ma\\E[4;34ma\\E[4;35ma\\E[4;36ma\\E[4;37ma\\E[0m' +
				          '\\E[4;44m\\E[4;30ma\\E[4;31ma\\E[4;32ma\\E[4;33ma\\E[4;34ma\\E[4;35ma\\E[4;36ma\\E[4;37ma\\E[0m' +
				          '\\E[4;45m\\E[4;30ma\\E[4;31ma\\E[4;32ma\\E[4;33ma\\E[4;34ma\\E[4;35ma\\E[4;36ma\\E[4;37ma\\E[0m' +
				          '\\E[4;46m\\E[4;30ma\\E[4;31ma\\E[4;32ma\\E[4;33ma\\E[4;34ma\\E[4;35ma\\E[4;36ma\\E[4;37ma\\E[0m' +
				          '\\E[4;47m\\E[4;30ma\\E[4;31ma\\E[4;32ma\\E[4;33ma\\E[4;34ma\\E[4;35ma\\E[4;36ma\\E[4;37ma\\E[0m 4',
				'  \\E[6;40moutline \\E[6;30m a\\E[6;31m  a\\E[6;32m  a\\E[6;33m  a\\E[6;34m  a\\E[6;35m  a\\E[6;36m  a\\E[6;37m  a\\E[0m ' +
				          '\\E[6;41m\\E[6;30ma\\E[6;31ma\\E[6;32ma\\E[6;33ma\\E[6;34ma\\E[6;35ma\\E[6;36ma\\E[6;37ma\\E[0m' +
				          '\\E[6;42m\\E[6;30ma\\E[6;31ma\\E[6;32ma\\E[6;33ma\\E[6;34ma\\E[6;35ma\\E[6;36ma\\E[6;37ma\\E[0m' +
				          '\\E[6;43m\\E[6;30ma\\E[6;31ma\\E[6;32ma\\E[6;33ma\\E[6;34ma\\E[6;35ma\\E[6;36ma\\E[6;37ma\\E[0m' +
				          '\\E[6;44m\\E[6;30ma\\E[6;31ma\\E[6;32ma\\E[6;33ma\\E[6;34ma\\E[6;35ma\\E[6;36ma\\E[6;37ma\\E[0m' +
				          '\\E[6;45m\\E[6;30ma\\E[6;31ma\\E[6;32ma\\E[6;33ma\\E[6;34ma\\E[6;35ma\\E[6;36ma\\E[6;37ma\\E[0m' +
				          '\\E[6;46m\\E[6;30ma\\E[6;31ma\\E[6;32ma\\E[6;33ma\\E[6;34ma\\E[6;35ma\\E[6;36ma\\E[6;37ma\\E[0m' +
				          '\\E[6;47m\\E[6;30ma\\E[6;31ma\\E[6;32ma\\E[6;33ma\\E[6;34ma\\E[6;35ma\\E[6;36ma\\E[6;37ma\\E[0m 6',
				'   \\E[9;40mstrike\\E[0m  \\E[9;30ma\\E[0m  \\E[9;31ma\\E[0m  \\E[9;32ma\\E[0m  \\E[9;33ma\\E[0m  \\E[9;34ma\\E[0m  \\E[9;35ma\\E[0m  \\E[9;36ma\\E[0m  \\E[9;37ma\\E[0m ' +
				          '\\E[9;41m\\E[9;30ma\\E[9;31ma\\E[9;32ma\\E[9;33ma\\E[9;34ma\\E[9;35ma\\E[9;36ma\\E[9;37ma\\E[0m' +
				          '\\E[9;42m\\E[9;30ma\\E[9;31ma\\E[9;32ma\\E[9;33ma\\E[9;34ma\\E[9;35ma\\E[9;36ma\\E[9;37ma\\E[0m' +
				          '\\E[9;43m\\E[9;30ma\\E[9;31ma\\E[9;32ma\\E[9;33ma\\E[9;34ma\\E[9;35ma\\E[9;36ma\\E[9;37ma\\E[0m' +
				          '\\E[9;44m\\E[9;30ma\\E[9;31ma\\E[9;32ma\\E[9;33ma\\E[9;34ma\\E[9;35ma\\E[9;36ma\\E[9;37ma\\E[0m' +
				          '\\E[9;45m\\E[9;30ma\\E[9;31ma\\E[9;32ma\\E[9;33ma\\E[9;34ma\\E[9;35ma\\E[9;36ma\\E[9;37ma\\E[0m' +
				          '\\E[9;46m\\E[9;30ma\\E[9;31ma\\E[9;32ma\\E[9;33ma\\E[9;34ma\\E[9;35ma\\E[9;36ma\\E[9;37ma\\E[0m' +
				          '\\E[9;47m\\E[9;30ma\\E[9;31ma\\E[9;32ma\\E[9;33ma\\E[9;34ma\\E[9;35ma\\E[9;36ma\\E[9;37ma\\E[0m 9',
				'{{#blink}}    \\E[5;40mblink  \\E[5;30ma  \\E[5;31ma  \\E[5;32ma  \\E[5;33ma  \\E[5;34ma  \\E[5;35ma  \\E[5;36ma  \\E[5;37ma\\E[0m ' +
				          '\\E[5;41m\\E[5;30ma\\E[5;31ma\\E[5;32ma\\E[5;33ma\\E[5;34ma\\E[5;35ma\\E[5;36ma\\E[5;37ma\\E[0m' +
				          '\\E[5;42m\\E[5;30ma\\E[5;31ma\\E[5;32ma\\E[5;33ma\\E[5;34ma\\E[5;35ma\\E[5;36ma\\E[5;37ma\\E[0m' +
				          '\\E[5;43m\\E[5;30ma\\E[5;31ma\\E[5;32ma\\E[5;33ma\\E[5;34ma\\E[5;35ma\\E[5;36ma\\E[5;37ma\\E[0m' +
				          '\\E[5;44m\\E[5;30ma\\E[5;31ma\\E[5;32ma\\E[5;33ma\\E[5;34ma\\E[5;35ma\\E[5;36ma\\E[5;37ma\\E[0m' +
				          '\\E[5;45m\\E[5;30ma\\E[5;31ma\\E[5;32ma\\E[5;33ma\\E[5;34ma\\E[5;35ma\\E[5;36ma\\E[5;37ma\\E[0m' +
				          '\\E[5;46m\\E[5;30ma\\E[5;31ma\\E[5;32ma\\E[5;33ma\\E[5;34ma\\E[5;35ma\\E[5;36ma\\E[5;37ma\\E[0m' +
				          '\\E[5;47m\\E[5;30ma\\E[5;31ma\\E[5;32ma\\E[5;33ma\\E[5;34ma\\E[5;35ma\\E[5;36ma\\E[5;37ma\\E[0m 5{{/blink}}{{/E}}'
			]
		},

		quest: {
			en: [
				'I always wanted to make an IT-quest, so there is small one, hidden here. Try to solve it :)',
				'Hint: look into your head{{#E}}\\E[0;30mer\\E[0m{{/E}}',
				'',
				'Winners:',
				'you can be first ;)'
			]
		},

		q00: '+--------------------------------------------------------------------------------+',
		q01: '| Hey, you! Who are looking in my source code now. Trying to figure out answers? |',
		q02: '| Surprise, they are encoded ^_^ But may be you will be so smart to decode them? |',
		q03: '| It will be a cheat, of course, but nice one.                                   |',
		q04: '+--------------------------------------------------------------------------------+',
		q1: {
			en: '\0IwikVywgoGikV2efm3onnjzdISXclGikV3CzlH5cISXclRGnnjean1ikV3UaK2s0IN4/ISXbUL=='
		},
		q2: {
			en: '\0G2GdmNMvm25wTDMTKIUwTRwkTR5wpSBrn3CwnOzVNuiamHnrn3UuADUamHngZRJ2XEP0JEGvXEJiKHQvYuUwKuB1J2J4JxXiJECvZEXflyMyTu4='
		},
		q3: {
			en: '\0IwikVyCzKGikV25woQikV2wkISXcoxQkoQikV2QfKQikVjsamxKamxw0KIidlH1aoRiwn3XaWu9nnjz='
		},
		q4: {
			en: '\0C29gKNPrG2ssoNMsJx91oNM0lRQ0TR9fKEzVNuiamHnrn3UuADUamHngJEPhX2YtXkBjXxKsKOKvJEstKHThKHQsJuMuYxPkXELflyMyTu4='
		},
		q5: {
			en: '\0ExwuKDM0nyvdTRU1oNM0lRGjKDManjMsTRsamyBrlH4rJDMioHGkoRwgmthrmx90TRQfTRQfn3ownr=='
		}

		//...
	};

	// language to get strings
	var language = window.localStorage ? window.localStorage.getItem('language') || 'en' : ($.cookie ? $.cookie('language') || 'en' : 'en');

	// caesar crypter and decrypter
	// http://nayuki.eigenstate.org/res/caesar-cipher-javascript.js
	/*
	 * Returns the result of having each letter of the given text shifted forward by the given key, with wraparound. Case is preserved, and non-letters are unchanged.
	 * Examples:
	 *   crypt("abz", 1) = "bca"
	 *   crypt("THe 123 !@#$", 13) = "GUr 123 !@#$"
	 */
	function crypt(input, key) {
		key = key || 11;
		var output = '';
		for (var i = 0; i < input.length; i++) {
			var c = input.charCodeAt(i);

			// uppercase
			if (c >= 65 && c <=  90) {
				output += String.fromCharCode((c - 65 + key) % 26 + 65);
			} else

			// lowercase
			if (c >= 97 && c <= 122) {
				output += String.fromCharCode((c - 97 + key) % 26 + 97);
			} else

			// just copy
			{
				output += input.charAt(i);
			}
		}
		return output;
	}

	function decrypt(input, key) {
		key = key || 11;
		return crypt(input, (26 - key) % 26);
	}
	//---------------------------------------------------------------

	// function to get string by key
	var _ = function(key) {
		var val = strings[key];
		if (val !== void 0) {
			var str = val[language] || val.en;
			if (typeof str === 'string' && str.length > 1 && str.charCodeAt(0) === 0) {
				// encoded message -> decode
				str = decrypt(str.substring(1));
			}
			return str;
		}
	};

	// expose language
	_.language = language;

	// setter
	_.set = function(lang) {
		language = lang;
		_.language = language;

		// save language in browser
		if (window.localStorage) {
			window.localStorage.setItem('language', lang);
		} else
		if ($.cookie) {
			$.cookie('language', lang, { expires: 365 });
		}
	};

	// crypter and decrypter
	// _.c = crypt;
	// _.d = decrypt;

	// expose _ to the global scope
	window._ = _;

})(window);
