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
    return gulp.src(['script/libs/bootstrap-3.3.6-dist/css/bootstrap.min.css', 'css/**/*.css'])
        .pipe(concat('storyPlaces.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist'));
});

gulp.task('fonts', function() {
    return gulp.src('script/libs/bootstrap-3.3.6-dist/fonts/glyphicons-halflings-regular.*')
        .pipe(gulp.dest('fonts'));
});

gulp.task('default', ['js', 'css', 'fonts']);

gulp.task('watch', function () {
    console.log(" ****************************************************************");
    console.log(" * Setting up watch (ignore \"Finished 'watch'\" message below).");
    console.log(" * Press ctrl-c to exit.");
    console.log(" *");
    console.log(" ");

    gulp.watch('script/**/*.js', ['js']);
    gulp.watch('css/**/*.css', ['css']);
});
