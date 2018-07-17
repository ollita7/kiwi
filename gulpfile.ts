var gulp = require('gulp'),
	exec = require('child_process').exec,
	gulpSequence = require('gulp-sequence'),
	ts = require('gulp-typescript');

var tsProject = ts.createProject('tsconfig.json', {});

gulp.task('publish', gulpSequence('compile', 'copy', 'publish-package'));

gulp.task('compile', () => {
	return gulp.src('src/**/*.ts')
		.pipe(tsProject())
		.pipe(gulp.dest("release"));
});

gulp.task('copy', () => {
	gulp.src(['package.json', 'README.md'])
		.pipe(gulp.dest('release/'));
});

gulp.task('publish-package', function (cb) {
	exec('npm publish', {
		cwd: 'release'
	}, function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
})

