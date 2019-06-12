/** *****************************
    Internal Task Collection
****************************** */

/* These tasks create packaged files from **dist** components
   Not intended to be called directly by a user because
   these do not build fresh from **src**
*/

module.exports = function (gulp) {
  const
    // node dependencies
    fs = require('fs');
  const chmod = require('gulp-chmod');
  const concat = require('gulp-concat');
  const concatCSS = require('gulp-concat-css');
  const clone = require('gulp-clone');
  const dedupe = require('gulp-dedupe');
  const gulpif = require('gulp-if');
  const header = require('gulp-header');
  const less = require('gulp-less');
  const minifyCSS = require('gulp-clean-css');
  const plumber = require('gulp-plumber');
  const print = require('gulp-print').default;
  const rename = require('gulp-rename');
  const replace = require('gulp-replace');
  const uglify = require('gulp-uglify');

  // user config
  const config = require('./../config/user');
  const docsConfig = require('./../config/docs');

  // install config
  const tasks = require('./../config/tasks');
  const release = require('./../config/project/release');

  // shorthand
  const { globs } = config;
  const { assets } = config.paths;
  const { output } = config.paths;

  const { banner } = tasks;
  const { filenames } = tasks;
  const { log } = tasks;
  const { settings } = tasks
  ;

  /*--------------
      Packaged
  ---------------*/

  gulp.task('package uncompressed css', () => gulp.src(`${output.uncompressed}/**/${globs.components}${globs.ignored}.css`)
    .pipe(plumber())
    .pipe(dedupe())
    .pipe(replace(assets.uncompressed, assets.packaged))
    .pipe(concatCSS(filenames.concatenatedCSS, settings.concatCSS))
    .pipe(gulpif(config.hasPermission, chmod(config.permission)))
    .pipe(header(banner, settings.header))
    .pipe(gulp.dest(output.packaged))
    .pipe(print(log.created)));

  gulp.task('package compressed css', () => gulp.src(`${output.uncompressed}/**/${globs.components}${globs.ignored}.css`)
    .pipe(plumber())
    .pipe(dedupe())
    .pipe(replace(assets.uncompressed, assets.packaged))
    .pipe(concatCSS(filenames.concatenatedMinifiedCSS, settings.concatCSS))
    .pipe(gulpif(config.hasPermission, chmod(config.permission)))
    .pipe(minifyCSS(settings.concatMinify))
    .pipe(header(banner, settings.header))
    .pipe(gulp.dest(output.packaged))
    .pipe(print(log.created)));

  gulp.task('package uncompressed js', () => gulp.src(`${output.uncompressed}/**/${globs.components}${globs.ignored}.js`)
    .pipe(plumber())
    .pipe(dedupe())
    .pipe(replace(assets.uncompressed, assets.packaged))
    .pipe(concat(filenames.concatenatedJS))
    .pipe(header(banner, settings.header))
    .pipe(gulpif(config.hasPermission, chmod(config.permission)))
    .pipe(gulp.dest(output.packaged))
    .pipe(print(log.created)));

  gulp.task('package compressed js', () => gulp.src(`${output.uncompressed}/**/${globs.components}${globs.ignored}.js`)
    .pipe(plumber())
    .pipe(dedupe())
    .pipe(replace(assets.uncompressed, assets.packaged))
    .pipe(concat(filenames.concatenatedMinifiedJS))
    .pipe(uglify(settings.concatUglify))
    .pipe(header(banner, settings.header))
    .pipe(gulpif(config.hasPermission, chmod(config.permission)))
    .pipe(gulp.dest(output.packaged))
    .pipe(print(log.created)));

  /*--------------
        RTL
  ---------------*/

  if (config.rtl) {
    gulp.task('package uncompressed rtl css', () => gulp.src(`${output.uncompressed}/**/${globs.components}${globs.ignoredRTL}.rtl.css`)
      .pipe(dedupe())
      .pipe(replace(assets.uncompressed, assets.packaged))
      .pipe(concatCSS(filenames.concatenatedRTLCSS, settings.concatCSS))
      .pipe(gulpif(config.hasPermission, chmod(config.permission)))
      .pipe(header(banner, settings.header))
      .pipe(gulp.dest(output.packaged))
      .pipe(print(log.created)));

    gulp.task('package compressed rtl css', () => gulp.src(`${output.uncompressed}/**/${globs.components}${globs.ignoredRTL}.rtl.css`)
      .pipe(dedupe())
      .pipe(replace(assets.uncompressed, assets.packaged))
      .pipe(concatCSS(filenames.concatenatedMinifiedRTLCSS, settings.concatCSS))
      .pipe(gulpif(config.hasPermission, chmod(config.permission)))
      .pipe(minifyCSS(settings.concatMinify))
      .pipe(header(banner, settings.header))
      .pipe(gulp.dest(output.packaged))
      .pipe(print(log.created)));

    gulp.task('package uncompressed docs css', () => gulp.src(`${output.uncompressed}/**/${globs.components}${globs.ignored}.css`)
      .pipe(dedupe())
      .pipe(plumber())
      .pipe(replace(assets.uncompressed, assets.packaged))
      .pipe(concatCSS(filenames.concatenatedCSS, settings.concatCSS))
      .pipe(gulpif(config.hasPermission, chmod(config.permission)))
      .pipe(gulp.dest(output.packaged))
      .pipe(print(log.created)));

    gulp.task('package compressed docs css', () => gulp.src(`${output.uncompressed}/**/${globs.components}${globs.ignored}.css`)
      .pipe(dedupe())
      .pipe(plumber())
      .pipe(replace(assets.uncompressed, assets.packaged))
      .pipe(concatCSS(filenames.concatenatedMinifiedCSS, settings.concatCSS))
      .pipe(minifyCSS(settings.concatMinify))
      .pipe(header(banner, settings.header))
      .pipe(gulpif(config.hasPermission, chmod(config.permission)))
      .pipe(gulp.dest(output.packaged))
      .pipe(print(log.created)));
  }

  /*--------------
        Docs
  ---------------*/

  const
    docsOutput = docsConfig.paths.output;
  gulp.task('package uncompressed docs css', () => gulp.src(`${docsOutput.uncompressed}/**/${globs.components}${globs.ignored}.css`)
    .pipe(dedupe())
    .pipe(plumber())
    .pipe(replace(assets.uncompressed, assets.packaged))
    .pipe(concatCSS(filenames.concatenatedCSS, settings.concatCSS))
    .pipe(gulpif(config.hasPermission, chmod(config.permission)))
    .pipe(gulp.dest(docsOutput.packaged))
    .pipe(print(log.created)));

  gulp.task('package compressed docs css', () => gulp.src(`${docsOutput.uncompressed}/**/${globs.components}${globs.ignored}.css`)
    .pipe(dedupe())
    .pipe(plumber())
    .pipe(replace(assets.uncompressed, assets.packaged))
    .pipe(concatCSS(filenames.concatenatedMinifiedCSS, settings.concatCSS))
    .pipe(minifyCSS(settings.concatMinify))
    .pipe(header(banner, settings.header))
    .pipe(gulpif(config.hasPermission, chmod(config.permission)))
    .pipe(gulp.dest(docsOutput.packaged))
    .pipe(print(log.created)));

  gulp.task('package uncompressed docs js', () => gulp.src(`${docsOutput.uncompressed}/**/${globs.components}${globs.ignored}.js`)
    .pipe(dedupe())
    .pipe(plumber())
    .pipe(replace(assets.uncompressed, assets.packaged))
    .pipe(concat(filenames.concatenatedJS))
    .pipe(header(banner, settings.header))
    .pipe(gulpif(config.hasPermission, chmod(config.permission)))
    .pipe(gulp.dest(docsOutput.packaged))
    .pipe(print(log.created)));

  gulp.task('package compressed docs js', () => gulp.src(`${docsOutput.uncompressed}/**/${globs.components}${globs.ignored}.js`)
    .pipe(dedupe())
    .pipe(plumber())
    .pipe(replace(assets.uncompressed, assets.packaged))
    .pipe(concat(filenames.concatenatedMinifiedJS))
    .pipe(uglify(settings.concatUglify))
    .pipe(header(banner, settings.header))
    .pipe(gulpif(config.hasPermission, chmod(config.permission)))
    .pipe(gulp.dest(docsOutput.packaged))
    .pipe(print(log.created)));
};
