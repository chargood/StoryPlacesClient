/* *****************************************************************************
 *
 * StoryPlaces
 *

This application was developed as part of the Leverhulme Trust funded 
StoryPlaces Project. For more information, please visit storyplaces.soton.ac.uk

Copyright (c) 2016
  University of Southampton
    Charlie Hargood, cah07r.ecs.soton.ac.uk
    Kevin Puplett, k.e.puplett.soton.ac.uk
	David Pepper, d.pepper.soton.ac.uk

All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * The name of the Universities of Southampton nor the name of its 
	  contributors may be used to endorse or promote products derived from 
	  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE ABOVE COPYRIGHT HOLDERS BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

***************************************************************************** */
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
