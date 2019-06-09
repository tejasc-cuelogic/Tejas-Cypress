/** *****************************
          Build Task
****************************** */

const
  gulp = require('gulp');

// node dependencies
const console = require('better-console');
const fs = require('fs');

// gulp dependencies
const autoprefixer = require('gulp-autoprefixer');
const chmod = require('gulp-chmod');
const clone = require('gulp-clone');
const flatten = require('gulp-flatten');
const gulpif = require('gulp-if');
const less = require('gulp-less');
const minifyCSS = require('gulp-clean-css');
const plumber = require('gulp-plumber');
const print = require('gulp-print').default;
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const runSequence = require('run-sequence');

// config
const config = require('../config/user');
const tasks = require('../config/tasks');
const install = require('../config/project/install');

// shorthand
const { globs } = config;
const { assets } = config.paths;
const { output } = config.paths;
const { source } = config.paths;

const { banner } = tasks;
const { comments } = tasks.regExp;
const { log } = tasks;
const { settings } = tasks
;

// add internal tasks (concat release)
require('../collections/internal')(gulp);

module.exports = function (callback) {
  let
    tasksCompleted = 0;
  const maybeCallback = function () {
    tasksCompleted++;
    if (tasksCompleted === 2) {
      callback();
    }
  };

  let stream;
  let compressedStream;
  let uncompressedStream;
  console.info('Building CSS');

  if (!install.isSetup()) {
    console.error('Cannot build files. Run "gulp install" to set-up Semantic');
    return;
  }

  // unified css stream
  stream = gulp.src(`${source.definitions}/**/${globs.components}.less`)
    .pipe(plumber(settings.plumber.less))
    .pipe(less(settings.less))
    .pipe(autoprefixer(settings.prefix))
    .pipe(replace(comments.variables.in, comments.variables.out))
    .pipe(replace(comments.license.in, comments.license.out))
    .pipe(replace(comments.large.in, comments.large.out))
    .pipe(replace(comments.small.in, comments.small.out))
    .pipe(replace(comments.tiny.in, comments.tiny.out))
    .pipe(flatten())
  ;

  // two concurrent streams from same source to concat release
  uncompressedStream = stream.pipe(clone());
  compressedStream = stream.pipe(clone());

  // uncompressed component css
  uncompressedStream
    .pipe(plumber())
    .pipe(replace(assets.source, assets.uncompressed))
    .pipe(gulpif(config.hasPermission, chmod(config.permission)))
    .pipe(gulp.dest(output.uncompressed))
    .pipe(print(log.created))
    .on('end', () => {
      runSequence('package uncompressed css', maybeCallback);
    })
  ;

  // compressed component css
  compressedStream
    .pipe(plumber())
    .pipe(clone())
    .pipe(replace(assets.source, assets.compressed))
    .pipe(minifyCSS(settings.minify))
    .pipe(rename(settings.rename.minCSS))
    .pipe(gulpif(config.hasPermission, chmod(config.permission)))
    .pipe(gulp.dest(output.compressed))
    .pipe(print(log.created))
    .on('end', () => {
      runSequence('package compressed css', maybeCallback);
    });
};
