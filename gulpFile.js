const gulp = require('gulp');
	const browserSync = require('browser-sync').create();
	const pug = require('gulp-pug');
	const sass = require('gulp-sass');
	const spritesmith = require('gulp.spritesmith');
	const rimraf = require('rimraf');
	const rename = require('gulp-rename');
	const coffeScript = require('gulp-coffee');
	const autoprefixer = require('gulp-autoprefixer');
	const cleanCSS = require('gulp-clean-css');
	const postcss = require('gulp-postcss');
	const stylus = require('gulp-stylus');


	/*********************** variables with source ****************/

	var
		the_pug = {
			in : "source/template/*.pug",
			watch : "source/template/**/*.pug",
			out : "build/"
		},
		css = {
			in : "source/styles/*.styl",
			watch : "source/styles/**/*.styl",
			out : "build/styles/"

		},
		js = {
			in : "source/js/**/*.js",
			out : "build/js/"
		}
		img = {
			in : "source/images/**/*.*",
			out : "build/images/"

		},
		coffeScr = {
			in: "source/js/**/*.coffe",
			out: "build/"
		}
		fonts = {
			in : "source/fonts/**/*.*",
			out : "build/fonts/"
		};

	/* -------- Server -------- */
	gulp.task('server', function() {
	browserSync.init({
	server: {
	port: 9000,
	baseDir: "build"
	}
	});
	//
	gulp.watch('build/**/*').on('change', browserSync.reload);
	});

	/* ------------ Pug compile ------------- */
	gulp.task('templates:compile', function buildHTML() {
	return gulp.src(the_pug.in)
	.pipe(pug({
		pretty: true
	}))
	.pipe(gulp.dest(the_pug.out))
	});

	/* ------------ Styles compile ------------- */
	gulp.task('styles:compile', function () {
		return gulp.src(css.in)
			/*-------------- SASS ---------------*/
			// .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
			/*-------------- STYLUS ---------------*/
			// .pipe(stylus({compress: true}))
			.pipe(stylus())
			.pipe(autoprefixer({
		            browsers: ['last 4 versions','Firefox > 20','last 2 Chrome versions','last 2 major versions'],
		            cascade: false
		        }))
			// .pipe(postcss())
			.pipe(cleanCSS({debug: true}, function(details) {
		      console.log(details.name + ': ' + details.stats.originalSize);
		      console.log(details.name + ': ' + details.stats.minifiedSize);
		    }))
			.pipe(rename('main.min.css'))
			.pipe(gulp.dest(css.out));
		});

	/* ------------ Sprite ------------- */
	gulp.task('sprite', function(cb) {
	const spriteData = gulp.src('source/css/images/icons/*.png').pipe(spritesmith({
	imgName: 'sprite.png',
	imgPath: '../images/sprite.png',
	cssName: 'sprite.scss'
	}));

	spriteData.img.pipe(gulp.dest('build/images/'));
	spriteData.css.pipe(gulp.dest('source/styles/global/'));
	cb();
	});

	/* ------------ Delete ------------- */
	gulp.task('clean', function del(cb) {
	return rimraf('build', cb);
	});

	/* ------------ Copy fonts ------------- */
	gulp.task('copy:fonts', function() {
	return gulp.src(fonts.in)
	.pipe(gulp.dest(fonts.out));
	});

	/* ------------ Copy images ------------- */
	gulp.task('copy:images', function() {
	return gulp.src(img.in)
	.pipe(gulp.dest(img.out));
	});


	/*--------------Copy JS----------------- */
	gulp.task('copy:js', function() {
	return gulp.src(js.in)
	.pipe(gulp.dest(js.out));
	});

	/*---------------Coffe - Script---------*/
	gulp.task('coffeScript:compile',function(){
		return gulp.src('source/js/**/*.coffee')
			.pipe(coffeScript({bare: true}))
			.pipe(gulp.dest('build/js'))
	})

	/* ------------ Copy ------------- */
	gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images','copy:js'));

	/* ------------ Watchers ------------- */
	gulp.task('watch', function() {
		gulp.watch(the_pug.watch, gulp.series('templates:compile'));
		gulp.watch(css.watch, gulp.series('styles:compile'));
		gulp.watch(js.in, gulp.series('copy:js'));
		gulp.watch('source/js/**/*.coffee' , gulp.series('coffeScript:compile'));
	});

	gulp.task('default', gulp.series(
		'clean',
	gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy','coffeScript:compile'),
	gulp.parallel('watch', 'server')
	)
);