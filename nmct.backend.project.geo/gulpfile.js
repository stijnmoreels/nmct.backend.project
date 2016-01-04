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
    watch = require('gulp-watch'),
    ngAnnotate = require('gulp-ng-annotate');



//watcher
gulp.task("default", function () {
    //Css Watch
    var cssWatcher = gulp.watch('./public/src/less/**/*.less', ['css']);
    //gulp.watch('./public/src/dist/css/*.css');

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
    gulp.src([
        "./public/src/js/chat.js",
        "./public/src/js/hash.js",
        "./public/src/js/mapType.js",
        "./public/src/models/ActivityModel.js",
        "./public/src/models/ShareModel.js",
        "./public/src/js/showErrorMsg.js",
        "./public/src/js/app.js",
        "./public/src/Controllers/LoginController.js",
        "./public/src/Controller/RegisterController.js",
        "./public/src/Directives/**/*.js",
        "./public/src/js/userLocation.js"])
        .pipe(jshint())
        .pipe(jshint.reporter(jsStylish))
        .pipe(sourcemaps.init())
        .pipe(concat("app.min.js"))
        .pipe(ngAnnotate({
            add: true
        }))
        .pipe(uglify())
        .pipe(gulp.dest("./public/src/dist/js"))
        .pipe(notify({
            message: "js built"
        }));
});