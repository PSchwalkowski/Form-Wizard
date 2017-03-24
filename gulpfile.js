var gulp = require('gulp');
var config = require('./gulpconfig')();

var sass = require('gulp-sass');
var babel = require('gulp-babel');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');

var browserSync = require('browser-sync').create();


gulp.task('default', ['serve']);

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./src/"
    }
  });

	gulp.run(['sass', 'js']);

	gulp.watch(config.srcPath + 'scss/**/*.scss', ['sass']);
	gulp.watch(config.srcPath + 'js/**/*.js', ['js']).on('change', browserSync.reload);
  gulp.watch(config.srcPath + '*.html').on('change', browserSync.reload);
});

gulp.task('sass', () => {
  return gulp.src(config.srcPath + '**/*.scss')
             .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
             .pipe(concatCss(config.appFile + '.min.css'))
             .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
              }))
             .pipe(cleanCSS())
             .pipe(gulp.dest(config.srcPath + 'css'))
             .pipe(notify('Styles compiled'))
		         .pipe(browserSync.stream());
});

gulp.task('js', () => {
  return gulp.src([
                config.srcPath + 'js/' + config.appFile + '.js',
              ])
             .pipe(concat(config.appFile + '.compiled.js'))
						 .pipe(babel({
			            presets: ['es2015']
			        }))
             .pipe(gulp.dest(config.srcPath + 'js'))
             .pipe(notify('Javascript compiled'))
});
