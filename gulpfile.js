var gulp = require('gulp'),
    uglify = require('gulp-uglify'), // minifier for javascript
    concat = require('gulp-concat'), // file concatination
    less = require('gulp-less'), // less processor
    csso = require('gulp-csso'), // minifier for css
    rename = require('gulp-rename'), // rename files
    htmlmin = require('gulp-htmlmin'), // minifier for html
    replace = require('gulp-replace'), // replace strings
	htmlreplace = require('gulp-html-replace'), // replace js and css
    imagemin = require('gulp-imagemin'); // minifier for images

var paths = {
	build: 'build/',
	js: [
		// 'js/less-1.6.1.min.js', // less not required
		'js/jquery-1.11.3.min.js',
		'js/jquery.cookie.js',
		'js/mousetrap.min.js',
		'js/mustache.min.js',
		'js/i18n.js',
		'js/sh.js',
		'js/app.js',
	],
	minjs: 'app.js',
	img: 'img/*.png',
	css: 'css/sh.less',
	mincss: 'app.css',
	html: 'index.php',
	other: [
		'.htaccess',
		'fonts/*.*',
		'bin/**',
		'img/favicon.ico',
		'img/*.jpg', // don't want compress .jpg files
		'css/ownhand.css', // css for funny font
		'js/test-AdTracking.js' // adBlock EasyPrivacy list check
	]
};

// minify and copy all javascript files into big single one
gulp.task('js', function() {
	return gulp.src(paths.js)
		.pipe(uglify())
		.pipe(concat(paths.minjs))
		.pipe(gulp.dest(paths.build + 'js'));
});

// copy all images to build
gulp.task('img', function() {
	return gulp.src(paths.img)
		.pipe(imagemin())
		.pipe(gulp.dest(paths.build + 'img'));
});

// process less file and minify resulting css
gulp.task('css', function() {
	return gulp.src(paths.css)
		.pipe(less())
		.pipe(csso(true)) // 'true' means 'disable structure minimization'
		.pipe(rename(paths.mincss))
		.pipe(gulp.dest(paths.build + 'css'));
});

// replace resource links and minify html
gulp.task('html', function() {
	return gulp.src(paths.html)
		.pipe(htmlreplace({
			css: {
				src: 'css/' + paths.mincss,
				tpl: '<link rel="stylesheet" type="text/css" href="%s">'
			},
			js: {
				src: 'js/' + paths.minjs,
				tpl: '<script type="text/javascript" src="%s" async="async"></script>'
			}
		}))
		.pipe(htmlmin({ // http://perfectionkills.com/experimenting-with-html-minifier/#options
			removeComments: true
		}))
		.pipe(gulp.dest(paths.build));
});

// other files, just copy
gulp.task('other', function() {
	return gulp.src(paths.other, { base: './' })
		.pipe(gulp.dest(paths.build));
});

// rerun the task when a file changes
gulp.task('watch', function () {
	gulp.watch(paths.js, ['js']);
	gulp.watch(paths.css, ['css']);
	gulp.watch(paths.html, ['html']);
	gulp.watch(paths.other, ['other']);
});

// The default task (called when you run 'gulp' from cli)
gulp.task('default', ['js', 'img', 'css', 'html', 'other']);
