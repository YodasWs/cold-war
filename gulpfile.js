'use strict';

const gulp = require('gulp')
const plugins = {
	prefixSass: require('gulp-autoprefixer'),
	rmLines: require('gulp-delete-lines'),
	compileSass: require('gulp-sass'),
	addHeader: require('gulp-header'),
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
})

gulp.task('compile:sass', () => {
	const tasks = [
		'compileSass',
		'prefixSass',
		'addHeader',
		'rmLines',
	]
	let stream = gulp.src([
		'scss/*.scss'
	])
	for (let i=0, k=tasks.length; i<k; i++) {
		const option = options[tasks[i]] || {}
		stream = stream.pipe(plugins[tasks[i]](option))
	}
	return stream.pipe(gulp.dest('./docs/css/'))
})

gulp.task('compile', gulp.parallel('compile:js', 'compile:sass'))

gulp.task('watch', () => {
	gulp.watch('./**/*.scss', ['compile:sass'])
	gulp.watch('./**/*.js', ['compile:js'])
})

gulp.task('default', () => {
})
