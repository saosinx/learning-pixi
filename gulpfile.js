const autoprefixer = require('autoprefixer')
const connect = require('gulp-connect')
const gulp = require('gulp')
const postcss = require('gulp-postcss')
const pug = require('gulp-pug')
const sass = require('gulp-sass')
const sassGlob = require('gulp-sass-glob')

const browserify = require('browserify')
const buffer = require('vinyl-buffer')
const clean = require('gulp-clean')
const imagemin = require('gulp-imagemin')
const log = require('gulplog')
const source = require('vinyl-source-stream')
// const sourcemaps = require('gulp-sourcemaps');
const tabify = require('gulp-tabify')
const uglify = require('gulp-uglify-es').default
const watchify = require('watchify')

const opts = {
	entries: './src/scripts/index.js',
	extension: ['.js'],
	debug: true,
}

const b = watchify(browserify(watchify.args, opts))

b.on('time', (time) => console.log(`${time}ms`))
b.on('log', log.info)

gulp.task('connect', (done) => {
	connect.server({
		port: 8000,
		livereload: true,
		root: 'dist',
	})
	done()
})

gulp.task('clean', (done) => {
	gulp.src('dist/*', { read: false }).pipe(clean({ force: true }))
	done()
})

gulp.task('imagemin', (done) => {
	gulp
		.src('src/images/**/*')
		.pipe(
			imagemin([
				imagemin.gifsicle({
					interlaced: true, // Interlace gif for progressive rendering
					optimizationLevel: 2, // An optimization level between 1 and 3
				}),
				imagemin.jpegtran({
					progressive: true, // Lossless conversion to progressive
					arithmetic: false, // Use arithmetic coding
				}),
				imagemin.optipng({
					optimizationLevel: 0, // An optimization level between 0 and 7
					bitDepthReduction: true, // Apply bit depth reduction
					colorTypeReduction: true, // Apply color type reduction
					paletteReduction: true, // Apply palette reduction
				}),
				imagemin.svgo(),
			])
		)
		.pipe(gulp.dest('dist/assets/images'))
	done()
})

gulp.task('uglify', (done) => {
	b.bundle()
		.on('error', log.error.bind(log, 'Browserify Error'))
		.pipe(source('main.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest('dist/assets/scripts'))
		.pipe(connect.reload())
	done()
})

gulp.task('build', (done) => {
	b.bundle()
		.on('error', log.error.bind(log, 'Browserify Error'))
		.pipe(source('main.js'))
		.pipe(buffer())
		// .pipe( sourcemaps.init(loadMaps: true) )
		// .pipe( sourcemaps.write('./') )
		.pipe(gulp.dest('dist/assets/scripts'))
		.pipe(connect.reload())
	done()
})

gulp.task('pug', (done) => {
	gulp
		.src('src/*.+(pug|jade)')
		.pipe(pug({ pretty: true }))
		.pipe(tabify(2, false))
		.pipe(gulp.dest('dist'))
		.pipe(connect.reload())
	done()
})

gulp.task('sass', (done) => {
	gulp
		.src('src/styles/styles.scss')
		.pipe(sassGlob())
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(postcss([autoprefixer()]))
		.pipe(gulp.dest('dist/assets/styles'))
		.pipe(connect.reload())
	done()
})

gulp.task('watch', (done) => {
	gulp.watch('src/**/*+(pug|jade)', gulp.series('pug'))
	gulp.watch('src/**/*.scss', gulp.series('sass'))
	gulp.watch('src/images/*.(png|jpg|jpeg)', gulp.series('imagemin'))
	gulp.watch('src/**/*.js', gulp.series('build'))
	done()
})

gulp.task(
	'default',
	gulp.series('clean', gulp.parallel('imagemin', 'build', 'sass', 'pug'), 'connect', 'watch')
)

gulp.task('build-prod', gulp.series('clean', gulp.parallel('imagemin', 'uglify', 'sass', 'pug')))
