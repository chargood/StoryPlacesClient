var gulp = require('gulp');
var requirejsOptimize = require('gulp-requirejs-optimize');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var htmlreplace = require('gulp-html-replace');


gulp.task('js', function () {
    return gulp.src('script/requireConfig.js')
        .pipe(requirejsOptimize({
            baseUrl: "script",
            mainConfigFile: "script/requireConfig.js",
        }))
        .pipe(rename({basename: "storyPlaces.min"}))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('css', function () {
    return gulp.src(['script/libs/bootstrap-3.3.6-dist/css/bootstrap.min.css', 'css/**/*.css'])
        .pipe(concat('storyPlaces.min.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('fonts', function () {
    return gulp.src('script/libs/bootstrap-3.3.6-dist/fonts/glyphicons-halflings-regular.*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('copyRequire', function () {
    return gulp.src('script/libs/require.js')
        .pipe(gulp.dest('dist/js'));
});

gulp.task('copyImages', function () {
    return gulp.src('images/**/*')
        .pipe(gulp.dest('dist/images'));
});

gulp.task('copyNoGps', function () {
    return gulp.src('nogps.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('copyHelp', function () {
    return gulp.src('help.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('copyEarly', function () {
    return gulp.src('earlyfinish.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('copyAbout', function () {
    return gulp.src('about.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('copyIndex', function () {
    return gulp.src('index.html')
        .pipe(htmlreplace({
            'css': 'css/storyPlaces.min.css',
            'js': {
                src: null,
                tpl: '<script data-main="js/storyPlaces.min" src="js/require.js"></script>'
            }
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['js', 'css', 'fonts', 'copyRequire', 'copyImages', 'copyIndex', 'copyNoGps','copyHelp','copyEarly','copyAbout']);

gulp.task('watch', function () {
    console.log(" ****************************************************************");
    console.log(" * Setting up watch (ignore \"Finished 'watch'\" message below).");
    console.log(" * Press ctrl-c to exit.");
    console.log(" *");
    console.log(" ");

    gulp.watch('script/**/*.js', ['js']);
    gulp.watch('css/**/*.css', ['css']);
});
