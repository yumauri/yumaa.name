/* jshint browser: true, jquery: true, -W099, smarttabs: true, undef: true, unused: true, bitwise: true, curly: true, quotmark: single, trailing: true */
/* global Sh */
$(document).ready(function() {
	'use strict';

	// get _ from the global scope
	var _ = window._;

	// activate 'more...' icon for contacts
	$(document.body).on('click', '.socialicon.more', function() {
		var $me = $(this);
		$me.parent().find('.hidden').show(); // show all hidden icons
		$me.remove(); // remove 'more...' icon
		return false;
	});

	// ie<=8
	if (navigator.userAgent.match(/MSIE [678]\.\d/)) {
		// get command from hash, if any
		var hash = window.location.hash,
		    cmd, command;
		if (hash && hash !== '' && hash !== '#') {
			if (hash.charAt(0) === '#') {
				hash = hash.substring(1);
			}
			cmd = decodeURIComponent(hash);
			command = cmd.match(/^\s*[^\s]+/);
			if (command) {
				command = command[0].replace(/^\s+|\s+$/g, ''); // .trim()
			}

			// only can print message, can't execute commands, so check only strings
			if (!(command in Strings)) {
				cmd = null;
				command = null;
			}
		}

		// print messages and exit
		var _str = function(s) {
		    	return Sh.str(s, undefined, Strings);
		    };
		$(document.body).append(
			'<div class="row">' + _str('welcome') + '</div>' +
			'<div class="row"><span class="prompt">' + _str('prompt') + '</span> ' +
			(cmd ? '<span class="input">' + cmd + '</span>' : '') + '</div>' +
			(command ? '<div class="row">' + _str(command) + '</div><div class="row">' + _str('prompt') + '</div>' : '') +
			'<div class="row">' + _str('ie8') + '</div>' +
			'<div class="row">logged out</div>'
		);
		$('.row .command').addClass('disabled');
		return;
	}

	var emailHref,
	    emailTarget,
	    chest = {};

	var bin = {

		// print about information
		aboutProperty: { ru: 'о', en: 'about' },
		about: function() {
			return this.str('about');
		},

		// print contacts
		contactsProperty: { ru: 'контакты', en: 'contacts' },
		contacts: function() {
			var ret = this.str('contacts');

			// replace '@ma.il' in contacts
			// prevent spambots from getting real address from i18n.js file
			ret = ret.replace('@ma.il', '@gmail.com');

			// change email, if need to
			if (emailHref && emailHref !== 'mailto:not@ma.il') {
				// replace email address in contacts
				ret = ret.replace(
					/href="mailto:([^"]+)"/,
					'href="' + emailHref + '"' + (emailTarget ? ' target="' + emailTarget + '"' : '')
				);
			}

			// get changed (or unchanged) address from fake 'mailto:' link (see explanation in the index.html)
			if (!emailHref) {
				window.setTimeout(function() { // after 0.5 seconds
					var $fake = $('#mailtonotmail');
					if ($fake.length === 1) {
						emailHref = $fake.attr('href');
						emailTarget = $fake.attr('target');

						if (emailHref && emailHref !== 'mailto:not@ma.il') {
							var addr = ret.match(/href="mailto:([^"]+)"/); // get real address
							if (addr) {
								emailHref = emailHref.replace('not@ma.il', addr[1]); // replace fake address to real

								// change all currently printed 'mailto:' links
								$('.socialicon.email > a').each(function() {
									var $this = $(this);
									$this.attr('href', emailHref);
									if (emailTarget) {
										$this.attr('target', emailTarget);
									}
								});
							}
						}

						// remove fake link
						$fake.remove();
					}
				}, 500);

				// prevent further fast setTimeout execution
				emailHref = 'mailto:not@ma.il';
			}

			return ret;
		},

		// print projects
		projectsProperty: { ru: 'проекты', en: 'projects' },
		projects: function() {
			return this.str('projects');
		},

		// print help
		helpProperty: { ru: 'помощь', en: 'help' },
		help: function() {
			return this.str('help');
		},

		// page information
		infoProperty: { ru: 'инфо', en: 'info' },
		info: function() {
			return this.str('info');
		},

		// print Ami
		amiProperty: { ru: 'ами', en: 'ami' },
		ami: function() {
			var sh = this;

			if (!chest.amicssloaded) {
				// load css
				$('<link>')
					.appendTo('head')
					.attr({ type: 'text/css', rel: 'stylesheet' })
					.attr('href', 'bin/ami.php?css');
				chest.amicssloaded = true;
			}

			if (!chest.amidata) {
				// load Ami
				$.ajax({
					url: 'bin/ami.php?body',
					dataType: 'text',
					timeout: 5000, // 5 seconds
					success: function(data) {
						chest.amidata = data;
						sh.done(data, void 0, 'ami');
					},
					error: function(jqXHR, textStatus, errorThrown) {
						sh.done(void 0, {
							err: jqXHR.status + ' ' + textStatus + ': ' + errorThrown
						});
					}
				});

			} else {
				window.setTimeout(function() {
					sh.done(chest.amidata, void 0, 'ami');
				}, 1);
			}
			return 0;
		},

		// change font
		funfontHint: ['on', 'off'],
		funfont: function(argv) {
			var mode = 'on',
			    $body = $(document.body),
			    l = argv.length;
			if (l == 2 && argv[1] == 'off') {
				mode = 'off';
			}

			if (!chest.bodyoriginalfont && mode !== 'off') {
				chest.bodyoriginalfont = $body.css('font-family');
			}

			if (!chest.funfontcssloaded && mode !== 'off') {
				// load css
				$('<link>')
					.appendTo('head')
					.attr({ type: 'text/css', rel: 'stylesheet' })
					.attr('href', 'css/ownhand.css');
				chest.funfontcssloaded = true;
				window.setTimeout(function() { // wait a second while css is loaded
					chest.bodyfunfont = $body.css('font-family');
				}, 1000);
			}

			if (chest.bodyoriginalfont && chest.bodyfunfont) {
				if (mode === 'off') {
					$body.css('font-family', chest.bodyoriginalfont);
				} else {
					$body.css('font-family', chest.bodyfunfont);
				}
				
			}
		}
	};

	// quest part -------------------------------------------------------------
	$.extend(bin, (function() {

		// test answers and give next questions
		function testQ(argv, cmd, std, q, a) {
			var re = new RegExp(atob(q), 'i');
			if (re.test(cmd)) {
				return atob(a);
			} else {
				std.err = argv[0] + ': ' + _('commandnotfound');
			}
		}

		// commands = answers
		var q = 'q',
		    ret = {
		    	zpv/*=you*/: function(argv, cmd, std) {
		    		return testQ(argv, cmd, std, _(q + '1'), _(q + '2'));
		    	},
		    	uif/*=the*/: function(argv, cmd, std) {
		    		return testQ(argv, cmd, std, _(q + '3'), _(q + '4'));
		    	},
		    	tvnnfs/*=summer*/: function() { // hint for the first question
		    		return atob(_(q + '5'));
		    	}
		    }, k, k1;

		// shift keys 1 letter back (b->a, c->b, etc), chunk of caesar crypt function
		for (k in ret) {
			k1 = '';
			for (var i = 0; i < k.length; i++) {
				k1 += String.fromCharCode(k.charCodeAt(i) - 1);
			}
			ret[k1] = ret[k];
			delete ret[k];
		}

		// add commands started with uppercase letter
		for (k in ret) {
			ret[k.substring(0, 1).toUpperCase() + k.substring(1)] = ret[k];
		}

		// add hidden property for every command
		for (k in ret) {
			ret[k + 'Property'] = { hidden: true };
		}

		return ret;
	})());
	//-------------------------------------------------------------------------

	// console initialization
	Sh.init({
		strings: Strings,
		bin: bin
	});

	// remove <noscript> tags
	$('noscript').remove();

	// remove _ from global scope ]:->
	delete window._;
});

