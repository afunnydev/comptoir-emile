const gulp = require('gulp');
const imagemin = require("gulp-imagemin");
const imageresize = require('gulp-image-resize');
const parallel = require("concurrent-transform");
var runSequence = require('run-sequence');
var del = require('del');
var exec = require('child_process').exec;
var newer = require('gulp-newer');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();

// image resizing variables
const imagexl = 2620;
const imagefull = 1920;
const imagehalf = 1024;
const imagequart = 600;
const imagethumb = 80;
const jsFiles = [
                  // 'themes/comptoir/assets/js/theme/jquery-2.1.4.min.js',
                  // 'themes/comptoir/assets/js/theme/mfn.menu.js',
                  // 'themes/comptoir/assets/js/theme/jquery.plugins.js',
                  // 'themes/comptoir/assets/js/theme/jquery.jplayer.min.js',
                  // 'themes/comptoir/assets/js/theme/animations/animations.js',
                  // 'themes/comptoir/assets/js/theme/email.js',
                  // 'themes/comptoir/assets/js/theme/scripts.js',
                  // 'themes/comptoir/assets/js/vendor/instafeed.min.js',
                  // 'themes/comptoir/assets/js/vendor/jquery.sticky-sidebar.js',
                  'themes/comptoir/assets/js/main.js'
                ];
const jsFilesUI = [
                  // 'themes/comptoir/assets/js/theme/jquery-2.1.4.min.js',
                  // 'themes/comptoir/assets/js/theme/ui/jquery.ui.core.js',
                  // 'themes/comptoir/assets/js/theme/ui/jquery.ui.widget.js',
                  // 'themes/comptoir/assets/js/theme/ui/jquery.ui.accordion.js',
                  // 'themes/comptoir/assets/js/theme/ui/jquery.ui.tabs.js',
                  // 'themes/comptoir/assets/js/theme/mfn.menu.js',
                  // 'themes/comptoir/assets/js/theme/jquery.plugins.js',
                  // 'themes/comptoir/assets/js/theme/jquery.jplayer.min.js',
                  // 'themes/comptoir/assets/js/theme/animations/animations.js',
                  // 'themes/comptoir/assets/js/theme/email.js',
                  // 'themes/comptoir/assets/js/theme/scripts.js',
                  // 'themes/comptoir/assets/js/vendor/instafeed.min.js',
                  // 'themes/comptoir/assets/js/vendor/jquery.sticky-sidebar.js',
                  'themes/comptoir/assets/js/main.js'
                ];
const jsDest = 'themes/comptoir/static/js';

 
// resize and optimize images
gulp.task("image-resize", () => {
  return gulp.src("themes/comptoir/source-images/*.{jpg,png,jpeg,gif}")
    .pipe(newer("themes/comptoir/static/img"))
    .pipe(imagemin())
    .pipe(imageresize({ width: imagexl}))
    .pipe(gulp.dest("themes/comptoir/static/xl/img"))
    .pipe(imageresize({ width: imagefull }))
    .pipe(gulp.dest("themes/comptoir/static/img"))
    .pipe(imageresize({ width: imagehalf }))
    .pipe(gulp.dest("themes/comptoir/static/half/img"))
    .pipe(imageresize({ width: imagequart }))
    .pipe(gulp.dest("themes/comptoir/static/quart/img"))
    .pipe(imageresize({ width: imagethumb }))
    .pipe(gulp.dest("themes/comptoir/static/thumb/img"));
});

// hugo production call
gulp.task("hugo", function (cb) {
  exec('hugo --cleanDestinationDir', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('sass', function () {
  return gulp.src('themes/comptoir/assets/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('themes/comptoir/static/css'));
});

gulp.task('scripts-normal', function() {
    return gulp.src(jsFiles)
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(jsDest));
});

gulp.task('scripts-ui', function() {
    return gulp.src(jsFilesUI)
        .pipe(sourcemaps.init())
        .pipe(concat('main-with-ui.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(jsDest));
});

gulp.task('scripts', ['scripts-normal', 'scripts-ui']);

// watching
gulp.task("watch", function() {

  browserSync.init({
      proxy: "http://localhost:1313/"
  });

  gulp.watch('themes/comptoir/source-images/*.{jpg,png,jpeg,gif}', ['image-resize'] );
  gulp.watch('themes/comptoir/assets/scss/**/*.scss', ['sass']);
  gulp.watch('themes/comptoir/assets/js/**/*.js', ['scripts']);
});

// watching images and resizing
gulp.task("dev",  function(callback) {
  runSequence('image-resize',
              'watch');
});

// optimizing images and calling hugo for production
gulp.task("prod",  function(callback) {
  runSequence('image-resize',
              'hugo');
});
