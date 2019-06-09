/** *****************************
        Define Sub-Tasks
****************************** */

module.exports = function (gulp) {
  const
    // rtl
    buildRTL = require('./../rtl/build');
  const watchRTL = require('./../rtl/watch');
  gulp.task('watch-rtl', 'Build all files as RTL', watchRTL);
  gulp.task('build-rtl', 'Watch files as RTL ', buildRTL);
};
