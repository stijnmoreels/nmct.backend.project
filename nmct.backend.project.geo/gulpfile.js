/**
 * Created by Arne on 10/27/15.
 */
var gulp = require('gulp'),
    csslint = require('gulp-csslint'),
//cssMinifier = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    less = require('gulp-less'),
    jshint = require('gulp-jshint'),
    jsStylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch');


//watcher
gulp.task("stream", function () {
    //Css Watch
    return gulp.src("./public/src/less/**/*.less")
        .pipe(watch("./public/src/less/**/*.less"))
        .pipe(gulp.dest('build'));
});


//Task: convert less to css
gulp.task("css", function () {
    gulp.src("./public/src/less/**/*.less")
        .pipe(less())
        .pipe(csslint({
            'ids': false
        }))
        .pipe(sourcemaps.init())
        //.pipe(cssMinifier())
        .pipe(concat("site.css"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./public/src/dist/css"))
        .pipe(notify({
            message: "css built"
        }))
});

gulp.task("js", function () {
    gulp.src("./public/src/js/**/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter(jsStylish))
        .pipe(sourcemaps.init())
        .pipe(concat("app.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./public/src/dist/js"))
        .pipe(notify({
            message: "js built"
        }));
});