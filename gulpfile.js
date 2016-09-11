const gulp = require('gulp');
const less = require('gulp-less');
const del = require('del');
const runSequence = require('run-sequence');
const cleanCss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');

const process = require('process');

gulp.task('clean-assets', function() {
    return del('static');
});

gulp.task('build-assets-css', function() {
    if (process.env.NODE_ENV === "production") {
        return gulp.src(['node_modules/normalize.css/normalize.css', 'assets/css/voxelwind.less'])
            .pipe(less())
            .pipe(cleanCss())
            .pipe(concat('voxelwind.css'))
            .pipe(gulp.dest('static'));
    } else {
        return gulp.src(['node_modules/normalize.css/normalize.css', 'assets/css/voxelwind.less'])
            .pipe(less())
            .pipe(concat('voxelwind.css'))
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