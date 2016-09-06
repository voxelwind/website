const gulp = require('gulp');
const less = require('gulp-less');
const del = require('del');
const runSequence = require('run-sequence');

gulp.task('clean-assets', function() {
    return del('static');
});

gulp.task('build-assets-css', function() {
    return gulp.src('assets/css/voxelwind.less')
        .pipe(less())
        .pipe(gulp.dest('static'));
});

gulp.task('build-assets-images', function() {
    return gulp.src('assets/images/**')
        .pipe(gulp.dest('static'));
});

gulp.task('build-assets', function(cb) {
    runSequence('clean-assets', ['build-assets-css', 'build-assets-images'], cb);
});

gulp.task('default', ['build-assets']);