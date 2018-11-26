var gulp = require('gulp');

// Babel - ES6
var babel = require('gulp-babel');

// Sass
var sass = require('gulp-sass');
sass.compiler = require('node-sass');

// Browserify
var browserify = require('browserify');
var source = require('vinyl-source-stream');

// Rename files
var rename = require('gulp-rename');

// Browser Sync
var browserSync = require('browser-sync').create();


/**
 * Tasks
 */

gulp.task('scripts', function() {
    return gulp.src('src/js/main.js')
        .pipe(babel({
			presets: ['@babel/env']
		}))
        .pipe(rename('hashtag-cminds.js'))
        .pipe(gulp.dest('dist/js'));
});


gulp.task('sass', function () {
    return gulp.src('src/sass/main.scss')
        .pipe(sass())
        .pipe(rename('hashtag-cminds.css'))
        .pipe(gulp.dest('dist/css'));
});


gulp.task('demo', function () {
    browserify('src/demo/demo.js').bundle()
        .pipe(source('demo.js'))
        .pipe(gulp.dest('dist/demo'));

    gulp.src('src/demo/demo.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/demo'));

    gulp.src('src/demo/demo.html')
        .pipe(rename('index.html'))
        .pipe(gulp.dest('dist/demo'));
});


gulp.task('watch', function() {
    gulp.start(['scripts','sass','demo']);

    browserSync.init({
        server: {
            baseDir: "dist/demo"
        }
    });

    gulp.watch('src/demo/*', ['demo']).on("change", browserSync.reload);
    gulp.watch('src/js/*', ['scripts']).on("change", browserSync.reload);
    gulp.watch('src/sass/*', ['sass']).on("change", browserSync.reload);
});


gulp.task('default', ['scripts','sass','demo']);