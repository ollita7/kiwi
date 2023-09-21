var gulp = require('gulp'),
	exec = require('child_process').exec,
	mocha = require('gulp-mocha'),
	ts = require('gulp-typescript');

var tsProject = ts.createProject('tsconfig.json', {});

gulp.task('compile', function() {
	return gulp.src(['src/**/*.ts'])
		.pipe(tsProject())
		.pipe(gulp.dest("release"));
});

gulp.task('compile-tests', function (cb) {
	exec('npm run compile', {
	}, function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
})

gulp.task('copy', async () => {
	gulp.src(['package.json', 'README.md'])
		.pipe(gulp.dest('release/'));

	gulp.src(['src/resources/documentation-ui/index.html'])
		.pipe(gulp.dest('release/resources/documentation-ui/'));
});

gulp.task('execute-tests', function () {
	return gulp.src(['dist/samples/tests/*.test.js'], { read: false })
		.pipe(mocha({
			reporter: 'spec'
		}));
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

gulp.task('publish', gulp.series('compile', 'compile-tests', 'copy', 'execute-tests', 'publish-package'));

gulp.task('test', gulp.series('compile-tests', 'execute-tests'));

