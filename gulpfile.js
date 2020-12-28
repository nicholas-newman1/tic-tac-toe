const gulp = require('gulp');
const sass = require('gulp-sass');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const minify = require('gulp-uglify');

const copyHtml = () => {
  return gulp.src('src/index.html').pipe(gulp.dest('dist'));
};

const compileTs = () => {
  return gulp
    .src('src/app.ts')
    .pipe(sourcemaps.init())
    .pipe(
      ts({
        noImplicitAny: true,
        outFile: 'app.js',
        noEmitOnError: false,
      })
    )
    .pipe(minify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
};

const compileSass = () => {
  return gulp
    .src('src/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        errLogToConsole: true,
        outputStyle: 'compressed',
      })
    )
    .on('error', console.error.bind(console))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
};

gulp.task('copyHtml', copyHtml);
gulp.task('compileTs', compileTs);
gulp.task('compileSass', compileSass);

gulp.task('default', gulp.parallel(['copyHtml', 'compileTs', 'compileSass']));

gulp.task('watch', () => {
  gulp.watch('src/app.ts', compileTs);
  gulp.watch('src/index.html', copyHtml);
  gulp.watch('src/styles.scss', compileSass);
});