// strings for shell
var Strings = (function(navigator) {

	// get _ from the global scope
	var _ = window._;

	return {
		welcome: [
			_('welcome'),
			{
				userAgent: navigator.userAgent,
				browser: navigator.yu_browser_small
			}
		],
		ie8: [
			_('ie8'),
			{
				years: (function() {
					var ua = navigator.userAgent,
					    year = ua.indexOf('MSIE 6.') > 0 ? 2001 : (ua.indexOf('MSIE 7.') > 0 ? 2006 : (ua.indexOf('MSIE 8.') > 0 ? 2009 : 0)),
					    diff = new Date().getFullYear() - year;
					return {
						year: year,
						diff: diff
					};
				})()
			}
		],
		prompt: _('prompt'),
		rootprompt: _('rootprompt'),
		README: _('README'),
		quest: window.atob ? _('quest') : 'No quest for you :( Try to change your browser',
		about: [
			_('about'),
			{
				greetings: function() {
					var permanent = _('permanent_greetings'),
					    _timebased = _('timebased_greetings'),
					    timebased = [
					    	[0, 3, _timebased[3]],
					    	[4, 11, _timebased[0]],
					    	[12, 17, _timebased[1]],
					    	[18, 22, _timebased[2]],
					    	[23, 24, _timebased[3]]
					    ],
					    use = Math.round(Math.random() * permanent.length);
	
					if (use < permanent.length) {
						return permanent[use];
					} else {
						var hr = new Date().getHours();
						for (var i = 0; i < timebased.length; i++) {
							if (hr >= timebased[i][0] && hr <= timebased[i][1]) {
								return timebased[i][2];
							}
						}
					}
	
					return permanent[0];
				}
			}
		],
		contacts: _('contacts'),
		projects: _('projects'),
		help: _('help'),
		info: _('info')
	};
})(navigator);

// print greetings to console
if (window.console && window.console.log) {
	window.console.log('You know that road. You know exactly where it ends. And I know that\'s not where you want to be...');
}
