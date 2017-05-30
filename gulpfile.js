'use strict';

const gulp = require('gulp')
const plugins = {
	prefixSass: require('gulp-autoprefixer'),
	sourcemaps: require('gulp-sourcemaps'),
	rmLines: require('gulp-delete-lines'),
	compileSass: require('gulp-sass'),
	compileES6: require('gulp-babel'),
	addHeader: require('gulp-header'),
	concat: require('gulp-concat'),
	lint: require('gulp-eslint'),
}

const options = {
	compileSass:{
		outputStyle:'compressed'
	},
	addHeader:(()=> {
		return "/* <%= file.basename %> */\n"
	})(),
	rmLines:{
		filters:[
			'^\s*$',
		]
	},
	concat: {
		css: {
			path: 'min.css'
		},
		js: {
			path: 'min.js'
		}
	}
}

// Copy HTML files to docs folder
gulp.task('compile:html', function() {
	return gulp.src('./src/**/*.html')
		.pipe(gulp.dest('./docs/'));
});

gulp.task('compile:js', () => {
	const tasks = [
		'lint',
		'compileES6',
	]
	let stream = gulp.src([
		'src/**/*.js'
	]).pipe(plugins.sourcemaps.init())
	for (let i=0, k=tasks.length; i<k; i++) {
		const option = options[tasks[i]] || {}
		stream = stream.pipe(plugins[tasks[i]](option))
	}
	if (tasks.indexOf('lint') != -1) {
		stream.pipe(plugins.lint.format())
	}
	return stream.pipe(plugins.concat(options.concat.js))
		.pipe(plugins.sourcemaps.write())
		.pipe(plugins.rmLines(options.rmLines))
		.pipe(gulp.dest('./docs/'))
})

gulp.task('compile:sass', () => {
	const tasks = [
		'compileSass',
		'prefixSass',
		'addHeader',
	]
	let stream = gulp.src([
		'src/**/*.{sa,sc,c}ss'
	]).pipe(plugins.sourcemaps.init())
	for (let i=0, k=tasks.length; i<k; i++) {
		const option = options[tasks[i]] || {}
		stream = stream.pipe(plugins[tasks[i]](option))
	}
	return stream.pipe(plugins.concat(options.concat.css))
		.pipe(plugins.sourcemaps.write())
		.pipe(plugins.rmLines(options.rmLines))
		.pipe(gulp.dest('./docs/'))
})

gulp.task('compile', gulp.parallel('compile:html', 'compile:js', 'compile:sass'))

gulp.task('watch', () => {
	gulp.watch('./src/**/*.{sa,sc,c}ss', gulp.series('compile:sass'))
	gulp.watch('./src/**/*.html', gulp.series('compile:html'))
	gulp.watch('./src/**/*.js', gulp.series('compile:js'))
})

gulp.task('default', gulp.series(
	'compile',
	'watch'
))
