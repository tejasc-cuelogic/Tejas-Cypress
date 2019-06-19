/** *****************************
          Build Task
****************************** */

const
  gulp = require('gulp');

// gulp dependencies
const chmod = require('gulp-chmod');
const gulpif = require('gulp-if');

// config
const config = require('../config/user');
const tasks = require('../config/tasks');

// shorthand
const { globs } = config;
const { assets } = config.paths;
const { output } = config.paths;
const { source } = config.paths;

const { log } = tasks;
module.exports = function (callback) {
  console.info('Building assets');

  // copy assets
  return gulp.src(`${source.themes}/**/assets/**/*.*`)
    .pipe(gulpif(config.hasPermission, chmod(config.permission)))
    .pipe(gulp.dest(output.themes));
};
