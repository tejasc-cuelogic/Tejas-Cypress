/** *****************************
          Build Task
****************************** */

const
  gulp = require('gulp');

// node dependencies
const console = require('better-console');
const fs = require('fs');

// gulp dependencies
const chmod = require('gulp-chmod');
const flatten = require('gulp-flatten');
const gulpif = require('gulp-if');
const plumber = require('gulp-plumber');
const print = require('gulp-print').default;
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const uglify = require('gulp-uglify');

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
    stream;
  let compressedStream;
  let uncompressedStream;
  console.info('Building Javascript');

  if (!install.isSetup()) {
    console.error('Cannot build files. Run "gulp install" to set-up Semantic');
    return;
  }

  // copy source javascript
  gulp.src(`${source.definitions}/**/${globs.components}.js`)
    .pipe(plumber())
    .pipe(flatten())
    .pipe(replace(comments.license.in, comments.license.out))
    .pipe(gulp.dest(output.uncompressed))
    .pipe(gulpif(config.hasPermission, chmod(config.permission)))
    .pipe(print(log.created))
    .pipe(uglify(settings.uglify))
    .pipe(rename(settings.rename.minJS))
    .pipe(gulp.dest(output.compressed))
    .pipe(gulpif(config.hasPermission, chmod(config.permission)))
    .pipe(print(log.created))
    .on('end', () => {
      gulp.start('package compressed js');
      gulp.start('package uncompressed js');
      callback();
    });
};
