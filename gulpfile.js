var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-clean-css');
var htmlreplace = require('gulp-html-replace');
var clean = require('gulp-clean');
var sass = require('gulp-sass');

var css = [
			'./node_modules/bootstrap/dist/css/bootstrap.css',
			'./node_modules/bootstrap-slider/dist/css/bootstrap-slider.css',
			'./node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker.css',
			'./src/css/styles.css'
];

var js = [
			'./node_modules/angular/angular.js',
			'./node_modules/jquery/dist/jquery.js',
			'./node_modules/bootstrap/dist/js/bootstrap.js',
			'./node_modules/bootstrap-slider/dist/bootstrap-slider.js',
			'./node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.js',
			'./node_modules/highcharts/highcharts.js',
			'./node_modules/highcharts/modules/map.js',
			'./node_modules/ngmap/build/scripts/ng-map.js'
];

var angularFiles = [
	'./src/js/app.js',
	'./src/js/controllers.js',
	'./src/js/services.js',
	'./src/js/directives.js'
]

gulp.task('default', ['clean', 'build', 'minify', 'minifyng', 'uglify'], () => {
	gulp.src('src/*.html')
    .pipe(htmlreplace({
        'css': './css/styles.min.css',
        'js': './js/main.min.js',
        'angular' : './js/app.min.js'
    }))
    .pipe(gulp.dest('./build/'));

    gulp.src('src/img/*')
    .pipe(gulp.dest('./build/img/'));
    
    gulp.src('src/fonts/*')
    .pipe(gulp.dest('./build/fonts/'));
});

gulp.task('clean', (cb) => {
	return gulp.src('./build/', {read: false})
        .pipe(clean());

        
});

gulp.task('build', ['clean']);

gulp.task('uglify', () => {
	gulp.src(css)
	.pipe(concat('styles.min.css'))
	.pipe(minify())
	.pipe(gulp.dest('./build/css/'));
});

gulp.task('minify', () => {
	gulp.src(js)
	.pipe(concat('main.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./build/js/'));

});

gulp.task('minifyng', () => {
	gulp.src(angularFiles)
	.pipe(concat('app.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./build/js/'));
});

gulp.task('sass', () => {
	return gulp.src('./src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/css/'));
});

gulp.task('sass:watch', () => {
	gulp.watch('./src/scss/*.scss', ['sass']);
});
