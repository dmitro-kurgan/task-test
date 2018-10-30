import gulp            from 'gulp';
import del             from 'del';
import runSequence     from 'run-sequence';
import browserSync     from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import syntax          from 'postcss-scss';
import deleteEmpty     from 'delete-empty';

import PLUGINS         from './config/postcss.config';
import COPY_FILES      from './config/copy-files.config';

const $        = gulpLoadPlugins();
const reload   = browserSync.reload;
const debug    = require('postcss-debug').createDebugger();
const uglify   = require('gulp-uglify-es').default;

require('gulp-stats')(gulp);

gulp.task('pug', () => {
  return gulp.src([
    'src/**/*.pug'
  ])
  .pipe($.pugLinter())
  .pipe($.pugLinter.reporter('fail').on('error', $.notify.onError()))
  .pipe($.pug({
    pretty: '\t'
  }))
  .pipe(gulp.dest('dist/'))
});

gulp.task('styles', () => {
  return gulp.src([
    'src/**/*.scss'
  ])

  .pipe($.newer('dist/'))
  .pipe($.sourcemaps.init())
  .pipe($.sass.sync(
    {outputStyle: 'expanded'})
  )
  .pipe($.postcss(debug(PLUGINS), {parser: syntax}))
  .pipe($.sourcemaps.write('.'))
  .pipe(gulp.dest('dist/'))
  .pipe($.size({title: 'styles'}))
});

gulp.task('lint:css', () => {
  return gulp.src(['src/styles/**/*.scss','src/components/**/*.scss', 'src/pages/**/*.scss'])
  .pipe($.stylelint({
    reporters: [
      {formatter: 'verbose', console: true, save: 'lint-log.txt'}
    ],
    failAfterError: false
  }))
  //.pipe($.scssLint())
  //.pipe($.scssLint.failReporter().on('error', $.notify.onError()))
});

gulp.task('minify-dist', () => {
  return gulp.src('dist/css/*.css')
  .pipe($.cleanCss())
  .pipe(gulp.dest('dist/css/'))
})

gulp.task('css-debug', ['styles'], () => {
  debug.inspect()
})

gulp.task('remove-unneeded', () => {
  gulp.src('dist/mixins/*')
  .pipe($.removeFiles());
})

gulp.task('images', () => {
  return gulp.src('src/images/**/*')

  .pipe($.newer('dist/images/'))
  .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    }))
  )
  .pipe(gulp.dest('dist/images/'))
  .pipe($.size({title: 'images'}))
})

gulp.task('scripts', () => {
  return gulp.src([
    'src/**/*.js',
    'libs/**/*.js'
  ])

  .pipe(gulp.dest('dist/'))
  .pipe(uglify())
  .pipe($.rename({ suffix: '.min' }))
  .pipe(gulp.dest('dist/'))
  .pipe($.size({title: 'scripts'}))
});

gulp.task('clean', () => del(['dist'], {dot: true}));

gulp.task('delete-empty', () => {
  deleteEmpty.sync('dist/');
});

gulp.task('copy', () => {
  return gulp.src(
    COPY_FILES,
  {
    base: 'src'
  })
  .pipe(gulp.dest('dist'))
  .pipe($.size({title: 'copy'}))
});

gulp.task('serve', ['clean'], cb => {
  runSequence(
    ['pug', 'styles', 'scripts', 'images'],
    ['remove-unneeded'],
    'copy',
    'delete-empty',
    cb
  )

  browserSync({
    notify: false,
    server: ['dist'],
    port: 3000
  });

  gulp.watch(['src/images/**/*'], ['images'], reload)
  gulp.watch(['src/**/**/*.pug'], ['pug', reload])
  gulp.watch(['src/**/**/*.scss'], ['lint:css', 'styles', reload])
  gulp.watch(['src/**/*.js'], [['scripts', 'copy'], reload])
});

gulp.task('build:prod', ['clean'], cb => {
  runSequence(
    'styles',
    'scripts',
    ['pug', 'copy'],
    ['remove-unneeded'],
    'images',
    'minify-dist',
    'delete-empty',
    cb
  )
});

gulp.task('default', ['clean'], cb => {
  runSequence(
    'styles',
    'scripts',
    ['pug', 'copy'],
    ['remove-unneeded'],
    'images',
    'delete-empty',
    cb
  )
});
