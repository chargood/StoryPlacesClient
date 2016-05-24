var gulp = require('gulp');
var requirejsOptimize = require('gulp-requirejs-optimize');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');


gulp.task('js', function () {
    return gulp.src('script/requireConfig.js')
        .pipe(requirejsOptimize({
            baseUrl: "script",
            mainConfigFile: "script/requireConfig.js",
        }))
        .pipe(rename({basename: "storyPlaces"}))
        .pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
    return gulp.src(['css/*.css', 'script/libs/bootstrap-3.3.6-dist/css/bootstrap.min.css'])
        .pipe(concat('storyPlaces.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist'))
});

gulp.task('default', ['js', 'css']);