const gulp = require('gulp');
const less = require('gulp-less');
const del = require('del');
const runSequence = require('run-sequence');
const cleanCss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');

const process = require('process');

gulp.task('clean-assets', function() {
    return del('static');
});

gulp.task('build-assets-css', function() {
    if (process.env.NODE_ENV === "production") {
        return gulp.src('assets/css/voxelwind.less')
            .pipe(less())
            .pipe(cleanCss())
            .pipe(gulp.dest('static'));
    } else {
        return gulp.src('assets/css/voxelwind.less')
            .pipe(less())
            .pipe(gulp.dest('static'));
    }
});

gulp.task('build-assets-images', function() {
    if (process.env.NODE_ENV === "production") {
        return gulp.src('assets/images/**')
            .pipe(imagemin())
            .pipe(gulp.dest('static'));
    } else {
        return gulp.src('assets/images/**')
            .pipe(gulp.dest('static'));
    }
});

gulp.task('build-assets', function(cb) {
    runSequence('clean-assets', ['build-assets-css', 'build-assets-images'], cb);
});

gulp.task('default', ['build-assets']);