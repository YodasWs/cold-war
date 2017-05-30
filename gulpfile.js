'use strict';

const gulp = require('gulp')
const plugins = {
	prefixSass: require('gulp-autoprefixer'),
	rmLines: require('gulp-delete-lines'),
	compileSass: require('gulp-sass'),
	compileES6: require('gulp-babel'),
	addHeader: require('gulp-header'),
	lint: require('gulp-eslint'),
}

const options = {
	compileSass:{
		outputStyle:'compressed'
	},
	addHeader:(()=> {
		return "/* <%= file.basename %> */\n"
	})(),
	rmLines:{'filters':[
		'^\s*$',
	]}
}

gulp.task('compile:js', () => {
	const tasks = [
		'lint',
		'compileES6',
	]
	let stream = gulp.src([
		'src/js/*.js',
		'!node_modules/**'
	])
	for (let i=0, k=tasks.length; i<k; i++) {
		const option = options[tasks[i]] || {}
		stream = stream.pipe(plugins[tasks[i]](option))
	}
	if (tasks.indexOf('lint') != -1) {
		stream.pipe(plugins.lint.format())
	}
	return stream.pipe(gulp.dest('./docs/js/'))
})

gulp.task('compile:sass', () => {
	const tasks = [
		'compileSass',
		'prefixSass',
		'addHeader',
		'rmLines',
	]
	let stream = gulp.src([
		'src/scss/*.scss'
	])
	for (let i=0, k=tasks.length; i<k; i++) {
		const option = options[tasks[i]] || {}
		stream = stream.pipe(plugins[tasks[i]](option))
	}
	return stream.pipe(gulp.dest('./docs/css/'))
})

gulp.task('compile', gulp.parallel('compile:js', 'compile:sass'))

gulp.task('watch', () => {
	gulp.watch('./src/**/*.scss', ['compile:sass'])
	gulp.watch('./src/**/*.js', ['compile:js'])
})

gulp.task('default', () => {
})
