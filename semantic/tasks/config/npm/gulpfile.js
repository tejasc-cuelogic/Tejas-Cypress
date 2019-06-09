/** *****************************
            Set-up
****************************** */

const
  gulp = require('gulp-help')(require('gulp'));

// read user config to know what task to load
const config = require('./tasks/config/user');

// watch changes
const watch = require('./tasks/watch');

// build all files
const build = require('./tasks/build');
const buildJS = require('./tasks/build/javascript');
const buildCSS = require('./tasks/build/css');
const buildAssets = require('./tasks/build/assets');

// utility
const clean = require('./tasks/clean');
const version = require('./tasks/version');

// docs tasks
const serveDocs = require('./tasks/docs/serve');
const buildDocs = require('./tasks/docs/build');

// rtl
const buildRTL = require('./tasks/rtl/build');
const watchRTL = require('./tasks/rtl/watch')
;


/** *****************************
             Tasks
****************************** */

gulp.task('default', false, [
  'watch',
]);

gulp.task('watch', 'Watch for site/theme changes', watch);

gulp.task('build', 'Builds all files from source', build);
gulp.task('build-javascript', 'Builds all javascript from source', buildJS);
gulp.task('build-css', 'Builds all css from source', buildCSS);
gulp.task('build-assets', 'Copies all assets from source', buildAssets);

gulp.task('clean', 'Clean dist folder', clean);
gulp.task('version', 'Displays current version of Semantic', version);

/*--------------
      Docs
---------------*/

/*
  Lets you serve files to a local documentation instance
  https://github.com/Semantic-Org/Semantic-UI-Docs/
*/

gulp.task('serve-docs', 'Serve file changes to SUI Docs', serveDocs);
gulp.task('build-docs', 'Build all files and add to SUI Docs', buildDocs);


/*--------------
      RTL
---------------*/

if (config.rtl) {
  gulp.task('watch-rtl', 'Watch files as RTL', watchRTL);
  gulp.task('build-rtl', 'Build all files as RTL', buildRTL);
}
