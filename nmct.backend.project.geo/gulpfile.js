/**
 * Created by Arne on 10/27/15.
 */
var gulp = require('gulp'),
    csslint = require('gulp-csslint'),
    //cssMinifier = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    less = require('gulp-less');


//Task: convert less to css
gulp.task("css", function(){
    gulp.src("./src/less/**/*.less")
        .pipe(less())
        .pipe(csslint({
            'ids': false
        }))
        .pipe(sourcemaps.init())
        //.pipe(cssMinifier())
        .pipe(concat("site.css"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./src/dist/css"))
        .pipe(notify({
            message: "css built"
        }))
});