/*
 * Sh ~ Shell
 *
 * Version 2.5.1
 * Require jquery (tested on 1.11.3) https://jquery.com/
 * Require mousetrap (tested on 1.5.3) http://craig.is/killing/mice
 * Require mustache (tested on 2.1.3) https://github.com/janl/mustache.js
 *
 * Author Didenko Victor
 */

/* jshint strict: true, browser: true, jquery: true, -W099, smarttabs: true, undef: true, unused: true, bitwise: true, curly: true, quotmark: single, trailing: true */
/* global Mustache, Mousetrap */
;(function(window, document, navigator, undefined) {
	'use strict';

	/************************************************************************************
	 * Private variables and functions
	 */

	// application version
	var version = '2.5.1 (06/12/2015)';

	// get _ from the global scope
	var _ = window._;

	// extend navigator global variable
	navigator.yu_browser = (function() {
		// ~ http://stackoverflow.com/questions/5916900/detect-version-of-browser
		var ua = navigator.userAgent, tem,
		    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
		if (/trident/i.test(M[1])) {
			tem = /\brv[ :]+([\d\.]+)?/g.exec(ua) || [];
			return 'IE/' + (tem[1] || '');
		}
		if (M[1] === 'Chrome') {
			tem = ua.match(/\bOPR\/([\d\.]+)/);
			if (tem !== null) {
				return 'Opera/' + tem[1];
			}
			tem = ua.match(/\bedge\/([\d\.]+)?/i);
			if (tem !== null) {
				return 'Edge/' + (tem[1] || '');
			}
			tem = ua.match(/\bvivaldi\/([\d\.]+)?/i);
			if (tem !== null) {
				return 'Vivaldi/' + (tem[1] || '');
			}
		}
		M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
		if ((tem = ua.match(/version\/([\d\.]+)/i)) !== null) {
			M.splice(1, 1, tem[1]);
		}
		return M.join('/');
	})();
	navigator.yu_browser_small = navigator.yu_browser.toLowerCase().replace(/[\.\s\/]+/g, '_');

	// collection of executables utils, calls with 'this' = Sh object
	var bin = {

		// collection of initialization functions, if necessary
		// all functions runs on shell init, after 'bin' extend
		init: {

			hidden: ['su', 'sudo', 'rm', 'perl', ':(){:|:&};:', ':(){', 'iddqd', 'eval'],
			sbin: ['w', 'who', 'hostname', 'uname', 'palette', 'ip', 'whois', 'geoip', 'dig', 'virus', 'eval'],

			// move 'sbin' commands to/from /sbin/
			__move_sbin: function(to) {
				var sbin = bin.init.sbin,
				    newname;

				// move commands from / to /sbin/
				if (to) {
					for (var i = 0, l = sbin.length; i < l; i++) {
						if (sbin[i] in bin) {
							newname = '/sbin/' + sbin[i];

							// move command
							bin[newname] = bin[sbin[i]];
							delete bin[sbin[i]];

							// move properties and hints
							if (sbin[i] + 'Property' in bin) {
								bin[newname + 'Property'] = bin[sbin[i] + 'Property'];
								delete bin[sbin[i] + 'Property'];
							}
							if (sbin[i] + 'Hint' in bin) {
								bin[newname + 'Hint'] = bin[sbin[i] + 'Hint'];
								delete bin[sbin[i] + 'Hint'];
							}
						}
					}

				// move commands from /sbin/ to /
				} else {
					for (var b in bin) {
						if (typeof bin[b] === 'function' && b.indexOf('/sbin/') === 0) {
							newname = b.substring(6);

							// move command
							bin[newname] = bin[b];
							delete bin[b];

							// move properties and hints
							if (b + 'Property' in bin) {
								bin[newname + 'Property'] = bin[b + 'Property'];
								delete bin[b + 'Property'];
							}
							if (b + 'Hint' in bin) {
								bin[newname + 'Hint'] = bin[b + 'Hint'];
								delete bin[b + 'Hint'];
							}
						}
					}

				}
			},

			// common initialization, set properties, move to /sbin/
			_common: function() {
				var hidden = bin.init.hidden,
				    i, l;

				// set 'hidden' property
				for (i = 0, l = hidden.length; i < l; i++) {
					if (hidden[i] in bin) {
						if (!(hidden[i] + 'Property' in bin)) {
							bin[hidden[i] + 'Property'] = {};
						}
						bin[hidden[i] + 'Property'].hidden = true;
					}
				}

				// move commands to /sbin/
				bin.init.__move_sbin(true);

				// create localized command names
				var newname;
				for (i in bin) {
					if (typeof bin[i] === 'function' && i + 'Property' in bin && _.language in bin[i + 'Property']) {
						// link command to new name, depending on current language
						newname = bin[i + 'Property'][_.language];
						bin[newname] = bin[i];

						// link properties
						bin[newname + 'Property'] = bin[i + 'Property'];
						// don't link hints, because hints are localized
					}
				}
			},

			// init hint for 'sudo' command (list of all commands)
			sudo: function() {
				var commands = [],
				    c;
				for (c in bin) {
					if (typeof bin[c] === 'function' && bin.init.hidden.indexOf(c) === -1 &&
						((bin[c + 'Property'] && !bin[c + 'Property'].hidden) || !bin[c + 'Property'])) {
						commands.push(c);
					}
				}
				bin.sudoHint = commands;
			},

			// init hint for 'cat' command (list of all strings=files)
			cat: function() {
				var files = [],
				    keys = Object.keys(strings),
				    s, i, l;
				for (i = 0, l = keys.length; i < l; i++) { // for (s in strings) {
					s = keys[i];
					if (s.charAt(0) !== '.') { // hide strings, started with .
						files.push(s + '.txt');
					}
				}
				bin.catHint = files;
			},

			// init 'login' command (list of social networks)
			login: function() {
				var providers = ['twitter','vkontakte','facebook','google','googleplus','yandex','youtube',/*'livejournal',*/'tumblr',/*'instagram','linkedin',*/'openid'];

				//MAYBE move to view.init() ?
				// load uLogin <script src="//ulogin.ru/js/ulogin.js"></script>
				$.ajax({
					url: '//ulogin.ru/js/ulogin.js',
					cache: true,
					dataType: 'script'
				});
				// create uLogin main element with buttons
				var $uLogin = $('<div id="uLogin" data-ulogin="display=buttons;optional=nickname,first_name,last_name;lang=' + _.language + ';callback=uLoginCallback"/>');
				for (var i = providers.length; i--;) {
					$uLogin.append('<span data-uloginbutton="' + providers[i] + '" class="uloginbutton ' + providers[i] + '"/>');
				}
				$(document.body).append($uLogin);

				// define callback for uLogin
				window.uLoginCallback = function(token) {
					$.ajax({
						url: '//ulogin.ru/token.php',
						dataType: 'jsonp',
						data: {
							host: window.location.toString(),
							token: token
						},
						success: function(data) {
							if (window.JSON && window.JSON.parse) {
								try {
									data = JSON.parse('' + data);
								} catch(e) {}
							}
							if (data && !data.error) {
								bin.login(data); // call 'login' command with recieved data
							}
						}
					});
				};

				// add all providers to 'login' command hint
				bin.loginHint = providers;
			},

			// init 'geoip' command (check AdBlock EasyPrivacy list)
			geoip: function() {
				//MAYBE move to view.init() ? or to <head>
				// <script src="js/test-AdTracking.js"></script>
				$.ajax({
					url: 'js/test-AdTracking.js',
					cache: true,
					dataType: 'script'
				});
			}
		},

		// allow to change language
		languageHint: ['en', 'ru'],
		'языкHint': ['английский', 'русский'],
		languageProperty: { ru: 'язык', en: 'язык' }, // always create russian link here
		language: function(argv, cmd, std) {
			if (argv.length !== 2 || bin[argv[0] + 'Hint'].indexOf(argv[1]) === -1) {
				std.err = _('wrongarguments');
				return;
			}

			// set language and reload page
			var newlang;
			switch (argv[1]) {
				case 'en':
				case 'английский':
					newlang = 'en';
					break;
				case 'ru':
				case 'русский':
					newlang ='ru';
			}
			_.set(newlang);

			// change current command, if any, to new name on different language
			var hash = tools.hash.get();
			if (hash) {
				var hashcmd = decodeURIComponent(hash),
				    command = hashcmd.match(/^\s*[^\s]+/);
				if (command) {
					command = command[0].trim();
				}
				var property = bin[command + 'Property'],
				    newname = property ? property[newlang] : undefined;

				if (command && newname) {
					tools.hash.set(hashcmd.replace(command, newname));
				}

				if (command === argv[0] || newname === argv[0]) {
					tools.hash.clear(); // remove 'language' command from location.hash
				}
			}

			window.location.reload();
			return -1; // return -1 -> do not save command in hash
		},

		// just reload page
		reloadHint: ['blank'],
		reload: function(argv) {
			if (argv.length > 1 && argv[1] == 'blank') {
				tools.hash.clear(); // clear location.hash
			}
			window.location.reload();
			return -1; // return -1 -> do not save command in hash
		},

		// print row
		echo: function(argv) {
			var esc = argv.length > 1 && argv[1] === '-e';
			argv.shift(); // remove command name from argv
			if (esc) {
				argv.shift(); // remove '-e' key
			}
			var str = Mustache.escape(argv.join(' '));
			if (esc) {
				str = Mustache.render('{{#E}}' + str + '{{/E}}', E);
			}
			view.row(str);
		},

		// clear shell
		clear: function() {
			view.clear();
		},

		// print or clear command history
		historyHint: ['clear'],
		'историяHint': ['очистить'],
		historyProperty: { ru: 'история', en: 'history' },
		history: function(argv, cmd, std) {
			var l = argv.length;
			if (l == 1) {
				var ret = '',
				    h = history.all();
				for (var i = 0, len = h.length; i < len; i++) {
					ret += '<div class="historyrow"><span class="command">' + Mustache.escape(h[i]) + '</span></div>';
				}
				return ret;
			} else
			if (l == 2 && (argv[1] == 'clear' || argv[1] == 'очистить')) {
				history.clear();
			} else {
				std.err = _('wrongarguments');
			}
		},

		// list all strings (as files)
		ls: function() {
			var files = [],
			    keys = Object.keys(strings),
			    s, i, l;
			for (i = 0, l = keys.length; i < l; i++) { // for (s in strings) {
				s = keys[i];
				if (s.charAt(0) !== '.') { // hide strings, started with .
					files.push(s + '.txt');
				}
			}
			var table = view.hintDivs(files, undefined, true);
			return table;
		},

		// print given string
		cat: function(argv, cmd, std) {
			argv.shift(); // remove command name from argv

			if (argv.length === 0) {
				std.err = _('missingfile');
				return;
			}

			var txtRE = /\.txt$/i,
			    imgRE = /\.jpe?g$/i,
			    httpRE = /^(https?:)?\/\//i;

			std.out = '';
			std.err = '';

			// callbacks for image load
			// inside object because of jshint warning 'possible strict vialotion', if use simple function with 'this'
			var img = {
				load: function() {
					view.done('<img src="' + this.src + '">');
				},
				error: function() {
					view.done(void 0, {
						err: 'cat: ' + this.src + ': ' + _('filenotfound')
					});
				}
			};

			for (var i = 0, l = argv.length; i < l; i++) {
				var file = argv[i];

				// try to load image (do not load from other domains)
				if (imgRE.test(file) && !httpRE.test(file)) {
					$('<img/>', {
						src: file,
						on: {
							'load': img.load,
							'error': img.error
						}
					});
				} else

				// print string
				if (txtRE.test(file)) {
					var s = file.replace(txtRE, '');
					if (s in strings) {
						std.out += str(s) + '<br>';
					} else {
						std.err += 'cat: ' + Mustache.escape(file) + ': ' + _('filenotfound') + '<br>';
					}
				}

				// else file not found
				else {
					std.err += 'cat: ' + Mustache.escape(file) + ': ' + _('filenotfound') + '<br>';
				}

			}
		},

		// print full color palette
		paletteHint: ['withblink'],
		palette: function(argv) {
			var scope = {
				blink: argv.length > 1 && argv[1] === 'withblink'
			};
			view.row(str('.palette', scope), 'palette');
		},

		// logged user information
		w: function() {
			return str('.w');
		},
		who: function() {
			return str('.who');
		},

		// show hostname
		hostname: function() {
			return config.hostname;
		},

		// show user agent
		uname: function(argv) {
			if (argv.length > 1 && (argv.indexOf('-a') != -1 || argv.indexOf('--all') != -1)) {
				return navigator.userAgent;
			}
			return navigator.yu_browser;
		},

		// request client ip from server
		ip: function() {
			var ret = {
				local: undefined,
				ip: undefined
			};

			// get local ip via WebRTC

			// http://habrahabr.ru/post/215071/
			// note: window.RTCPeerConnection is "not a constructor" in FF22/23
			var RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection,
			    rtc,

			    // creates object, that DOESN'T inherit Object's properties!
			    // not necessary, but very interesting way
			    addrs = Object.create(null),

			    updateAddrsDoneId,
			    updateAddrsDone = function() {
			    	var display = [];
			    	for (var a in addrs) {
			    		if (addrs[a]) {
			    			display.push(a);
			    		}
			    	}
			    	ret.local = display.join(', ');
			    },

			    updateAddrs = function(addr) {
			    	if (addr in addrs) {
			    		return;
			    	}
			    	addrs[addr] = true;

			    	// clear timeout and set new one
			    	window.clearTimeout(updateAddrsDoneId);
			    	updateAddrsDoneId = window.setTimeout(updateAddrsDone, 50); // find new address in 50ms!
			    },

			    grepSDP = function(sdp) {
			    	var lines = sdp.split('\r\n'); // c.f. http://tools.ietf.org/html/rfc4566#page-39
			    	for (var i = lines.length; i--;) {
			    		var line = lines[i],
			    		    parts, addr, type;
			    		if (line.indexOf('a=candidate') > -1) { // http://tools.ietf.org/html/rfc4566#section-5.13
			    			parts = line.split(' '); // http://tools.ietf.org/html/rfc5245#section-15.1
			    			addr = parts[4];
			    			type = parts[7];
			    			if (type === 'host') {
			    				updateAddrs(addr);
			    			}
			    		} else
			    		if (line.indexOf('c=') > -1) { // http://tools.ietf.org/html/rfc4566#section-5.7
			    			parts = line.split(' ');
			    			addr = parts[2];
			    			updateAddrs(addr);
			    		}
			    	}
			    };

			if (RTCPeerConnection) {
				addrs['0.0.0.0'] = false;

				rtc = new RTCPeerConnection({ iceServers: [] });
				if (window.mozRTCPeerConnection) { // FF needs a channel/stream to proceed
					rtc.createDataChannel('', { reliable: false });
				}

				rtc.onicecandidate = function(e) {
					if (e.candidate) {
						grepSDP(e.candidate.candidate);
					}
				};

				rtc.createOffer(function(offerDesc) {
					grepSDP(offerDesc.sdp);
					rtc.setLocalDescription(offerDesc);
				}, function() { // offer failed
					ret.local = null;
				});
			} else {
				ret.local = null;
			}

			// get external ip via local script

			// can be get, e.g. from http://l2.io/ip.js?var=ip (yeah, it without callback)
			var sh = this;
			if (sh.user && sh.user.ip) {
				ret.ip = sh.user.ip;
			} else {
				$.ajax({
					url: 'bin/ip.php',
					dataType: 'text',
					timeout: 3000, // 3 seconds
					success: function(data) {
						var isip = data.match(/^[\da-f\.:%]+$/);
						ret[isip ? 'ip' : 'error'] = data;
						ret[!isip ? 'ip' : 'error'] = null;
					},
					error: function(jqXHR, textStatus, errorThrown) {
						ret.ip = null;
						ret.error = jqXHR.status + ' ' + textStatus + ': ' + errorThrown;
					}
				});
			}

			// checker function, check return data every 10ms, and if work is done -> returns value to console
			var checkerId = window.setInterval(function() {
				if (ret.local !== undefined && ret.ip !== undefined) {
					if (rtc) {
						rtc.onicecandidate = null;
						// rtc = null;
					}
					window.clearInterval(checkerId);
					window.clearTimeout(timeoutId);
					sh.done(str('.ip', ret));
				}
			}, 50);

			// timeout function, after 3.1 seconds breaks all work, clear data
			var timeoutId = window.setTimeout(function() {
				if (ret.local === undefined) {
					ret.local = null;
				}
				if (ret.ip === undefined) {
					ret.ip = null;
					ret.error = 'timeout';
				}
			}, 3100);

			return 0;
		},

		// request whois information
		whois: function(argv, cmd, std) {
			if (argv.length === 2) {
				var domain = argv[1].trim();

				// check domain validity
				//if (!/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(domain) &&
				//	!/^(www\.)?([-a-zA-Z0-9]{2,100})\.([a-zA-Z\.]{2,8})$/.test(domain)) {
				//	return _('baddomain');
				//}

				var sh = this;
				$.ajax({
					type: 'POST',
					url: 'bin/whois.php',
					data: {
						domain: domain
					},
					dataType: 'text',
					// timeout: 15000, // 15 seconds
					success: function(data) {
						sh.done(data);
					},
					error: function(jqXHR, textStatus, errorThrown) {
						sh.done(void 0, {
							err: jqXHR.status + ' ' + textStatus + ': ' + errorThrown
						});
					}
				});
				return 0;
			} else {
				std.err = _('wrongarguments');
			}
		},

		// request dig information
		dig: function(argv, cmd, std) {
			var types = ['any','a','mx','cname','ns','ptr','txt','hinfo','soa','aaaa','a6','srv','naptr'],
			    domain, type;

			if (argv.length === 1 || argv.length > 3) {
				std.err = _('wrongarguments');
				return;
			}

			// get domain and request type
			if (argv.length === 2) {
				domain = argv[1].toLowerCase().trim();
				type = 'a';
			} else {
				argv[1] = argv[1].toLowerCase().trim();
				argv[2] = argv[2].toLowerCase().trim();

				if (types.indexOf(argv[1]) !== -1) {
					domain = argv[2];
					type = argv[1];
				} else
				if (types.indexOf(argv[2]) !== -1) {
					domain = argv[1];
					type = argv[2];
				} else {
					domain = argv[1];
					type = 'a';
				}
			}

			// do request
			var sh = this;
			$.ajax({
				type: 'POST',
				url: 'bin/dig.php',
				data: {
					domain: domain,
					type: type
				},
				dataType: 'json',
				timeout: 10000, // 10 seconds
				success: function(data) {
					// if error
					if ('error' in data && data.error !== '') {
						sh.done(data.error);
						return;
					}
					if ('answer' in data && data.answer === false) {
						sh.done('DNS request failed');
						return;
					}

					// if response is successful
					sh.done(str('.dig', $.extend(data, {
						'answer?': data.answer && data.answer.length > 0,
						'authns?': data.authns && data.authns.length > 0,
						'addtl?': data.addtl && data.addtl.length > 0
					})));
				},
				error: function(jqXHR, textStatus, errorThrown) {
					sh.done(void 0, {
						err: jqXHR.status + ' ' + textStatus + ': ' + errorThrown
					});
				}
			});
			return 0;
		},

		// retrieve geoip information
		geoip: function(argv, cmd, std, service) {
			// adBlock EasyPrivacy list check
			// variable window.EasyPrivacy_check is defined in js/test-AdTracking.js script
			// which is blocked by EasyPrivacy list rule '-AdTracking.'
			if (!window.EasyPrivacy_check && !service) {
				view.row('<span class="warning">' + _('easyprivacy') + '</span>');
			}

			if (argv.length <= 2) {
				service = service || 0;
				var sh = this,
				    ip = argv.length === 2 ? argv[1].trim() : undefined,
				    services = [
				    	{
				    		name: 'http://ipinfo.io/',
				    		url: 'http://ipinfo.io/{{ip}}',
				    		ip: 'ip',
				    		country: 'country',
				    		// countryCode: 'country',
				    		city: 'city',
				    		// latitude: 'latitude',
				    		// longitude: 'longitude',
				    		loc: 'loc',
				    		// timezone: 'timezone'
				    		provider: 'org'
				    	}
				    	/*{ // looks like dead
				    		name: 'https://ru.smart-ip.net/',
				    		url: '//ru.smart-ip.net/geoip-json',
				    		ip: 'host',
				    		country: 'countryName',
				    		countryCode: 'countryCode',
				    		city: 'city',
				    		latitude: 'latitude',
				    		longitude: 'longitude',
				    		timezone: 'timezone'
				    		// provider: 'provider'
				    	}*/
				    	/*{ // looks like dead
				    		name: 'http://ip.codehelper.io/',
				    		url: 'http://www.codehelper.io/api/ips/',
				    		ip: 'IP',
				    		country: 'CountryName',
				    		countryCode: 'Country',
				    		city: 'CityName',
				    		capital: 'Capital',
				    		latitude: 'CityLatitude',
				    		longitude: 'CityLongitude',
				    		timezone: 'LocalTimeZone',
				    		// provider: 'provider'
				    	}*/
				    ];

				$.ajax({
					type: 'GET',
					url: services[service].url.replace('{{ip}}', ip ? ip : ''),
					data: {
						lang: _.language,
						host: ip,
						ip: ip
					},
					dataType: 'jsonp',
					timeout: 10000, // 10 seconds
					success: function(data) {
						// unification of different service responses
						$.extend(data, {
							service: services[service],
							ip: data[services[service].ip] ? data[services[service].ip] : '?',
							country: data[services[service].country] ? data[services[service].country] : 'Unknown',
							countryCode: data[services[service].countryCode],
							city: data[services[service].city] && data[services[service].city] !== 'Unknown'
							        ? data[services[service].city]
							        : (data[services[service].capital] ? data[services[service].capital] : 'Unknown'),
							latitude: data[services[service].latitude]
							            ? data[services[service].latitude]
							            : (data[services[service].loc] && data[services[service].loc].split(',').length === 2 ? data[services[service].loc].split(',')[0] : null),
							longitude: data[services[service].longitude]
							             ? data[services[service].longitude]
							             : (data[services[service].loc] && data[services[service].loc].split(',').length === 2 ? data[services[service].loc].split(',')[1] : null),
							timezone: data[services[service].timezone],
							provider: data[services[service].provider]
						});
						sh.done(sh.str('.geoip', data));
					},
					error: function(jqXHR, textStatus, errorThrown) {
						var error = 'service "' + services[service].name + '" error:: ' + jqXHR.status + ' ' + textStatus + ': ' + errorThrown;

						// use next service
						if (service + 1 < services.length) {
							sh.row('<span class="error">' + error + '</span>');

							// sad I can't use arguments.callee in strict mode :(
							var callagain = 'geoip';
							if (!(callagain in bin)) {
								callagain = '/sbin/geoip';
							}
							bin[callagain].call(sh, argv, cmd, std, service + 1);

						// return error and exit
						} else {
							sh.done(void 0, {
								err: error
							});
						}
					}
				});
				return 0;

			} else {
				std.err = _('wrongarguments');
			}
		},

		// do login
		// if Sh === true -> command executed from cli, else -> from callback (argv == data in that case)
		login: function(argv, cmd, std) {
			// "click" by button or show usage message
			if (this === Sh) {
				if (argv.length === 1) {
					return str('.loginusage') + '<br>    ' + bin.loginHint.join(', ');
				} else
				if (argv.length > 2 || bin.loginHint.indexOf(argv[1]) === -1) {
					std.err = _('wrongarguments');
					return;
				}

				// open social network uLogin window by "clicking" on uLogin button
				$('#uLogin .' + argv[1]).trigger('click');

			// do login
			} else {
				// get login
				var login = 'root';
				if (argv) {
					if (argv.nickname) {
						login = argv.nickname;
					} else
					if (argv.first_name) {
						login = argv.first_name;
						if (argv.last_name) {
							login += ' ' + argv.last_name;
						}
					} else
					if (argv.last_name) {
						login = argv.last_name;
					}
				}
				login = login.toLowerCase().replace(/\s/g, '_');

				user.login = login;
				tools.storage.set('login', login, 'session'); // save user login for session

				bin.su();

				view.row(str('.logined', argv)); // print welcome message
				view.set('');
				view.execute();
			}

			return -1; // do not save in hash
		},

		// do logout
		logout: function() {
			// if user is authorized -> deauthorize
			if (user.authorized) {
				// move commands from / to /sbin/
				bin.init.__move_sbin(true);

				// change prompt and authorized flag
				if (user.login === 'root') {
					strings.prompt = strings['.prompt']; // restore prompt
				}
				user.authorized = false;
				tools.storage.set('authorized', null, 'session'); // remove authorized flag from session
				user.login = _('userlogin');
				tools.storage.set('login', null, 'session'); // remove user login from session
				tools.hash.clear(); // remove command from location.hash

				view.row(_('loggedout'));

			// else -> do real logout
			} else {
				view.logout();
			}

			return -1; // do not save in hash
		},

		// easter egg, fork bomb
		':(){:|:&};:': function(argv, cmd, std) {
			std.err = argv[0] + ': ' + _('_nicetry');
		},
		':(){': function(argv, cmd, std) { // because of view on wikipedia -> :(){ :|:& };:
			if (cmd.replace(/\s+/g, '').trim() === ':(){:|:&};:') {
				return bin[':(){:|:&};:'](argv, cmd, std);
			} else {
				std.err = ':(){: ' + _('commandnotfound');
			}
		},

		// easter egg, remove command
		rm: function() {
			var sh = this;
			view.row(_('_rm1'));
			window.setTimeout(function() {
				sh.done(_('_rm2'));
			}, 5000);
		},
		perl: function(argv, cmd, std) {
			if (cmd.trim() === 'perl -e \'$??s:;s:s;;$?::s;;=]=>%-{<-|}<&|`{;;y; -/:-@[-`{-};`-{/" -;;s;;$_;see\'') {
				view.row(_('_rm3'));
				return bin.rm.call(this);
			} else {
				std.err = 'perl: ' + _('commandnotfound');
			}
		},

		// easter egg, god mode
		su: function(init) {
			// move commands from /sbin/ to /
			bin.init.__move_sbin(false);

			// change prompt and authorized flag
			if (user.login === 'root' || Sh === this) {
				user.login = 'root';
				if (strings.prompt !== strings.rootprompt) {
					strings['.prompt'] = strings.prompt; // save current prompt
					strings.prompt = strings.rootprompt;
				}
			}
			user.authorized = true;
			tools.storage.set('authorized', true, 'session'); // save authorized flag for session
			if (init !== true) {
				tools.hash.clear(); // remove command from location.hash
			}
			return -1; // do not save in hash
		},

		// easter egg, run command from /sbin/
		sudo: function(argv, cmd, std) {
			argv.shift(); // remove command name from argv

			if (argv.length > 0) {
				var command = argv[0];
				// if command in / -> run normally
				if (command in bin) {
					return bin[command].call(this, argv, cmd, std);
				} else
				// if command in /sbin/ -> run from /sbin/
				if ('/sbin/' + command in bin) {
					return bin['/sbin/' + command].call(this, argv, cmd, std);
				} else {
					std.err = Mustache.escape(argv[0]) + ': ' + _('commandnotfound');
				}
			} else {
				std.err = _('wrongarguments');
			}
		},

		// easter egg, cheating
		iddqd: function(argv, cmd, std) {
			std.err = argv[0] + ': ' + _('_cheater');
		},

		// easter egg, virus
		virus: function() {
			if (!state.virusruncount) {
				state.virusruncount = 0;
			}

			// print warning
			var messages = _('virus');
			if (state.virusruncount < messages.length - 1) {
				return messages[state.virusruncount++];
			}

			// print last warning
			view.row(messages[state.virusruncount], 'crap');
			$('html,body').animate({ 'scrollTop': view.$body.height() }, 'fast');

			// break console view
			user.logged = false;
			unbindEvents(); // unbind event listeners
			$('.row .command').addClass('disabled'); // remove all commands
			$('.cursor.waiting').remove(); // remove all waiting cursors if any
			$('.cursor').removeClass('cursor'); // remove current cursor
			$('.prompt').removeClass('prompt'); // remove prompt (in fact this will set pre-wrap style for prompt)

			// run virus

			var $body = $(document.body);

			// recursively wrap each letter into <span> tag
			function spanize(target) {
				var newtarget = $('<div></div>'),
				    nodes = target.contents();//.clone();
				nodes.each(function(i, v) {
					var $this = $(this);
					if (v.nodeType === 3) { // text
						var text = $this.text(),
						    letters = text.split('');
						for (var j = 0; j < letters.length; j++) {
							newtarget.append('<span class="letter">' + letters[j] + '</span>');
						}
					} else
					if (v.tagName === 'IMG') { // image
						newtarget.append($('<span class="letter"/>').append(v));
					} else { // recursion
						newtarget.append($this);
						$this.html(spanize($this));
					}
				});
				return newtarget.html();
			}
			$body.html(spanize($body));

			// animate letters
			$('.letter').on('mouseover', function() {
				var $this = $(this),
				    pos = $this.position(),
				    $l = $this.clone();

				// make duplicate of letter above real one, and hide real one
				$l.css({
					position: 'absolute',
					top: pos.top,
					left: pos.left
				}).appendTo($body);
				$this.off().css({ visibility: 'hidden' });

				// fall
				$l.animate({
					opacity: 0,
					top: '+=50'
				}, 1000, function() {
					$(this).remove();
				});
			});

			return -Number.MAX_VALUE; // this prevent from calling .done() callback -> no new prompt
		},

		// a moment of clarity from github
		zen: function() {
			var sh = this;
			// this is possible because of Access-Control-Allow-Origin:* header from github
			$.get('https://api.github.com/zen', function(data) {
				sh.done(data);
			});
			return 0;
		},

		// eval any javascript code from shell
		'eval': function(argv, cmd, std) {
			if (argv.length > 1) {
				var ret;
				try {
					/* jshint ignore:start */
					// indirect eval call, in global scope http://perfectionkills.com/global-eval-what-are-the-options/
					ret = (1,eval)(cmd.indexOf('/sbin/') === 0 ? cmd.substring(11) : cmd.substring(5));
					/* jshint ignore:end */
				} catch(e) {
					std.err = '' + e;
				}
				return '' + ret;
			}
			std.err = _('wrongarguments');
		}
	};

	var strings = {
		welcome: '',
		prompt: '$',
		rootprompt: '#',
		'.w': _('w'),
		'.who': _('who'),
		'.palette': _('palette'),
		'.ip': _('ip'),
		'.geoip': _('geoip'),
		'.dig': _('dig'),
		'.loginusage': _('loginusage'),
		'.logined': _('logined')
	};

	// collections of small helpful snippets
	var tools = {

		// tools to work with location.hash
		hash: {

			get: function() {
				var hash = window.location.hash;
				if (hash && hash !== '' && hash !== '#') {
					if (hash.charAt(0) === '#') {
						hash = hash.substring(1);
					}
					return hash;
				}
			},

			set: function(str) {
				// .replace() method change hash without affecting browser history
				window.location.replace('#' + encodeURIComponent(str));
			},

			clear: function() {
				// remove command from location.hash
				if (window.history && window.history.pushState) {
					window.history.pushState('', document.title, window.location.pathname);
				} else {
					window.location.replace('#');
				}
			}
		},

		// tools to work with browser storage
		storage: {

			get: function(key, where) {
				where = where || 'local';
				var store = window[where + 'Storage'],
				    getFunc = store ? store.getItem : $.cookie;

				return getFunc ? getFunc.call(store || $, key) : undefined;
			},

			set: function(key, value, where) {
				where = where || 'local';
				var store = window[where + 'Storage'],
				    setFunc = store ? store.setItem : $.cookie,
				    removeFunc = store ? store.removeItem : $.removeCookie;

				if (value === null || value === undefined) {
					return removeFunc ? removeFunc.call(store || $, key) : undefined;
				} else {
					// argument { expires: 365 } needed to set cookie for year
					// localStorage.setItem() function will ignore it (I hope :)
					return setFunc ? setFunc.call(store || $, key, value, where === 'local' ? { expires: 365 } : undefined) : undefined;
				}
			},

			// check, if browser has storage and json, to save information for future use
			canSave: window.localStorage && window.JSON && JSON.parse && JSON.stringify,

			// getter for objects, don't get objects from cookies
			take: function(key) {
				if (this.canSave) {
					try {
						return JSON.parse(localStorage.getItem(key));
					} catch(e) {}
				}
			},

			// setter for objects, don't save objects to cookies
			save: function(key, value) {
				if (this.canSave) {
					if (value === null || value === undefined) {
						localStorage.removeItem(key);
					} else {
						localStorage.setItem(key, JSON.stringify(value));
					}
				}
			}
		}
	};

	var config = {
		el: null, // == document.body
		historyLength: 10,
		hostname: window.location.host
	};

	var user = {
		logged: true, // is user logged in
		authorized: false, // is user authorized,
		login: _('userlogin'),
		name: undefined,
		ip: undefined,
		isGuest: function() {
			var logins = {'guest':1, 'гость':1};
			                              // 'this' may be 'E' object
			return (this.login in logins) || (this.user && this.user.login in logins);
		}
	};

	// global default scope for mustache templates
	var E = {

		// function for escaping in the console (allow use colors), used in mustache templates
		E: function () {
			// http://www.understudy.net/custom.html#color_prompts
			var colors = {
				'0': '', //'font-bold-off font-italic-off font-underline-off font-white background-black',
				'1': 'font-bold',
				'3': 'font-italic',
				'4': 'font-underline',
				'5': 'font-blink',
				'6': 'font-outline',
				'7': '', // Reverse Video on = ?
				'8': 'font-nondisplay',
				'9': 'font-strike',
				'22': 'font-bold-off',
				'23': 'font-italic-off',
				'24': 'font-underline-off', // :(
				'25': 'font-blink-off', // :(
				'27': '', // Inverse off
				'29': 'font-strike-off', // :(
				'30': 'font-black',
				'31': 'font-red',
				'32': 'font-green',
				'33': 'font-yellow',
				'34': 'font-blue',
				'35': 'font-magenta',
				'36': 'font-cyan',
				'37': 'font-white',
				'40': 'background-black',
				'41': 'background-red',
				'42': 'background-green',
				'43': 'background-yellow',
				'44': 'background-blue',
				'45': 'background-magenta',
				'46': 'background-cyan',
				'47': 'background-white'
			};
			return function(text, render) {
				var spanc = 0;
				text = text.replace(/\\(?:E|033)\[([\d;]+)m/g, function(str, m1) {
					var ds = m1.split(';'),
					    classname = [],
					    reset = false,
					    ret = '';
					for (var i = 0, length = ds.length; i < length; i++) {
						if (ds[i] in colors) {
							classname.push(colors[ds[i]]);
						}
						if (ds[i] === '0' && i === length - 1) {
							reset = true;
						}
					}
					if (!reset) {
						ret = '<span class="' + classname.join(' ') + '">';
					} else {
						while (spanc-- > 0) {
							ret += '</span>';
						}
					}
					spanc++;
					return ret;
				});
				while (spanc-- > 0) {
					text += '</span>';
				}
				return render(text);
			};
		},

		// last login date/time
		lastLogin: (function() {
			// get current date/time
			var d = new Date(),
			    day = d.getDay(),
			    month = d.getMonth(),
			    smonth = (month + 1).toString().length === 1 ? '0' + (month + 1) : '' + (month + 1),
			    date = d.getDate(),
			    sdate = date.toString().length === 1 ? '0' + date : '' + date,
			    year = d.getFullYear(),
			    minutes = d.getMinutes(),
			    hours = d.getHours(),
			    months = _('months'),
			    days = _('days');
			if (minutes.toString().length === 1) {
				minutes = '0' + minutes;
			}
			if (hours.toString().length === 1) {
				hours = '0' + hours;
			}

			// different formats
			var fulldate = days[day] + ' ' + months[month] + ' ' + date + ' ' + hours + ':' + minutes + ' ' + year,
			    shortdate = year + '-' + smonth + '-' + sdate + ' ' + hours + ':' + minutes,
			    time = hours + ':' + minutes,
			    cdate = {
			        'date': fulldate,
			        'short': shortdate,
			        'time': time
			    };

			// show last login date/time and save current
			var lastLogin;
			if (window.JSON) {
				lastLogin = tools.storage.get('lastLogin');
				tools.storage.set('lastLogin', JSON.stringify(cdate));
				try {
					lastLogin = JSON.parse(lastLogin);
				} catch(e) {}
			}
			if (!lastLogin) {
				lastLogin = {};
			}

			// extend last login information with current login information
			$.extend(lastLogin, {
				'currdate': fulldate,
				'currshort': shortdate,
				'currtime': time
			});

			return lastLogin;
		})(),

		// last login IP address
		lastIP: (function() {
			// show last login IP
			var lastIP = tools.storage.get('lastIP');

			// get current login IP
			$.ajax({
				url: 'bin/ip.php',
				dataType: 'text',
				success: function(data) {
					if (data.match(/^[\da-f\.:%]+$/)) {
						user.ip = data;
						tools.storage.set('lastIP', data);
					}
				}
			});

			return lastIP;
		})(),

		// hostname
		hostname: function() {
			return config.hostname;
		},

		// user
		user: user,

		// isMobile
		isMobile: false, // changes dynamically

		// language flag icon (of change to language, not current language)
		flag: _('flag'),

		// application version
		version: version

	};

	// Return rendered string by string identifier
	function str(s, scope, extstrings) {
		var view = scope ? $.extend({}, E, scope) : E, // always escape strings
		    ret = '';

		s = (extstrings !== undefined && (s in extstrings)) ? extstrings[s] : ((s in strings) ? strings[s] : null);
		if (s !== null) {
			if (typeof s === 'string') {
				ret = s;
			} else
			if ($.isArray(s)) {
				var nstr = [];
				for (var i = 0, length = s.length; i < length; i++) {
					if (typeof s[i] === 'string') { // string
						nstr.push(s[i]);
					} else
					if ($.isArray(s[i])) { // nested array with strings -> just get all strings from it
						for (var j = 0, l = s[i].length; j < l; j++) {
							nstr.push(s[i][j]);
						}
					} else
					if (typeof s[i] === 'object') { // object with scope
						view = $.extend({}, view, s[i]);
					}
				}
				ret = nstr.join('<br>');
			}
			ret = Mustache.render(ret, view);
		}
		return ret;
	}

	// object with current shell state
	var state = {
		cmd: '', // current command
		cursorPosition: 0, // current cursor position

		cmdToArgv: function() {
			var argv = [],
			    cmd = this.cmd.trim(),
			    len = cmd ? cmd.length : 0,
			    quoted = false,
			    arg = '',
			    ch;

			// if command is empty -> return empty array
			if (len === 0) {
				return argv;
			}

			// if there is no quotes in command -> just split by spaces
			if (cmd.indexOf('"') == -1 && cmd.indexOf('\'') == -1) {
				return cmd.split(/\s+/);
			}

			// else divide command with quotes
			for (var i = 0; i < len; i++) {
				ch = cmd.charAt(i);
				if (ch == '"' || ch == '\'') {
					if (arg.length > 0) {
						argv.push(arg);
						arg = '';
					}
					quoted = !quoted;
				} else
				if (/\s/.test(ch)) {
					if (quoted) {
						arg += ch;
					} else
					if (arg.length > 0) {
						argv.push(arg);
						arg = '';
					}
				} else {
					arg += ch;
				}
			}
			if (arg.length > 0) {
				argv.push(arg);
			}
			return argv;
		},

		// get part of command before cursor
		before: function(skipBeforeCursor) {
			var pos = this.cursorPosition;
			if (skipBeforeCursor === true) {
				pos--;
			}
			return pos >= 0 ? this.cmd.substring(0, pos) : '';
		},

		// return symbol under cursor
		inner: function() {
			return this.cursorPosition < this.cmd.length ? this.cmd.charAt(this.cursorPosition) : ' ';
		},

		// get part of command after cursor
		after: function(skipCursor) {
			var pos = this.cursorPosition;
			if (skipCursor === true) {
				pos++;
			}
			return pos < this.cmd.length ? this.cmd.substring(pos) : '';
		},

		// reset state
		reset: function() {
			this.cmd = '';
			this.cursorPosition = 0;
		}
	};

	// object for command history interaction
	var history = {
		h: [],
		historyLength: config.historyLength,
		historyPosition: -1,

		// initialize history
		init: function() {
			var me = this;
			if (config.historyLength !== me.historyLength) {
				me.historyLength = config.historyLength;
			}

			me.h = tools.storage.take('history');
			if (me.h) {
				// crop to historyLength
				if (me.h.length > me.historyLength) {
					me.h = me.h.slice(-me.historyLength);
				}
			}

			if (!$.isArray(me.h)) {
				me.h = [];
			}
		},

		// reset history position
		reset: function() {
			this.historyPosition = -1;
		},

		// put new command to history
		put: function(cmd) {
			var me = this;
			if (cmd != me.h[me.h.length - 1]) {
				me.h.push(cmd);
			}
			if (me.h.length > me.historyLength) {
				me.h.shift();
			}
			tools.storage.save('history', me.h);
		},

		// get command from history
		get: function(direction, substr) {
			var me = this,
			    length = me.h.length,
			    i;
			if (me.historyPosition == -1) {
				me.historyPosition = length;
			}
			if (direction >= 0) { // -> get forward element
				if (substr && substr !== '') {
					for (i = me.historyPosition + 1; i < length; i++) {
						if (me.h[i].indexOf(substr) === 0) {
							me.historyPosition = i;
							return me.h[me.historyPosition];
						}
					}
				} else {
					if (me.historyPosition + 1 < length) {
						me.historyPosition++;
						return me.h[me.historyPosition];
					} else {
						me.historyPosition = length;
						return '';
					}
				}
			} else { // -> get backward element
				if (substr && substr !== '') {
					for (i = me.historyPosition - 1; i >= 0; i--) {
						if (me.h[i].indexOf(substr) === 0) {
							me.historyPosition = i;
							return me.h[me.historyPosition];
						}
					}
				} else {
					if (me.historyPosition - 1 >= 0) {
						me.historyPosition--;
						return me.h[me.historyPosition];
					}
				}
			}
			return undefined;
		},

		// return all history array
		all: function() {
			return this.h;
		},

		// clear command history
		clear: function() {
			this.h = [];
			tools.storage.save('history', null);
		}
	};

	// object for interface interaction
	var view = {
		$body: null,

		// initizlize view
		init: function() {
			var me = this;

			me.$body = config.el ? $(config.el) : me.$body = $(document.body);

			// bind event listeners
			bindEvents();

			// print welcome message, if exists, and print prompt
			var welcome = str('welcome');
			if (welcome && welcome !== '') {
				me.row(welcome);
			}
			me.prompt();
		},

		// command click event listener
		onCommandClick: function(e) {
			var me = e.data.scope,
			    $this = $(this),
			    command = $this.data('command') || $this.text();

			if (config.isMobile) {
				me.$body.find('.altcmdline')
					.val(command)
					.trigger('input');

				// scroll down
				$('html,body').animate({ 'scrollTop': me.$body.height() }, 'fast');
			} else {
				me.set(command);
			}
		},

		// "enter" button click
		onEnterClick: function(e) {
			var me = e.data.scope;
			if (config.isMobile) {
				me.$body.find('.altcmdform').submit();
			} else {
				me.execute();
			}
		},

		// clear shell
		clear: function() {
			this.$body.find('.row').remove();
		},

		// print "row"
		row: function(s, className) {
			var rowEl = '<div class="row ' + (className || '') + '">' + s + '</div>',
			    $c = this.$body.find('.cursor.waiting');
			if ($c.length !== 0) { // there is waiting cursor -> add row _before_ it
				$c.parent().before(rowEl);
			} else { // no waiting cursor -> simply add row
				this.$body.append(rowEl);
			}
		},

		// print shell prompt
		prompt: function() {
			var me = this;

			// remove mobile input element
			if (config.isMobile) {
				// me.$body.find('.altcmdline').remove();
				me.$body.find('.altcmdform').remove();
			}

			me.$body.find('.enter').remove(); // remove "enter" button
			me.$body.find('.input').removeClass('input');
			if (user.logged) {
				me.row('<span class="prompt">' + str('prompt') + '</span> <span class="input"></span>');
				state.reset();
				history.reset();
				me.updateCmd();
			} else {
				me.row(_('loggedout'));
			}

			// scroll down
			$('html,body').animate({ 'scrollTop': this.$body.height() }, 'fast');
		},

		// get or set cursor position
		cursor: function(pos) {
			var me = this;

			// if called without parameters -> return cursor position
			if (undefined === pos) {
				return state.cursorPosition;
			}

			// set cursor position (relative)
			if (typeof pos === 'number') {
				pos = state.cursorPosition + pos;
				if (pos > state.cmd.length) {
					pos = state.cmd.length;
				}
				if (pos < 0) {
					pos = 0;
				}
				state.cursorPosition = pos;

			// smart move cursor
			} else {
				var moveTo = null;

				// move cursor forward one word on the current line
				if (pos === '+w') {
					(state.cmd + ' ').replace(/[^\s]\s/g, function(str, offset) { // nothing replace, but find offset
						if (!moveTo && offset >= state.cursorPosition) {
							moveTo = offset + 1;
						}
					});
				} else

				// move cursor backward one word on the current line
				if (pos === '-w') {
					(' ' + state.cmd).replace(/\s[^\s]/g, function(str, offset) { // nothing replace, but find offset
						if (offset < state.cursorPosition) {
							moveTo = offset;
						}
					});
				}

				if (moveTo !== null) {
					state.cursorPosition = moveTo;
				}
			}
			me.updateCmd();
		},

		// put char/string in the cursor position
		put: function(s) {
			state.cmd = state.before() + s + state.after();
			state.cursorPosition += s.length;
			this.updateCmd();
		},

		// set command
		set: function(cmd) {
			state.cmd = cmd;
			state.cursorPosition = cmd.length;
			this.updateCmd();
		},

		// delete symbol after (under) cursor
		deleleAfter: function() {
			state.cmd = state.before() + state.after(true);
			this.updateCmd();
		},

		// clear the line after the cursor
		deleteAllAfter: function() {
			state.cmd = state.before();
			this.updateCmd();
		},

		// delete symbol before cursor
		deleteBefore: function() {
			state.cmd = state.before(true) + state.after();
			if (state.cursorPosition > 0) {
				state.cursorPosition--;
			}
			this.updateCmd();
		},

		// clears the line before the cursor position
		deleteAllBefore: function() {
			state.cmd = state.after();
			state.cursorPosition = 0;
			this.updateCmd();
		},

		// synchronize current state command and view
		updateCmd: function() {
			var me = this;

			me.$body.find('.input').html(
				(config.isMobile ?
					// input element for mobile software keyboard
					'<form class="altcmdform"><input type="text" name="altcmdline" class="altcmdline"></form>'
						:
					// ordinary cursor
					Mustache.escape(state.before()) +
					'<span class="cursor">' + Mustache.escape(state.inner()) + '</span>' +
					Mustache.escape(state.after(true))
				) +
				'<span class="enter">&nbsp;&#8626;</span>' // add "enter" button
			);

			// activate alternative input for mobile devices
			if (config.isMobile) {
				me.$body.find('.altcmdline').on('input', function() {
					var $el = $(this),
					    val = $el.val(),
					    len = val.length > 2 ? val.length : 2;
					$el.width(len * 9); // assume 9px -> single letter width
				});
				me.$body.find('.altcmdform').on('submit', function() {
					var $el = $(this.altcmdline),
					    val = $el.val();
					me.set(val);
					me.execute();
					return false;
				});
			}

			// scroll down
			$('html,body').animate({ 'scrollTop': me.$body.height() }, 'fast');
		},

		// get command from history
		historyCmd: function(direstion) {
			var me = this,
			    pos = state.cursorPosition,
			    cmd = state.cmd,
			    part = cmd.substring(0, pos).trim(),
			    newcmd = history.get(direstion, part);
			if (typeof newcmd === 'string') {
				state.cmd = newcmd;
				//if (part == '')
				//	me.cursor(newcmd.length);
				me.updateCmd();
			}
		},

		// generate floating divs with hint commands
		hintDivs: function(arr, prefix, notcommands) {
			var ret = [];
			arr.sort();
			for (var i = 0, l = arr.length; i < l; i++) {
				ret.push(
					'<div class="hint">' +
						(!notcommands ? '<span class="command">' : '') +
						(prefix ? prefix + ' ' : '') + arr[i] +
						(!notcommands ? '</span>' : '') +
					'</div>'
				);
			}
			return ret.join('') + '<br>';
		},

		// show command hint
		hint: function() {
			var me = this,
			    pos = state.cursorPosition,
			    cmd = state.cmd,
			    part = cmd.substring(0, pos).trim(), // entered part of command
			    firstcommand = cmd.match(/^\s*[^\s]+/), // first word in command line
			    command, i, c, coincident;
			if (firstcommand) {
				firstcommand = firstcommand[0];
				command = firstcommand.trim();
			}

			// find longest coincident sequence among strings
			function getCoincident(strings, initial) {
				var coincident = initial,
				    tcoincident,
				    coincidentLength = coincident.length;

				outer:
				for (var j = coincidentLength + 1, l0 = strings[0].length; j <= l0; j++) {
					tcoincident = strings[0].substring(0, j);
					for (var i = 1, l = strings.length; i < l; i++) {
						if (strings[i].length > 0 && strings[i].indexOf(tcoincident) !== 0) {
							break outer;
						}
					}
					coincident = tcoincident;
				}

				return coincident;
			}

			// if there is nothing entered, or cursor is under command (not command options)
			if (part.length === 0 || (firstcommand && pos <= firstcommand.length)) {
				var bins = [];

				// get all appropriate commands
				for (c in bin) {
					// do not show /sbin/.. commands if user do not authorized or not start with '/s' it manually
					// also do not show commands with 'hidden' property
					if (typeof bin[c] === 'function' &&
						(part.indexOf('/s') === 0 || c.indexOf('/sbin/') !== 0 || user.authorized) &&
						((bin[c + 'Property'] && !bin[c + 'Property'].hidden) || !bin[c + 'Property'])) {
						if (part.length === 0 || c.indexOf(part) === 0) {
							bins.push(c);
						}
					}
				}

				// if there is only command -> type it
				if (bins.length === 1) {
					me.put(bins[0].substring(part.length) + ' ');
				} else

				// if there are many commands -> show hint table
				if (bins.length > 1) {
					// show hints
					me.row(me.hintDivs(bins));
					me.prompt();

					// find longest coincident sequence and type it
					coincident = getCoincident(bins, part);
					if (coincident !== part) {
						cmd += coincident.substring(part.length);
					}

					// restore and update command
					me.put(cmd);
				}
			} else

			// hint for command, if exists
			if (firstcommand && pos > firstcommand.length && command in bin && $.isArray(bin[command + 'Hint'])) {
				var allhints = bin[command + 'Hint'],
				    hints = [],
				    optPart = part.replace(command, '').trim();

				// get all appropriate options
				for (i = allhints.length; i--;) {
					if (optPart.length === 0 || allhints[i].indexOf(optPart) === 0) {
						hints.push(allhints[i]);
					}
				}

				// if there is only option -> type it
				if (hints.length === 1) {
					me.put(hints[0].substring(optPart.length));
				} else

				// if there are many commands -> show hint table
				if (hints.length > 1) {
					// show hits
					me.row(me.hintDivs(hints, command));
					me.prompt();

					// find longest coincident sequence and type it
					coincident = getCoincident(hints, optPart);
					if (coincident !== optPart) {
						cmd += coincident.substring(optPart.length);
					}

					// restore and update command
					me.put(cmd);
				}
			}
		},

		// execute command
		execute: function() {
			var me = this;

			// show rotating waiting cursor
			function waitingCursor() {
				var texts = ['/', '-', '\\', '|'],
				    $c = me.$body.find('.cursor.waiting');
				if ($c.length > 0) {
					$c.each(function() {
						var $this = $(this),
						    text = $this.text(),
						    index = texts.indexOf(text) + 1;
						if (index === texts.length) {
							index = 0;
						}
						$this.text(texts[index]);
					});
					view.waitingCursorTimeoutId = window.setTimeout(waitingCursor, 100);
				} else {
					delete view.waitingCursorTimeoutId;
				}
			}

			var argv = state.cmdToArgv(),
			    cmd = state.cmd.trim(),
			    command = argv.length > 0 ? argv[0] : null,
			    result;
			if (command && command !== '') {
				if (command in bin && typeof bin[command] === 'function') {
					// show 'waiting' non-blocking cursor
					me.row('<span class="cursor waiting">/</span>');
					if (view.waitingCursorTimeoutId === undefined) {
						view.waitingCursorTimeoutId = window.setTimeout(waitingCursor, 100);
					}

					// execute command
					var std = {
						out: null,
						err: null
					};
					result = bin[command].call(Sh, argv, cmd, std);

					// if returned result === 0 -> command runs asynchronously, we should wait for result
					// if returned result === -Number.MAX_VALUE -> like kernel panic :)
					// else get returned result and print it if any
					if (result !== 0 && result !== -Number.MAX_VALUE) {
						window.setTimeout(function() {
							me.done(result, std);
						}, 1);
					}
				} else {
					window.setTimeout(function() {
						me.done(undefined, {
							err: Mustache.escape(command) + ': ' + _('commandnotfound')
						});
					}, 1);
				}

				// set as interactive command
				if (user.logged) {
					var before = state.cmd.substring(0, state.cmd.indexOf(command)),
					    inner = state.cmd.substring(before.length).replace(/\s*\s+$/, '');
					me.$body.find('.input').html(
						Mustache.escape(before) +
						'<span class="command" style="margin:0 -2px">' +
						Mustache.escape(inner) +
						'</span>'
					);
				}

				// add to history
				history.put(cmd);

				// add command as location hash
				// if returned result < 0 -> some error, don't set hash
				if (user.logged && (typeof result !== 'number' || result >= 0)) {
					tools.hash.set(cmd);
				}

			} else { // == if (!command || command === '') -> just hit enter
				tools.hash.clear(); // remove command from location.hash
				me.done();
			}

			state.reset();
			history.reset();
		},

		// asynchronous command execution done callback
		done: function(result, std, className) {
			var me = this;

			// remove all waiting cursors if any
			me.$body.find('.cursor.waiting').remove();

			// print returned result if any
			if (typeof std === 'object') {
				// print stdout
				if (std.out && std.out.length > 0) {
					me.row(std.out, className);
				}
				// print stderr
				if (std.err && std.err.length > 0) {
					me.row('<span class="error">' + std.err + '</span>');
				}
			}
			// print returned value
			if (typeof result === 'string' && result.length > 0) {
				me.row(result, className);
			}

			me.prompt();
		},

		// do login
		/* jshint ignore:start */
		login: function(network) {
			//TODO
			// hm... nothing to do here?
		},
		/* jshint ignore:end */

		// do logout
		logout: function() {
			user.logged = false;

			// unbind event listeners
			unbindEvents();

			// remove all commands
			$('.row .command').addClass('disabled');

			tools.hash.clear(); // remove command from location.hash

			// try to close window
			// window.close();
		}

	};

	// bind keys event listeners
	function bindEvents() {

		// callback for special keys
		function specialKeys(e, combo) {
			switch (combo) {

				// cursor manipulation
				case 'end':
				case 'ctrl+e': // go to the end of the line you are currently typing on
					view.cursor(Number.MAX_VALUE);
					break;
				case 'home':
				case 'ctrl+a': // go to the beginning of the line you are currently typing on
					view.cursor(-Number.MAX_VALUE);
					break;
				case 'left':
					view.cursor(-1);
					break;
				case 'right':
					view.cursor(+1);
					break;
				case 'alt+f': // move cursor forward one word on the current line
					view.cursor('+w');
					break;
				case 'alt+b': // move cursor backward one word on the current line
					view.cursor('-w');
					break;

				// command manipulation
				case 'backspace':
				case 'ctrl+h': // same as backspace
					view.deleteBefore();
					break;
				case 'del':
					view.deleleAfter();
					break;
				case 'ctrl+k': // clear the line after the cursor
					view.deleteAllAfter();
					break;
				case 'ctrl+u': // clears the line before the cursor position
					view.deleteAllBefore();
					break;
				// case 'ctrl+t': // swap the last two characters before the cursor // -> default 'new tab'
				// case 'esc t': // swap the last two words before the cursor // conflicts with 'show hint'
				// case 'ctrl+w': // delete the word before the cursor // -> default 'close tab'
				case 'space':
					view.put(' ');
					break;

				// show hint
				case 'tab': // auto-complete
				case 'esc':
					view.hint();
					break;

				// history manipulation
				case 'up':
					view.historyCmd(-1);
					break;
				case 'down':
					view.historyCmd(+1);
					break;
				// case 'ctrl+r': // let’s you search through previously used commands // -> default 'reload page'

				// execute smth
				case 'ctrl+l': // clears the screen, similar to the clear command
					view.set('clear');
					view.execute();
					break;
				case 'ctrl+d': // exit the current shell
					view.set('logout');
					view.execute();
					break;
				case 'enter':
					view.execute();
					break;
				// case 'ctrl+c': // kill whatever you are running
				// case 'ctrl+z': // puts whatever you are running into a suspended background process. fg restores it.
			}
			return false;
		}

		// callback for usual keys
		function usualKeys(e) {
			view.put(String.fromCharCode(e.which));
			return false;
		}

		// bind mouse click on command
		view.$body.on('click', '.row .command', { scope: view }, view.onCommandClick);

		// bind mouse click on "enter" button
		view.$body.on('click', '.enter', { scope: view }, view.onEnterClick);

		// if this is mobile device -> do not bind any keyboard events, just return
		if (config.isMobile) {
			return;
		}

		// bind special keys
		Mousetrap.bind([
			'end', 'home', 'left', 'right', 'ctrl+a', 'ctrl+e', 'alt+f', 'alt+b',
			'backspace', 'ctrl+h', 'del', 'ctrl+u', 'ctrl+k', 'space', // 'ctrl+t', 'esc t', 'ctrl+w',
			'tab', 'esc',
			'up', 'down', // 'ctrl+r',
			'ctrl+l', 'ctrl+d', 'enter' //, 'ctrl+c', 'ctrl+z'
		], specialKeys);

		// usual keys
		var numbers = '1234567890'.split(''),
		    english = 'abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ'.split(''),
		    // russian = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ',
		    russian = (function() {
		    	var codes = [1025, 1105]; // Ё, ё
		    	for (var i = 1040; i <= 1103; i++) { // А-Яа-я
		    		codes.push(i);
		    	}
		    	return codes.map(function(c) {
		    		return String.fromCharCode(c);
		    	});
		    })(),
		    symbols = '!";%:?*()_+-=@#$^&{}[]\\|/:;\'<>,.~`'.split('').concat(String.fromCharCode(8470)); // №

		// bind usual keys
		Mousetrap.bind(numbers.concat(english, russian, symbols), usualKeys);

		// bind paste event
		// http://stackoverflow.com/a/258325
		// listens ctrl+v and shift+ins events and transfer focus to a hidden textarea to get pasted text
		Mousetrap.bind(['mod+v', 'shift+ins'], function() {
			// get textarea and focus it
			var $textarea = $('#clipboarddata');
			if ($textarea.length === 0) {
				$textarea = $('<textarea/>', {
					id: 'clipboarddata'
				}).appendTo(view.$body);
			}
			$textarea.focus();

			if ($textarea.length !== 0) {
				// wait a bit, get text, clear and unfocus textarea
				window.setTimeout(function() {
					var text = $textarea.val();
					$textarea.val('');
					$textarea.blur();
					view.put(text);
				}, 10);
			}
		});

		// easter egg, doom2 god mode
		Mousetrap.bind('alt+i d d q d', function() {
			// show doom2 banner
			if ($('#doom2banner').length === 0) {
				$('<img/>', {
					id: 'doom2banner',
					src: 'img/doom.png',
					width: '640px',
					height: '77px',
					css: {
						position: 'fixed',
						left: ($(window).width() - 640) / 2,
						bottom: 0
					}
				}).appendTo(view.$body);
			}

			// execute 'su' command
			bin.su.call(Sh);
			view.row(_('_godmode'));
			view.set('');
			view.execute();
			return false;
		});

		//TODO add Konami Code
		// https://en.wikipedia.org/wiki/Konami_Code
		// ↑↑↓↓←→←→ba
		// maybe use https://github.com/mikeflynn/egg.js
	}

	// unbind keys event listeners
	function unbindEvents() {
		Mousetrap.reset();

		// unbind mouse click from command
		view.$body.off('click', '.row .command', view.onCommandClick);

		// unbind mouse click from "enter" button
		view.$body.off('click', '.enter', { scope: view }, view.onEnterClick);
	}

	/************************************************************************************
	 * Public interface
	 */
	var Sh = {

		// initialize shell
		init: function(conf) {

			if (typeof conf === 'object') {
				// extend executables
				if (conf.bin) {
					$.extend(bin, conf.bin);
					delete conf.bin;
				}

				// extend strings
				if (conf.strings) {
					$.extend(strings, conf.strings);
					delete conf.strings;
				}

				// extend config
				$.extend(config, conf);
			}

			// mobile browser detection
			config.isMobile = E.isMobile = navigator.userAgent.match(/Android|iPhone|iPad|iPod|MIDP|IEMobile|BlackBerry|ARM/i); // Opera Mini

			// initialize 'bin' command collection
			var _common;
			if (bin.init) {
				var f;
				for (f in bin.init) {
					if (typeof bin.init[f] === 'function' && f.indexOf('__') !== 0) { // don't start __function
						if (f === '_common') { // '_common' function runs in the end, after all others
							_common = bin.init[f];
						} else {
							bin.init[f]();
						}
					}
				}
			}
			if (_common !== undefined) {
				_common(); // run common init function
			}

			// if user was authorized in session -> authorize user
			if (tools.storage.get('authorized', 'session')) {
				user.login = tools.storage.get('login', 'session') || 'root';
				bin.su(true); // execute 'su' command
			}

			history.init();
			view.init();

			// get and execute command from hash
			var hash = tools.hash.get();
			if (hash) {
				var cmd = decodeURIComponent(hash),
				    command = cmd.match(/^\s*[^\s]+/);
				if (command) {
					command = command[0].trim();
				}

				// if there is no such command in binaries -> try to find it in commands properties
				// may be this is command on different language
				if (!(command in bin)) {
					var c, lang;
					for (c in bin) {
						if (c.indexOf('Property') !== -1) {
							for (lang in bin[c]) {
								if (bin[c][lang] === command) {
									// change language to new
									_.set(lang);
									window.location.reload();
									return;
								}
							}
						}
					}
				}

				view.set(cmd);
				view.execute();
			}
		},

		// Return rendered string by string identifier
		str: function() {
			return str.apply(this, arguments);
		},

		// expose user object
		user: user,

		// expose asynchronous command execution done callback
		done: function() {
			view.done.apply(view, arguments);
		},

		// expose row command for asynchronous command execution
		row: function() {
			view.row.apply(view, arguments);
		}
	};

	// expose Sh to the global scope
	window.Sh = Sh;

})(window, document, navigator);
